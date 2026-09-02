import { config } from "@/config";

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-current/10 ${className}`} />;
}

function BrandShell({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const shellClasses = isWanderly
    ? "border-[#e6d9c1] bg-[#fffaf3] text-[#17221d]"
    : isTravelPro
      ? "border-slate-200 bg-white text-slate-900"
      : "border-violet-100 bg-white text-[#20173c]";

  const softClasses = isWanderly
    ? "bg-[#f1e9df] text-[#4f665e]"
    : isTravelPro
      ? "bg-slate-200 text-slate-600"
      : "bg-violet-100 text-violet-700";

  return (
    <div className={`rounded-[2rem] border p-4 shadow-sm ${shellClasses} ${className}`}>
      <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${softClasses}`}>
        Loading
      </div>
      {children}
    </div>
  );
}

export function BrandRouteLoading() {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const pageClasses = isWanderly
    ? "bg-[#f6f0e8] text-[#17221d]"
    : isTravelPro
      ? "bg-slate-100 text-slate-900"
      : "bg-[#f8f5ff] text-[#20173c]";

  return (
    <div className={`min-h-[60vh] ${pageClasses}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-11 w-32 rounded-full" />
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <SkeletonLine className="h-6 w-40" />
              <SkeletonLine className="h-12 w-3/4" />
              <SkeletonLine className="h-5 w-2/3" />
              <SkeletonLine className="h-20 w-full" />
            </div>
            <div className="rounded-[2rem] border border-current/10 bg-white/70 p-6 shadow-sm">
              <SkeletonLine className="h-5 w-28" />
              <SkeletonLine className="mt-5 h-12 w-full" />
              <SkeletonLine className="mt-4 h-12 w-full" />
              <SkeletonLine className="mt-4 h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DestinationExplorerSkeleton() {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const panelClasses = isWanderly
    ? "border-[#eadfcd] bg-[#fffaf3]"
    : isTravelPro
      ? "border-slate-200 bg-white"
      : "border-violet-100 bg-white";

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <SkeletonLine className={`h-4 w-28 ${isWanderly ? "text-[#d96a3a]" : ""}`} />
        <SkeletonLine className="h-12 w-full max-w-xl" />
        <SkeletonLine className="h-5 w-full max-w-lg" />
      </div>

      <div className={`rounded-[2rem] border p-4 shadow-sm ${panelClasses}`}>
        <div className="mb-4 flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonLine key={index} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="mb-4 h-12 w-full rounded-full border border-current/10 bg-current/5" />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`overflow-hidden rounded-[1.75rem] border ${panelClasses}`}>
            <SkeletonLine className="h-56 w-full" />
            <div className="space-y-3 p-5">
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-8 w-2/3" />
              <SkeletonLine className="h-4 w-1/2" />
              <SkeletonLine className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DestinationDetailSkeleton() {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const panelClasses = isWanderly
    ? "border-[#eadfcd] bg-[#fffaf3]"
    : isTravelPro
      ? "border-slate-200 bg-white"
      : "border-violet-100 bg-white";

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-36 rounded-full bg-current/10 animate-pulse" />
      <div className={`overflow-hidden rounded-[2rem] border ${panelClasses}`}>
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <SkeletonLine className="h-5 w-28" />
            <SkeletonLine className="mt-4 h-12 w-2/3" />
            <SkeletonLine className="mt-3 h-4 w-40" />
            <SkeletonLine className="mt-8 h-[26rem] w-full rounded-[1.5rem]" />
          </div>
          <div className="border-t border-current/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="mt-5 h-24 w-full" />
            <SkeletonLine className="mt-4 h-24 w-full" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`rounded-[1.75rem] border p-6 sm:p-8 ${panelClasses}`}>
          <SkeletonLine className="h-5 w-28" />
          <SkeletonLine className="mt-5 h-24 w-full" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonLine key={index} className="h-20 w-full rounded-[1.25rem]" />
            ))}
          </div>
        </div>

        <div className={`rounded-[1.75rem] border p-6 sm:p-8 ${panelClasses}`}>
          <SkeletonLine className="h-5 w-28" />
          <div className="mt-5 space-y-4">
            <SkeletonLine className="h-12 w-full" />
            <SkeletonLine className="h-12 w-full" />
            <SkeletonLine className="h-12 w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function TripsSkeleton() {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const panelClasses = isWanderly
    ? "border-[#eadfcd] bg-[#fffaf3]"
    : isTravelPro
      ? "border-slate-200 bg-white"
      : "border-violet-100 bg-white";

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonLine className="h-10 w-40" />
        <SkeletonLine className="h-11 w-32 rounded-full" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`rounded-[1.5rem] border p-5 ${panelClasses}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <SkeletonLine className="h-6 w-44" />
                <SkeletonLine className="h-4 w-32" />
              </div>
              <div className="space-y-2 text-left sm:text-right">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TripFormSkeleton() {
  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const panelClasses = isWanderly
    ? "border-[#eadfcd] bg-[#fffaf3]"
    : isTravelPro
      ? "border-slate-200 bg-white"
      : "border-violet-100 bg-white";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <SkeletonLine className="h-4 w-32" />
        <SkeletonLine className="h-12 w-full max-w-xl" />
        <SkeletonLine className="h-5 w-full max-w-md" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-8">
          <div className={`rounded-[2rem] border p-6 sm:p-8 ${panelClasses}`}>
            <SkeletonLine className="mb-6 h-8 w-44" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonLine key={index} className="h-48 w-full rounded-[1.5rem]" />
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] border p-6 sm:p-8 ${panelClasses}`}>
            <SkeletonLine className="mb-5 h-8 w-48" />
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonLine className="h-16 w-full rounded-2xl" />
              <SkeletonLine className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        <div className={`rounded-[2rem] border p-6 ${panelClasses}`}>
          <SkeletonLine className="h-6 w-32" />
          <SkeletonLine className="mt-5 h-24 w-full rounded-[1.5rem]" />
          <SkeletonLine className="mt-5 h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BrandLoadingFragment() {
  return (
    <BrandShell className="mb-4">
      <div className="mt-3 h-5 w-28 rounded-full bg-current/10 animate-pulse" />
    </BrandShell>
  );
}
