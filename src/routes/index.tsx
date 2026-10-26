import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Badge, Card } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Itanimulli — From street vendor to legend" },
      { name: "description", content: "Pitch hub for Itanimulli, an open-world game concept spanning an ancient kingdom and a far-future space era." },
      { property: "og:title", content: "Itanimulli — Game Concept Hub" },
      { property: "og:description", content: "From street vendor to legend. Your legacy never dies." },
    ],
  }),
  component: Index,
});

const sections = [
  { title: "The World", to: "/world", text: "A Nile kingdom of farms, markets, palaces, temples and tombs — fully explorable." },
  { title: "Routes to Power", to: "/routes", text: "Hustle, produce, command, scheme, rule or commune with the gods. Climb from Vendor to Pharaoh." },
  { title: "Legacy Across Eras", to: "/legacy", text: "Your Ka fades. Your Ba endures. Heirs inherit, curses linger, legends return." },
  { title: "The Space Era", to: "/duat", text: "Millennia later, your name echoes aboard the Duat — a prison ship among the stars." },
] as const;

function Index() {
  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Night over a golden Nile kingdom" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-fade-night" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="mb-6 flex gap-3"><Badge kind="Concept" /><span className="text-xs uppercase tracking-[0.35em] text-sand">Open-world game concept</span></div>
          <h1 className="text-6xl font-bold md:text-9xl text-gold-gradient">Itanimulli</h1>
          <p className="mt-3 font-display tracking-[0.5em] text-sand">I.T.A.N.I.M.U.L.L.I.</p>
          <p className="mt-8 max-w-2xl text-2xl md:text-3xl text-foreground">From street vendor to legend.<br /><span className="text-gold">Your legacy never dies.</span></p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/prototype" className="rounded-sm bg-gold-gradient px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-gold">Play the demo</Link>
            <Link to="/duat" className="rounded-sm border border-gold px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-gold hover:bg-gold/10">Booking photo creator</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-4xl md:text-5xl text-gold-gradient">One life. Many eras.</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Begin with nothing at the farm outskirts. Build a name the ages remember — then face what that name means a thousand years from now.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sections.map((s) => (
            <Link key={s.to} to={s.to}><Card title={s.title} kind="Concept">{s.text}<div className="mt-4 text-xs uppercase tracking-[0.25em] text-gold">Explore →</div></Card></Link>
          ))}
        </div>
      </section>
    </>
  );
}
