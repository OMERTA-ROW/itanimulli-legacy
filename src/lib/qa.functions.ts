import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { INVITE_TTL_HOURS, QA_STATUSES, inviteProblem, issueSchema, resolveQaRole, type QaRole } from "./qa";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function whoAmI(userId: string): Promise<{ role: QaRole; email: string | null; verified: boolean }> {
  const db = await admin();
  const { data: u } = await db.auth.admin.getUserById(userId);
  const email = u.user?.email ?? null;
  const verified = Boolean(u.user?.email_confirmed_at);
  const { data: access } = await db.from("qa_access").select("user_id").eq("user_id", userId).is("revoked_at", null).maybeSingle();
  const role = resolveQaRole({ email, emailVerified: verified, ownerEmail: process.env["OWNER_EMAIL"], hasActiveAccess: !!access });
  return { role, email, verified };
}

async function requireRole(userId: string, allowed: QaRole[]) {
  const me = await whoAmI(userId);
  if (!allowed.includes(me.role)) throw new Error("Forbidden: you do not have QA access.");
  return me;
}

export const getQaSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const me = await whoAmI(context.userId);
    return { role: me.role, email: me.email, ownerConfigured: Boolean(process.env["OWNER_EMAIL"]) };
  });

export const getConnectionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context.userId, ["owner", "qa_reviewer"]);
    // Only reports whether a credential exists. Nothing is called, so nothing is claimed live.
    const has = (k: string) => Boolean(process.env[k]);
    return [
      { name: "Game telemetry", state: "not_connected", detail: "No telemetry pipeline exists yet; the game is a browser prototype." },
      { name: "Jackboy", state: "not_connected", detail: "No Jackboy integration. Use the manual handoff export." },
      { name: "OMNI", state: has("OMNI_API_KEY") ? "credential_unverified" : "not_connected", detail: has("OMNI_API_KEY") ? "A key is stored but no verified integration uses it." : "No OMNI connection linked to this project." },
      { name: "Guardian", state: "not_connected", detail: "No Guardian integration or credential." },
    ] as const;
  });

export const listIssues = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context.userId, ["owner", "qa_reviewer"]);
    const { data, error } = await (await admin()).from("qa_issues").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createIssue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => issueSchema.parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.userId, ["owner", "qa_reviewer"]);
    const { error } = await (await admin()).from("qa_issues").insert({ ...data, evidence_ref: data.evidence_ref || null, created_by: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setIssueStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid(), status: z.enum(QA_STATUSES) }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.userId, ["owner", "qa_reviewer"]);
    const { error } = await (await admin()).from("qa_issues").update({ status: data.status, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Owner only ----
export const ownerOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context.userId, ["owner"]);
    const db = await admin();
    const [inv, mem] = await Promise.all([
      db.from("qa_invitations").select("id, invited_email, created_at, expires_at, used_at, revoked_at").order("created_at", { ascending: false }),
      db.from("qa_access").select("user_id, email, role, granted_at, revoked_at").order("granted_at", { ascending: false }),
    ]);
    return { invitations: inv.data ?? [], members: mem.data ?? [] };
  });

export const createInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ email: z.string().trim().email().max(254) }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.userId, ["owner"]);
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const { error } = await (await admin()).from("qa_invitations").insert({
      token_hash: await sha256(token),
      invited_email: data.email.toLowerCase(),
      created_by: context.userId,
      expires_at: new Date(Date.now() + INVITE_TTL_HOURS * 3600_000).toISOString(),
    });
    if (error) throw new Error(error.message);
    // Token is shown once to the owner; only its hash is stored. No email is sent.
    return { path: `/qa-invite/${token}` };
  });

export const revokeInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.userId, ["owner"]);
    await (await admin()).from("qa_invitations").update({ revoked_at: new Date().toISOString() }).eq("id", data.id).is("used_at", null);
    return { ok: true };
  });

export const revokeAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ userId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.userId, ["owner"]);
    await (await admin()).from("qa_access").update({ revoked_at: new Date().toISOString() }).eq("user_id", data.userId);
    return { ok: true };
  });

// ---- Invitee ----
export const acceptInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) }).parse(i))
  .handler(async ({ data, context }) => {
    const me = await whoAmI(context.userId);
    const db = await admin();
    const { data: invite } = await db.from("qa_invitations").select("*").eq("token_hash", await sha256(data.token)).maybeSingle();
    const problem = inviteProblem(invite, { email: me.email, emailVerified: me.verified });
    if (problem || !invite) return { ok: false as const, error: problem ?? "Invalid invitation." };
    // Single use: only succeeds if still unused at write time.
    const { data: claimed } = await db.from("qa_invitations").update({ used_at: new Date().toISOString(), used_by: context.userId })
      .eq("id", invite.id).is("used_at", null).is("revoked_at", null).select("id");
    if (!claimed?.length) return { ok: false as const, error: "This invitation was already used." };
    const { error } = await db.from("qa_access").upsert({ user_id: context.userId, email: me.email!, role: "qa_reviewer", granted_by: invite.created_by, granted_at: new Date().toISOString(), revoked_at: null });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
