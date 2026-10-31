import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { PageHeader, Badge } from "@/components/site";
import { QA_CATEGORIES, QA_SEVERITIES, QA_STATUSES, jackboyHandoff } from "@/lib/qa";
import {
  createInvite, createIssue, getConnectionStatus, getQaSession, listIssues,
  ownerOverview, revokeAccess, revokeInvite, setIssueStatus,
} from "@/lib/qa.functions";


export const Route = createFileRoute("/_authenticated/qa")({
  head: () => ({
    meta: [
      { title: "QA review workspace — Itanimulli: The Rise of Kings" },
      { name: "description", content: "Private QA workspace for authorized Itanimulli reviewers." },
      { property: "og:title", content: "QA review workspace — Itanimulli: The Rise of Kings" },
      { property: "og:description", content: "Private QA workspace for authorized Itanimulli reviewers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QaPage,
});

const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none";
const btn = "rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50";

function QaPage() {
  const session = useServerFn(getQaSession);
  const q = useQuery({ queryKey: ["qa-session"], queryFn: () => session() });
  if (q.isLoading) return <p className="p-10 text-center text-muted-foreground">Checking access…</p>;
  if (q.error) return <p role="alert" className="p-10 text-center text-destructive">{String(q.error.message)}</p>;
  const s = q.data!;
  if (!s.role) {
    return (
      <div>
        <PageHeader eyebrow="QA review" title="No QA access" />
        <p className="mx-auto max-w-xl px-6 text-center text-muted-foreground">
          Signed in as {s.email}. This workspace is invitation-only. Ask the owner for a QA invitation link sent to this email address.
        </p>
      </div>
    );
  }
  return (
    <div>
      <PageHeader eyebrow={s.role === "owner" ? "Owner · QA review" : "QA reviewer"} title="Razul review workspace" />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-16">
        <Onboarding />
        <Connections />
        {s.role === "owner" && <OwnerPanel />}
        <Issues />
      </section>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="glyph-border rounded-md bg-card p-6 text-sm text-muted-foreground">
      <h2 className="font-display text-lg text-gold">Reviewer brief</h2>
      <p className="mt-2">Analyze authorized test builds for animation snapping, foot sliding, clipping, collision mismatch, vehicles, performance and multiplayer desync. Record each finding with its build version, what you saw, what should happen, exact steps and evidence. Export handed-off issues for Jackboy.</p>
      <p className="mt-2">Game-feature expansion is paused until review begins. This workspace has no access to billing, secrets or site-wide settings.</p>
    </div>
  );
}

function Connections() {
  const fn = useServerFn(getConnectionStatus);
  const q = useQuery({ queryKey: ["qa-conn"], queryFn: () => fn() });
  return (
    <div className="glyph-border rounded-md bg-card p-6">
      <h2 className="font-display text-lg text-gold">Connections</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {q.data?.map((c) => (
          <li key={c.name} className="rounded-sm border border-border p-3 text-sm">
            <div className="flex items-center justify-between"><span className="font-semibold">{c.name}</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.state === "not_connected" ? "Not connected" : "Key stored · unverified"}</span></div>
            <p className="mt-1 text-muted-foreground">{c.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OwnerPanel() {
  const qc = useQueryClient();
  const overview = useServerFn(ownerOverview);
  const invite = useServerFn(createInvite);
  const revokeI = useServerFn(revokeInvite);
  const revokeA = useServerFn(revokeAccess);
  const q = useQuery({ queryKey: ["qa-owner"], queryFn: () => overview() });
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["qa-owner"] });

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(null); setLink(null);
    try { const r = await invite({ data: { email } }); setLink(`${window.location.origin}${r.path}`); setEmail(""); refresh(); }
    catch (x) { setErr((x as Error).message); }
  }
  return (
    <div className="glyph-border rounded-md bg-card p-6">
      <h2 className="font-display text-lg text-gold">Invite a QA reviewer</h2>
      <p className="mt-1 text-sm text-muted-foreground">Enter Razul's verified email. You get a single-use link valid for 72 hours to send him yourself; no email is sent.</p>
      <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
        <input aria-label="Reviewer email" className={`${input} max-w-sm`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className={btn}>Create invite</button>
      </form>
      {err && <p role="alert" className="mt-2 text-sm text-destructive">{err}</p>}
      {link && <p className="mt-2 break-all text-sm text-nile">Shown once: {link}</p>}
      <h3 className="mt-6 font-display text-sm text-gold">Reviewers</h3>
      <ul className="mt-2 grid gap-1 text-sm">
        {q.data?.members.length === 0 && <li className="text-muted-foreground">None yet.</li>}
        {q.data?.members.map((m) => (
          <li key={m.user_id} className="flex justify-between gap-2">
            <span>{m.email} · {m.revoked_at ? "revoked" : "active"}</span>
            {!m.revoked_at && <button className="text-destructive" onClick={async () => { await revokeA({ data: { userId: m.user_id } }); refresh(); }}>Revoke</button>}
          </li>
        ))}
      </ul>
      <h3 className="mt-6 font-display text-sm text-gold">Invitations</h3>
      <ul className="mt-2 grid gap-1 text-sm">
        {q.data?.invitations.map((i) => {
          const state = i.revoked_at ? "revoked" : i.used_at ? "used" : new Date(i.expires_at) < new Date() ? "expired" : "pending";
          return (
            <li key={i.id} className="flex justify-between gap-2">
              <span>{i.invited_email} · {state}</span>
              {state === "pending" && <button className="text-destructive" onClick={async () => { await revokeI({ data: { id: i.id } }); refresh(); }}>Revoke</button>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const empty = { build_version: "", category: "animation_snapping", title: "", observed: "", expected: "", repro_steps: "", severity: "medium", evidence_ref: "" };

function Issues() {
  const qc = useQueryClient();
  const list = useServerFn(listIssues);
  const create = useServerFn(createIssue);
  const setStatus = useServerFn(setIssueStatus);
  const q = useQuery({ queryKey: ["qa-issues"], queryFn: () => list() });
  const [f, setF] = useState(empty);
  const [err, setErr] = useState<string | null>(null);
  const up = (k: keyof typeof empty) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(null);
    try { await create({ data: f as never }); setF(empty); qc.invalidateQueries({ queryKey: ["qa-issues"] }); }
    catch (x) { setErr((x as Error).message); }
  }
  function exportJackboy() {
    const rows = (q.data ?? []).filter((i) => i.status === "handed_off");
    const blob = new Blob([JSON.stringify(jackboyHandoff(rows as never), null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "jackboy-handoff.json"; a.click();
  }
  const label = (k: string) => QA_CATEGORIES.find((c) => c[0] === k)?.[1] ?? k;
  return (
    <div className="glyph-border rounded-md bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg text-gold">Issues</h2>
        <button type="button" onClick={exportJackboy} className="rounded-sm border border-border px-3 py-1.5 text-sm hover:bg-gold/10">Export handed-off for Jackboy</button>
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Build version<input className={input} required value={f.build_version} onChange={up("build_version")} /></label>
        <label className="grid gap-1 text-sm">Title<input className={input} required minLength={3} value={f.title} onChange={up("title")} /></label>
        <label className="grid gap-1 text-sm">Category<select className={input} value={f.category} onChange={up("category")}>{QA_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Severity<select className={input} value={f.severity} onChange={up("severity")}>{QA_SEVERITIES.map((v) => <option key={v}>{v}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Observed behavior<textarea className={input} required value={f.observed} onChange={up("observed")} /></label>
        <label className="grid gap-1 text-sm">Expected behavior<textarea className={input} required value={f.expected} onChange={up("expected")} /></label>
        <label className="grid gap-1 text-sm sm:col-span-2">Reproduction steps<textarea className={input} required rows={3} value={f.repro_steps} onChange={up("repro_steps")} /></label>
        <label className="grid gap-1 text-sm sm:col-span-2">Evidence reference (clip link, file name, timestamp)<input className={input} value={f.evidence_ref} onChange={up("evidence_ref")} /></label>
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
        <div className="sm:col-span-2"><button className={btn}>Save issue</button></div>
      </form>
      <ul className="mt-6 grid gap-3">
        {q.data?.length === 0 && <li className="text-sm text-muted-foreground">No issues recorded yet.</li>}
        {q.data?.map((i) => (
          <li key={i.id} className="rounded-sm border border-border p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{i.title}</span>
              <span className="flex items-center gap-2"><Badge kind="Demo" /> 
                <select aria-label="Status" className="rounded-sm border border-border bg-background px-2 py-1" value={i.status}
                  onChange={async (e) => { await setStatus({ data: { id: i.id, status: e.target.value as never } }); qc.invalidateQueries({ queryKey: ["qa-issues"] }); }}>
                  {QA_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select></span>
            </div>
            <p className="mt-1 text-muted-foreground">Build {i.build_version} · {label(i.category)} · {i.severity}</p>
            <p className="mt-2"><b>Observed:</b> {i.observed}</p>
            <p><b>Expected:</b> {i.expected}</p>
            <p className="whitespace-pre-wrap"><b>Steps:</b> {i.repro_steps}</p>
            {i.evidence_ref && <p><b>Evidence:</b> {i.evidence_ref}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
