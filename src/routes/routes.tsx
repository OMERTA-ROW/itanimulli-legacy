import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/site";

export const Route = createFileRoute("/routes")({
  head: () => ({ meta: [
    { title: "Routes to Power — Itanimulli: The Rise of Kings" },
    { name: "description", content: "Six paths to power and the ladder from Vendor to Pharaoh." },
    { property: "og:title", content: "Routes to Power — Itanimulli: The Rise of Kings" },
    { property: "og:description", content: "Hustler, Merchant, Military, Political, Royal or Mystic." },
  ] }),
  component: Routes,
});

const routes: [string, string][] = [
  ["Marketplace Hustler", "Flip goods, run deals, build a street network."],
  ["Producer / Merchant", "Own the fields, workshops and barges that feed the city."],
  ["Military Leader", "Rise through the guard to command armies."],
  ["Political Operator", "Trade favors, blackmail, and votes in the palace halls."],
  ["King or Queen", "Claim the throne by blood, marriage, or coup."],
  ["Mystic", "Serve the temples, read the stars, bend fate itself."],
];
const ladder = ["Vendor", "Fixer", "Patron", "Vizier", "Pharaoh"];

function Routes() {
  return (
    <>
      <PageHeader eyebrow="Progression" title="Routes to Power">Choose a path, or weave several. Every route climbs the same ladder.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        {routes.map(([t, d]) => <Card key={t} title={t} kind="Concept">{d}</Card>)}
      </div>
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <h2 className="text-4xl text-gold-gradient">The Ladder</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {ladder.map((l, i) => (
            <li key={l} className="glyph-border rounded-md bg-card p-6 text-center" style={{ transform: `translateY(${-i * 8}px)` }}>
              <div className="text-xs text-nile">Tier {i + 1}</div>
              <div className="mt-2 font-display text-2xl text-gold">{l}</div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
