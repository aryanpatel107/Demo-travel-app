"use client";

import { useEffect, useState } from "react";
import { useAppConfig } from "@/components/RemoteConfigProvider";

let hasShownStartupSplash = false;

export default function BrandSplash() {
  const [isDone, setIsDone] = useState(() => hasShownStartupSplash);
  const [isExiting, setIsExiting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const appConfig = useAppConfig();
  const {
    config,
    branding,
    primaryColor: appPrimary,
    secondaryColor: appSecondary,
    isBrandResolved,
  } = appConfig;

  // Render dynamic values ONLY once client-side brand configuration is resolved
  const brandName = isBrandResolved
    ? branding?.fullName?.trim() ||
      branding?.name?.trim() ||
      config?.name?.trim() ||
      ""
    : "";

  const subtitle = isBrandResolved
    ? config?.splash?.subtitle?.trim() || "Curated Travel Experiences"
    : "";

  const logoUrl = isBrandResolved
    ? config?.splash?.logo?.trim() ||
      branding?.logo?.trim() ||
      null
    : null;

  const primaryColor = isBrandResolved && appPrimary ? appPrimary : "#38bdf8";
  const accentColor = isBrandResolved && appSecondary ? appSecondary : "#818cf8";

  // Countdown exit lifecycle: only starts after brand is resolved on client
  useEffect(() => {
    if (hasShownStartupSplash) {
      return;
    }

    if (!isBrandResolved) {
      return;
    }

    // Begin smooth exit 1.6s after brand is resolved
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 1600);

    // Completely unmount after exit transition (2.2s total)
    const doneTimer = window.setTimeout(() => {
      hasShownStartupSplash = true;
      setIsDone(true);
    }, 2200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [isBrandResolved]);

  if (isDone || hasShownStartupSplash) {
    return null;
  }

  // During SSR and initial client hydration (before isBrandResolved is true),
  // server and client produce 100% IDENTICAL markup without brand-specific data.
  // After hydration & API resolution, dynamic logo, colors, and title populate smoothly.
  return (
    <div
      className={`brand-splash fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "#080c14",
        backgroundImage: isBrandResolved
          ? `radial-gradient(circle at 50% 45%, ${primaryColor}22 0%, transparent 65%), radial-gradient(circle at 80% 20%, ${accentColor}15 0%, transparent 50%), linear-gradient(180deg, #070a10 0%, #0c121e 100%)`
          : "radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.08) 0%, transparent 65%), linear-gradient(180deg, #070a10 0%, #0c121e 100%)",
      }}
      role="status"
      aria-live="polite"
      aria-label={
        isBrandResolved && brandName
          ? `${brandName} loading screen`
          : "Loading travel website"
      }
    >
      {/* Subtle travel celestial rings & flight arc background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Outer orbital compass ring */}
        <div
          className="animate-spin-slow h-[520px] w-[520px] rounded-full border border-white/[0.04]"
          style={{
            borderColor: isBrandResolved ? `${primaryColor}20` : "rgba(255,255,255,0.05)",
            borderStyle: "dashed",
          }}
        />

        {/* Secondary mid orbit ring */}
        <div
          className="absolute h-[380px] w-[380px] rounded-full border border-white/[0.06]"
          style={{
            borderColor: isBrandResolved ? `${accentColor}18` : "rgba(255,255,255,0.06)",
          }}
        />

        {/* Pulsing ambient radiant core */}
        <div
          className="animate-aura-pulse absolute h-72 w-72 rounded-full blur-3xl filter"
          style={{
            backgroundColor: isBrandResolved ? `${primaryColor}35` : "rgba(56, 189, 248, 0.12)",
          }}
        />

        {/* Subtle travel coordinates / latitude lines overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      </div>

      {/* Main splash content */}
      <div className="brand-splash__content relative z-10 flex flex-col items-center px-6 text-center">
        {/* Brand Logo Container with glassmorphic badge */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle logo outer glow */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-75 blur-lg transition-all duration-500"
            style={{
              backgroundColor: isBrandResolved ? `${primaryColor}30` : "rgba(56, 189, 248, 0.15)",
            }}
          />

          {/* Logo badge frame */}
          <div className="relative flex h-24 min-w-[6.5rem] max-w-[16rem] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-300">
            {isBrandResolved && logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName || "Website logo"}
                className={`max-h-12 w-auto max-w-full object-contain filter transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100 drop-shadow-md" : "opacity-90"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <span className="flex items-center justify-center text-white/50">
                <svg
                  className="h-8 w-8 animate-spin-slow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon
                    points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                    fill="currentColor"
                    fillOpacity="0.25"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="font-display flex min-h-[2.5rem] items-center justify-center text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
          {isBrandResolved && brandName ? (
            brandName
          ) : (
            <span className="inline-block h-8 w-44 animate-pulse rounded-lg bg-white/10" />
          )}
        </h1>

        {/* Elegant Travel Subtitle */}
        <div
          className="mt-3 flex min-h-[1.25rem] items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition-colors duration-300 sm:text-[0.78rem]"
          style={{
            color: isBrandResolved ? `${primaryColor}dd` : "rgba(203, 213, 225, 0.7)",
          }}
        >
          {isBrandResolved && subtitle ? (
            subtitle
          ) : (
            <span className="inline-block h-3.5 w-52 animate-pulse rounded bg-white/10" />
          )}
        </div>

        {/* Travel loading progress section */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Slim glowing progress beam */}
          <div className="relative h-1 w-44 overflow-hidden rounded-full bg-white/10 sm:w-52">
            <div
              className="animate-travel-progress h-full rounded-full"
              style={{
                background: isBrandResolved
                  ? `linear-gradient(90deg, ${primaryColor}80, ${primaryColor}, ${accentColor})`
                  : "linear-gradient(90deg, rgba(56, 189, 248, 0.6), #38bdf8, #818cf8)",
                boxShadow: isBrandResolved
                  ? `0 0 14px ${primaryColor}90`
                  : "0 0 12px rgba(56, 189, 248, 0.5)",
              }}
            />
          </div>

          {/* Minimalist travel flight status */}
          <div className="flex items-center gap-2 text-[0.7rem] font-medium tracking-wider text-slate-400">
            <svg
              className="h-3.5 w-3.5 animate-pulse"
              style={{ color: isBrandResolved ? primaryColor : "#38bdf8" }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span className="text-slate-400/90">Curating your journey...</span>
          </div>
        </div>
      </div>
    </div>
  );
}