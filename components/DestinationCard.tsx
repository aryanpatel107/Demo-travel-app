import Link from "next/link";
import { Destination } from "@/types/destination";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block overflow-hidden rounded-2xl border border-cloud bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        />
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-sand/95 font-mono text-xs font-semibold text-teal">
          {destination.rating}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{destination.name}</h3>
        <p className="text-xs uppercase tracking-widest text-ink/50">{destination.country}</p>
        <p className="mt-2 line-clamp-2 text-sm text-ink/70">{destination.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-cloud pt-3 font-mono text-xs">
          <span className="text-ink/50">{destination.duration}</span>
          <span className="font-semibold text-coral">${destination.price}</span>
        </div>
      </div>
    </Link>
  );
}