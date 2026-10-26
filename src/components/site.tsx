import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Pitch" },
  { to: "/world", label: "World" },
  { to: "/routes", label: "Routes" },
  { to: "/legacy", label: "Soul & Legacy" },
  { to: "/codex", label: "Codex" },
  { to: "/duat", label: "The Duat" },
  { to: "/prototype", label: "Prototype" },
  { to: "/account", label: "Account" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Leaving the page always puts the phone menu away again.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the phone menu and hands focus back to the button.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-6 py-4 sm:flex sm:flex-wrap sm:justify-between">
        <Link to="/" className="min-w-0 whitespace-nowrap font-display text-[13px] tracking-[0.12em] text-gold-gradient sm:text-lg sm:tracking-[0.3em]">Itanimulli</Link>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-nav-menu"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-2.5 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10 sm:hidden"
        >
          {open ? "Close" : "Menu"}
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {open ? (
              <>
                <path d="M3 3l10 10" />
                <path d="M13 3L3 13" />
              </>
            ) : (
              <>
                <path d="M2 4h12" />
                <path d="M2 8h12" />
                <path d="M2 12h12" />
              </>
            )}
          </svg>
        </button>

        <nav
          id="site-nav-menu"
          aria-label="Site sections"
          className={`${open ? "block" : "hidden"} col-span-2 -mx-6 border-t border-border bg-background/95 px-6 pb-3 pt-2 sm:mx-0 sm:col-auto sm:block sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0`}
        >
          <div className="grid gap-1 sm:flex sm:flex-wrap sm:gap-5 sm:text-xs sm:uppercase sm:tracking-[0.2em] sm:text-muted-foreground">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-gold" }}
                className="rounded-sm px-1 py-2.5 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-gold/5 hover:text-gold sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs"
              >
                {n.label}
              </Link>
            ))}
          </div>
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
      Itanimulli · Game concept hub · Not a live game
    </footer>
  );
}
