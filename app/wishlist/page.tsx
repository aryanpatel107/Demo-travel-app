"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DestinationCard from "@/components/DestinationCard";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppConfig } from "@/components/RemoteConfigProvider";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WishlistPage() {
  const { wishlist, loading, refreshWishlist } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const { primaryColor } = useAppConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshWishlist();
  }, [refreshWishlist]);

  const brandColor = primaryColor || "#2882c5";

  if (!mounted || authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-5 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <Skeleton className="h-52 w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sign in to view your Wishlist
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Keep track of all your dream destinations in one place.
          </p>
          <div className="mt-6">
            <Link
              href="/login?returnUrl=/wishlist"
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-95"
              style={{ backgroundColor: brandColor }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: brandColor }}
          >
            Saved Places
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Destinations you've saved for your future journeys.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {wishlist.length} {wishlist.length === 1 ? "destination" : "destinations"}
            </span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && wishlist.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <Skeleton className="h-52 w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        /* Empty State */
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-10 w-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Nothing saved yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Explore our curated destinations and tap the heart icon to save your favorite spots for later.
          </p>
          <div className="mt-6">
            <Link
              href="/destinations"
              id="explore-destinations-btn"
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-95 hover:scale-105 active:scale-95"
              style={{ backgroundColor: brandColor }}
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      ) : (
        /* Destinations Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <DestinationCard key={item.id} destination={item.destination} />
          ))}
        </div>
      )}
    </div>
  );
}
