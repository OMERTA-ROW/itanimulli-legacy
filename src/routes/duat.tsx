import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, PageHeader } from "@/components/site";

export const Route = createFileRoute("/duat")({
  head: () => ({ meta: [
    { title: "The Duat — Booking Photo Creator (Demo) — Itanimulli: The Rise of Kings" },
    { name: "description", content: "Space-era intake aboard the prison ship Duat. Build your character in a booking-photo creator demo." },
    { property: "og:title", content: "The Duat — Itanimulli: The Rise of Kings" },
    { property: "og:description", content: "Intake begins. Adjust face, hair, skin and build before your booking photo." },
  ] }),
  component: Duat,
});

const skins = ["oklch(0.88 0.05 70)", "oklch(0.76 0.08 60)", "oklch(0.62 0.09 55)", "oklch(0.48 0.08 50)", "oklch(0.36 0.06 45)", "oklch(0.27 0.04 40)"];
const hairColors = ["oklch(0.15 0.01 60)", "oklch(0.35 0.06 50)", "oklch(0.7 0.1 80)", "oklch(0.85 0.01 80)", "oklch(0.55 0.15 30)", "oklch(0.55 0.12 230)"];
const hairStyles = ["Shaved", "Crop", "Braids", "Long", "Crest"];

function Slider({ label, value, set, min = 0, max = 100 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number }) {
  return (
    <label className="block">
      <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground"><span>{label}</span><span className="text-gold">{value}</span></div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => set(+e.target.value)} className="mt-2 w-full accent-[var(--gold)]" />
    </label>
  );
}

