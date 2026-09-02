import Stats from "@/components/Stats";
import WhyWanderly from "@/components/WhyWanderly";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { destinations } from "@/data/destinations";
import Image from "next/image";
import Link from "next/link";
import { config } from "@/config";

const featured = destinations.slice(0, 3);

export default function WanderlyHome() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.25),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-300">
              {config.hero.badge}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-none text-white sm:text-5xl lg:text-6xl">
              {config.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              {config.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={config.hero.primaryCtaHref}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                {config.hero.primaryCtaLabel}
              </Link>
              <Link
                href={config.hero.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {config.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
            <div className="overflow-hidden rounded-[1.5rem]">
              <div
                className="h-[420px] w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-100 p-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">From</label>
              <input className="w-full bg-transparent text-lg font-medium text-slate-900 outline-none" placeholder="Surat" />
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">To</label>
              <input className="w-full bg-transparent text-lg font-medium text-slate-900 outline-none" placeholder="Anywhere" />
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">Month</label>
              <input className="w-full bg-transparent text-lg font-medium text-slate-900 outline-none" placeholder="Any time" />
            </div>
            <div className="rounded-2xl bg-slate-900 p-4 text-center text-white">
              <button className="w-full text-sm font-semibold uppercase tracking-[0.2em]">Search</button>
            </div>
          </div>
        </div>
      </section>

      {config.features.showStats && <Stats />}
      {config.features.showDestinations && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber-600">Featured</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.featured}</h2>
            </div>
            <Link href="/destinations" className="font-mono text-xs uppercase tracking-widest text-teal-700 hover:underline">
              View all →
            </Link>
          </div>
          <DestinationGrid destinations={featured} />
        </section>
      )}

      {config.features.showBenefits && <WhyWanderly />}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600">Experiences</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{config.sectionTitles.travelStories}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Wild coastlines", meta: "Bali · 7 days", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
            { title: "Mountain trails", meta: "Patagonia · 10 days", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
            { title: "Temple mornings", meta: "Kyoto · 6 days", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e" },
          ].map((experience) => (
            <article key={experience.title} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{experience.meta}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900">{experience.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {config.features.showTestimonials && <Testimonials />}
      {config.features.showCTA && <CTASection />}
    </>
  );
}
