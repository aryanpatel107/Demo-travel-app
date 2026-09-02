import Link from "next/link";
import { config } from "@/config";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { destinations } from "@/data/destinations";

const featured = destinations.slice(0, 3);

export default function MyTravelHome() {
  return (
    <>
      <section className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-50/90">
              {config.hero.badge}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {config.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-emerald-50/90">{config.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={config.hero.primaryCtaHref} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">
                {config.hero.primaryCtaLabel}
              </Link>
              <Link href={config.hero.secondaryCtaHref} className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15">
                {config.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Trips picked for you</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">Your next escape</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Live</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Best for", value: "Slow travel" },
                { label: "Travel style", value: "Beach + culture" },
                { label: "Ideal window", value: "Nov - Jan" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-600">Recommended</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.featured}</h2>
          </div>
          <Link href="/destinations" className="font-mono text-xs uppercase tracking-widest text-emerald-700 hover:underline">
            See more →
          </Link>
        </div>
        <DestinationGrid destinations={featured} />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-600">Built around you</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.tripPlanner}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Pick your vibe", note: "Beach, culture, or nature" },
            { title: "Shape the plan", note: "Save favorites and compare ideas" },
            { title: "Travel with ease", note: "Move from inspiration to booking" },
          ].map((step) => (
            <div key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-10 w-10 rounded-full bg-emerald-100 text-center font-display text-xl font-semibold text-emerald-700 leading-10">
                ✓
              </div>
              <h3 className="font-display text-2xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{step.note}</p>
            </div>
          ))}
        </div>
      </section>

      {config.features.showTestimonials && <Testimonials />}
      {config.features.showCTA && <CTASection />}
    </>
  );
}
