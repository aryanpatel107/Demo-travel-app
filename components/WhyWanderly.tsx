import { config } from "@/config";

const features = [
  {
    code: "01",
    title: "Curated, not crowdsourced",
    description: "Every destination is reviewed by our travel team before it makes the list — no filler, no tourist traps.",
  },
  {
    code: "02",
    title: "Transparent pricing",
    description: "The fare you see is the fare you pay. No hidden fees revealed at checkout.",
  },
  {
    code: "03",
    title: "Flexible trip planning",
    description: "Build your itinerary in minutes, adjust dates and travelers anytime before you fly.",
  },
];

export default function WhyWanderly() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Why {config.name}</p>
      <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-ink">
        {config.sectionTitles.benefits}
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.code} className="border-t border-gold/50 pt-5">
            <span className="font-mono text-xs text-ink/40">{feature.code}</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}