import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/site";

export const Route = createFileRoute("/world")({
  head: () => ({ meta: [
    { title: "The World — It's Anomaly" },
    { name: "description", content: "Locations of the It's Anomaly kingdom: farms, markets, palace, temples, tombs, pyramids and the Nile." },
    { property: "og:title", content: "The World — It's Anomaly" },
    { property: "og:description", content: "Explore the Nile kingdom of It's Anomaly." },
  ] }),
  component: World,
});

const places: [string, string, string][] = [
  ["Farm Outskirts", "Where every legend starts", "Fields of grain and flax. Labor, barter, and your first rumors."],
  ["City Gate", "Tolls & watchmen", "Guards, smugglers and caravans. Who you know decides who gets in."],
  ["Market District", "The beating heart", "Stalls, debts, favors. The Hustler's proving ground."],
  ["The Palace", "Seat of the throne", "Viziers whisper, scribes record, and thrones are won or lost."],
  ["Temples", "House of the gods", "Priests trade blessings and secrets. Mystics find their calling."],
  ["Tombs", "Records of the dead", "Your deeds are sealed here — and so are your curses."],
  ["Pyramids", "Monuments to legacy", "Build one, and your Ba echoes across eras."],
  ["The Nile", "Lifeline of the kingdom", "Trade barges, floods, and river crime. Control the river, control the realm."],
];

function World() {
  return (
    <>
      <PageHeader eyebrow="Locations" title="The World">An original kingdom inspired by ancient Egypt. Every district is a stage on your rise.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
        {places.map(([t, s, d]) => <Card key={t} title={t} sub={s} kind="Concept">{d}</Card>)}
      </div>
    </>
  );
}
