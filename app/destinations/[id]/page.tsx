import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestinationById } from "@/data/destinations";
import { config } from "@/config";

interface DestinationDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { id } = await params;
  const destination = getDestinationById(id);
  const brandKey = config.name.toLowerCase().replace(/\s+/g, "");
  const isWanderly = brandKey === "wanderly";
  const isTravelPro = brandKey === "travelpro";

  if (!destination) {
    notFound();
  }

  const ctaHref = `/trips/create?destinationId=${destination.id}`;

  if (isWanderly) {
    return (
      <article className="destination-detail-page wanderly-detail-page">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#375349] hover:underline">
            ← Back to destinations
          </Link>

          <div className="mt-6 overflow-hidden rounded-[32px] border border-[#e8dcc5] bg-[#fffaf3] shadow-[0_25px_60px_rgba(24,33,29,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#d96a3a]">Destination guide</p>
                <h1 className="mt-4 font-display text-4xl leading-none text-[#16241f] sm:text-5xl">{destination.name}</h1>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#4f5f58]">{destination.country}</p>

                <div className="mt-8 overflow-hidden rounded-[26px]">
                  <div className="relative h-[420px] w-full overflow-hidden">
                    <Image
                      src={destination.imageUrl}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              <aside className="bg-[#f4efe5] p-6 sm:p-8 lg:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#374a44]">Why go?</p>
                <p className="mt-5 text-base leading-8 text-[#2f3c37]">{destination.longDescription}</p>
              </aside>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[28px] border border-[#e8dcc5] bg-[#fffaf3] p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#f3eeea] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#55706c]">Duration</p>
                  <p className="mt-3 text-lg font-semibold text-[#16241f]">{destination.duration}</p>
                </div>
                <div className="rounded-2xl bg-[#f3eeea] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#55706c]">Rating</p>
                  <p className="mt-3 text-lg font-semibold text-[#16241f]">{destination.rating}</p>
                </div>
                <div className="rounded-2xl bg-[#f3eeea] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#55706c]">Travel style</p>
                  <p className="mt-3 text-lg font-semibold capitalize text-[#16241f]">{destination.tags[0] ?? "escape"}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d96a3a]">Things to experience</p>
                <ul className="mt-4 space-y-3 text-base leading-7 text-[#33433d]">
                  {destination.tags.map((tag) => (
                    <li key={tag} className="flex items-start gap-3">
                      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[#d96a3a]" aria-hidden="true" />
                      <span className="capitalize">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <aside className="rounded-[28px] border border-[#e8dcc5] bg-[#f4efe5] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#3e5149]">Ready to go?</p>
              <h2 className="mt-4 font-display text-3xl text-[#16241f]">Build my adventure</h2>
              <p className="mt-3 text-base leading-7 text-[#33433d]">Turn this destination into a tailored trip plan.</p>
              <Link href={ctaHref} className="mt-6 inline-flex rounded-full bg-[#d96a3a] px-5 py-3 text-sm font-semibold text-white transition-transform hover:translate-y-[-1px]">
                Build my adventure →
              </Link>
            </aside>
          </div>
        </div>
      </article>
    );
  }

  if (isTravelPro) {
    return (
      <article className="destination-detail-page travelpro-detail-page">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-slate-700">Destinations</Link>
            <span>/</span>
            <span className="text-slate-800">{destination.name}</span>
          </nav>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600">Destination</p>
                <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">{destination.name}</h1>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">{destination.country}</p>

                <div className="mt-8 overflow-hidden rounded-[26px]">
                  <div className="relative h-[420px] w-full overflow-hidden">
                    <Image
                      src={destination.imageUrl}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              <aside className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Trip planner</p>
                  <div className="mt-4 space-y-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span>Destination</span>
                      <span className="font-semibold text-slate-900">{destination.name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span>Duration</span>
                      <span className="font-semibold text-slate-900">{destination.duration}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span>Travelers</span>
                      <span className="font-semibold text-slate-900">Flexible</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rating</span>
                      <span className="font-semibold text-slate-900">{destination.rating}</span>
                    </div>
                  </div>
                  <Link href={ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
                    Plan this trip
                  </Link>
                </div>
              </aside>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600">Overview</p>
              <p className="mt-4 text-base leading-8 text-slate-700">{destination.longDescription}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Duration</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{destination.duration}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Travel style</p>
                  <p className="mt-3 text-lg font-semibold capitalize text-slate-900">{destination.tags[0] ?? "escape"}</p>
                </div>
              </div>
            </section>

            <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Travel information</p>
              <ul className="mt-4 space-y-3 text-base text-slate-700">
                {destination.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-3">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                    <span className="capitalize">{tag}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="destination-detail-page mytravel-detail-page">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5b4b88] hover:underline">
          ← Back to destinations
        </Link>

        <div className="mt-6 overflow-hidden rounded-[30px] border border-[#e8ddff] bg-white shadow-[0_18px_40px_rgba(86,63,143,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b4ec6]">Thinking about {destination.name}?</p>
              <h1 className="mt-4 font-display text-4xl text-[#20173c] sm:text-5xl">{destination.name}</h1>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#72668f]">{destination.country}</p>

              <div className="mt-8 overflow-hidden rounded-[26px]">
                <div className="relative h-[420px] w-full overflow-hidden">
                  <Image
                    src={destination.imageUrl}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <aside className="bg-[#f7f3ff] p-6 sm:p-8 lg:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6648b7]">Make it your trip</p>
              <h2 className="mt-4 font-display text-3xl text-[#20173c]">Plan a trip to {destination.name} ✨</h2>
              <p className="mt-4 text-base leading-7 text-[#4d496b]">{destination.description}</p>
              <Link href={ctaHref} className="mt-6 inline-flex rounded-full bg-[#7a5ae1] px-5 py-3 text-sm font-semibold text-white transition-transform hover:translate-y-[-1px]">
                Plan a trip to {destination.name} ✨
              </Link>
            </aside>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[26px] border border-[#e8ddff] bg-white p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b4ec6]">Why you will love it</p>
            <p className="mt-4 text-base leading-8 text-[#4d496b]">{destination.longDescription}</p>
          </section>

          <aside className="rounded-[26px] border border-[#e8ddff] bg-[#f7f3ff] p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b4ec6]">Trip snapshot</p>
            <div className="mt-4 space-y-4 text-sm text-[#4d496b]">
              <div className="flex items-center justify-between border-b border-[#e1d7ff] pb-3">
                <span>Duration</span>
                <span className="font-semibold text-[#20173c]">{destination.duration}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#e1d7ff] pb-3">
                <span>Style</span>
                <span className="font-semibold capitalize text-[#20173c]">{destination.tags[0] ?? "adventure"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rating</span>
                <span className="font-semibold text-[#20173c]">{destination.rating}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}