import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { config } from "@/config";
import { Destination } from "@/types/destination";

interface DestinationCardProps {
  destination: Destination;
  variant?: "wanderly" | "travelpro" | "mytravel";
}

function DestinationCard({ destination, variant }: DestinationCardProps) {
  const selectedVariant = variant ?? (config.name.toLowerCase().replace(/\s+/g, "") || "wanderly");
  const isWanderly = selectedVariant === "wanderly";
  const isTravelPro = selectedVariant === "travelpro";

  const baseClassName = [
    "group block overflow-hidden transition-all duration-300 ease-out",
    isWanderly
      ? "rounded-[28px] border border-[#e8dfcf] bg-[#fffaf3] shadow-[0_25px_50px_rgba(22,36,31,0.12)] hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(22,36,31,0.16)]"
      : isTravelPro
        ? "rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
        : "rounded-[26px] border border-[#eae0ff] bg-white shadow-[0_18px_42px_rgba(92,71,154,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(92,71,154,0.12)]",
  ].join(" ");

  const imageClassName = [
    "relative h-56 w-full overflow-hidden",
    isWanderly ? "" : "",
  ].join(" ");

  const nameClassName = [
    "font-display text-xl font-semibold tracking-tight",
    isWanderly ? "text-[#16241f]" : isTravelPro ? "text-slate-900" : "text-[#20173c]",
  ].join(" ");

  const countryClassName = [
    "mt-1 text-[11px] uppercase tracking-[0.2em]",
    isWanderly ? "text-[#4a5a52]" : isTravelPro ? "text-slate-500" : "text-[#72668f]",
  ].join(" ");

  const descriptionClassName = [
    "mt-3 line-clamp-3 text-sm leading-6",
    isWanderly ? "text-[#33433d]" : isTravelPro ? "text-slate-600" : "text-[#4a4568]",
  ].join(" ");

  const metaClassName = [
    "mt-4 flex items-center justify-between border-t pt-3 font-mono text-[11px] uppercase tracking-[0.12em]",
    isWanderly ? "border-[#eadfc5] text-[#4a5a52]" : isTravelPro ? "border-slate-200 text-slate-500" : "border-[#ece5ff] text-[#5a4a7c]",
  ].join(" ");

  const ratingClassName = [
    "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-[10px] font-semibold",
    isWanderly
      ? "border-[#d79b60] bg-[#fdf6ec] text-[#1d2d27]"
      : isTravelPro
        ? "border-slate-300 bg-white/90 text-slate-800"
        : "border-[#d6c9ff] bg-[#f8f4ff] text-[#403155]",
  ].join(" ");

  const tagStyle = isWanderly
    ? "bg-[#f3eadb] text-[#16352f]"
    : isTravelPro
      ? "bg-slate-100 text-slate-700"
      : "bg-[#f0ebff] text-[#482f70]";

  return (
    <Link href={`/destinations/${destination.id}`} className={baseClassName}>
      <div className={imageClassName}>
        <Image
          src={destination.imageUrl}
          alt={`${destination.name} in ${destination.country}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
        <span className={ratingClassName}>{destination.rating}</span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className={nameClassName}>{destination.name}</h3>
            <p className={countryClassName}>{destination.country}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 ${tagStyle}`}>{destination.tags[0] ?? "trip"}</span>
        </div>

        <p className={descriptionClassName}>{destination.description}</p>

        <div className={metaClassName}>
          <span>{destination.duration}</span>
          <span className={isWanderly ? "text-[#d96a3a]" : isTravelPro ? "text-blue-600" : "text-[#6d46b9]"}>
            ${destination.price}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default memo(DestinationCard);