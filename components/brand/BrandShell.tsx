import type { ReactNode } from "react";
import { config } from "@/config";

interface BrandShellProps {
  children: ReactNode;
}

export default function BrandShell({ children }: BrandShellProps) {
  const theme = {
    "--brand-primary": config.colors.primary,
    "--brand-secondary": config.colors.secondary,
    "--brand-background": config.colors.background,
    "--brand-surface": config.colors.surface,
    "--brand-text": config.colors.text,
    "--brand-muted": config.colors.mutedText,
    "--brand-accent": config.colors.accent,
  } as React.CSSProperties;

  const isWanderly = config.name === "Wanderly";

  return (
    <div
      data-brand={config.name.toLowerCase()}
      className={`brand-shell min-h-screen w-full${isWanderly ? " wanderly-page" : ""}`}
      style={theme}
    >
      {children}
    </div>
  );
}