function Duat() {
  const [faceW, setFaceW] = useState(50);
  const [jaw, setJaw] = useState(40);
  const [eyes, setEyes] = useState(50);
  const [skin, setSkin] = useState(2);
  const [hair, setHair] = useState(1);
  const [hairC, setHairC] = useState(0);
  const [build, setBuild] = useState(50);
  const [name, setName] = useState("NEFERU-7");
  const [taken, setTaken] = useState(false);
  const [flash, setFlash] = useState(false);
  const id = `DT-${(faceW * 31 + jaw * 7 + build * 13 + skin * 101 + hair * 17).toString().padStart(5, "0")}`;

  const fw = 56 + faceW * 0.28;
  const jy = 150 + jaw * 0.25;
  const shoulders = 70 + build * 0.9;
  const skinC = skins[skin];
  const hc = hairColors[hairC];
  const eyeGap = 14 + eyes * 0.12;

  const snap = () => { setFlash(true); setTimeout(() => { setFlash(false); setTaken(true); }, 180); };

  return (
    <>
      <PageHeader eyebrow="Space era · Prison ship Duat" title="Intake" kind="Demo">Millennia after the kingdom fell, you wake in chains aboard the Duat. Before processing, you choose who the camera sees.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_420px]">
        <div className="relative flex justify-center">
          <div className="glyph-border relative w-full max-w-md rounded-md bg-card p-5 shadow-gold">
            <div className="flex items-center justify-between font-display text-[10px] tracking-[0.3em] text-nile"><span>DUAT CORRECTIONAL · INTAKE</span><Badge kind="Demo" /></div>
            <div className="relative mt-3 overflow-hidden rounded-sm border border-border bg-night">
              <svg viewBox="0 0 240 280" className="block w-full">
                {Array.from({ length: 7 }).map((_, i) => (
                  <g key={i}><line x1="0" x2="240" y1={40 + i * 32} y2={40 + i * 32} stroke="var(--border)" /><text x="6" y={37 + i * 32} fontSize="8" fill="var(--muted-foreground)">{7 - i}'</text></g>
                ))}
                <path d={`M${120 - shoulders} 280 Q${120 - shoulders} 215 120 205 Q${120 + shoulders} 215 ${120 + shoulders} 280Z`} fill="oklch(0.55 0.13 50)" />
                <rect x="108" y={jy - 8} width="24" height="40" fill={skinC} />
                {hair === 3 && <path d={`M${120 - fw / 2 - 6} 90 Q120 50 ${120 + fw / 2 + 6} 90 L${120 + fw / 2 + 10} 200 L${120 - fw / 2 - 10} 200Z`} fill={hc} />}
                <path d={`M${120 - fw / 2} 100 Q120 50 ${120 + fw / 2} 100 L${120 + fw / 2 - 4} ${jy - 30} Q120 ${jy + 8} ${120 - fw / 2 + 4} ${jy - 30}Z`} fill={skinC} />
                {hair === 1 && <path d={`M${120 - fw / 2} 100 Q120 52 ${120 + fw / 2} 100 Q120 78 ${120 - fw / 2} 100Z`} fill={hc} />}
                {hair === 2 && <g fill={hc}><path d={`M${120 - fw / 2} 102 Q120 50 ${120 + fw / 2} 102 Q120 80 ${120 - fw / 2} 102Z`} />{[-1, 1].map((s) => <rect key={s} x={120 + s * (fw / 2 + 2) - 4} y="100" width="8" height="80" rx="4" />)}</g>}
                {hair === 3 && <path d={`M${120 - fw / 2} 104 Q120 48 ${120 + fw / 2} 104 Q120 82 ${120 - fw / 2} 104Z`} fill={hc} />}
                {hair === 4 && <path d="M112 100 Q120 40 128 100Z" fill={hc} />}
                {[-1, 1].map((s) => <g key={s}><ellipse cx={120 + s * eyeGap} cy="122" rx="6" ry="3.5" fill="var(--sand)" /><circle cx={120 + s * eyeGap} cy="122" r="2.4" fill="var(--night)" /><line x1={120 + s * eyeGap - 7} x2={120 + s * eyeGap + 7} y1="112" y2="113" stroke="var(--night)" strokeWidth="2" /></g>)}
                <path d="M118 128 L115 145 L122 145" stroke="var(--night)" strokeOpacity=".4" fill="none" />
                <line x1="110" x2="130" y1={jy - 22} y2={jy - 22} stroke="var(--night)" strokeOpacity=".6" strokeWidth="2" />
                <rect x="60" y="232" width="120" height="40" fill="var(--night)" stroke="var(--gold)" />
                <text x="120" y="248" textAnchor="middle" fontSize="10" fill="var(--gold)" fontFamily="Cinzel">{name || "UNNAMED"}</text>
                <text x="120" y="263" textAnchor="middle" fontSize="9" fill="var(--sand)" fontFamily="monospace">{id}</text>
              </svg>
              {flash && <div className="absolute inset-0 bg-foreground" />}
              {taken && <div className="absolute right-3 top-3 rotate-12 border-2 border-destructive px-2 py-1 font-display text-xs tracking-widest text-destructive">PROCESSED</div>}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground"><span>DECK 9 · CELL BLOCK A</span><span>CYCLE 4.471</span></div>
          </div>
        </div>
        <div className="glyph-border space-y-5 rounded-md bg-card p-6">
          <h2 className="text-2xl text-gold">Adjust subject</h2>
          <label className="block"><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inmate name</span>
            <input value={name} maxLength={16} onChange={(e) => { setName(e.target.value.toUpperCase()); setTaken(false); }} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 font-display text-gold" /></label>
          <Slider label="Face width" value={faceW} set={(n) => { setFaceW(n); setTaken(false); }} />
          <Slider label="Jaw" value={jaw} set={(n) => { setJaw(n); setTaken(false); }} />
          <Slider label="Eye spacing" value={eyes} set={(n) => { setEyes(n); setTaken(false); }} />
          <Slider label="Build" value={build} set={(n) => { setBuild(n); setTaken(false); }} />
          <div><div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Skin tone</div>
            <div className="mt-2 flex gap-2">{skins.map((c, i) => <button key={c} aria-label={`Skin tone ${i + 1}`} onClick={() => { setSkin(i); setTaken(false); }} className={`h-8 w-8 rounded-full border-2 ${skin === i ? "border-gold" : "border-transparent"}`} style={{ background: c }} />)}</div></div>
          <div><div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hair</div>
            <div className="mt-2 flex flex-wrap gap-2">{hairStyles.map((h, i) => <button key={h} onClick={() => { setHair(i); setTaken(false); }} className={`rounded-sm border px-3 py-1 text-sm ${hair === i ? "border-gold text-gold" : "border-border text-muted-foreground"}`}>{h}</button>)}</div>
            <div className="mt-3 flex gap-2">{hairColors.map((c, i) => <button key={c} aria-label={`Hair color ${i + 1}`} onClick={() => { setHairC(i); setTaken(false); }} className={`h-6 w-6 rounded-full border-2 ${hairC === i ? "border-gold" : "border-transparent"}`} style={{ background: c }} />)}</div></div>
          <button onClick={snap} className="w-full rounded-sm bg-gold-gradient py-3 font-display uppercase tracking-[0.25em] text-primary-foreground shadow-gold">{taken ? "Retake photo" : "Take booking photo"}</button>
        </div>
      </div>
    </>
  );
}
