import { createFileRoute } from "@tanstack/react-router";
import { callbackPath, getProvider } from "@/lib/providers";
import { ADAPTERS, LinkError, appOrigin } from "@/lib/providers.server";

// Provider redirects land here. The caller is identified ONLY by the one-time,
// server-stored state row (created by an authenticated request) plus the matching
// httpOnly cookie set on that same browser.
export const Route = createFileRoute("/api/public/link/$provider/callback")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const env = process.env as Record<string, string | undefined>;
        const origin = appOrigin(env, request.url);
        const back = (result: string) =>
          new Response(null, {
            status: 302,
            headers: {
              location: `${origin}/account?link=${encodeURIComponent(params.provider)}&result=${result}`,
              "set-cookie": `itl_link_${params.provider}=; Path=/api/public/link; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
              "cache-control": "no-store",
            },
          });

        const p = getProvider(params.provider);
        const adapter = p && ADAPTERS[p.id];
        if (!p || !adapter) return back("unsupported");

        const url = new URL(request.url);
        const state = url.searchParams.get("state");
        const cookie = (request.headers.get("cookie") ?? "")
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith(`itl_link_${p.id}=`))
          ?.split("=")[1];
        if (!state || !cookie || cookie !== state) return back("state_mismatch");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Consume the state exactly once.
        const { data: row } = await supabaseAdmin
          .from("link_states")
          .delete()
          .eq("state", state)
          .eq("provider", p.id)
          .select()
          .maybeSingle();
        if (!row || new Date(row.expires_at).getTime() < Date.now()) return back("expired");

        try {
          const identity = await adapter.complete({
            url,
            redirectUri: origin + callbackPath(p.id),
            nonce: row.nonce,
            codeVerifier: row.code_verifier,
            env,
          });
          const { error } = await supabaseAdmin.from("linked_accounts").insert({
            user_id: row.user_id,
            provider: p.id,
            provider_user_id: identity.providerUserId,
            display_name: identity.displayName,
          });
          if (error) return back(error.code === "23505" ? "already_linked" : "failed");
          return back("ok");
        } catch (e) {
          console.error("link callback failed", p.id, e instanceof LinkError ? e.code : e);
          return back(e instanceof LinkError ? e.code : "failed");
        }
      },
    },
  },
});
