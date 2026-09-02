"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import DestinationGrid from "@/components/DestinationGrid";
import { BrandEmptyState, BrandErrorState } from "@/components/brand/BrandState";
import { destinations } from "@/data/destinations";
import { config } from "@/config";

const categories = ["ALL", "ADVENTURE", "BEACH", "CULTURE", "NATURE"] as const;

export default function DestinationsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("ALL");

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("ALL");
  };

  const brandKey = config.name.toLowerCase().replace(/\s+/g, "");
  const isWanderly = brandKey === "wanderly";
  const isTravelPro = brandKey === "travelpro";
  const isMyTravel = brandKey === "mytravel";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const normalizedCategory = activeCategory.toLowerCase();

    return destinations.filter((destination) => {
      const matchesQuery =
        !q ||
        destination.name.toLowerCase().includes(q) ||
        destination.country.toLowerCase().includes(q) ||
        destination.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        normalizedCategory === "all" ||
        destination.tags.some((tag) => tag.toLowerCase() === normalizedCategory);

      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const featured = filtered[0];
  const secondary = filtered.slice(1);

  if (!Array.isArray(destinations) || destinations.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <BrandErrorState
          title="Destinations are temporarily unavailable"
          description="We couldn’t load the destination list right now. Please try again in a moment."
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      </section>
    );
  }

  return (
    <section className={`destinations-page ${brandKey}-destinations`}>
      <div className="mx-auto max-w-6xl">
        {isWanderly && (
          <div className="wanderly-destinations__header">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#d96a3a]">Departures</p>
              <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.95] text-[#16241f] sm:text-6xl">
                Places worth
                <span className="block">getting lost in.</span>
              </h1>
            </div>
            <div className="max-w-xl">
              <p className="text-lg leading-8 text-[#33433d]">
                Discover destinations that turn a simple trip into a story.
              </p>
            </div>
          </div>
        )}

        {isTravelPro && (
          <div className="travelpro-destinations__header">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-600">Destinations</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">Explore destinations</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Find the right destination for your next journey.
            </p>
          </div>
        )}

        {isMyTravel && (
          <div className="mytravel-destinations__header">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#5f4bb2]">Discovery</p>
            <h1 className="mt-3 font-display text-4xl text-[#20173c] sm:text-5xl">Where will you go next?</h1>
            <p className="mt-3 max-w-xl text-lg text-[#4c4770]">
              Find a place that feels right for your next adventure.
            </p>
          </div>
        )}

        <div className="mt-8 mb-8">
          <SearchBar onSearch={setQuery} placeholder="Search by name, country, or tag..." />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const baseClassName = isWanderly
              ? "rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors sm:px-4"
              : isTravelPro
                ? "rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors sm:px-4"
                : "rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors sm:px-4";

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  baseClassName,
                  isWanderly
                    ? isActive
                      ? "border-[#d96a3a] bg-[#d96a3a] text-[#fffaf3]"
                      : "border-[#e7dac0] bg-[#fffaf3] text-[#3c4f48]"
                    : isTravelPro
                      ? isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                      : isActive
                        ? "border-[#7a5ae1] bg-[#7a5ae1] text-white"
                        : "border-[#eae0ff] bg-white text-[#4a4568]",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {isWanderly && filtered.length > 0 && (
          <div className="wanderly-destinations__featured">
            <div className="wanderly-destinations__feature-card">
              <div className="wanderly-destinations__feature-image relative">
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="wanderly-destinations__feature-content">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d96a3a]">Featured</p>
                <h2 className="mt-3 font-display text-3xl text-[#16241f]">{featured.name}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#4a5a52]">{featured.country}</p>
                <p className="mt-4 max-w-md text-base leading-7 text-[#33433d]">{featured.description}</p>
                <div className="mt-6 flex items-center gap-4">
                  <Link href={`/destinations/${featured.id}`} className="rounded-full bg-[#d96a3a] px-5 py-3 text-sm font-semibold text-white transition-transform hover:translate-y-[-1px]">
                    View story
                  </Link>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#445c56]">{featured.duration}</span>
                </div>
              </div>
            </div>

            <div className="wanderly-destinations__feature-grid">
              {secondary.slice(0, 3).map((destination) => (
                <DestinationGridItem key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-8">
            <BrandEmptyState
              title="No destinations found"
              description={
                query || activeCategory !== "ALL"
                  ? "Your search or selected filter did not match any destinations. Clear the filters to view all destinations again."
                  : "We couldn’t find any destinations to show right now."
              }
              actionLabel="Clear filters"
              onAction={resetFilters}
            />
          </div>
        )}

        {!isWanderly && filtered.length > 0 && (
          <DestinationGrid destinations={filtered} variant={brandKey as "wanderly" | "travelpro" | "mytravel"} />
        )}
      </div>
    </section>
  );
}

const DestinationGridItem = memo(function DestinationGridItem({ destination }: { destination: (typeof destinations)[number] }) {
  return (
    <Link href={`/destinations/${destination.id}`} className="wanderly-destinations__mini-card">
      <div className="wanderly-destinations__mini-image relative">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2xl text-[#16241f]">{destination.name}</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d96a3a]">{destination.rating}</span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#4a5a52]">{destination.country}</p>
        <p className="mt-3 text-sm leading-6 text-[#33433d]">{destination.description}</p>
      </div>
    </Link>
  );
});