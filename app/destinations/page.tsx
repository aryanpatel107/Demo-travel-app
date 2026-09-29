
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

import SearchBar from "@/components/SearchBar";
import DestinationGrid from "@/components/DestinationGrid";
import {
  BrandEmptyState,
  BrandErrorState,
} from "@/components/brand/BrandState";
import { useAppConfig } from "@/components/RemoteConfigProvider";
import { destinations } from "@/data/destinations";

const categories = [
  "ALL",
  "ADVENTURE",
  "BEACH",
  "CULTURE",
  "NATURE",
] as const;

export default function DestinationsPage() {
  const { branding } = useAppConfig();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("ALL");

  const brandName = branding.name?.trim() || "";
  const brandKey = brandName.toLowerCase().replace(/\s+/g, "");

  const isWanderly = brandKey === "wanderly";
  const isTravelPro = brandKey === "travelpro";
  const isMyTravel = brandKey === "mytravel";

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("ALL");
  };

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
        destination.tags.some(
          (tag) => tag.toLowerCase() === normalizedCategory,
        );

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
    <section className={`destinations-page ${brandKey}-destinations px-4 py-8 sm:px-6 sm:py-12 lg:px-8`}>
      <div className="mx-auto max-w-6xl">
        {isWanderly && (
          <div className="wanderly-destinations__header mb-6 sm:mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#d96a3a]">
                Departures
              </p>

              <h1 className="mt-2 sm:mt-3 max-w-xl font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.05] sm:leading-[0.95] text-[#16241f]">
                Places worth
                <span className="block">getting lost in.</span>
              </h1>
            </div>

            <div className="max-w-xl">
              <p className="text-base sm:text-lg leading-7 sm:leading-8 text-[#33433d]">
                Discover destinations that turn a simple trip into a story.
              </p>
            </div>
          </div>
        )}

        {isTravelPro && (
          <div className="travelpro-destinations__header mb-6 sm:mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-600">
              Destinations
            </p>

            <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-5xl text-slate-900">
              Explore destinations
            </h1>

            <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
              Find the right destination for your next journey.
            </p>
          </div>
        )}

        {isMyTravel && (
          <div className="mytravel-destinations__header mb-6 sm:mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#5f4bb2]">
              Discovery
            </p>

            <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-5xl text-[#20173c]">
              Where will you go next?
            </h1>

            <p className="mt-2 sm:mt-3 max-w-xl text-base sm:text-lg text-[#4c4770]">
              Find a place that feels right for your next adventure.
            </p>
          </div>
        )}

        <div className="mt-6 mb-6 sm:mt-8 sm:mb-8">
          <SearchBar
            onSearch={setQuery}
            placeholder="Search by name, country, or tag..."
          />
        </div>

        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            const baseClassName =
              "rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 min-h-9 sm:min-h-10 font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] transition-colors flex items-center justify-center";

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

        {isWanderly && filtered.length > 0 && featured && (
          <div className="wanderly-destinations__featured">
            <div className="wanderly-destinations__feature-card grid grid-cols-1 lg:grid-cols-2">
              <div className="wanderly-destinations__feature-image relative min-h-56 sm:min-h-72 lg:min-h-[22rem]">
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="wanderly-destinations__feature-content p-5 sm:p-6 lg:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d96a3a]">
                  Featured
                </p>

                <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl text-[#16241f]">
                  {featured.name}
                </h2>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#4a5a52]">
                  {featured.country}
                </p>

                <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-6 sm:leading-7 text-[#33433d]">
                  {featured.description}
                </p>

                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href={`/destinations/${featured.id}`}
                    className="flex min-h-11 items-center justify-center rounded-full bg-[#d96a3a] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:translate-y-[-1px]"
                  >
                    View story
                  </Link>

                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#445c56]">
                    {featured.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="wanderly-destinations__feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {secondary.slice(0, 3).map((destination) => (
                <DestinationGridItem
                  key={destination.id}
                  destination={destination}
                />
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
          <DestinationGrid
            destinations={filtered}
            variant={brandKey as "wanderly" | "travelpro" | "mytravel"}
          />
        )}
      </div>
    </section>
  );
}

const DestinationGridItem = memo(function DestinationGridItem({
  destination,
}: {
  destination: (typeof destinations)[number];
}) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="wanderly-destinations__mini-card"
    >
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
          <h3 className="font-display text-2xl text-[#16241f]">
            {destination.name}
          </h3>

          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d96a3a]">
            {destination.rating}
          </span>
        </div>

        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#4a5a52]">
          {destination.country}
        </p>

        <p className="mt-3 text-sm leading-6 text-[#33433d]">
          {destination.description}
        </p>
      </div>
    </Link>
  );
});

