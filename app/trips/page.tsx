"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandEmptyState, BrandErrorState } from "@/components/brand/BrandState";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiError, apiFetch } from "@/lib/apiClient";

interface TripView {
  id: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  paymentStatus: string;
}

/**
 * /trips — the signed-in user's trip list.
 *
 * Access is gated by useRequireAuth(): while auth status is still being
 * resolved, or once it resolves to "not logged in", this page renders
 * nothing and is silently redirected to /login — no error is shown for
 * that case, since it isn't actually an error.
 *
 * A visible error card is reserved for a genuine failure that happens
 * AFTER access was already confirmed (e.g. the session token expired
 * mid-use, or the trips service is unreachable).
 */
export default function TripsPage() {
  const router = useRouter();
  const isAuthReady = useRequireAuth();

  const [trips, setTrips] = useState<TripView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) {
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
            // Access was confirmed by useRequireAuth() before this call
            // was ever made, so a 401 here means the session genuinely
            // expired between the guard check and this request — a real,
            // user-facing condition worth explaining, not silent-redirect
            // noise.
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
  }, [isAuthReady, router]);

  // Covers both "still checking auth" and "confirmed logged out, about
  // to redirect" — render nothing rather than a loading card, since a
  // logged-out visitor should see a clean, near-instant redirect with no
  // intermediate flash of page content.
  if (!isAuthReady) {
    return null;
  }

  if (loading) {
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
