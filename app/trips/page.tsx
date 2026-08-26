import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";

interface TripView {
  id: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  paymentStatus: string;
}

async function getTrips(): Promise<TripView[]> {
  const trips = await apiFetch<
    {
      id: string;
      destinationName: string;
      startDate: string;
      endDate: string;
      travelers: number;
      paymentStatus?: string;
    }[]
  >("/api/trips");

  return trips.map((t) => ({
    id: t.id,
    destinationName: t.destinationName,
    startDate: t.startDate.slice(0, 10),
    endDate: t.endDate.slice(0, 10),
    travelers: t.travelers,
    paymentStatus: t.paymentStatus ?? "unpaid",
  }));
}

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Your Trips</h1>
        <Link
          href="/trips/create"
          className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <p className="text-ink/50">You haven&apos;t planned any trips yet.</p>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex items-center justify-between rounded-2xl border border-cloud bg-white p-5 shadow-sm"
            >
              <div>
                <p className="font-display font-semibold text-ink">{trip.destinationName}</p>
                <p className="font-mono text-xs text-ink/50">
                  {trip.startDate} → {trip.endDate}
                </p>
              </div>

              <div className="text-right">
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