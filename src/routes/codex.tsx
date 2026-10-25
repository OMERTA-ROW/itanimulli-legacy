import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, PageHeader } from "@/components/site";

export const Route = createFileRoute("/codex")({
  head: () => ({ meta: [
    { title: "Legacy Codex (Demo) — It's Anomaly" },
    { name: "description", content: "Sample lineage, tomb record and Scarab Seal artifacts." },
    { property: "og:title", content: "Legacy Codex — It's Anomaly" },
    { property: "og:description", content: "Trace a dynasty and its artifacts." },
  ] }),
  component: Codex,
});

const lineage = [
  { name: "Neferu the Vendor", tier: "Vendor → Patron", fate: "Heart balanced" },
  { name: "Amsaf, her son", tier: "Patron → Vizier", fate: "Heart heavy" },
  { name: "Tiye, sworn ally", tier: "Vizier → Pharaoh", fate: "Legendary" },
];
const artifacts = [
  { id: "SS-0412-AQ", name: "Gilded Grain Scale", maker: "Neferu", materials: "Bronze, cedar, gold leaf", owners: ["Neferu", "Amsaf"], history: "First tool of the family trade. Weighed grain at the market gate for 40 years." },
  { id: "SS-0977-KH", name: "Vizier's Signet", maker: "Royal workshop", materials: "Carnelian, gold", owners: ["Amsaf", "Tiye"], history: "Sealed the decree that exiled the river smugglers." },
  { id: "SS-1201-RA", name: "Crook of the Dawn", maker: "Temple of the Sun", materials: "Lapis, ebony, electrum", owners: ["Tiye"], history: "Buried with Tiye under a sealing curse. Rumored to surface in the space era." },
];

function Codex() {
  const [sel, setSel] = useState(artifacts[0]);
  return (
    <>
      <PageHeader eyebrow="Sample data" title="Legacy Codex" kind="Demo">The House of Neferu — a sample dynasty traced across three lives.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3">
        <div>
          <h2 className="mb-4 text-2xl text-gold">Lineage</h2>
          <div className="space-y-3">{lineage.map((l) => <Card key={l.name} title={l.name} sub={l.tier}>{l.fate}</Card>)}</div>
          <h2 className="mb-4 mt-10 text-2xl text-gold">Tomb Record</h2>
          <Card title="Tomb of Tiye" sub="Western cliffs · Sealed">Curse: "Who breaks this seal shall lose their name." · Robbery attempts: 2 · Ba rating: 94</Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl text-gold">Artifacts</h2>
          <div className="mb-6 flex flex-wrap gap-3">
            {artifacts.map((a) => (
              <button key={a.id} onClick={() => setSel(a)} className={`rounded-sm border px-4 py-2 font-display text-sm ${sel.id === a.id ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground"}`}>{a.name}</button>
            ))}
          </div>
          <div className="glyph-border rounded-md bg-card p-8 shadow-gold">
            <div className="flex items-center justify-between"><span className="font-display text-xs tracking-[0.3em] text-nile">SCARAB SEAL ID</span><Badge kind="Demo" /></div>
            <div className="mt-2 font-display text-4xl text-gold-gradient">{sel.id}</div>
            <h3 className="mt-4 text-2xl">{sel.name}</h3>
            <dl className="mt-6 grid gap-4 md:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Maker</dt><dd>{sel.maker}</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Materials</dt><dd>{sel.materials}</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">Owners</dt><dd>{sel.owners.join(" → ")}</dd></div>
              <div className="md:col-span-2"><dt className="text-xs uppercase tracking-widest text-muted-foreground">History</dt><dd>{sel.history}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
