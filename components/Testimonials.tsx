import { config } from "@/config";

const testimonials = [
  {
    quote: "Booked our Bali trip in ten minutes and the itinerary tool actually kept us organized the whole week.",
    name: "R. Mehta",
    location: "Surat, India",
  },
  {
    quote: "The pricing was exactly what we saw upfront. No surprise fees at checkout, which is rare these days.",
    name: "L. Andersen",
    location: "Oslo, Norway",
  },
  {
    quote: "Patagonia was the trip of a lifetime. The destination notes were more useful than any guidebook.",
    name: "T. Osei",
    location: "Accra, Ghana",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-teal-dark py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">Postcards from travelers</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-sand">
          {config.sectionTitles.testimonials}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-sand p-6">
              <p className="text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 border-t border-dashed border-cloud pt-3 font-mono text-xs text-ink/50">
                {t.name} · {t.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}