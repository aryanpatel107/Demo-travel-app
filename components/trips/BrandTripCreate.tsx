"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/config";
import { destinations } from "@/data/destinations";
import { apiFetch } from "@/lib/apiClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type TripFormState = {
  destinationId: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes: string;
  amount: number;
  currency: string;
};

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

type BrandKey = "wanderly" | "travelpro" | "mytravel";

type FormErrors = Partial<{
  destinationId: string;
  startDate: string;
  endDate: string;
  travelers: string;
}>;

type PaymentChoice = "now" | "later";
type PaymentResultStatus = "success" | "failed" | "cancelled";

const EXPERIENCE_OPTIONS = [
  { label: "Adventure", icon: "🏔" },
  { label: "Beaches", icon: "🌊" },
  { label: "Food", icon: "🍜" },
  { label: "Culture", icon: "🏛" },
  { label: "Nature", icon: "🌿" },
  { label: "Photography", icon: "📸" },
  { label: "Relax", icon: "🏖" },
];

const BRAND_KEY = config.name.toLowerCase().replace(/\s+/g, "") as BrandKey;

export default function BrandTripCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gate the entire trip-creation flow behind a confirmed login. Without
  // this, a logged-out visitor could fill out the whole multi-step form
  // (destination, dates, travelers, experiences) only to hit a raw
  // "Request failed with status 401" on the very last step — wasted
  // effort and an unprofessional error. This applies to all three
  // brand layouts below since they share this one component.
  const isAuthReady = useRequireAuth();

  const preselectedDestinationId = searchParams.get("destinationId") ?? "";

  const [trip, setTrip] = useState<TripFormState>({
    destinationId: preselectedDestinationId,
    startDate: "",
    endDate: "",
    travelers: 2,
    notes: "",
    amount: 1000,
    currency: "usd",
  });
  const [experienceSelections, setExperienceSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [createdTrip, setCreatedTrip] = useState<TripResponse | null>(null);
  const [tripStage, setTripStage] = useState<"form" | "created" | "processing">("form");

  const [activeStep, setActiveStep] = useState(0);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  const selectedDestination = useMemo(
    () => destinations.find((destination) => destination.id === trip.destinationId),
    [trip.destinationId]
  );

  const updateTrip = (values: Partial<TripFormState>) => {
    setTrip((current) => ({ ...current, ...values }));
  };

  const toggleExperienceSelection = (experience: string) => {
    setExperienceSelections((current) =>
      current.includes(experience)
        ? current.filter((item) => item !== experience)
        : [...current, experience]
    );
  };

  const validateTrip = () => {
    const nextErrors: FormErrors = {};

    if (!trip.destinationId.trim()) {
      nextErrors.destinationId = "Please choose a destination.";
    }

    if (!trip.startDate.trim()) {
      nextErrors.startDate = "Please select a start date.";
    }

    if (!trip.endDate.trim()) {
      nextErrors.endDate = "Please select an end date.";
    }

    if (trip.startDate && trip.endDate && trip.startDate > trip.endDate) {
      nextErrors.endDate = "The end date must be after the start date.";
    }

    if (trip.travelers < 1) {
      nextErrors.travelers = "Travelers must be at least 1.";
    }

    return nextErrors;
  };

  const summaryDates =
    trip.startDate && trip.endDate
      ? `${new Date(trip.startDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })} — ${new Date(trip.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })}`
      : "Choose your dates";

  const goToPaymentResult = (status: PaymentResultStatus, paymentId?: string) => {
    if (!createdTrip) {
      router.push("/trips");
      return;
    }

    const params = new URLSearchParams();
    if (paymentId) params.set("paymentId", paymentId);
    params.set("status", status);
    router.push(`/trips/${createdTrip.id}/payment-success?${params.toString()}`);
  };

  async function submitTrip() {
    const nextErrors = validateTrip();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const destination = destinations.find((item) => item.id === trip.destinationId);

      if (!destination) {
        throw new Error("Please select a valid destination.");
      }

      const tripPayload = {
        destinationId: destination.id,
        destinationName: destination.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers,
        notes: trip.notes || null,
      };

      const nextTrip = await apiFetch<TripResponse>("/api/trips", {
        method: "POST",
        body: JSON.stringify(tripPayload),
      });

      setCreatedTrip(nextTrip);
      setTripStage("created");
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  async function handlePaymentChoice(choice: PaymentChoice) {
    if (!createdTrip) {
      return;
    }

    setLoading(true);
    setTripStage("processing");

    if (choice === "later") {
      window.setTimeout(() => {
        goToPaymentResult("cancelled");
      }, 900);
      return;
    }

    try {
      const checkout = await apiFetch<CheckoutResponse>("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({
          tripId: createdTrip.id,
          amount: trip.amount,
          currency: trip.currency,
        }),
      });

      window.setTimeout(() => {
        goToPaymentResult("success", checkout.paymentId);
      }, 900);
    } catch (err) {
      window.setTimeout(() => {
        goToPaymentResult("failed");
      }, 900);
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const bookSummary = (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Trip summary
        </p>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          Live
        </span>
      </div>

      <div>
        <p className="text-sm text-slate-500">Destination</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          {selectedDestination ? `${selectedDestination.name}, ${selectedDestination.country}` : "Not selected"}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Dates</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{summaryDates}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Travelers</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{trip.travelers}</p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Estimated total</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {trip.currency.toUpperCase()} {trip.amount}
        </p>
      </div>
    </div>
  );

  // Covers both "still checking auth" and "confirmed logged out, about to
  // redirect". Render nothing rather than any part of the form — a
  // logged-out visitor should never see the destination picker, dates,
  // or traveler counts before being sent to /login.
  if (!isAuthReady) {
    return null;
  }

  if (tripStage === "processing") {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-sky-200 bg-sky-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <h2 className="text-2xl font-bold text-sky-900">Payment processing...</h2>
          <p className="mt-3 text-sky-700">
            We are confirming your payment choice and preparing the final booking status.
          </p>
        </div>
      </div>
    );
  }

  if (tripStage === "created") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-emerald-600">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-emerald-900">Trip created successfully</h2>
          <p className="mt-3 text-emerald-700">
            Your trip is saved. Review the details below and choose your payment option.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Trip summary</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">
              {selectedDestination ? `${selectedDestination.name}, ${selectedDestination.country}` : "Trip overview"}
            </h3>

            <div className="mt-6 space-y-5 text-slate-700">
              <div>
                <p className="text-sm text-slate-500">Dates</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{summaryDates}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Travelers</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{trip.travelers} guests</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Notes</p>
                <p className="mt-1 text-lg text-slate-900">
                  {trip.notes?.trim() ? trip.notes : "No additional notes added"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Trip ID</p>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-900">{createdTrip?.id ?? "pending"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Payment</p>
            <h3 className="text-2xl font-bold text-slate-900">Choose your payment option</h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePaymentChoice("now")}
                disabled={loading}
                className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay now"}
              </button>
              <button
                type="button"
                onClick={() => handlePaymentChoice("later")}
                disabled={loading}
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pay later
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTripStage("form")}
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Edit trip details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (BRAND_KEY === "wanderly") {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f6f0e8] text-[#17221d]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#d96a3a]">
              Wanderly itinerary
            </p>
            <h1 className="font-display text-5xl leading-none tracking-[-0.05em] text-[#17221d] sm:text-6xl">
              Build your next
              <span className="block text-[#d96a3a]">great adventure.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#32443f]">
              Tell us what kind of journey you are dreaming about. We will help turn it into a trip worth remembering.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-8">
              <section className="rounded-[2rem] border border-[#ebe0d2] bg-[#fffdf9] p-6 shadow-[0_20px_45px_rgba(23,34,29,0.08)] sm:p-8">
                <h2 className="mb-6 text-3xl font-bold text-[#17221d]">Where do you want to go?</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {destinations.map((destination) => {
                    const isSelected = trip.destinationId === destination.id;

                    return (
                      <button
                        key={destination.id}
                        type="button"
                        aria-label={`Select ${destination.name}`}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setFormErrors((current) => ({ ...current, destinationId: "" }));
                          updateTrip({ destinationId: destination.id });
                        }}
                        className={`group relative overflow-hidden rounded-[1.75rem] border text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#d96a3a] shadow-[0_18px_35px_rgba(217,106,58,0.18)]"
                            : "border-[#eee3d3] hover:-translate-y-1 hover:border-[#d0b79b]"
                        }`}
                      >
                        <div className="relative h-52 w-full overflow-hidden">
                          <Image
                            src={destination.imageUrl}
                            alt={destination.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                          {isSelected && (
                            <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#d96a3a] text-lg text-white shadow-lg">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 bg-[#fffdf9] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-2xl font-bold text-[#17221d]">{destination.name}</h3>
                            {isSelected && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d96a3a]">Selected</span>}
                          </div>
                          <p className="text-sm text-[#4f665e]">{destination.country}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formErrors.destinationId && (
                  <p className="mt-3 text-sm font-medium text-red-600">{formErrors.destinationId}</p>
                )}
              </section>

              <section className="rounded-[2rem] border border-[#ebe0d2] bg-[#fffdf9] p-6 shadow-[0_20px_45px_rgba(23,34,29,0.08)] sm:p-8">
                <h2 className="mb-6 text-3xl font-bold text-[#17221d]">When are you going?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#4f665e]">
                      Start date
                    </span>
                    <input
                      type="date"
                      value={trip.startDate}
                      onChange={(event) => {
                        setFormErrors((current) => ({ ...current, startDate: "" }));
                        updateTrip({ startDate: event.target.value });
                      }}
                      className="w-full rounded-2xl border border-[#e6d7c7] bg-[#f9f4ef] px-4 py-3 text-base text-[#17221d] focus:border-[#d96a3a] focus:outline-none"
                    />
                    {formErrors.startDate && (
                      <span className="mt-2 block text-sm text-red-600">{formErrors.startDate}</span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#4f665e]">
                      End date
                    </span>
                    <input
                      type="date"
                      value={trip.endDate}
                      onChange={(event) => {
                        setFormErrors((current) => ({ ...current, endDate: "" }));
                        updateTrip({ endDate: event.target.value });
                      }}
                      className="w-full rounded-2xl border border-[#e6d7c7] bg-[#f9f4ef] px-4 py-3 text-base text-[#17221d] focus:border-[#d96a3a] focus:outline-none"
                    />
                    {formErrors.endDate && (
                      <span className="mt-2 block text-sm text-red-600">{formErrors.endDate}</span>
                    )}
                  </label>
                </div>

                <div className="mt-6 rounded-2xl border border-[#efe1d0] bg-[#f9f3ec] p-4">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#4f665e]">
                    Travelers
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-base font-semibold text-[#17221d]">Adults</p>
                        <p className="text-xs text-[#4f665e]">{adultCount} guests</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setAdultCount((count) => {
                              const nextCount = Math.max(1, count - 1);
                              setTrip((current) => ({ ...current, travelers: nextCount + childCount }));
                              return nextCount;
                            });
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5d5c4] bg-[#fffaf5] text-xl text-[#17221d]"
                          aria-label="Decrease adults"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-lg font-semibold text-[#17221d]">{adultCount}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAdultCount((count) => {
                              const nextCount = count + 1;
                              setTrip((current) => ({ ...current, travelers: nextCount + childCount }));
                              return nextCount;
                            });
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5d5c4] bg-[#fffaf5] text-xl text-[#17221d]"
                          aria-label="Increase adults"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-base font-semibold text-[#17221d]">Children</p>
                        <p className="text-xs text-[#4f665e]">{childCount} guests</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setChildCount((count) => {
                              const nextCount = Math.max(0, count - 1);
                              setTrip((current) => ({ ...current, travelers: adultCount + nextCount }));
                              return nextCount;
                            });
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5d5c4] bg-[#fffaf5] text-xl text-[#17221d]"
                          aria-label="Decrease children"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-lg font-semibold text-[#17221d]">{childCount}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setChildCount((count) => {
                              const nextCount = count + 1;
                              setTrip((current) => ({ ...current, travelers: adultCount + nextCount }));
                              return nextCount;
                            });
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5d5c4] bg-[#fffaf5] text-xl text-[#17221d]"
                          aria-label="Increase children"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e6d7c7] pt-4">
                    <span className="text-sm text-[#4f665e]">Total travelers</span>
                    <span className="text-lg font-bold text-[#17221d]">{adultCount + childCount}</span>
                  </div>
                </div>

                {formErrors.travelers && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.travelers}</p>
                )}
              </section>

              <section className="rounded-[2rem] border border-[#ebe0d2] bg-[#fffdf9] p-6 shadow-[0_20px_45px_rgba(23,34,29,0.08)] sm:p-8">
                <h2 className="mb-6 text-3xl font-bold text-[#17221d]">What kind of experiences are you craving?</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {EXPERIENCE_OPTIONS.map((experience) => {
                    const selected = experienceSelections.includes(experience.label);

                    return (
                      <button
                        key={experience.label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleExperienceSelection(experience.label)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-[#d96a3a] bg-[#fff4ee] text-[#17221d]"
                            : "border-[#eee3d3] bg-[#f6efe9] text-[#17221d] hover:border-[#d0b79b]"
                        }`}
                      >
                        <span className="flex items-center gap-3 text-base font-medium">
                          <span className="text-xl">{experience.icon}</span>
                          {experience.label}
                        </span>
                        {selected && <span className="text-sm font-bold text-[#d96a3a]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="lg:pt-2">
              <div className="rounded-[2rem] border border-[#efe0d2] bg-[#fdf7f2] p-6 shadow-[0_20px_40px_rgba(23,34,29,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d96a3a]">Your adventure</p>
                <div className="mt-5 rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#4f665e]">Destination</p>
                  <h3 className="mt-3 text-2xl font-bold text-[#17221d]">
                    {selectedDestination ? `${selectedDestination.name}, ${selectedDestination.country}` : "Choose your destination"}
                  </h3>

                  <div className="mt-6 space-y-4 border-t border-[#efe4d6] pt-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#4f665e]">Dates</p>
                      <p className="mt-2 text-lg font-semibold text-[#17221d]">{summaryDates}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#4f665e]">Travelers</p>
                      <p className="mt-2 text-lg font-semibold text-[#17221d]">{trip.travelers} travelers</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#4f665e]">Experiences</p>
                      <p className="mt-2 text-base font-medium text-[#17221d]">
                        {experienceSelections.length > 0 ? experienceSelections.join(", ") : "Your picks appear here"}
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submitTrip}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center rounded-full bg-[#d96a3a] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#c85d2f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating your trip..." : "Create my adventure →"}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (BRAND_KEY === "travelpro") {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">TravelPro</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Book your trip</h1>
            <p className="mt-3 max-w-xl text-lg text-slate-600">
              Enter your travel details and review your trip before confirming.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-8">
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Destination
                  </label>
                  <select
                    value={trip.destinationId}
                    onChange={(event) => {
                      setFormErrors((current) => ({ ...current, destinationId: "" }));
                      updateTrip({ destinationId: event.target.value });
                    }}
                    aria-invalid={!!formErrors.destinationId}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
                  >
                    <option value="">Choose destination</option>
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}, {destination.country}
                      </option>
                    ))}
                  </select>
                  {formErrors.destinationId && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.destinationId}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Departure
                    </label>
                    <input
                      type="date"
                      value={trip.startDate}
                      onChange={(event) => {
                        setFormErrors((current) => ({ ...current, startDate: "" }));
                        updateTrip({ startDate: event.target.value });
                      }}
                      aria-invalid={!!formErrors.startDate}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                    {formErrors.startDate && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Return
                    </label>
                    <input
                      type="date"
                      value={trip.endDate}
                      onChange={(event) => {
                        setFormErrors((current) => ({ ...current, endDate: "" }));
                        updateTrip({ endDate: event.target.value });
                      }}
                      aria-invalid={!!formErrors.endDate}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                    {formErrors.endDate && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.endDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={trip.travelers}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value) || 1;
                      setFormErrors((current) => ({ ...current, travelers: "" }));
                      updateTrip({ travelers: nextValue });
                    }}
                    aria-invalid={!!formErrors.travelers}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                  {formErrors.travelers && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.travelers}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Notes
                  </label>
                  <textarea
                    value={trip.notes}
                    onChange={(event) => updateTrip({ notes: event.target.value })}
                    rows={4}
                    placeholder="Any special preferences or requirements?"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              {bookSummary}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={submitTrip}
                disabled={loading}
                className="w-full rounded-full bg-sky-700 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating your trip..." : "Continue to booking"}
              </button>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ff] text-[#1f2937]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">MyTravel</p>
          <h1 className="mt-3 text-4xl font-bold text-[#1f2937] sm:text-5xl">Let&apos;s plan your trip.</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-[#4b5563]">
            Answer a few quick questions and we&apos;ll build your trip with you.
          </p>
        </header>

        <div className="mb-8 rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    activeStep === index
                      ? "bg-violet-600 text-white"
                      : index < activeStep
                        ? "bg-violet-100 text-violet-700"
                        : "bg-violet-50 text-violet-400"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
          {activeStep === 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Step 1</p>
              <h2 className="mt-3 text-3xl font-bold text-[#1f2937]">Where are you thinking of going?</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {destinations.map((destination) => (
                  <button
                    key={destination.id}
                    type="button"
                    onClick={() => {
                      updateTrip({ destinationId: destination.id });
                      setActiveStep(1);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      trip.destinationId === destination.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-violet-100 bg-[#faf7ff] hover:border-violet-300"
                    }`}
                  >
                    <p className="text-lg font-semibold text-[#1f2937]">{destination.name}</p>
                    <p className="text-sm text-[#4b5563]">{destination.country}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="rounded-full bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Step 2</p>
              <h2 className="mt-3 text-3xl font-bold text-[#1f2937]">When would you like to go?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#374151]">Start date</span>
                  <input
                    type="date"
                    value={trip.startDate}
                    onChange={(event) => updateTrip({ startDate: event.target.value })}
                    className="w-full rounded-2xl border border-violet-200 bg-[#faf7ff] px-4 py-3 text-base text-[#1f2937] focus:border-violet-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#374151]">End date</span>
                  <input
                    type="date"
                    value={trip.endDate}
                    onChange={(event) => updateTrip({ endDate: event.target.value })}
                    className="w-full rounded-2xl border border-violet-200 bg-[#faf7ff] px-4 py-3 text-base text-[#1f2937] focus:border-violet-500 focus:outline-none"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setActiveStep(0)} className="rounded-full border border-violet-200 px-5 py-3 text-base font-semibold text-violet-700">
                  ← Back
                </button>
                <button type="button" onClick={() => setActiveStep(2)} className="rounded-full bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-700">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Step 3</p>
              <h2 className="mt-3 text-3xl font-bold text-[#1f2937]">Who&apos;s coming?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-violet-100 bg-[#faf7ff] p-5">
                  <p className="text-base font-semibold text-[#1f2937]">Adults</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setAdultCount((count) => {
                          const nextCount = Math.max(1, count - 1);
                          setTrip((current) => ({ ...current, travelers: nextCount + childCount }));
                          return nextCount;
                        });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-[#1f2937]">{adultCount}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdultCount((count) => {
                          const nextCount = count + 1;
                          setTrip((current) => ({ ...current, travelers: nextCount + childCount }));
                          return nextCount;
                        });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-[#faf7ff] p-5">
                  <p className="text-base font-semibold text-[#1f2937]">Children</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setChildCount((count) => {
                          const nextCount = Math.max(0, count - 1);
                          setTrip((current) => ({ ...current, travelers: adultCount + nextCount }));
                          return nextCount;
                        });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-[#1f2937]">{childCount}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setChildCount((count) => {
                          const nextCount = count + 1;
                          setTrip((current) => ({ ...current, travelers: adultCount + nextCount }));
                          return nextCount;
                        });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-violet-100 bg-[#faf7ff] px-5 py-3">
                <span className="text-sm text-[#4b5563]">Total travelers</span>
                <span className="text-lg font-bold text-[#1f2937]">{adultCount + childCount}</span>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setActiveStep(1)} className="rounded-full border border-violet-200 px-5 py-3 text-base font-semibold text-violet-700">← Back</button>
                <button type="button" onClick={() => setActiveStep(3)} className="rounded-full bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-700">Continue →</button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Step 4</p>
              <h2 className="mt-3 text-3xl font-bold text-[#1f2937]">What sounds good?</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EXPERIENCE_OPTIONS.map((experience) => {
                  const selected = experienceSelections.includes(experience.label);
                  return (
                    <button
                      key={experience.label}
                      type="button"
                      onClick={() => toggleExperienceSelection(experience.label)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected ? "border-violet-500 bg-violet-50" : "border-violet-100 bg-[#faf7ff] hover:border-violet-300"
                      }`}
                    >
                      <span className="text-3xl">{experience.icon}</span>
                      <p className="mt-3 text-lg font-semibold text-[#1f2937]">{experience.label}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setActiveStep(2)} className="rounded-full border border-violet-200 px-5 py-3 text-base font-semibold text-violet-700">← Back</button>
                <button type="button" onClick={() => setActiveStep(4)} className="rounded-full bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-700">Continue →</button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Step 5</p>
              <h2 className="mt-3 text-3xl font-bold text-[#1f2937]">Your trip</h2>
              <div className="mt-6 rounded-[2rem] border border-violet-100 bg-[#faf7ff] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Your travel plan</p>
                <h3 className="mt-3 text-3xl font-bold text-[#1f2937]">
                  {selectedDestination ? `${selectedDestination.name}, ${selectedDestination.country}` : "Choose your destination"}
                </h3>
                <div className="mt-5 space-y-3 text-base text-[#374151]">
                  <p><span className="font-semibold text-[#1f2937]">Dates:</span> {summaryDates}</p>
                  <p><span className="font-semibold text-[#1f2937]">Travelers:</span> {trip.travelers}</p>
                  <p><span className="font-semibold text-[#1f2937]">Preferences:</span> {experienceSelections.length > 0 ? experienceSelections.join(", ") : "No favorites picked yet"}</p>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setActiveStep(3)} className="rounded-full border border-violet-200 px-5 py-3 text-base font-semibold text-violet-700">← Back</button>
                <button type="button" onClick={submitTrip} disabled={loading} className="rounded-full bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Creating your trip..." : "Create my trip ✨"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
