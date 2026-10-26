import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge, PageHeader } from "@/components/site";
import { MEMBER_ROLES, MULTIPLAYER_BLOCKERS, PRIVACY, PROVISIONING, SERVER_GAMES, SERVER_REGIONS, memberSchema, serverDraftSchema } from "@/lib/servers";

export const Route = createFileRoute("/_authenticated/servers")({
  head: () => ({
    meta: [
      { title: "My servers — Itanimulli the game" },
      { name: "description", content: "Plan your own Itanimulli game servers as drafts." },
      { property: "og:title", content: "My servers — Itanimulli the game" },
      { property: "og:description", content: "Plan your own Itanimulli game servers as drafts." },
    ],
  }),
  component: ServersPage,
});

const field = "w-full rounded-sm border border-border bg-background px-3 py-2";

function ServersPage() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const servers = useQuery({
    queryKey: ["servers", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("game_servers").select("*, server_members(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["servers"] });

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const parsed = serverDraftSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid server");
    const { error } = await supabase.from("game_servers").insert({ ...parsed.data, owner_id: user.id });
    if (error) return setError(error.message);
    form.reset();
    refresh();
  }

  return (
    <div>
      <PageHeader eyebrow="Cloud game servers" title="My servers">
        Plan servers for you and your crew. {PROVISIONING.reason}
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={create} className="glyph-border grid h-fit gap-3 rounded-md bg-card p-5" aria-label="New server draft">
          <h2 className="text-2xl text-gold">New draft</h2>
          <label className="grid gap-1 text-sm">Server name<input name="name" required minLength={3} maxLength={48} className={field} /></label>
          <label className="grid gap-1 text-sm">Game<select name="game" className={field}>{SERVER_GAMES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select></label>
          <label className="grid gap-1 text-sm">Region<select name="region" className={field}>{SERVER_REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
          <label className="grid gap-1 text-sm">Capacity<input name="capacity" type="number" min={2} max={64} defaultValue={16} className={field} /></label>
          <label className="grid gap-1 text-sm">Privacy<select name="privacy" className={field}>{PRIVACY.map((p) => <option key={p}>{p}</option>)}</select></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button className="rounded-sm bg-gold px-4 py-2 font-display text-xs uppercase tracking-[0.25em] text-primary-foreground">Save draft</button>
        </form>

        <div className="grid gap-4">
          {servers.data?.length === 0 && <p className="text-muted-foreground">No server drafts yet.</p>}
          {servers.data?.map((s) => <ServerCard key={s.id} server={s} onChange={refresh} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <h2 className="text-3xl text-gold-gradient">What real multiplayer still needs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MULTIPLAYER_BLOCKERS.map((b) => (
            <div key={b.title} className="glyph-border rounded-md bg-card p-5">
              <h3 className="text-lg text-gold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">Linking a PlayStation, Xbox or Steam account does not make servers joinable from those platforms. Crossplay and console support each need platform certification.</p>
      </section>
    </div>
  );
}

type ServerRow = {
  id: string; name: string; game: string; region: string; capacity: number; privacy: string; status: string;
  server_members: { id: string; invited_email: string; role: string }[];
};

function ServerCard({ server, onChange }: { server: ServerRow; onChange: () => void }) {
  const [err, setErr] = useState<string | null>(null);
  async function addMember(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const p = memberSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!p.success) return setErr(p.error.issues[0]?.message ?? "Invalid member");
    const { error } = await supabase.from("server_members").insert({ server_id: server.id, invited_email: p.data.email, role: p.data.role });
    if (error) return setErr(error.code === "23505" ? "Already on the list" : error.message);
    setErr(null);
    form.reset();
    onChange();
  }
  async function remove() {
    if (!window.confirm(`Delete draft “${server.name}”?`)) return;
    await supabase.from("game_servers").delete().eq("id", server.id);
    onChange();
  }
  async function setPrivacy(privacy: string) {
    await supabase.from("game_servers").update({ privacy }).eq("id", server.id);
    onChange();
  }
  return (
    <article className="glyph-border rounded-md bg-card p-5" aria-label={server.name}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xl text-gold">{server.name}</h3>
          <p className="text-xs uppercase tracking-[0.15em] text-nile">
            {SERVER_GAMES.find((g) => g.id === server.game)?.label} · {SERVER_REGIONS.find((r) => r.id === server.region)?.label} · {server.capacity} players
          </p>
        </div>
        <Badge kind="Concept" />
      </div>
      <p className="mt-3 text-sm">Status: <strong className="text-sand">Draft — not running</strong> · Address: none assigned</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label>Privacy <select value={server.privacy} onChange={(e) => setPrivacy(e.target.value)} className="ml-1 rounded-sm border border-border bg-background px-2 py-1">{PRIVACY.map((p) => <option key={p}>{p}</option>)}</select></label>
        <button disabled title={PROVISIONING.reason} className="cursor-not-allowed rounded-sm border border-border px-3 py-1 text-muted-foreground opacity-60">Start server (unavailable)</button>
        <button onClick={remove} className="text-destructive hover:underline">Delete</button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Members</h4>
        <p className="text-xs text-muted-foreground">You are the owner. Invites are saved on the draft only — no emails are sent.</p>
        <ul className="mt-2 space-y-1 text-sm">
          {server.server_members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2">
              <span>{m.invited_email} · {m.role} · pending</span>
              <button onClick={async () => { await supabase.from("server_members").delete().eq("id", m.id); onChange(); }} className="text-xs text-destructive hover:underline">Remove</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addMember} className="mt-2 flex flex-wrap gap-2">
          <input name="email" type="email" placeholder="player@email.com" required className="min-w-0 flex-1 rounded-sm border border-border bg-background px-2 py-1 text-sm" aria-label="Member email" />
          <select name="role" className="rounded-sm border border-border bg-background px-2 py-1 text-sm" aria-label="Member role">{MEMBER_ROLES.map((r) => <option key={r}>{r}</option>)}</select>
          <button className="rounded-sm border border-gold px-3 py-1 text-sm text-gold">Add</button>
        </form>
        {err && <p role="alert" className="mt-1 text-sm text-destructive">{err}</p>}
      </div>
    </article>
  );
}
