import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site";
import { PROVIDERS, type ProviderInfo, type ProviderState } from "@/lib/providers";
import { getProviderStates, startLink, unlinkAccount } from "@/lib/linking.functions";

const RESULT_TEXT: Record<string, string> = {
  ok: "Account linked.",
  cancelled: "Linking was cancelled.",
  already_linked: "That account is already linked to another player.",
  state_mismatch: "Linking could not be verified in this browser. Open the site in its own tab and try again.",
  expired: "The linking request expired. Try again.",
  unsupported: "That provider can't be linked.",
};

export const Route = createFileRoute("/_authenticated/account")({
  validateSearch: (s) => z.object({ link: z.string().optional(), result: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Your account — Itanimulli the game" },
      { name: "description", content: "Manage your Itanimulli player account and linked gaming accounts." },
      { property: "og:title", content: "Your account — Itanimulli the game" },
      { property: "og:description", content: "Manage your Itanimulli player account and linked gaming accounts." },
    ],
  }),
  component: AccountPage,
});

const STATE_LABEL: Record<ProviderState, string> = {
  available: "Available",
  not_configured: "Not configured",
  requires_developer_access: "Requires developer access",
};

function AccountPage() {
  const { user } = Route.useRouteContext();
  const { result } = Route.useSearch();
  const qc = useQueryClient();
  const getStates = useServerFn(getProviderStates);
  const start = useServerFn(startLink);
  const unlink = useServerFn(unlinkAccount);
  const [confirm, setConfirm] = useState<{ p: ProviderInfo; action: "link" | "unlink" } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const states = useQuery({ queryKey: ["provider-states"], queryFn: () => getStates() });
  const links = useQuery({
    queryKey: ["linked-accounts", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("linked_accounts").select("provider, provider_user_id, display_name, linked_at");
      if (error) throw error;
      return data;
    },
  });

  async function proceed() {
    if (!confirm) return;
    setError(null);
    if (confirm.action === "link") {
      const r = await start({ data: { provider: confirm.p.id, consent: true } });
      if (!r.ok) return setError(r.error);
      window.location.assign(r.url);
    } else {
      const r = await unlink({ data: { provider: confirm.p.id, consent: true } });
      if (!r.ok) setError(r.error);
      setConfirm(null);
      qc.invalidateQueries({ queryKey: ["linked-accounts"] });
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Player account" title="Your account">
        Signed in as {user.email}. Linked accounts prove who you are on other platforms. They do not enable crossplay or make other games work with Itanimulli.
      </PageHeader>
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-3">
          <Link to="/servers" className="rounded-sm border border-gold px-4 py-2 font-display text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold/10">My servers</Link>
          <button onClick={() => supabase.auth.signOut()} className="rounded-sm border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold">Sign out</button>
        </div>
        {result && <p role="status" className="mt-6 text-nile">{RESULT_TEXT[result] ?? "Linking failed. Nothing was linked."}</p>}
        {error && <p role="alert" className="mt-6 text-destructive">{error}</p>}

        <h2 className="mt-12 text-3xl text-gold-gradient">Linked gaming accounts</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">We never ask for console passwords or session cookies. Linking always happens on the platform's own sign-in page.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PROVIDERS.map((p) => {
            const s = states.data?.[p.id];
            const linked = links.data?.find((l) => l.provider === p.id);
            return (
              <article key={p.id} className="glyph-border rounded-md bg-card p-5" aria-label={p.name}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl text-gold">{p.name}</h3>
                  <span className="rounded-sm border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {linked ? "Linked" : s ? STATE_LABEL[s.state] : "Checking…"}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-nile">{p.method}</p>
                {p.note && <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>}
                {linked ? (
                  <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                    <span>{linked.display_name ?? linked.provider_user_id}</span>
                    <button onClick={() => setConfirm({ p, action: "unlink" })} className="text-destructive hover:underline">Unlink</button>
                  </div>
                ) : s?.state === "available" ? (
                  <button onClick={() => setConfirm({ p, action: "link" })} className="mt-3 rounded-sm bg-gold px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-primary-foreground">Link {p.name}</button>
                ) : s ? (
                  <details className="mt-3 text-sm text-muted-foreground">
                    <summary className="cursor-pointer text-gold">What's needed to enable this</summary>
                    <ol className="mt-2 list-decimal space-y-1 pl-5">{p.setup.map((step) => <li key={step}>{step}</li>)}</ol>
                    {s.missing.length > 0 && <p className="mt-2">Missing secrets: {s.missing.join(", ")}</p>}
                    {p.access !== "partner-only" && <p className="mt-1 break-all">Callback URL: {s.callbackUrl}</p>}
                    <a className="mt-1 inline-block text-nile underline" href={p.docsUrl} target="_blank" rel="noreferrer">Official documentation</a>
                  </details>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6">
          <div className="glyph-border max-w-md rounded-md bg-card p-6">
            <h2 id="confirm-title" className="text-2xl text-gold">{confirm.action === "link" ? `Link ${confirm.p.name}?` : `Unlink ${confirm.p.name}?`}</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {confirm.action === "link"
                ? `You'll go to ${confirm.p.name}'s official sign-in page. We store only your ${confirm.p.name} account ID and public name — never your password.`
                : `This removes the stored ${confirm.p.name} account ID from your Itanimulli account.`}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancel</button>
              <button onClick={proceed} className="rounded-sm bg-gold px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-primary-foreground">{confirm.action === "link" ? "Continue" : "Unlink"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
