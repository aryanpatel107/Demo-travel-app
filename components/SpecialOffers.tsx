import { config } from "@/config";

const offers = [
  { name: "Coastal Escape", price: "$899", note: "7 nights from Lisbon" },
  { name: "City Sprint", price: "$649", note: "3-day Paris upgrade" },
  { name: "Alpine Reset", price: "$1,199", note: "Swiss mountain route" },
];

export default function SpecialOffers() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Offers</p>
      <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-ink">
        {config.sectionTitles.specialOffers}
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {offers.map((offer) => (
          <div key={offer.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Limited</p>
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{offer.name}</h3>
            <p className="mt-4 text-3xl font-semibold text-coral">{offer.price}</p>
            <p className="mt-2 text-sm text-ink/70">{offer.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
