import Link from "next/link";
import { config } from "@/config";
import BoardingPassCard from "./BoardingPassCard";

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section
      className="bg-teal-dark bg-gradient-to-br from-teal to-teal-dark"
      style={{
        background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
            Now boarding
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-sand sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-teal-100/90">{subtitle}</p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/destinations"
              className="rounded-full px-6 py-3 text-sm font-semibold text-sand transition-transform hover:scale-105"
              style={{ backgroundColor: config.colors.secondary }}
            >
              Explore Destinations
            </Link>
            <Link
              href="/trips/create"
              className="rounded-full border border-sand/30 px-6 py-3 text-sm font-semibold text-sand transition-colors hover:bg-sand/10"
            >
              Plan a Trip
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <BoardingPassCard
            fromCity="Surat"
            fromCode="STV"
            toCity="Bali"
            toCode="DPS"
            date="12 Nov"
            duration="7h 40m"
            price={899}
          />
        </div>
      </div>
    </section>
  );
}