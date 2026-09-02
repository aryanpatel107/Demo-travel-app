import { config } from "@/config";

const stories = [
  {
    title: "Bali sunrise reset",
    summary: "A slow island week with beach mornings and temple evenings.",
  },
  {
    title: "Kyoto in motion",
    summary: "Historic lanes, tea rituals, and quiet city mornings.",
  },
  {
    title: "Patagonia at full scale",
    summary: "Long trails, big skies, and unforgettable glacier views.",
  },
];

export default function TravelStories() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Travel stories</p>
      <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-ink">
        {config.sectionTitles.travelStories}
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Story</p>
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{story.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{story.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
