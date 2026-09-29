"use client";

import { memo } from "react";
import { Destination } from "@/types/destination";
import DestinationCard from "./DestinationCard";
import { useAppConfig } from "@/components/RemoteConfigProvider";

interface DestinationGridProps {
  destinations: Destination[];
  variant?: "wanderly" | "travelpro" | "mytravel";
}

function DestinationGrid({
  destinations,
  variant,
}: DestinationGridProps) {
  const { branding } = useAppConfig();

  const remoteBrandKey =
    branding.name?.trim().toLowerCase().replace(/\s+/g, "") || "";

  const currentVariant = variant ?? remoteBrandKey;

  if (destinations.length === 0) {
    return (
      <p className="py-12 text-center text-ink/50">
        No destinations match your search.
      </p>
    );
  }

  return (
    <div
      className={[
        "grid gap-6",
        currentVariant === "wanderly"
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      ].join(" ")}
    >
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          variant={
            currentVariant as "wanderly" | "travelpro" | "mytravel"
          }
        />
      ))}
    </div>
  );
}

export default memo(DestinationGrid);