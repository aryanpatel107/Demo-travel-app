import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestinationById } from "@/data/destinations";

interface DestinationDetailPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export default function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const destination = getDestinationById(params.id);

  if (!destination) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/destinations" className="font-mono text-xs uppercase tracking-widest text-teal hover:underline">
        ← Back to destinations
      </Link>

      <div
        className="mt-6 h-72 w-full rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      />

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{destination.name}</h1>
          <p className="text-ink/50">{destination.country}</p>
        </div>
        <span className="rounded-full border border-gold/60 bg-white px-3 py-1 font-mono text-sm text-teal">
          ★ {destination.rating}
        </span>
      </div>

      <p className="mt-6 leading-relaxed text-ink/80">{destination.longDescription}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-cloud bg-white p-6 font-mono text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40">Price</p>
          <p className="mt-1 font-semibold text-coral">${destination.price}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/40">Duration</p>
          <p className="mt-1 font-semibold text-ink">{destination.duration}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs uppercase tracking-widest text-ink/40">Tags</p>
          <p className="mt-1 font-semibold capitalize text-ink">{destination.tags.join(", ")}</p>
        </div>
      </div>

      <Link
        href={`/trips/create?destinationId=${destination.id}`}
        className="mt-8 inline-block rounded-full bg-coral px-6 py-3 text-sm font-semibold text-sand transition-transform hover:scale-105"
      >
        Plan a Trip Here
      </Link>
    </article>
  );
}