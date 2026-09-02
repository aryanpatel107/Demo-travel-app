import Image from "next/image";
import Link from "next/link";
import { config } from "@/config";

export default function BrandHero() {
  if (config.name === "Wanderly") {
    return (
      <section className="wanderly-hero animate-reveal">
        <div className="wanderly-hero__inner">
          <div className="wanderly-hero__content">
            <p className="anim-fade-up wanderly-eyebrow">TRAVEL DIFFERENT</p>
            <h1 className="anim-fade-up anim-fade-up--1 wanderly-heading">
              Find places
              <span className="wanderly-heading__accent">worth remembering.</span>
            </h1>
            <p className="anim-fade-up anim-fade-up--2 wanderly-subheading">
              Discover journeys shaped by wonder, stories, and slower, richer travel. From quiet coastlines to extraordinary escapes, we make the next great chapter feel inevitable.
            </p>

            <div className="anim-fade-up anim-fade-up--3 wanderly-actions">
              <Link href="/destinations" className="brand-button wanderly-button wanderly-button--primary">
                Explore
              </Link>
              <Link href="/trips/create" className="brand-button wanderly-button wanderly-button--secondary">
                Plan a trip
              </Link>
            </div>
          </div>

          <div className="anim-scale-in wanderly-hero__media">
            <div className="wanderly-image-shell relative">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                alt="Coastal travel destination"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            <div className="wanderly-floating-card">
              <div className="wanderly-floating-card__label">Featured escape</div>
              <div className="wanderly-floating-card__row">
                <div>
                  <div className="wanderly-floating-card__title">Kerala</div>
                  <div className="wanderly-floating-card__meta">India • Backwaters</div>
                </div>
                <span className="wanderly-floating-card__price">7 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (config.name === "TravelPro") {
    return (
      <section className="bg-slate-50 py-14 text-slate-900 animate-reveal">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-600">Travel booking</p>
              <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.94] text-slate-900 sm:text-6xl">
                Travel smarter.
                <span className="block">Go further.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-slate-600">
                Plan trips with clarity, compare routes with confidence, and keep every detail organized from departure to destination.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">From</label>
                  <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-600" placeholder="Surat" />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">To</label>
                  <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-600" placeholder="Bali" />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Date</label>
                  <input type="date" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-600" />
                </div>
                <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-slate-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 py-16 text-slate-900 animate-reveal">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-violet-600">Personalized journeys</p>
        <h1 className="mt-5 mx-auto max-w-3xl font-display text-5xl leading-[0.94] text-slate-900 sm:text-6xl">
          Your journey.
          <span className="block">Your way.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Curated ideas and flexible plans built around your pace, your preferences, and the moments you want to remember.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/trips/create" className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
            Create my trip →
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            "Weekend escapes",
            "Adventure",
            "Relaxation",
          ].map((label) => (
            <div key={label} className="rounded-[1.5rem] border border-violet-100 bg-white p-5 shadow-sm">
              <p className="font-display text-2xl font-semibold text-slate-900">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
