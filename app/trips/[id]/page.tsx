"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/components/ui/Toast";
import { CartItemSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ApiError, apiFetch } from "@/lib/apiClient";

type TripItemType = "flight" | "hotel" | "visa";

type TripItem = {
  id: string;
  type: TripItemType;
  title: string;
  provider: string;
  details: string | null;
  price: number;
  currency: string;
  isCancelled: boolean;
  createdAt: string;
};

type TripDetail = {
  id: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes: string | null;
  status: string;
  createdAt: string;
};

const ITEM_TYPE_LABEL: Record<TripItemType, string> = {
  flight: "Flight",
  hotel: "Hotel",
  visa: "Visa",
};

const ITEM_TYPE_ICON: Record<TripItemType, string> = {
  flight: "✈️",
  hotel: "🏨",
  visa: "🛂",
};

type AddItemFormState = {
  title: string;
  provider: string;
  details: string;
  price: string;
};

const EMPTY_FORM: AddItemFormState = { title: "", provider: "", details: "", price: "" };

export default function TripCartPage() {
  const { id } = useParams<{ id: string }>();
  const isAuthReady = useRequireAuth();
  const { showToast } = useToast();

  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [items, setItems] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState<TripItemType | null>(null);
  const [formState, setFormState] = useState<AddItemFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Define the core fetching logic
  const refreshData = useCallback(async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      setError(null);

      const [tripResponse, itemsResponse] = await Promise.all([
        apiFetch<TripDetail>(`/api/trips/${id}`),
        apiFetch<TripItem[]>(`/api/trips/${id}/items`),
      ]);

      setTrip(tripResponse);
      setItems(itemsResponse);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 404) {
        setError("Trip not found.");
      } else {
        setError("Could not load this trip right now.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // UseEffect only handles the INITIAL mount and auth changes
  useEffect(() => {
    if (!isAuthReady) return;

    let isMounted = true;

    async function loadInitialData() {
      try {
        // We do NOT call setLoading(true) or setError(null) here synchronously.
        // The data fetching is the first thing that happens.
        const [tripRes, itemsRes] = await Promise.all([
          apiFetch<TripDetail>(`/api/trips/${id}`),
          apiFetch<TripItem[]>(`/api/trips/${id}/items`),
        ]);

        if (isMounted) {
          setTrip(tripRes);
          setItems(itemsRes);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof ApiError && err.status === 404 ? "Trip not found." : "Could not load data.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialData();
    return () => { isMounted = false; };
  }, [id, isAuthReady]); // Note: No dependency on refreshData function here

  if (!isAuthReady) {
    return null;
  }

  async function handleAddItem(type: TripItemType) {
    if (!formState.title.trim() || !formState.provider.trim() || !formState.price.trim()) {
      showToast("Please fill in title, provider, and price.", "error");
      return;
    }

    const price = Number(formState.price);
    if (!Number.isFinite(price) || price < 0) {
      showToast("Please enter a valid price.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch(`/api/trips/${id}/items`, {
        method: "POST",
        body: JSON.stringify({
          type,
          title: formState.title.trim(),
          provider: formState.provider.trim(),
          details: formState.details.trim() || null,
          price,
          currency: "usd",
        }),
      });

      showToast(`${ITEM_TYPE_LABEL[type]} added to your cart.`, "success");
      setFormState(EMPTY_FORM);
      setOpenForm(null);
      await refreshData(); // Manual refresh after action
    } catch {
      showToast(`Could not add that item.`, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveItem(itemId: string) {
    setRemovingId(itemId);
    try {
      await apiFetch(`/api/trips/${id}/items/${itemId}`, { method: "DELETE" });
      showToast("Item removed.", "success");
      setItems((current) => current.filter((item) => item.id !== itemId));
    } catch {
      showToast("Could not remove item.", "error");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCancelTrip() {
    setCancelling(true);
    try {
      await apiFetch(`/api/trips/${id}/cancel`, { method: "POST" });
      showToast("Booking cancelled.", "success");
      setShowCancelConfirm(false);
      await refreshData();
    } catch {
      showToast("Could not cancel.", "error");
    } finally {
      setCancelling(false);
    }
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const isCancelled = trip?.status === "cancelled";

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
      <Link href="/trips" className="mb-4 sm:mb-6 inline-flex min-h-9 items-center text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Back to your trips
      </Link>

      {loading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : trip ? (
        <>
          <div className="mb-6 sm:mb-8 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{trip.destinationName}</h1>
              {isCancelled && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                  Cancelled
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {new Date(trip.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} —{" "}
              {new Date(trip.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} ·{" "}
              {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mb-6 sm:mb-8 space-y-3">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Your cart</h2>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                No items yet — add a flight, hotel, or visa below.
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{ITEM_TYPE_ICON[item.type]}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="truncate text-xs text-slate-500">
                          {item.provider}
                          {item.details ? ` · ${item.details}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.currency.toUpperCase()} {item.price.toFixed(2)}
                      </span>
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingId === item.id}
                          className="min-h-9 px-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {removingId === item.id ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">Total</span>
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {items[0].currency.toUpperCase()} {total.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {!isCancelled && (
            <div className="mb-8 sm:mb-10 space-y-3">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Add to your trip</h2>
              <div className="flex flex-wrap gap-2">
                {(["flight", "hotel", "visa"] as TripItemType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setOpenForm(openForm === type ? null : type);
                      setFormState(EMPTY_FORM);
                    }}
                    className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      openForm === type
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
                    }`}
                  >
                    {ITEM_TYPE_ICON[type]} {ITEM_TYPE_LABEL[type]}
                  </button>
                ))}
              </div>

              {openForm && (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                      <input
                        type="text"
                        value={formState.title}
                        onChange={(e) => setFormState(c => ({ ...c, title: e.target.value }))}
                        className="w-full min-h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Provider</label>
                      <input
                        type="text"
                        value={formState.provider}
                        onChange={(e) => setFormState(c => ({ ...c, provider: e.target.value }))}
                        className="w-full min-h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Price (USD)</label>
                      <input
                        type="number"
                        value={formState.price}
                        onChange={(e) => setFormState(c => ({ ...c, price: e.target.value }))}
                        className="w-full min-h-11 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItem(openForm)}
                    disabled={submitting}
                    className="w-full min-h-11 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                  >
                    {submitting ? "Adding…" : `Add ${ITEM_TYPE_LABEL[openForm]}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}