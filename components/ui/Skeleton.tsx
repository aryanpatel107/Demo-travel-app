/**
 * Base skeleton block — a pulsing gray rectangle. Compose these into
 * whatever shape you need (see TripCardSkeleton below for an example),
 * or use directly: <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

/**
 * Placeholder shown while a trip card's real data is loading — matches
 * the general shape of the trip list items in TripsPage.
 */
export function TripCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="space-y-2 sm:text-right">
        <Skeleton className="ml-auto h-4 w-24" />
        <Skeleton className="ml-auto h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * A stack of TripCardSkeletons — drop in wherever a trip list is loading.
 * Usage: {loading ? <TripListSkeleton /> : <ActualTripList />}
 */
export function TripListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <TripCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Placeholder for a single cart line item (flight/hotel/visa row).
 */
export function CartItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/**
 * Placeholder for a single review card.
 */
export function ReviewCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}