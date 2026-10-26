import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageHeader } from "@/components/site";

const safeNext = (n: unknown) => (typeof n === "string" && /^\/(?!\/)[\w\-/]*$/.test(n) ? n : "/account");

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => z.object({ next: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Player account — Itanimulli" },
      { name: "description", content: "Sign in or create your Itanimulli player account." },
      { property: "og:title", content: "Player account — Itanimulli" },
      { property: "og:description", content: "Sign in or create your Itanimulli player account." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const dest = safeNext(next);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMsg({ kind: "error", text: error.message });
        navigate({ to: dest });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (error) return setMsg({ kind: "error", text: error.message });
        if (data.session) navigate({ to: dest });
        else setMsg({ kind: "info", text: "Check your email to confirm your account, then sign in." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return setMsg({ kind: "error", text: error.message });
        setMsg({ kind: "info", text: "If that email has an account, a reset link is on its way." });
      }
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) return setMsg({ kind: "error", text: result.error.message ?? "Sign-in failed." });
    if (result.redirected) return;
    navigate({ to: dest });
  }

  const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-foreground focus:border-gold focus:outline-none";
  return (
    <div>
      <PageHeader eyebrow="Player account" title={mode === "signup" ? "Join the kingdom" : mode === "forgot" ? "Recover access" : "Return to the kingdom"} />
      <section className="mx-auto max-w-md px-6">
        <div className="glyph-border rounded-md bg-card p-6">
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Email
              <input className={input} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {mode !== "forgot" && (
              <label className="grid gap-1 text-sm">
                Password
                <input className={input} type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
            )}
            {msg && <p role={msg.kind === "error" ? "alert" : "status"} className={msg.kind === "error" ? "text-sm text-destructive" : "text-sm text-nile"}>{msg.text}</p>}
            <button disabled={busy} className="rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-50">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>
          {mode !== "forgot" && (
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => social("google")} className="rounded-sm border border-border px-4 py-2 text-sm hover:bg-gold/10">Continue with Google</button>
              <button type="button" onClick={() => social("lovable")} className="rounded-sm border border-border px-4 py-2 text-sm hover:bg-gold/10">Continue with Lovable</button>
            </div>
          )}
          <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
            {mode !== "signin" && <button type="button" className="hover:text-gold" onClick={() => setMode("signin")}>Have an account? Sign in</button>}
            {mode !== "signup" && <button type="button" className="hover:text-gold" onClick={() => setMode("signup")}>Create an account</button>}
            {mode !== "forgot" && <button type="button" className="hover:text-gold" onClick={() => setMode("forgot")}>Forgot password?</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
