import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Pitch" },
  { to: "/world", label: "World" },
  { to: "/routes", label: "Routes" },
  { to: "/legacy", label: "Soul & Legacy" },
  { to: "/codex", label: "Codex" },
  { to: "/duat", label: "The Duat" },
  { to: "/prototype", label: "Prototype" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="font-display text-lg tracking-[0.3em] text-gold-gradient">I.T.M.U.L.L.I.</Link>
        <nav className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "text-gold" }} className="hover:text-gold transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Badge({ kind }: { kind: "Concept" | "Demo" }) {
  return (
    <span className={`inline-block rounded-sm border px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.25em] ${kind === "Demo" ? "border-nile text-nile" : "border-gold text-gold"}`}>
      {kind}
    </span>
  );
}

export function PageHeader({ eyebrow, title, children, kind = "Concept" }: { eyebrow: string; title: string; children?: ReactNode; kind?: "Concept" | "Demo" }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 pt-20">
      <div className="mb-4 flex items-center gap-3"><Badge kind={kind} /><span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</span></div>
      <h1 className="text-5xl font-semibold md:text-7xl text-gold-gradient">{title}</h1>
      {children && <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{children}</p>}
    </section>
  );
}

export function Card({ title, sub, children, kind }: { title: string; sub?: string; children?: ReactNode; kind?: "Concept" | "Demo" }) {
  return (
    <div className="glyph-border rounded-md bg-card p-6 transition hover:shadow-gold">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl text-gold">{title}</h3>
        {kind && <Badge kind={kind} />}
      </div>
      {sub && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-nile">{sub}</p>}
      {children && <div className="mt-3 text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
      It's Anomaly · Game concept hub · Not a live game
    </footer>
  );
}
