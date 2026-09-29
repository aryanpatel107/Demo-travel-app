"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import { apiFetch } from "@/lib/apiClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAppConfig } from "@/components/RemoteConfigProvider";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

type FormErrors = Partial<{
  destinationId: string;
  startDate: string;
  endDate: string;
  travelers: string;
}>;

type PaymentChoice = "now" | "later";
type PaymentResultStatus = "success" | "failed" | "cancelled";
type TripStage = "form" | "created" | "processing";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const EXPERIENCE_OPTIONS = [
  { label: "Adventure", icon: "🏔" },
  { label: "Beaches", icon: "🌊" },
  { label: "Food", icon: "🍜" },
  { label: "Culture", icon: "🏛" },
  { label: "Nature", icon: "🌿" },
  { label: "Photography", icon: "📸" },
  { label: "Relax", icon: "🏖" },
] as const;

const DEFAULT_AMOUNT = 1000;
const DEFAULT_CURRENCY = "usd";
const DEFAULT_ADULTS = 2;
const DEFAULT_CHILDREN = 0;

const STEPS = [
  { id: 0, title: "Destination" },
  { id: 1, title: "Dates" },
  { id: 2, title: "Travelers" },
  { id: 3, title: "Experiences" },
  { id: 4, title: "Review" },
] as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Choose your dates";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const start = new Date(startDate).toLocaleDateString("en-GB", options);
  const end = new Date(endDate).toLocaleDateString("en-GB", options);
  return `${start} — ${end}`;
}

