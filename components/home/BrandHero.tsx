"use client";

import Link from "next/link";
import { useAppConfig } from "@/components/RemoteConfigProvider";

interface BrandHeroProps {
  accentText?: string;
  children?: React.ReactNode;
}

export default function BrandHero({
  accentText,
  children,
}: BrandHeroProps) {
  const { config, remoteConfig, branding, primaryColor, secondaryColor } = useAppConfig();

  const websiteName =
    remoteConfig?.website?.name?.trim() ||
    branding.name ||
    config.name ||
    "";

  const heroStyle =
    primaryColor && secondaryColor
      ? {
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: "#ffffff",
        }
      : {
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.88), rgba(15,118,110,0.9)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80') center/cover",
          color: "#ffffff",
        };

  const primaryHref =
    remoteConfig?.websiteLinks?.headerType?.[0] &&
    typeof remoteConfig.websiteLinks.headerType[0] === "object"
      ? String(
          (remoteConfig.websiteLinks.headerType[0] as Record<string, unknown>)
            .url ??
            (remoteConfig.websiteLinks.headerType[0] as Record<string, unknown>)
              .href ??
            "#",
        )
      : config.hero?.primaryCtaHref || "/destinations";

  const primaryLabel =
    remoteConfig?.websiteLinks?.headerType?.[0] &&
    typeof remoteConfig.websiteLinks.headerType[0] === "object"
      ? String(
          (remoteConfig.websiteLinks.headerType[0] as Record<string, unknown>)
            .title ??
            (remoteConfig.websiteLinks.headerType[0] as Record<string, unknown>)
              .label ??
            (remoteConfig.websiteLinks.headerType[0] as Record<string, unknown>)
              .name ??
            "",
        )
      : config.hero?.primaryCtaLabel || "Explore Destinations";

  return (
    <section className="relative overflow-hidden" style={heroStyle}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/75">
            {websiteName}
          </p>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {websiteName}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {accentText || ""}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {primaryLabel && primaryHref !== "#" ? (
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: secondaryColor ?? undefined,
                  color: "#fff",
                }}
              >
                {primaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}