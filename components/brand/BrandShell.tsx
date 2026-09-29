"use client";

import type { CSSProperties, ReactNode } from "react";
import { useAppConfig } from "@/components/RemoteConfigProvider";

interface BrandShellProps {
  children: ReactNode;
}

export default function BrandShell({ children }: BrandShellProps) {
  const { branding, primaryColor, secondaryColor, brandKey } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const normalizedBrandName = brandName.toLowerCase();

  const resolvedPrimary = primaryColor || branding.primaryColor || "#2882c5";
  const resolvedSecondary = secondaryColor || branding.secondaryColor || "#f58e83";

  const theme = {
    "--brand-primary": resolvedPrimary,
    "--brand-secondary": resolvedSecondary,
    "--brand-background": "transparent",
    "--brand-surface": "transparent",
    "--brand-text": "inherit",
    "--brand-muted": "inherit",
    "--brand-accent": resolvedPrimary,
    "--wanderly-orange": resolvedPrimary,
    "--wanderly-forest": resolvedPrimary,
    "--wanderly-primary": resolvedPrimary,
  } as CSSProperties;

  const isWanderly =
    (brandKey === "wanderly" && !normalizedBrandName.includes("gujju")) ||
    normalizedBrandName.includes("wanderly");

  return (
    <div
      data-brand={normalizedBrandName || "travel"}
      className={`brand-shell min-h-screen w-full${
        isWanderly ? " wanderly-page" : ""
      }`}
      style={theme}
    >
      {children}
    </div>
  );
}