import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhyWanderly from "@/components/WhyWanderly";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { destinations } from "@/data/destinations";
import Link from "next/link";

export default function HomePage() {
  const featured = destinations.slice(0, 3);

  return (
    <>
      <Hero
        title="Explore the World, One Trip at a Time"
        subtitle="Curated destinations, unforgettable experiences, and trips built around you."
      />
      <Stats />
      <WhyWanderly />

      <section className="mx-auto max-w-6xl px-6 py-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-coral">Featured</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              Popular Destinations
            </h2>
          </div>
          <Link href="/destinations" className="font-mono text-xs uppercase tracking-widest text-teal hover:underline">
            View all →
          </Link>
        </div>
        <DestinationGrid destinations={featured} />
      </section>

      <Testimonials />
      <CTASection />
    </>
  );
}