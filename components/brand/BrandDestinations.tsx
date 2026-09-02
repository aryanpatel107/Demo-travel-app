import Image from "next/image";
import Link from "next/link";
import { config } from "@/config";
import { destinations } from "@/data/destinations";

const featured = destinations.slice(0, 4);

export default function BrandDestinations() {
  if (config.name === "Wanderly") {
    return (
      <section className="wanderly-destination-section animate-reveal animate-reveal-delay-1">
        <div className="wanderly-destination-section__header">
          <p className="wanderly-kicker">CURATED DESTINATIONS</p>
          <h2 className="wanderly-section-title">Go where curiosity takes you.</h2>
        </div>

        <div className="wanderly-destination-grid">
          {featured.map((destination, index) => (
            <Link
              key={destination.id}
              href={`/destinations/${destination.id}`}
              className={`brand-card wanderly-destination-card wanderly-destination-card--${index + 1}`}
            >
              <div className="wanderly-destination-card__image-wrap relative">
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="wanderly-destination-card__content">
                <p className="wanderly-destination-card__country">{destination.country}</p>
                <h3 className="wanderly-destination-card__name">{destination.name}</h3>
                <p className="wanderly-destination-card__description">{destination.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (config.name === "TravelPro") {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20 animate-reveal animate-reveal-delay-1">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-600">Popular routes</p>
            <h2 className="mt-3 font-display text-4xl text-slate-900">Top destinations</h2>
          </div>
          <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-700 hover:text-sky-700">
            View all →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.id}`} className="brand-card group rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative h-44 overflow-hidden rounded-[1.15rem]">
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold text-slate-900">{destination.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{destination.country}</p>
                  </div>
                  <span className="text-lg font-semibold text-sky-600">${destination.price}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Explore</span>
                  <span className="text-sky-600">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 animate-reveal animate-reveal-delay-1">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-600">Curated picks</p>
        <h2 className="mt-3 font-display text-4xl text-slate-900">Trips picked for you</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((destination) => (
          <Link key={destination.id} href={`/destinations/${destination.id}`} className="brand-card group flex overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
            <div className="relative w-2/5 overflow-hidden">
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-violet-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-700">Recommended</span>
                  <span className="text-xl">♡</span>
                </div>
                <p className="font-display text-3xl font-semibold text-slate-900">{destination.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{destination.country}</p>
              </div>

              <p className="mt-4 text-sm text-slate-600">{destination.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-violet-100 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Ideal for</span>
                <span className="text-violet-700">Plan →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
