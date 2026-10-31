import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site";
import { supabase } from "@/integrations/supabase/client";
import { acceptInvite } from "@/lib/qa.functions";

export const Route = createFileRoute("/qa-invite/$token")({
  head: () => ({
    meta: [
      { title: "QA invitation — Itanimulli: The Rise of Kings" },
      { name: "description", content: "Accept an invitation to the Itanimulli QA review workspace." },
      { property: "og:title", content: "QA invitation — Itanimulli: The Rise of Kings" },
      { property: "og:description", content: "Accept an invitation to the Itanimulli QA review workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const accept = useServerFn(acceptInvite);
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user)); }, []);

  async function go() {
    setBusy(true); setMsg(null);
    try {
      const r = await accept({ data: { token } });
      if (r.ok) navigate({ to: "/qa" }); else setMsg(r.error);
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader eyebrow="QA invitation" title="Join the review workspace" />
      <section className="mx-auto max-w-md px-6 text-center">
        <div className="glyph-border rounded-md bg-card p-6 text-sm">
          {signedIn === null && <p className="text-muted-foreground">Checking sign-in…</p>}
          {signedIn === false && (
            <>
              <p className="text-muted-foreground">Sign in or create an account with the email this invitation was sent to, then come back to this link.</p>
              <Link to="/auth" search={{ next: `/qa-invite/${token}` }} className="mt-4 inline-block rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground">Sign in</Link>
            </>
          )}
          {signedIn && <button disabled={busy} onClick={go} className="rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? "Checking…" : "Accept invitation"}</button>}
          {msg && <p role="alert" className="mt-3 text-destructive">{msg}</p>}
        </div>
      </section>
    </div>
  );
}
