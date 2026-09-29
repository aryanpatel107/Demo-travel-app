"use client";

import { useAppConfig } from "@/components/RemoteConfigProvider";
import Link from "next/link";
import { useState } from "react";

interface ServiceModule {
  serviceTypeId?: number;
  serviceName?: string;
  serviceCode?: string;
  serviceIcon?: string;
  code?: string;
  name?: string;
  icon?: string;
  displayOrder?: number;
  [key: string]: unknown;
}

const DEFAULT_ICONS: Record<string, string> = {
  HOTEL: "🏨",
  PACKAGE: "📦",
  TOUR: "🏄",
  FLIGHT: "✈️",
  TRANSFER: "🚗",
  VISA: "🛂",
  RESTAURANT: "🍽️",
  BUILDPACKAGE: "🧳",
};

export default function BrandModules() {
  const { branding, remoteConfig, primaryColor } = useAppConfig();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const rawModules = (
    Array.isArray(branding.modules) && branding.modules.length > 0
      ? branding.modules
      : Array.isArray(remoteConfig?.websiteModules)
        ? remoteConfig?.websiteModules
        : []
  ) as ServiceModule[];

  if (!rawModules || rawModules.length === 0) {
    return null;
  }

  // Filter out invalid modules and sort by displayOrder
  const sortedModules = [...rawModules]
    .filter((m) => Boolean(m.serviceCode || m.code || m.serviceName || m.name))
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  if (sortedModules.length === 0) {
    return null;
  }

  const website = (remoteConfig?.website || {}) as Record<string, unknown>;
  const base =
    (typeof website.staticPath === "string" && website.staticPath.trim()) ||
    (typeof website.serviceImageCdnPath === "string" && website.serviceImageCdnPath.trim()) ||
    "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/";

  const resolvedPrimary = primaryColor || branding.primaryColor || "#2882c5";

  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-6xl px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
            {branding.name ? `${branding.name} Services` : "Travel Services"}
          </p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: resolvedPrimary }}
          >
            {sortedModules.length} Modules Available
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {sortedModules.map((module, index) => {
            const code = String(module.serviceCode ?? module.code ?? "").toUpperCase();
            const serviceName = String(module.serviceName ?? module.name ?? "Service");
            const rawIcon = module.serviceIcon || (typeof module.icon === "string" && module.icon.includes("/") ? module.icon : undefined);
            const iconUrl = rawIcon
              ? (rawIcon.startsWith("http")
                  ? rawIcon
                  : `${base.replace(/\/?$/, "/")}${rawIcon.replace(/^\//, "")}`)
              : null;
            const isSelected = activeTab === code;

            return (
              <Link
                key={`module-${index}-${module.serviceTypeId ?? module.serviceCode}`}
                href={`/trips/create?service=${encodeURIComponent(code)}`}
                onClick={() => setActiveTab(code)}
                className={`group flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isSelected
                    ? "border-slate-400 bg-slate-50 shadow"
                    : "border-slate-100 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div
                  className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:scale-105"
                  style={{
                    backgroundColor: `${resolvedPrimary}15`,
                    color: resolvedPrimary,
                  }}
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={serviceName}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        // Fallback to emoji if remote image fails
                        e.currentTarget.style.display = "none";
                        const span = e.currentTarget.parentElement?.querySelector(".fallback-emoji");
                        if (span) span.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <span
                    className={`fallback-emoji text-lg ${iconUrl ? "hidden" : ""}`}
                  >
                    {DEFAULT_ICONS[code] || (typeof module.icon === "string" && module.icon.length <= 4 ? module.icon : "✨")}
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950">
                  {serviceName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
