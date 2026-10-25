import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/site";

export const Route = createFileRoute("/prototype")({
  head: () => ({ meta: [
    { title: "Prototype (Demo) — It's Anomaly" },
    { name: "description", content: "Top-down browser demo: walk from the outer farm to the city gate and make a market delivery." },
    { property: "og:title", content: "Prototype — It's Anomaly" },
    { property: "og:description", content: "Play a tiny slice of the Hustler route." },
  ] }),
  component: Proto,
});

const W = 800, H = 400;
const zones = [
  { name: "Outer Farm", x: 0, w: 260, c: "oklch(0.45 0.08 120)" },
  { name: "City Gate", x: 260, w: 180, c: "oklch(0.55 0.06 80)" },
  { name: "Market", x: 440, w: 360, c: "oklch(0.4 0.05 60)" },
];

function Proto() {
  const pos = useRef({ x: 80, y: 200 });
  const keys = useRef<Record<string, boolean>>({});
  const [, tick] = useState(0);
  const [stage, setStage] = useState<"pickup" | "deliver" | "done">("pickup");
  const stageRef = useRef(stage); stageRef.current = stage;

  useEffect(() => {
    const d = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; if (e.key.startsWith("Arrow")) e.preventDefault(); };
    const u = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", d); window.addEventListener("keyup", u);
    let raf = 0;
    const loop = () => {
      const k = keys.current, p = pos.current, s = 3;
      if (k.arrowleft || k.a) p.x -= s; if (k.arrowright || k.d) p.x += s;
      if (k.arrowup || k.w) p.y -= s; if (k.arrowdown || k.s) p.y += s;
      p.x = Math.max(10, Math.min(W - 10, p.x)); p.y = Math.max(10, Math.min(H - 10, p.y));
      // gate wall: only pass through opening
      if (p.x > 340 && p.x < 360 && (p.y < 170 || p.y > 230)) p.x = p.x < 350 ? 340 : 360;
      if (stageRef.current === "pickup" && Math.hypot(p.x - 60, p.y - 80) < 25) setStage("deliver");
      if (stageRef.current === "deliver" && Math.hypot(p.x - 680, p.y - 200) < 30) setStage("done");
      tick((n) => n + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, []);

  const p = pos.current;
  const obj = { pickup: "Pick up the grain sack at the farm shed.", deliver: "Carry the sack through the city gate to Merchant Hapu.", done: "Delivered! Hapu owes you a favor. +5 Ba" }[stage];

  return (
    <>
      <PageHeader eyebrow="Hustler route · Vertical slice" title="Prototype" kind="Demo">Use WASD or arrow keys. Not the real game — a feel test.</PageHeader>
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4 glyph-border rounded-md bg-card p-4"><span className="text-xs uppercase tracking-[0.25em] text-nile">Objective · </span><span className="text-gold">{obj}</span></div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-md border border-border">
          {zones.map((z) => <g key={z.name}><rect x={z.x} y="0" width={z.w} height={H} fill={z.c} /><text x={z.x + 10} y="20" fontSize="12" fill="var(--sand)" fontFamily="Cinzel">{z.name}</text></g>)}
          <rect x="340" y="0" width="20" height="170" fill="oklch(0.7 0.06 80)" /><rect x="340" y="230" width="20" height="170" fill="oklch(0.7 0.06 80)" />
          <rect x="0" y="190" width={W} height="20" fill="oklch(0.65 0.05 80 / 40%)" />
          <rect x="40" y="55" width="40" height="30" fill="oklch(0.35 0.05 50)" />
          {stage === "pickup" && <circle cx="60" cy="80" r="7" fill="var(--gold)" />}
          {[500, 560, 620, 740].map((x) => <rect key={x} x={x} y="100" width="40" height="30" fill="oklch(0.55 0.1 40)" />)}
          <circle cx="680" cy="200" r="11" fill="var(--nile)" /><text x="680" y="230" textAnchor="middle" fontSize="11" fill="var(--sand)">Hapu</text>
          <circle cx={p.x} cy={p.y} r="10" fill="var(--gold)" stroke="var(--night)" strokeWidth="2" />
          {stage === "deliver" && <rect x={p.x - 5} y={p.y - 22} width="10" height="9" fill="var(--sand)" />}
        </svg>
        {stage === "done" && <button onClick={() => { pos.current = { x: 80, y: 200 }; setStage("pickup"); }} className="mt-4 rounded-sm border border-gold px-5 py-2 font-display text-sm text-gold">Replay</button>}
      </div>
    </>
  );
}
