"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { apiFetch } from "@/lib/apiClient";

type TripResponse = {
  id: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes?: string;
  status: string;
  createdAt: string;
  paymentStatus: string;
};

type CheckoutResponse = {
  checkoutUrl: string;
  paymentId: string;
};

export default function CreateTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselected = searchParams.get("destinationId") ?? "";

  const [destinationId, setDestinationId] = useState(preselected);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");

  const [amount, setAmount] = useState(1000);
  const [currency, setCurrency] = useState("usd");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const selectedDestination = destinations.find(
        (destination) => destination.id === destinationId
      );

      if (!selectedDestination) {
        throw new Error("Please select a destination.");
      }

      // 1. Create the trip
      const trip = await apiFetch<TripResponse>("/api/trips", {
        method: "POST",
        body: JSON.stringify({
          destinationId: selectedDestination.id,
          destinationName: selectedDestination.name,
          startDate,
          endDate,
          travelers,
          notes: notes || null,
        }),
      });

      // 2. Create payment checkout
      const checkout = await apiFetch<CheckoutResponse>(
        "/api/payments/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            tripId: trip.id,
            amount,
            currency,
          }),
        }
      );

      // 3. Show success briefly
      setSubmitted(true);

      // 4. Redirect to payment page
      setTimeout(() => {
        router.push(checkout.checkoutUrl);
      }, 800);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        Plan a New Trip
      </h1>

      {submitted ? (
        <div className="rounded-lg bg-emerald-50 p-5 text-emerald-700">
          <h2 className="font-semibold">Trip created successfully!</h2>
          <p className="mt-1 text-sm">
            Redirecting you to payment...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Destination
            </label>

            <select
              required
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            >
              <option value="" disabled>
                Select a destination
              </option>

              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Start Date
              </label>

              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                End Date
              </label>

              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Travelers
            </label>

            <input
              required
              type="number"
              min={1}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any special requirements?"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Payment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Currency
                </label>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
                >
                  <option value="usd">USD</option>
                  <option value="inr">INR</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </select>
              </div>

              <div className="rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Payment Amount
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {currency.toUpperCase()} {amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating trip..." : `Pay ${currency.toUpperCase()} ${amount}`}
          </button>
        </form>
      )}
    </section>
  );
}