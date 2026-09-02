import Link from "next/link";
import { config } from "@/config";

export default function BrandBooking() {
  if (config.name === "Wanderly") {
    return (
      <section className="wanderly-booking anim-fade-up anim-fade-up--2 animate-reveal animate-reveal-delay-2">
        <div className="wanderly-booking__inner">
          <div className="wanderly-booking__copy">
            <p className="wanderly-kicker wanderly-kicker--light">YOUR NEXT STORY</p>
            <h2 className="wanderly-booking__title">Your next story<br />starts here.</h2>
            <p className="wanderly-booking__text">
              Build a trip around the places, experiences and moments you&apos;ve been dreaming about.
            </p>
          </div>

          <div className="wanderly-booking__action">
            <Link href="/trips/create" className="brand-button wanderly-button wanderly-button--primary wanderly-button--large">
              Start planning →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (config.name === "TravelPro") {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20 animate-reveal animate-reveal-delay-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-600">Smart travel</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-slate-900">
                Everything you need<br />
                for a better trip.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                "Flexible planning",
                "Simple booking",
                "Organized itineraries",
              ].map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-start">
            <Link href="/trips/create" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-slate-700">
              Create booking
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 animate-reveal animate-reveal-delay-2">
      <div className="rounded-[2rem] bg-gradient-to-r from-violet-500 to-purple-600 p-8 text-white shadow-xl md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-100">Travel planning</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-white">
              One place for<br />
              all your adventures.
            </h2>
            <p className="mt-4 max-w-lg text-base text-violet-50">
              Create, organize and manage your trips without the stress.
            </p>
          </div>
          <div className="justify-self-end">
            <Link href="/trips/create" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50">
              Plan a trip
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
