import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Itanimulli: The Rise of Kings" },
      { name: "description", content: "Choose a new password for your Itanimulli player account." },
      { property: "og:title", content: "Set a new password — Itanimulli: The Rise of Kings" },
      { property: "og:description", content: "Choose a new password for your Itanimulli player account." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => s.session && setReady(true));
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    navigate({ to: "/account" });
  }

  return (
    <div>
      <PageHeader eyebrow="Player account" title="Set a new password" />
      <section className="mx-auto max-w-md px-6">
        <div className="glyph-border rounded-md bg-card p-6">
          {!ready ? (
            <p className="text-muted-foreground">Open this page from the reset link in your email. The link is valid for a limited time.</p>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-1 text-sm">
                New password
                <input className="w-full rounded-sm border border-border bg-background px-3 py-2" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              {msg && <p role="alert" className="text-sm text-destructive">{msg}</p>}
              <button className="rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.25em] text-primary-foreground">Save password</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
