import { z } from "zod";

// Client-safe QA rules shared by the server functions and the UI.
export const QA_CATEGORIES = [
  ["animation_snapping", "Animation snapping"],
  ["foot_sliding", "Foot sliding"],
  ["clipping", "Clipping"],
  ["collision_mismatch", "Collision mismatch"],
  ["vehicles", "Vehicles"],
  ["performance", "Performance"],
  ["multiplayer_desync", "Multiplayer desync"],
  ["other", "Other"],
] as const;
export const QA_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const QA_STATUSES = ["open", "triaged", "handed_off", "fixed", "wont_fix"] as const;
export const INVITE_TTL_HOURS = 72;

export const issueSchema = z.object({
  build_version: z.string().trim().min(1).max(64),
  category: z.enum(QA_CATEGORIES.map((c) => c[0]) as [string, ...string[]]),
  title: z.string().trim().min(3).max(160),
  observed: z.string().trim().min(1).max(4000),
  expected: z.string().trim().min(1).max(4000),
  repro_steps: z.string().trim().min(1).max(4000),
  severity: z.enum(QA_SEVERITIES),
  evidence_ref: z.string().trim().max(500).optional().nullable(),
});
export type IssueInput = z.infer<typeof issueSchema>;

export type QaRole = "owner" | "qa_reviewer" | null;

/** Owner = verified email that exactly matches the OWNER_EMAIL secret. Reviewer = active qa_access row. */
export function resolveQaRole(input: {
  email: string | null | undefined;
  emailVerified: boolean;
  ownerEmail: string | null | undefined;
  hasActiveAccess: boolean;
}): QaRole {
  const email = input.email?.trim().toLowerCase();
  const owner = input.ownerEmail?.trim().toLowerCase();
  if (email && owner && input.emailVerified && email === owner) return "owner";
  if (input.hasActiveAccess) return "qa_reviewer";
  return null;
}

export type InviteRow = {
  invited_email: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
};

export function inviteProblem(
  invite: InviteRow | null,
  user: { email: string | null | undefined; emailVerified: boolean },
  now = new Date(),
): string | null {
  if (!invite) return "This invitation does not exist.";
  if (invite.revoked_at) return "This invitation was revoked.";
  if (invite.used_at) return "This invitation was already used.";
  if (new Date(invite.expires_at) <= now) return "This invitation has expired.";
  if (!user.emailVerified) return "Confirm your email address before accepting.";
  if ((user.email ?? "").toLowerCase() !== invite.invited_email.toLowerCase())
    return "Sign in with the email address this invitation was sent to.";
  return null;
}

export function jackboyHandoff(issues: Array<IssueInput & { id: string; status: string; created_at: string }>) {
  return {
    format: "itanimulli-qa-handoff/v1",
    target: "Jackboy",
    note: "Manual export. Jackboy is not connected; deliver this file by hand.",
    exported_at: new Date().toISOString(),
    issues: issues.map((i) => ({
      id: i.id,
      build_version: i.build_version,
      category: i.category,
      title: i.title,
      severity: i.severity,
      status: i.status,
      observed: i.observed,
      expected: i.expected,
      repro_steps: i.repro_steps,
      evidence_ref: i.evidence_ref ?? null,
      reported_at: i.created_at,
    })),
  };
}
