"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandEmptyState, BrandErrorState } from "@/components/brand/BrandState";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, apiFetch } from "@/lib/apiClient";

interface TripView {
  id: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  paymentStatus: string;
}

export default function TripsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<TripView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    async function loadTrips() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<
          {
            id: string;
            destinationName: string;
            startDate: string;
            endDate: string;
            travelers: number;
            paymentStatus?: string;
          }[]
        >("/api/trips");

        const mappedTrips = response.map((trip) => ({
          id: trip.id,
          destinationName: trip.destinationName,
          startDate: trip.startDate.slice(0, 10),
          endDate: trip.endDate.slice(0, 10),
          travelers: trip.travelers,
          paymentStatus: trip.paymentStatus ?? "unpaid",
        }));

        setTrips(mappedTrips);
      } catch (loadError) {
        if (loadError instanceof ApiError) {
          if (loadError.status === 401) {
            setError("Your session has expired. Please log in again.");
            router.replace("/login");
            return;
          }

          if (loadError.status === 403) {
            setError("You don't have permission to access these trips.");
            return;
          }

          if (loadError.status === 503) {
            setError("Unable to connect to the travel service.");
            return;
          }

          setError("Trips are temporarily unavailable.");
          return;
        }

        setError("Trips are temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    }

    void loadTrips();
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Loading your trips…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <BrandErrorState
          title={error === "Your session has expired. Please log in again." ? "Session expired" : "Trips are temporarily unavailable"}
          description={error}
          actionLabel={error === "Your session has expired. Please log in again." ? "Log in again" : "Try Again"}
          actionHref={error === "Your session has expired. Please log in again." ? "/login" : "/trips"}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Your Trips</h1>
        <Link
          href="/trips/create"
          className="brand-button inline-flex items-center justify-center rounded-full bg-coral px-5 py-2 text-sm font-semibold text-sand hover:scale-105"
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <BrandEmptyState
          title="No trips planned yet"
          description="Start with a simple trip and build a personalized itinerary around your next destination."
          actionLabel="Create a trip"
          actionHref="/trips/create"
        />
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="brand-card anim-fade-up flex flex-col gap-4 rounded-2xl border border-cloud bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-display font-semibold text-ink">{trip.destinationName}</p>
                <p className="font-mono text-xs text-ink/50">
                  {trip.startDate} → {trip.endDate}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-ink/70">
                  {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
                </p>
                <span
                  className={`font-mono text-xs ${
                    trip.paymentStatus === "paid" ? "text-teal" : "text-coral"
                  }`}
                >
                  {trip.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
