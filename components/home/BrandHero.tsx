import Link from "next/link";
import { config } from "@/config";

interface BrandHeroProps {
  accentText?: string;
  children?: React.ReactNode;
}

export default function BrandHero({ accentText, children }: BrandHeroProps) {
  const heroStyle =
    config.visualStyle === "professional"
      ? {
          background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
          color: "#ffffff",
        }
      : config.visualStyle === "personal"
        ? {
            background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
            color: "#ffffff",
          }
        : {
            background: `linear-gradient(135deg, rgba(15,23,42,0.88), rgba(15,118,110,0.9)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80') center/cover`,
            color: "#ffffff",
          };

  return (
    <section className="relative overflow-hidden" style={heroStyle}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/75">
            {config.hero.badge}
          </p>
          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {config.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {config.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={config.hero.primaryCtaHref}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: config.colors.secondary, color: "#fff" }}
            >
              {config.hero.primaryCtaLabel}
            </Link>
            <Link
              href={config.hero.secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {config.hero.secondaryCtaLabel}
            </Link>
          </div>

          {accentText ? (
            <div className="mt-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              {accentText}
            </div>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
