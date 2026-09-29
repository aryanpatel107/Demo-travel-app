import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { destinations } from "@/data/destinations";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { createTripApi, checkoutPaymentApi, type CheckoutResponse } from "@/lib/apiClient";
import { theme } from "@/constants/theme";

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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/* -------------------------------------------------------------------------- */
/* Date Helpers                                                               */
/* -------------------------------------------------------------------------- */

function getTodayStartOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseISODate(dateStr: string): Date {
  if (!dateStr) return getTodayStartOfDay();
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const parsed = new Date(y, m, d, 0, 0, 0, 0);
    return isNaN(parsed.getTime()) ? getTodayStartOfDay() : parsed;
  }
  return getTodayStartOfDay();
}

function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "Select date";
  try {
    const d = parseISODate(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return d.toLocaleDateString("en-GB", options);
  } catch {
    return dateStr;
  }
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Choose your dates";
  try {
    const startObj = parseISODate(startDate);
    const endObj = parseISODate(endDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const start = startObj.toLocaleDateString("en-GB", options);
    const end = endObj.toLocaleDateString("en-GB", options);
    return `${start} — ${end}`;
  } catch {
    return `${startDate} — ${endDate}`;
  }
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
  return formatDateToISO(getTodayStartOfDay());
}

function addDaysToDate(days: number): string {
  const d = getTodayStartOfDay();
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BrandTripCreate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { branding, primaryColor, brandKey } = useAppConfig();
  const isAuthReady = useRequireAuth();

  const brandName = branding.name?.trim() || "MyTravel";
  const primary = primaryColor || "#7c3aed";
  const primaryLight = `${primary}18`;
  const primaryMuted = `${primary}30`;

  const preselectedDestinationId = (params.destinationId as string) ?? "";

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

  /* Calendar Modal State (Works 100% reliably on Web, iOS, and Android) */
  const [calendarField, setCalendarField] = useState<"start" | "end" | null>(null);
  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth());
  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());

  /* UI / flow state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [createdTrip, setCreatedTrip] = useState<TripResponse | null>(null);
  const [tripStage, setTripStage] = useState<TripStage>("form");
  const [activeStep, setActiveStep] = useState(0);

  const selectedDestination = useMemo(
    () => destinations.find((d) => d.id === trip.destinationId) ?? null,
    [trip.destinationId]
  );

  const summaryDates = useMemo(
    () => formatDateRange(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate]
  );

  const today = useMemo(() => getTodayISO(), []);

  /* Calendar calculations (Must be at the top level before any early returns) */
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();

  const calendarWeeks = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      cells.push(day);
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }, [firstDayIndex, daysInCurrentMonth]);

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
        : [...current, label]
    );
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Calendar Open/Select Handlers                                          */
  /* ---------------------------------------------------------------------- */

  const openStartCalendar = useCallback(() => {
    clearFieldError("startDate");
    if (calendarField === "start") {
      setCalendarField(null);
      return;
    }
    const init = trip.startDate ? parseISODate(trip.startDate) : getTodayStartOfDay();
    setCalMonth(init.getMonth());
    setCalYear(init.getFullYear());
    setCalendarField("start");
  }, [trip.startDate, calendarField, clearFieldError]);

  const openEndCalendar = useCallback(() => {
    clearFieldError("endDate");
    if (calendarField === "end") {
      setCalendarField(null);
      return;
    }
    const minD = trip.startDate ? parseISODate(trip.startDate) : getTodayStartOfDay();
    const init = trip.endDate ? parseISODate(trip.endDate) : minD;
    setCalMonth(init.getMonth());
    setCalYear(init.getFullYear());
    setCalendarField("end");
  }, [trip.startDate, trip.endDate, calendarField, clearFieldError]);

  const handleSelectCalendarDay = useCallback(
    (day: number) => {
      const m = String(calMonth + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      const iso = `${calYear}-${m}-${d}`;

      if (calendarField === "start") {
        clearFieldError("startDate");
        clearFieldError("endDate");
        updateTrip({ startDate: iso });

        // Auto-clear end date if it becomes invalid when start date changes
        const needNewEnd = !trip.endDate || iso > trip.endDate;
        if (trip.endDate && iso > trip.endDate) {
          updateTrip({ endDate: "" });
        }

        // Auto-advance to End Date selection if End Date is missing or was cleared
        if (needNewEnd) {
          const nextInit = parseISODate(iso);
          setCalMonth(nextInit.getMonth());
          setCalYear(nextInit.getFullYear());
          setCalendarField("end");
        } else {
          setCalendarField(null);
        }
      } else if (calendarField === "end") {
        clearFieldError("endDate");
        updateTrip({ endDate: iso });
        setCalendarField(null);
      }
    },
    [calMonth, calYear, calendarField, clearFieldError, trip.endDate, updateTrip]
  );

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
        } else if (trip.startDate < today) {
          errors.startDate = "Start date cannot be in the past.";
        }

        if (!trip.endDate.trim()) {
          errors.endDate = "Please select an end date.";
        } else if (trip.endDate < today) {
          errors.endDate = "End date cannot be in the past.";
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
    [trip, today]
  );

  const validateFullTrip = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!trip.destinationId.trim()) {
      errors.destinationId = "Please choose a destination.";
    }
    if (!trip.startDate.trim()) {
      errors.startDate = "Please select a start date.";
    } else if (trip.startDate < today) {
      errors.startDate = "Start date cannot be in the past.";
    }

    if (!trip.endDate.trim()) {
      errors.endDate = "Please select an end date.";
    } else if (trip.endDate < today) {
      errors.endDate = "End date cannot be in the past.";
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
  }, [trip, today]);

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
        router.push("/(tabs)/trips" as never);
        return;
      }

      const query = paymentId
        ? `status=${encodeURIComponent(status)}&paymentId=${encodeURIComponent(paymentId)}`
        : `status=${encodeURIComponent(status)}`;

      router.push(
        `/trips/${createdTrip.id}/payment-success?${query}` as never
      );
    },
    [createdTrip, router]
  );

  /* ---------------------------------------------------------------------- */
  /* Submit & payment                                                       */
  /* ---------------------------------------------------------------------- */

  const submitTrip = useCallback(async () => {
    const nextErrors = validateFullTrip();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
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
        notes: buildNotes(trip.notes, experienceSelections) ?? undefined,
      };

      const nextTrip = await createTripApi<TripResponse>(tripPayload, brandKey);

      setCreatedTrip(nextTrip);
      setTripStage("created");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
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
    brandKey,
  ]);

  const handlePaymentChoice = useCallback(
    async (choice: PaymentChoice) => {
      if (!createdTrip) return;

      setLoading(true);
      setTripStage("processing");
      setError("");

      if (choice === "later") {
        setTimeout(() => {
          goToPaymentResult("cancelled");
        }, 900);
        return;
      }

      try {
        const checkout = await checkoutPaymentApi<CheckoutResponse>(
          {
            tripId: createdTrip.id,
            amount: trip.amount,
            currency: trip.currency,
          },
          brandKey
        );

        setTimeout(() => {
          goToPaymentResult("success", checkout.paymentId);
        }, 900);
      } catch (err) {
        setTimeout(() => {
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
    },
    [createdTrip, trip.amount, trip.currency, goToPaymentResult, brandKey]
  );

  /* ---------------------------------------------------------------------- */
  /* Early returns                                                          */
  /* ---------------------------------------------------------------------- */

  if (!isAuthReady) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Stage 1: PROCESSING                                                    */
  /* ---------------------------------------------------------------------- */

  if (tripStage === "processing") {
    return (
      <View style={styles.centerContainer}>
        <View style={[styles.processingCard, { borderColor: primaryMuted, backgroundColor: primaryLight }]}>
          <ActivityIndicator size="large" color={primary} style={styles.spinner} />
          <Text style={[styles.processingTitle, { color: primary }]}>
            Payment processing...
          </Text>
          <Text style={styles.processingSubtitle}>
            We are confirming your payment choice and preparing the final booking status.
          </Text>
        </View>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Stage 2: CREATED                                                       */
  /* ---------------------------------------------------------------------- */

  if (tripStage === "created") {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Trip created successfully</Text>
          <Text style={styles.successSubtitle}>
            Your trip is saved. Review the details below and choose your payment option.
          </Text>
        </View>

        {/* Trip Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionKicker}>TRIP SUMMARY</Text>
          <Text style={styles.summaryDestTitle}>
            {selectedDestination
              ? `${selectedDestination.name}, ${selectedDestination.country}`
              : "Trip overview"}
          </Text>

          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dates</Text>
              <Text style={styles.summaryValue}>{summaryDates}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Travelers</Text>
              <Text style={styles.summaryValue}>{trip.travelers} guests</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Notes</Text>
              <Text style={styles.summaryValue}>
                {buildNotes(trip.notes, experienceSelections) || "No additional notes added"}
              </Text>
            </View>

            <View style={styles.tripIdBox}>
              <Text style={styles.tripIdLabel}>Trip ID</Text>
              <Text style={styles.tripIdValue}>{createdTrip?.id ?? "pending"}</Text>
            </View>
          </View>
        </View>

        {/* Payment Choices Card */}
        <View style={styles.paymentActionCard}>
          <Text style={styles.sectionKicker}>PAYMENT</Text>
          <Text style={styles.paymentCardTitle}>Choose your payment option</Text>

          <View style={styles.paymentButtonCol}>
            <Pressable
              onPress={() => handlePaymentChoice("now")}
              disabled={loading}
              style={[styles.primaryBtn, { backgroundColor: primary }, loading && styles.btnDisabled]}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? "Processing..." : "Pay now"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handlePaymentChoice("later")}
              disabled={loading}
              style={[styles.secondaryBtn, loading && styles.btnDisabled]}
            >
              <Text style={styles.secondaryBtnText}>Pay later</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setTripStage("form");
                setActiveStep(4);
              }}
              style={styles.tertiaryBtn}
            >
              <Text style={styles.tertiaryBtnText}>Edit trip details</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Stage 3: MAIN STEP WIZARD FORM                                         */
  /* ---------------------------------------------------------------------- */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: primary }]}>{brandName.toUpperCase()}</Text>
        <Text style={styles.title}>Let's plan your trip.</Text>
        <Text style={styles.subtitle}>
          Answer a few quick questions and we'll build your trip with you.
        </Text>
      </View>

      {/* Progress Stepper Indicator */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperRow}>
          {STEPS.map((step, index) => {
            const isActive = activeStep === index;
            const isDone = index < activeStep;

            return (
              <React.Fragment key={step.id}>
                <View style={styles.stepCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && { backgroundColor: primary },
                      isDone && styles.stepCircleDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCircleText,
                        (isActive || isDone) && styles.stepCircleTextActive,
                      ]}
                    >
                      {isDone ? "✓" : index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepTitleText,
                      isActive && { color: primary, fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {step.title}
                  </Text>
                </View>

                {index < STEPS.length - 1 ? (
                  <View
                    style={[
                      styles.stepLine,
                      index < activeStep && { backgroundColor: primary },
                    ]}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Main Step Card Container */}
      <View style={styles.stepCard}>
        {/* ==================== STEP 0: Destination ==================== */}
        {activeStep === 0 ? (
          <View>
            <Text style={[styles.stepKicker, { color: primary }]}>Step 1 of 5</Text>
            <Text style={styles.stepHeading}>Where are you thinking of going?</Text>
            <Text style={styles.stepDesc}>
              Select a destination to start planning your journey.
            </Text>

            <View style={styles.destGrid}>
              {destinations.map((destination) => {
                const isSelected = trip.destinationId === destination.id;

                return (
                  <Pressable
                    key={destination.id}
                    onPress={() => {
                      clearFieldError("destinationId");
                      updateTrip({ destinationId: destination.id });
                    }}
                    style={[
                      styles.destItem,
                      isSelected && [styles.destItemSelected, { borderColor: primary, backgroundColor: primaryLight }],
                    ]}
                  >
                    {destination.imageUrl ? (
                      <Image
                        source={{ uri: destination.imageUrl }}
                        style={styles.destThumb}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : null}
                    <View style={styles.destInfo}>
                      <Text style={styles.destName}>{destination.name}</Text>
                      <Text style={styles.destCountry}>{destination.country}</Text>
                    </View>
                    {isSelected ? (
                      <View style={[styles.checkCircle, { backgroundColor: primary }]}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {formErrors.destinationId ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formErrors.destinationId}</Text>
              </View>
            ) : null}

            <View style={styles.stepNavRowSingle}>
              <Pressable
                onPress={goToNextStep}
                style={[styles.continueBtn, { backgroundColor: primary }]}
              >
                <Text style={styles.continueBtnText}>Continue →</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* ==================== STEP 1: Dates ==================== */}
        {activeStep === 1 ? (
          <View>
            <Text style={[styles.stepKicker, { color: primary }]}>Step 2 of 5</Text>
            <Text style={styles.stepHeading}>When would you like to go?</Text>
            <Text style={styles.stepDesc}>
              Choose your travel dates. End date must be after the start date.
            </Text>

            {/* Quick helper date presets */}
            <View style={styles.presetsRow}>
              <Pressable
                onPress={() => {
                  const s = addDaysToDate(7);
                  const e = addDaysToDate(14);
                  clearFieldError("startDate");
                  clearFieldError("endDate");
                  updateTrip({ startDate: s, endDate: e });
                  setCalendarField(null);
                }}
                style={styles.presetChip}
              >
                <Text style={[styles.presetChipText, { color: primary }]}>+1 Week</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  const s = addDaysToDate(14);
                  const e = addDaysToDate(24);
                  clearFieldError("startDate");
                  clearFieldError("endDate");
                  updateTrip({ startDate: s, endDate: e });
                  setCalendarField(null);
                }}
                style={styles.presetChip}
              >
                <Text style={[styles.presetChipText, { color: primary }]}>+2 Weeks</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  const s = addDaysToDate(30);
                  const e = addDaysToDate(40);
                  clearFieldError("startDate");
                  clearFieldError("endDate");
                  updateTrip({ startDate: s, endDate: e });
                  setCalendarField(null);
                }}
                style={styles.presetChip}
              >
                <Text style={[styles.presetChipText, { color: primary }]}>+1 Month</Text>
              </Pressable>
            </View>

            {/* Date Picker Fields */}
            <View style={styles.datesGrid}>
              {/* Start Date Button */}
              <View style={styles.fieldBlock}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <Pressable
                  onPress={openStartCalendar}
                  style={[
                    styles.datePickerBtn,
                    calendarField === "start" && [styles.datePickerBtnActive, { borderColor: primary }],
                    formErrors.startDate ? styles.inputError : null,
                  ]}
                >
                  <View style={styles.datePickerContent}>
                    <Text style={styles.dateCalendarIcon}>📅</Text>
                    <Text
                      style={[
                        styles.datePickerText,
                        !trip.startDate ? styles.datePickerPlaceholder : null,
                      ]}
                    >
                      {trip.startDate ? formatDisplayDate(trip.startDate) : "Select start date"}
                    </Text>
                  </View>
                  <Text style={[styles.dateChevron, { color: primary }]}>
                    {calendarField === "start" ? "▴" : "▾"}
                  </Text>
                </Pressable>
                {formErrors.startDate ? (
                  <Text style={styles.fieldErrorText}>{formErrors.startDate}</Text>
                ) : null}
              </View>

              {/* End Date Button */}
              <View style={styles.fieldBlock}>
                <Text style={styles.inputLabel}>End Date</Text>
                <Pressable
                  onPress={openEndCalendar}
                  style={[
                    styles.datePickerBtn,
                    calendarField === "end" && [styles.datePickerBtnActive, { borderColor: primary }],
                    formErrors.endDate ? styles.inputError : null,
                  ]}
                >
                  <View style={styles.datePickerContent}>
                    <Text style={styles.dateCalendarIcon}>📅</Text>
                    <Text
                      style={[
                        styles.datePickerText,
                        !trip.endDate ? styles.datePickerPlaceholder : null,
                      ]}
                    >
                      {trip.endDate ? formatDisplayDate(trip.endDate) : "Select end date"}
                    </Text>
                  </View>
                  <Text style={[styles.dateChevron, { color: primary }]}>
                    {calendarField === "end" ? "▴" : "▾"}
                  </Text>
                </Pressable>
                {formErrors.endDate ? (
                  <Text style={styles.fieldErrorText}>{formErrors.endDate}</Text>
                ) : null}
              </View>
            </View>

            {/* Interactive Inline Calendar (Opens on click for Start Date or End Date) */}
            {calendarField !== null ? (
              <View style={styles.calendarInlineCard}>
                {/* Header */}
                <View style={styles.calHeader}>
                  <View>
                    <Text style={[styles.calKicker, { color: primary }]}>
                      {calendarField === "start" ? "DEPARTURE DATE" : "RETURN DATE"}
                    </Text>
                    <Text style={styles.calTitle}>
                      {calendarField === "start" ? "Select Start Date" : "Select End Date"}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setCalendarField(null)}
                    style={styles.calCloseBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.calCloseText}>✕</Text>
                  </Pressable>
                </View>

                {/* Month Navigation */}
                <View style={styles.monthNavRow}>
                  <Pressable
                    onPress={() => {
                      if (calMonth === 0) {
                        setCalMonth(11);
                        setCalYear((y) => y - 1);
                      } else {
                        setCalMonth((m) => m - 1);
                      }
                    }}
                    style={styles.monthNavBtn}
                  >
                    <Text style={[styles.monthNavArrow, { color: primary }]}>‹</Text>
                  </Pressable>

                  <Text style={styles.monthYearText}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>

                  <Pressable
                    onPress={() => {
                      if (calMonth === 11) {
                        setCalMonth(0);
                        setCalYear((y) => y + 1);
                      } else {
                        setCalMonth((m) => m + 1);
                      }
                    }}
                    style={styles.monthNavBtn}
                  >
                    <Text style={[styles.monthNavArrow, { color: primary }]}>›</Text>
                  </Pressable>
                </View>

                {/* Day of Week Headers */}
                <View style={styles.calWeekRow}>
                  {DAY_HEADERS.map((h) => (
                    <Text key={h} style={styles.calWeekCell}>
                      {h}
                    </Text>
                  ))}
                </View>

                {/* Calendar Days by Week Rows (Zero-wrap guarantee on all screen sizes) */}
                <View style={styles.calDaysContainer}>
                  {calendarWeeks.map((week, wIdx) => (
                    <View key={`week-${wIdx}`} style={styles.calWeekRow}>
                      {week.map((day, dIdx) => {
                        if (day === null) {
                          return <View key={`empty-${wIdx}-${dIdx}`} style={styles.calDayCell} />;
                        }

                        const m = String(calMonth + 1).padStart(2, "0");
                        const d = String(day).padStart(2, "0");
                        const cellDate = `${calYear}-${m}-${d}`;
                        const minDate = calendarField === "end" && trip.startDate ? trip.startDate : today;
                        const isDisabled = cellDate < minDate;
                        const isSelected =
                          calendarField === "start"
                            ? trip.startDate === cellDate
                            : trip.endDate === cellDate;
                        const isToday = cellDate === today;

                        return (
                          <View key={`day-${wIdx}-${dIdx}`} style={styles.calDayCell}>
                            <Pressable
                              disabled={isDisabled}
                              onPress={() => handleSelectCalendarDay(day)}
                              style={[
                                styles.calDayCircle,
                                isSelected && { backgroundColor: primary },
                                isToday && !isSelected && styles.calDayToday,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.calDayText,
                                  isDisabled && styles.calDayDisabledText,
                                  isSelected && styles.calDaySelectedText,
                                  isToday && !isSelected && { color: primary, fontWeight: "800" },
                                ]}
                              >
                                {day}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>

                {/* Footer instructions & Done button */}
                <View style={styles.calFooter}>
                  <Text style={styles.calFooterText}>
                    {calendarField === "end" && trip.startDate
                      ? `Must be on or after ${formatDisplayDate(trip.startDate)}`
                      : "Must be today or in the future"}
                  </Text>
                  <Pressable
                    onPress={() => setCalendarField(null)}
                    style={[styles.calDoneBtn, { backgroundColor: primary }]}
                  >
                    <Text style={styles.calDoneBtnText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            {/* Selected Range Preview Summary */}
            {Boolean(trip.startDate && trip.endDate && trip.startDate <= trip.endDate) ? (
              <View style={[styles.rangePreviewBox, { backgroundColor: primaryLight, borderColor: primaryMuted }]}>
                <Text style={[styles.rangePreviewText, { color: primary }]}>
                  You selected: <Text style={{ fontWeight: "700" }}>{summaryDates}</Text>
                </Text>
              </View>
            ) : null}

            {/* Step 1 Navigation buttons */}
            <View style={styles.stepNavRow}>
              <Pressable onPress={goToPreviousStep} style={styles.backOutlineBtn}>
                <Text style={[styles.backOutlineText, { color: primary }]}>← Back</Text>
              </Pressable>
              <Pressable
                onPress={goToNextStep}
                style={[styles.continueBtn, { backgroundColor: primary }]}
              >
                <Text style={styles.continueBtnText}>Continue →</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* ==================== STEP 2: Travelers ==================== */}
        {activeStep === 2 ? (
          <View>
            <Text style={[styles.stepKicker, { color: primary }]}>Step 3 of 5</Text>
            <Text style={styles.stepHeading}>Who's coming?</Text>
            <Text style={styles.stepDesc}>
              Tell us how many adults and children will be traveling.
            </Text>

            <View style={styles.travelerRowGroup}>
              {/* Adults Counter */}
              <View style={styles.travelerCard}>
                <View>
                  <Text style={styles.travelerType}>Adults</Text>
                  <Text style={styles.travelerSub}>Ages 13+</Text>
                </View>
                <View style={styles.counterRow}>
                  <Pressable
                    onPress={() => syncTravelers(adultCount - 1, childCount)}
                    disabled={adultCount <= 1}
                    style={[styles.counterBtn, adultCount <= 1 && styles.counterBtnDisabled]}
                  >
                    <Text style={[styles.counterBtnText, { color: primary }]}>−</Text>
                  </Pressable>
                  <Text style={styles.counterNum}>{adultCount}</Text>
                  <Pressable
                    onPress={() => syncTravelers(adultCount + 1, childCount)}
                    style={styles.counterBtn}
                  >
                    <Text style={[styles.counterBtnText, { color: primary }]}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Children Counter */}
              <View style={styles.travelerCard}>
                <View>
                  <Text style={styles.travelerType}>Children</Text>
                  <Text style={styles.travelerSub}>Ages 0–12</Text>
                </View>
                <View style={styles.counterRow}>
                  <Pressable
                    onPress={() => syncTravelers(adultCount, childCount - 1)}
                    disabled={childCount <= 0}
                    style={[styles.counterBtn, childCount <= 0 && styles.counterBtnDisabled]}
                  >
                    <Text style={[styles.counterBtnText, { color: primary }]}>−</Text>
                  </Pressable>
                  <Text style={styles.counterNum}>{childCount}</Text>
                  <Pressable
                    onPress={() => syncTravelers(adultCount, childCount + 1)}
                    style={styles.counterBtn}
                  >
                    <Text style={[styles.counterBtnText, { color: primary }]}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Total Travelers Pill */}
            <View style={[styles.totalPill, { backgroundColor: primaryLight, borderColor: primaryMuted }]}>
              <Text style={styles.totalLabel}>Total travelers</Text>
              <Text style={[styles.totalCount, { color: primary }]}>
                {adultCount + childCount}
              </Text>
            </View>

            {formErrors.travelers ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formErrors.travelers}</Text>
              </View>
            ) : null}

            <View style={styles.stepNavRow}>
              <Pressable onPress={goToPreviousStep} style={styles.backOutlineBtn}>
                <Text style={[styles.backOutlineText, { color: primary }]}>← Back</Text>
              </Pressable>
              <Pressable
                onPress={goToNextStep}
                style={[styles.continueBtn, { backgroundColor: primary }]}
              >
                <Text style={styles.continueBtnText}>Continue →</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* ==================== STEP 3: Experiences ==================== */}
        {activeStep === 3 ? (
          <View>
            <Text style={[styles.stepKicker, { color: primary }]}>Step 4 of 5</Text>
            <Text style={styles.stepHeading}>What sounds good?</Text>
            <Text style={styles.stepDesc}>
              Select the experiences you're most interested in (optional).
            </Text>

            <View style={styles.experienceGrid}>
              {EXPERIENCE_OPTIONS.map((experience) => {
                const selected = experienceSelections.includes(experience.label);

                return (
                  <Pressable
                    key={experience.label}
                    onPress={() => toggleExperience(experience.label)}
                    style={[
                      styles.experienceChip,
                      selected && [
                        styles.experienceChipSelected,
                        { borderColor: primary, backgroundColor: primaryLight },
                      ],
                    ]}
                  >
                    <Text style={styles.experienceIcon}>{experience.icon}</Text>
                    <Text style={styles.experienceLabel}>{experience.label}</Text>
                    {selected ? (
                      <Text style={[styles.selectedBadge, { color: primary }]}>Selected</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {/* Optional Notes Input */}
            <View style={styles.notesSection}>
              <Text style={styles.inputLabel}>Additional Notes or Preferences</Text>
              <TextInput
                value={trip.notes}
                onChangeText={(val) => updateTrip({ notes: val })}
                placeholder="Any special requests or dietary needs..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                style={styles.notesInput}
              />
            </View>

            <View style={styles.stepNavRow}>
              <Pressable onPress={goToPreviousStep} style={styles.backOutlineBtn}>
                <Text style={[styles.backOutlineText, { color: primary }]}>← Back</Text>
              </Pressable>
              <Pressable
                onPress={goToNextStep}
                style={[styles.continueBtn, { backgroundColor: primary }]}
              >
                <Text style={styles.continueBtnText}>Continue →</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* ==================== STEP 4: Review & Submit ==================== */}
        {activeStep === 4 ? (
          <View>
            <Text style={[styles.stepKicker, { color: primary }]}>Step 5 of 5</Text>
            <Text style={styles.stepHeading}>Review your trip</Text>
            <Text style={styles.stepDesc}>
              Make sure everything looks good before creating your trip.
            </Text>

            <View style={styles.reviewPlanBox}>
              <Text style={[styles.reviewPlanKicker, { color: primary }]}>YOUR TRAVEL PLAN</Text>
              <Text style={styles.reviewPlanDest}>
                {selectedDestination
                  ? `${selectedDestination.name}, ${selectedDestination.country}`
                  : "No destination selected"}
              </Text>

              <View style={styles.reviewRow}>
                <View style={styles.reviewCol}>
                  <Text style={styles.reviewLabel}>Dates</Text>
                  <Text style={styles.reviewValue}>{summaryDates}</Text>
                </View>

                <View style={styles.reviewCol}>
                  <Text style={styles.reviewLabel}>Travelers</Text>
                  <Text style={styles.reviewValue}>
                    {trip.travelers} {trip.travelers === 1 ? "guest" : "guests"}
                    <Text style={styles.reviewSubValue}>
                      {` (${adultCount} adult${adultCount !== 1 ? "s" : ""}${childCount > 0 ? `, ${childCount} child${childCount !== 1 ? "ren" : ""}` : ""})`}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.reviewPrefBox}>
                <Text style={styles.reviewLabel}>Preferences</Text>
                <Text style={styles.reviewPrefValue}>
                  {experienceSelections.length > 0
                    ? experienceSelections.join(" · ")
                    : "No preferences selected"}
                </Text>
              </View>

              {Boolean(trip.notes.trim()) ? (
                <View style={[styles.reviewPrefBox, { marginTop: 10 }]}>
                  <Text style={styles.reviewLabel}>Notes</Text>
                  <Text style={styles.reviewPrefValue}>{trip.notes.trim()}</Text>
                </View>
              ) : null}
            </View>

            {Boolean(error) ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.stepNavRow}>
              <Pressable onPress={goToPreviousStep} style={styles.backOutlineBtn}>
                <Text style={[styles.backOutlineText, { color: primary }]}>← Back</Text>
              </Pressable>
              <Pressable
                onPress={submitTrip}
                disabled={loading}
                style={[
                  styles.continueBtn,
                  { backgroundColor: primary },
                  loading && styles.btnDisabled,
                ]}
              >
                <Text style={styles.continueBtnText}>
                  {loading ? "Creating your trip..." : "Create my trip ✨"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f1ff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#f5f1ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 320,
  },

  /* Stepper */
  stepperContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepCol: {
    alignItems: "center",
    width: 52,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3e8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleDone: {
    backgroundColor: "#ede9fe",
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#a855f7",
  },
  stepCircleTextActive: {
    color: "#ffffff",
  },
  stepTitleText: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#f3e8ff",
    marginHorizontal: 4,
    marginBottom: 14,
  },

  /* Step Card Container */
  stepCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    padding: 20,
    ...theme.shadows.sm,
  },
  stepKicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 6,
  },
  stepHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },

  /* Step 0 Destinations */
  destGrid: {
    gap: 10,
    marginBottom: 16,
  },
  destItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    backgroundColor: "#faf7ff",
  },
  destItemSelected: {
    borderWidth: 2,
  },
  destThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  destInfo: {
    flex: 1,
  },
  destName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  destCountry: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkMark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },

  /* Step 1 Dates */
  presetsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8b4fe",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  datesGrid: {
    gap: 14,
    marginBottom: 16,
  },
  fieldBlock: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#faf7ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateCalendarIcon: {
    fontSize: 16,
  },
  datePickerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  datePickerPlaceholder: {
    color: "#94a3b8",
    fontWeight: "500",
  },
  dateChevron: {
    fontSize: 14,
    fontWeight: "800",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  fieldErrorText: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "600",
  },
  rangePreviewBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  rangePreviewText: {
    fontSize: 13,
  },

  datePickerBtnActive: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  calendarInlineCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 18,
    marginTop: 14,
    marginBottom: 8,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    ...theme.shadows.md,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  calKicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 2,
  },
  calTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
  },
  calCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  calCloseText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "700",
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#faf7ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavArrow: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1f2937",
  },
  calWeekRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  calWeekCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
  },
  calDaysContainer: {
    gap: 4,
  },
  calDayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  calDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  calDayDisabledText: {
    color: "#cbd5e1",
    fontWeight: "400",
  },
  calDaySelectedText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  calDayToday: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
  },
  calFooter: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    alignItems: "center",
    gap: 8,
  },
  calFooterText: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
  calDoneBtn: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  calDoneBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  /* Step 2 Travelers */
  travelerRowGroup: {
    gap: 12,
    marginBottom: 16,
  },
  travelerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#faf7ff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    padding: 14,
  },
  travelerType: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  travelerSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  counterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: {
    opacity: 0.35,
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: "800",
  },
  counterNum: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    minWidth: 20,
    textAlign: "center",
  },
  totalPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
  totalCount: {
    fontSize: 17,
    fontWeight: "800",
  },

  /* Step 3 Experiences */
  experienceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  experienceChip: {
    width: "48%",
    backgroundColor: "#faf7ff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    padding: 12,
  },
  experienceChipSelected: {
    borderWidth: 2,
  },
  experienceIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  selectedBadge: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  notesSection: {
    gap: 6,
    marginBottom: 16,
  },
  notesInput: {
    backgroundColor: "#faf7ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
    textAlignVertical: "top",
  },

  /* Step 4 Review */
  reviewPlanBox: {
    backgroundColor: "#faf7ff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    padding: 16,
    marginBottom: 16,
  },
  reviewPlanKicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
  },
  reviewPlanDest: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 14,
  },
  reviewRow: {
    gap: 10,
    marginBottom: 12,
  },
  reviewCol: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    ...theme.shadows.sm,
  },
  reviewLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  reviewSubValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
  },
  reviewPrefBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    ...theme.shadows.sm,
  },
  reviewPrefValue: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "600",
  },

  /* Navigation buttons */
  stepNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    width: "100%",
  },
  stepNavRowSingle: {
    alignItems: "flex-end",
    marginTop: 20,
    width: "100%",
  },
  backOutlineBtn: {
    borderWidth: 1.5,
    borderColor: "#d8b4fe",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  backOutlineText: {
    fontSize: 14,
    fontWeight: "700",
  },
  continueBtn: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 130,
  },
  continueBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 130,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* Error box */
  errorBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "600",
  },

  /* Created Stage */
  successBanner: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successCheck: {
    fontSize: 26,
    fontWeight: "800",
    color: "#059669",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#065f46",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#047857",
    textAlign: "center",
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  sectionKicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#64748b",
    marginBottom: 6,
  },
  summaryDestTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
  summaryDetails: {
    gap: 12,
  },
  summaryRow: {
    gap: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  tripIdBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  tripIdLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
  },
  tripIdValue: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#0f172a",
    marginTop: 2,
  },
  paymentActionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 20,
    ...theme.shadows.sm,
  },
  paymentCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
  paymentButtonCol: {
    gap: 10,
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  tertiaryBtn: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryBtnText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Processing Stage */
  processingCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    ...theme.shadows.md,
  },
  spinner: {
    marginBottom: 16,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  processingSubtitle: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },
});