function buildNotes(userNotes: string, experiences: string[]): string | null {
  const parts: string[] = [];

  if (userNotes.trim()) {
    parts.push(userNotes.trim());
  }

  if (experiences.length > 0) {
    parts.push(`Preferred experiences: ${experiences.join(", ")}`);
  }

  return parts.length > 0 ? parts.join(" | ") : null;
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BrandTripCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { branding } = useAppConfig();
  const isAuthReady = useRequireAuth();

  const brandName = branding.name?.trim() || "MyTravel";
  const preselectedDestinationId = searchParams.get("destinationId") ?? "";

  /* Form state */
  const [trip, setTrip] = useState<TripFormState>({
    destinationId: preselectedDestinationId,
    startDate: "",
    endDate: "",
    travelers: DEFAULT_ADULTS + DEFAULT_CHILDREN,
    notes: "",
    amount: DEFAULT_AMOUNT,
    currency: DEFAULT_CURRENCY,
  });

  const [experienceSelections, setExperienceSelections] = useState<string[]>([]);
  const [adultCount, setAdultCount] = useState(DEFAULT_ADULTS);
  const [childCount, setChildCount] = useState(DEFAULT_CHILDREN);

  /* UI / flow state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [createdTrip, setCreatedTrip] = useState<TripResponse | null>(null);
  const [tripStage, setTripStage] = useState<TripStage>("form");
  const [activeStep, setActiveStep] = useState(0);

  const selectedDestination = useMemo(
    () => destinations.find((d) => d.id === trip.destinationId) ?? null,
    [trip.destinationId],
  );

  const summaryDates = useMemo(
    () => formatDateRange(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate],
  );

  const today = useMemo(() => getTodayISO(), []);

  /* ---------------------------------------------------------------------- */
  /* State updaters                                                         */
  /* ---------------------------------------------------------------------- */

  const updateTrip = useCallback((values: Partial<TripFormState>) => {
    setTrip((current) => ({ ...current, ...values }));
  }, []);

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setFormErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const syncTravelers = useCallback((adults: number, children: number) => {
    const safeAdults = Math.max(1, adults);
    const safeChildren = Math.max(0, children);
    setAdultCount(safeAdults);
    setChildCount(safeChildren);
    setTrip((current) => ({
      ...current,
      travelers: safeAdults + safeChildren,
    }));
  }, []);

  const toggleExperience = useCallback((label: string) => {
    setExperienceSelections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Validation (per step + full form)                                      */
  /* ---------------------------------------------------------------------- */

  const validateStep = useCallback(
    (step: number): FormErrors => {
      const errors: FormErrors = {};

      if (step === 0) {
        if (!trip.destinationId.trim()) {
          errors.destinationId = "Please select a destination to continue.";
        }
      }

      if (step === 1) {
        if (!trip.startDate.trim()) {
          errors.startDate = "Please select a start date.";
        }
        if (!trip.endDate.trim()) {
          errors.endDate = "Please select an end date.";
        }
        if (
          trip.startDate &&
          trip.endDate &&
          trip.startDate > trip.endDate
        ) {
          errors.endDate = "End date must be after the start date.";
        }
      }

      if (step === 2) {
        if (trip.travelers < 1) {
          errors.travelers = "At least 1 traveler is required.";
        }
      }

      return errors;
    },
    [trip],
  );

  const validateFullTrip = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!trip.destinationId.trim()) {
      errors.destinationId = "Please choose a destination.";
    }
    if (!trip.startDate.trim()) {
      errors.startDate = "Please select a start date.";
    }
    if (!trip.endDate.trim()) {
      errors.endDate = "Please select an end date.";
    }
    if (
      trip.startDate &&
      trip.endDate &&
      trip.startDate > trip.endDate
    ) {
      errors.endDate = "End date must be after the start date.";
    }
    if (trip.travelers < 1) {
      errors.travelers = "Travelers must be at least 1.";
    }

    return errors;
  }, [trip]);

  const goToNextStep = useCallback(() => {
    const errors = validateStep(activeStep);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, [activeStep, validateStep]);

  const goToPreviousStep = useCallback(() => {
    setFormErrors({});
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Navigation helpers                                                     */
  /* ---------------------------------------------------------------------- */

  const goToPaymentResult = useCallback(
    (status: PaymentResultStatus, paymentId?: string) => {
      if (!createdTrip) {
        router.push("/trips");
        return;
      }

      const params = new URLSearchParams({ status });
      if (paymentId) {
        params.set("paymentId", paymentId);
      }

      router.push(
        `/trips/${createdTrip.id}/payment-success?${params.toString()}`,
      );
    },
    [createdTrip, router],
  );

  /* ---------------------------------------------------------------------- */
  /* Submit & payment                                                       */
  /* ---------------------------------------------------------------------- */

  const submitTrip = useCallback(async () => {
    const nextErrors = validateFullTrip();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Jump back to the first step that has an error
      if (nextErrors.destinationId) setActiveStep(0);
      else if (nextErrors.startDate || nextErrors.endDate) setActiveStep(1);
      else if (nextErrors.travelers) setActiveStep(2);
      return;
    }

    if (!selectedDestination) {
      setError("Please select a valid destination.");
      setActiveStep(0);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const tripPayload = {
        destinationId: selectedDestination.id,
        destinationName: selectedDestination.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers,
        notes: buildNotes(trip.notes, experienceSelections),
      };

      const nextTrip = await apiFetch<TripResponse>("/api/trips", {
        method: "POST",
        body: JSON.stringify(tripPayload),
      });

      setCreatedTrip(nextTrip);
      setTripStage("created");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    validateFullTrip,
    selectedDestination,
    trip.startDate,
    trip.endDate,
    trip.travelers,
    trip.notes,
    experienceSelections,
  ]);

  const handlePaymentChoice = useCallback(
    async (choice: PaymentChoice) => {
      if (!createdTrip) return;

      setLoading(true);
      setTripStage("processing");
      setError("");

      if (choice === "later") {
        window.setTimeout(() => {
          goToPaymentResult("cancelled");
        }, 900);
        return;
      }

      try {
        const checkout = await apiFetch<CheckoutResponse>(
          "/api/payments/checkout",
          {
            method: "POST",
            body: JSON.stringify({
              tripId: createdTrip.id,
              amount: trip.amount,
              currency: trip.currency,
            }),
          },
        );

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
            : "Payment could not be completed. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [createdTrip, trip.amount, trip.currency, goToPaymentResult],
  );

  /* ---------------------------------------------------------------------- */
  /* Early returns                                                          */
  /* ---------------------------------------------------------------------- */

  if (!isAuthReady) {
    return null;
  }

  if (tripStage === "processing") {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-violet-200 bg-violet-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <h2 className="text-2xl font-bold text-violet-900">
            Payment processing...
          </h2>
          <p className="mt-3 text-violet-700">
            We are confirming your payment choice and preparing the final
            booking status.
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
          <h2 className="text-3xl font-bold text-emerald-900">
            Trip created successfully
          </h2>
          <p className="mt-3 text-emerald-700">
            Your trip is saved. Review the details below and choose your
            payment option.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Trip summary
            </p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">
              {selectedDestination
                ? `${selectedDestination.name}, ${selectedDestination.country}`
                : "Trip overview"}
            </h3>

            <div className="mt-6 space-y-5 text-slate-700">
              <div>
                <p className="text-sm text-slate-500">Dates</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {summaryDates}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Travelers</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {trip.travelers} guests
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Notes</p>
                <p className="mt-1 text-lg text-slate-900">
                  {buildNotes(trip.notes, experienceSelections) ||
                    "No additional notes added"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Trip ID</p>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                  {createdTrip?.id ?? "pending"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Payment
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              Choose your payment option
            </h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePaymentChoice("now")}
                disabled={loading}
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              onClick={() => {
                setTripStage("form");
                setActiveStep(4);
              }}
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Edit trip details
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Main Form – MyTravel Step Wizard                                       */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#f5f1ff] text-[#1f2937]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
            {brandName}
          </p>
          <h1 className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold text-[#1f2937]">
            Let&apos;s plan your trip.
          </h1>
          <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-sm sm:text-lg text-[#4b5563]">
            Answer a few quick questions and we&apos;ll build your trip with
            you.
          </p>
        </header>

        {/* Progress indicator */}
        <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-[2rem] border border-violet-100 bg-white p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition ${activeStep === index
                      ? "bg-violet-600 text-white shadow-md"
                      : index < activeStep
                        ? "bg-violet-100 text-violet-700"
                        : "bg-violet-50 text-violet-400"
                      }`}
                  >
                    {index < activeStep ? "✓" : index + 1}
                  </div>
                  <span
                    className={`mt-1.5 hidden text-[10px] font-semibold uppercase tracking-wider sm:block ${activeStep === index
                      ? "text-violet-700"
                      : "text-violet-400"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-1 sm:mx-2 h-0.5 flex-1 rounded ${index < activeStep ? "bg-violet-400" : "bg-violet-100"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-2xl sm:rounded-[2rem] border border-violet-100 bg-white p-4 sm:p-8 shadow-sm">
          {/* ========== STEP 0: Destination ========== */}
          {activeStep === 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                Step 1 of 5
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                Where are you thinking of going?
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6b7280]">
                Select a destination to start planning your journey.
              </p>

              <div className="mt-5 sm:mt-6 grid gap-3 sm:grid-cols-2">
                {destinations.map((destination) => {
                  const isSelected = trip.destinationId === destination.id;

                  return (
                    <button
                      key={destination.id}
                      type="button"
                      onClick={() => {
                        clearFieldError("destinationId");
                        updateTrip({ destinationId: destination.id });
                      }}
                      className={`min-h-11 rounded-2xl border p-4 sm:p-5 text-left transition ${isSelected
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200"
                        : "border-violet-100 bg-[#faf7ff] hover:border-violet-300"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-base sm:text-lg font-semibold text-[#1f2937]">
                            {destination.name}
                          </p>
                          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#4b5563]">
                            {destination.country}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs text-white shrink-0 ml-2">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {formErrors.destinationId && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formErrors.destinationId}
                </p>
              )}

              <div className="mt-6 sm:mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 1: Dates ========== */}
          {activeStep === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                Step 2 of 5
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                When would you like to go?
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6b7280]">
                Choose your travel dates. End date must be after the start date.
              </p>

              <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-[#374151]">
                    Start date
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={trip.startDate}
                    onChange={(e) => {
                      clearFieldError("startDate");
                      clearFieldError("endDate");
                      const newStart = e.target.value;
                      updateTrip({ startDate: newStart });

                      // Auto-clear end date if it becomes invalid
                      if (trip.endDate && newStart > trip.endDate) {
                        updateTrip({ endDate: "" });
                      }
                    }}
                    className={`w-full min-h-11 rounded-2xl border bg-[#faf7ff] px-4 py-2.5 sm:py-3.5 text-sm sm:text-base text-[#1f2937] focus:outline-none ${formErrors.startDate
                      ? "border-red-400 focus:border-red-500"
                      : "border-violet-200 focus:border-violet-500"
                      }`}
                  />
                  {formErrors.startDate && (
                    <span className="mt-2 block text-sm font-medium text-red-600">
                      {formErrors.startDate}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-[#374151]">
                    End date
                  </span>
                  <input
                    type="date"
                    min={trip.startDate || today}
                    value={trip.endDate}
                    onChange={(e) => {
                      clearFieldError("endDate");
                      updateTrip({ endDate: e.target.value });
                    }}
                    className={`w-full min-h-11 rounded-2xl border bg-[#faf7ff] px-4 py-2.5 sm:py-3.5 text-sm sm:text-base text-[#1f2937] focus:outline-none ${formErrors.endDate
                      ? "border-red-400 focus:border-red-500"
                      : "border-violet-200 focus:border-violet-500"
                      }`}
                  />
                  {formErrors.endDate && (
                    <span className="mt-2 block text-sm font-medium text-red-600">
                      {formErrors.endDate}
                    </span>
                  )}
                </label>
              </div>

              {trip.startDate && trip.endDate && trip.startDate <= trip.endDate && (
                <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs sm:text-sm text-violet-800">
                  You selected: <strong>{summaryDates}</strong>
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full border border-violet-200 px-6 py-3 text-sm sm:text-base font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 2: Travelers ========== */}
          {activeStep === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                Step 3 of 5
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                Who&apos;s coming?
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6b7280]">
                Tell us how many adults and children will be traveling.
              </p>

              <div className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-violet-100 bg-[#faf7ff] p-4 sm:p-5">
                  <p className="text-sm sm:text-base font-semibold text-[#1f2937]">
                    Adults
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b7280]">Ages 13+</p>
                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        syncTravelers(adultCount - 1, childCount)
                      }
                      disabled={adultCount <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease adults"
                    >
                      −
                    </button>
                    <span className="text-xl sm:text-2xl font-bold text-[#1f2937]">
                      {adultCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        syncTravelers(adultCount + 1, childCount)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700 transition hover:bg-violet-50"
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-[#faf7ff] p-4 sm:p-5">
                  <p className="text-sm sm:text-base font-semibold text-[#1f2937]">
                    Children
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b7280]">Ages 0–12</p>
                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        syncTravelers(adultCount, childCount - 1)
                      }
                      disabled={childCount <= 0}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease children"
                    >
                      −
                    </button>
                    <span className="text-xl sm:text-2xl font-bold text-[#1f2937]">
                      {childCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        syncTravelers(adultCount, childCount + 1)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-xl text-violet-700 transition hover:bg-violet-50"
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50 px-4 sm:px-5 py-3 sm:py-3.5">
                <span className="text-xs sm:text-sm font-medium text-[#4b5563]">
                  Total travelers
                </span>
                <span className="text-base sm:text-lg font-bold text-[#1f2937]">
                  {adultCount + childCount}
                </span>
              </div>

              {formErrors.travelers && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {formErrors.travelers}
                </p>
              )}

              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full border border-violet-200 px-6 py-3 text-sm sm:text-base font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: Experiences ========== */}
          {activeStep === 3 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                Step 4 of 5
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                What sounds good?
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6b7280]">
                Select the experiences you&apos;re most interested in (optional).
              </p>

              <div className="mt-5 sm:mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EXPERIENCE_OPTIONS.map((experience) => {
                  const selected = experienceSelections.includes(
                    experience.label,
                  );

                  return (
                    <button
                      key={experience.label}
                      type="button"
                      onClick={() => toggleExperience(experience.label)}
                      className={`min-h-11 rounded-2xl border p-4 sm:p-5 text-left transition ${selected
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200"
                        : "border-violet-100 bg-[#faf7ff] hover:border-violet-300"
                        }`}
                    >
                      <span className="text-2xl sm:text-3xl">{experience.icon}</span>
                      <p className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-[#1f2937]">
                        {experience.label}
                      </p>
                      {selected && (
                        <span className="mt-1.5 sm:mt-2 inline-block text-xs font-semibold text-violet-600">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full border border-violet-200 px-6 py-3 text-sm sm:text-base font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-violet-700"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 4: Review & Submit ========== */}
          {activeStep === 4 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                Step 5 of 5
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                Review your trip
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6b7280]">
                Make sure everything looks good before creating your trip.
              </p>

              <div className="mt-5 sm:mt-6 rounded-2xl sm:rounded-[2rem] border border-violet-100 bg-[#faf7ff] p-4 sm:p-6">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
                  Your travel plan
                </p>

                <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1f2937]">
                  {selectedDestination
                    ? `${selectedDestination.name}, ${selectedDestination.country}`
                    : "No destination selected"}
                </h3>

                <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3.5 sm:p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Dates
                    </p>
                    <p className="mt-1 text-base sm:text-lg font-semibold text-[#1f2937]">
                      {summaryDates}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 sm:p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                      Travelers
                    </p>
                    <p className="mt-1 text-base sm:text-lg font-semibold text-[#1f2937]">
                      {trip.travelers}{" "}
                      {trip.travelers === 1 ? "guest" : "guests"}
                      <span className="ml-1 text-xs sm:text-sm font-normal text-[#6b7280]">
                        ({adultCount} adult{adultCount !== 1 ? "s" : ""}
                        {childCount > 0
                          ? `, ${childCount} child${childCount !== 1 ? "ren" : ""}`
                          : ""}
                        )
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 rounded-xl bg-white p-3.5 sm:p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                    Preferences
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-medium text-[#1f2937]">
                    {experienceSelections.length > 0
                      ? experienceSelections.join(" · ")
                      : "No preferences selected"}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full border border-violet-200 px-6 py-3 text-sm sm:text-base font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={submitTrip}
                  disabled={loading}
                  className="flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
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