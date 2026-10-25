import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/site";

export const Route = createFileRoute("/legacy")({
  head: () => ({ meta: [
    { title: "Soul & Legacy — It's Anomaly" },
    { name: "description", content: "Ka, Ba, the Weighing of the Heart, succession, curses and legendary return." },
    { property: "og:title", content: "Soul & Legacy — It's Anomaly" },
    { property: "og:description", content: "Your Ka fades. Your Ba endures." },
  ] }),
  component: Legacy,
});

const items: [string, string, string][] = [
  ["Ka", "Life force", "Health, stamina and vitality of your current body. When it fails, your life ends."],
  ["Ba", "Reputation that travels", "Your name and deeds. Ba carries into future eras and shapes how the world greets your line."],
  ["Weighing of the Heart", "Judgment on death", "Your deeds are weighed against the feather. The verdict sets your afterlife and your heir's starting fortune."],
  ["Succession", "Heirs & trusted allies", "Continue as a child, apprentice or sworn ally — inheriting wealth, enemies and Ba."],
  ["Sealing Curses", "Protect the tomb", "Bind curses into your tomb to punish robbers and rivals across generations."],
  ["Legendary Return", "The name that rises", "A Ba great enough can return in a later era — even among the stars."],
];

function Legacy() {
  return (
    <>
      <PageHeader eyebrow="Death is a mechanic" title="Soul & Legacy">Dying isn't the end of your story — it's the start of your legend.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        {items.map(([t, s, d]) => <Card key={t} title={t} sub={s} kind="Concept">{d}</Card>)}
      </div>
    </>
  );
}
