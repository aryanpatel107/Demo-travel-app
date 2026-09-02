import Link from "next/link";
import { config } from "@/config";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import SpecialOffers from "@/components/SpecialOffers";
import { destinations } from "@/data/destinations";

const featured = destinations.slice(0, 3);

export default function TravelProHome() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-violet-300">
              {config.hero.badge}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {config.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-200">{config.hero.subtitle}</p>
            <div className="mt-8 flex gap-3">
              <Link href={config.hero.primaryCtaHref} className="rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-400">
                {config.hero.primaryCtaLabel}
              </Link>
              <Link href={config.hero.secondaryCtaHref} className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                {config.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-2xl">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">From</label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" placeholder="Surat" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">To</label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" placeholder="Bali" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Departure</label>
                  <input type="date" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Travelers</label>
                  <input type="number" min={1} defaultValue={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-500" />
                </div>
              </div>
              <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
                Search flights
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-violet-600">Popular destinations</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.featured}</h2>
          </div>
          <Link href="/destinations" className="font-mono text-xs uppercase tracking-widest text-violet-700 hover:underline">
            Browse all →
          </Link>
        </div>
        <DestinationGrid destinations={featured} />
      </section>

      {config.features.showSpecialOffers && <SpecialOffers />}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-violet-600">Travel packages</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.recommended}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Weekend Escape", price: "$699", details: "Flights + hotel + transfer" },
            { title: "Family Retreat", price: "$1,299", details: "Flexible dates included" },
            { title: "Premium Getaway", price: "$2,399", details: "Private transfer + lounge" },
          ].map((packageItem) => (
            <div key={packageItem.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Bundle</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900">{packageItem.title}</h3>
              <p className="mt-4 text-3xl font-semibold text-violet-600">{packageItem.price}</p>
              <p className="mt-2 text-sm text-slate-600">{packageItem.details}</p>
            </div>
          ))}
        </div>
      </section>

      {config.features.showTestimonials && <Testimonials />}
      {config.features.showCTA && <CTASection />}
    </>
  );
}
