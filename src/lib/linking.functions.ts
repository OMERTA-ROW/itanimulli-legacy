import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PROVIDERS, callbackPath, getProvider, resolveProviderState, type ProviderState } from "./providers";
import { ADAPTERS, appOrigin, pkceChallenge, presentSecretNames, randomToken } from "./providers.server";

/** Public: which providers can link right now. Reveals only yes/no, never values. */
export const getProviderStates = createServerFn({ method: "GET" }).handler(async () => {
  const env = process.env as Record<string, string | undefined>;
  const origin = appOrigin(env, getRequest().url);
  const out: Record<string, { state: ProviderState; missing: string[]; callbackUrl: string }> = {};
  for (const p of PROVIDERS) {
    const present = presentSecretNames(env, p.requiredSecrets);
    const state = ADAPTERS[p.id] ? resolveProviderState(p, present) : "requires_developer_access";
    out[p.id] = {
      state,
      missing: p.requiredSecrets.filter((s) => !present.has(s)),
      callbackUrl: origin + callbackPath(p.id),
    };
  }
  return out;
});

export const startLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ provider: z.string(), consent: z.literal(true) }).parse(d))
  .handler(async ({ data, context }) => {
    const env = process.env as Record<string, string | undefined>;
    const p = getProvider(data.provider);
    const adapter = p && ADAPTERS[p.id];
    if (!p || !adapter) return { ok: false as const, error: "This provider requires platform developer access." };
    if (resolveProviderState(p, presentSecretNames(env, p.requiredSecrets)) !== "available")
      return { ok: false as const, error: "This provider is not configured yet." };

    const { data: existing } = await context.supabase
      .from("linked_accounts")
      .select("id")
      .eq("provider", p.id)
      .maybeSingle();
    if (existing) return { ok: false as const, error: "Already linked. Unlink first to link a different account." };

    const origin = appOrigin(env, getRequest().url);
    const redirectUri = origin + callbackPath(p.id);
    const state = randomToken();
    const nonce = randomToken();
    const codeVerifier = randomToken(48);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("link_states").delete().lt("expires_at", new Date().toISOString());
    const { error } = await supabaseAdmin.from("link_states").insert({
      state,
      nonce,
      code_verifier: codeVerifier,
      provider: p.id,
      user_id: context.userId,
    });
    if (error) return { ok: false as const, error: "Could not start linking. Try again." };

    // Bind the flow to this browser so a link URL can't be replayed in someone else's session.
    setCookie(`itl_link_${p.id}`, state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/api/public/link",
      maxAge: 600,
    });
    const url = adapter.authorizeUrl({
      state,
      nonce,
      codeChallenge: await pkceChallenge(codeVerifier),
      redirectUri,
      origin,
      env,
    });
    return { ok: true as const, url };
  });

export const unlinkAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ provider: z.string(), consent: z.literal(true) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("linked_accounts")
      .delete()
      .eq("provider", data.provider)
      .eq("user_id", context.userId);
    return error ? { ok: false as const, error: "Could not unlink." } : { ok: true as const };
  });
