import Link from "next/link";
import { config } from "@/config";

interface BrandStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  tone?: "error" | "empty";
}

export function BrandStateCard({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  tone = "empty",
}: BrandStateProps) {
  const brandKey = config.name.toLowerCase().replace(/\s+/g, "");
  const isWanderly = brandKey === "wanderly";
  const isTravelPro = brandKey === "travelpro";

  const shellClasses = isWanderly
    ? "border-[#e8dcc5] bg-[#fffaf3] text-[#17221d]"
    : isTravelPro
      ? "border-slate-200 bg-white text-slate-900"
      : "border-[#e8ddff] bg-white text-[#20173c]";

  const iconClasses = isWanderly
    ? "bg-[#f3eadb] text-[#d96a3a]"
    : isTravelPro
      ? "bg-sky-50 text-sky-700"
      : "bg-[#f0ebff] text-[#6b4ec6]";

  const buttonClasses = isWanderly
    ? "bg-[#d96a3a] text-white hover:bg-[#c85d2f]"
    : isTravelPro
      ? "bg-sky-700 text-white hover:bg-sky-800"
      : "bg-[#7a5ae1] text-white hover:bg-[#6849c9]";

  const toneClasses =
    tone === "error"
      ? isWanderly
        ? "border-[#f1c9c4] bg-[#fff4f2] text-[#4c2c2a]"
        : isTravelPro
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-[#f2d6dd] bg-[#fff4f7] text-[#6b2d50]"
      : "";

  const content = (
    <div
      className={`rounded-[2rem] border p-8 text-center shadow-sm ${shellClasses} ${toneClasses}`}
      aria-live="polite"
      role={tone === "error" ? "alert" : "status"}
    >
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${iconClasses}`}>
        {tone === "error" ? "⚠" : "✦"}
      </div>

      <h2 className="mt-5 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-7 opacity-80">{description}</p>

      {actionLabel && (
        <div className="mt-6 flex justify-center">
          {actionHref ? (
            <Link
              href={actionHref}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${buttonClasses}`}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonClasses}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return content;
}

export function BrandErrorState(props: Omit<BrandStateProps, "tone">) {
  return <BrandStateCard {...props} tone="error" />;
}

export function BrandEmptyState(props: Omit<BrandStateProps, "tone">) {
  return <BrandStateCard {...props} tone="empty" />;
}
