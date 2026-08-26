"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import DestinationGrid from "@/components/DestinationGrid";
import { destinations } from "@/data/destinations";

export default function DestinationsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Departures</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">All Destinations</h1>
      <p className="mb-8 mt-1 text-ink/60">Browse our full collection and find your next adventure.</p>
      <div className="mb-10">
        <SearchBar onSearch={setQuery} placeholder="Search by name, country, or tag..." />
      </div>
      <DestinationGrid destinations={filtered} />
    </section>
  );
}