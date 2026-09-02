"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

const splashCopy: Record<string, { tag: string; accent: string }> = {
  wanderly: { tag: "Go somewhere unforgettable.", accent: "#f59e0b" },
  travelpro: { tag: "Professional travel. Simply done.", accent: "#60a5fa" },
  mytravel: { tag: "Your journey starts here.", accent: "#8b5cf6" },
};

export default function BrandSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const current = splashCopy[config.name.toLowerCase()] ?? splashCopy.wanderly;

  if (config.name === "Wanderly") {
    return (
      <div className="brand-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#26382F]" role="status" aria-live="polite" aria-label="Wanderly startup splash">
        <div className="brand-splash__content flex flex-col items-center text-center text-[#F5F0E8]">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#F5F0E8]/25 bg-[#F5F0E8]/10 text-2xl font-bold text-[#F5F0E8] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
            {config.logo}
          </div>

          <div className="font-display text-4xl font-semibold tracking-[-0.06em] text-[#F5F0E8]">Wanderly</div>

          <div className="mt-3 text-[0.7rem] uppercase tracking-[0.42em] text-[#D96A3A]">
            Go somewhere unforgettable.
          </div>
        </div>
      </div>
    );
  }

  if (config.visualStyle === "personal") {
    return (
      <div
        className="brand-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{ background: "#FAF9FF" }}
        role="status"
        aria-live="polite"
        aria-label="MyTravel startup splash"
      >
        <div className="brand-splash__content flex flex-col items-center text-center">
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold shadow-[0_18px_40px_rgba(124,92,255,0.22)]"
            style={{
              background: "#7C5CFF",
              color: "#ffffff",
              boxShadow: "0 18px 40px rgba(124, 92, 255, 0.22)",
            }}
          >
            {config.logo}
          </div>

          <div className="font-display text-[2.75rem] font-semibold leading-none tracking-tight" style={{ color: "#211A38" }}>
            MyTravel
          </div>

          <div className="mt-4 flex items-center gap-5 text-slate-500">
            <span className="h-px w-16 bg-[#D9D2F8]" />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.38em] text-[#6F6881]">Your journey</span>
            <span className="h-px w-16 bg-[#D9D2F8]" />
          </div>

          <div className="mt-5 text-3xl font-semibold leading-tight" style={{ color: "#211A38" }}>
            starts here.
          </div>

          <div className="mt-7 flex gap-2">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: dot === 1 ? "#7C5CFF" : "#D8D1F9",
                  transform: dot === 1 ? "scale(1.1)" : "scale(1)",
                  transition: "all 200ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="brand-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: config.visualStyle === "professional" ? "#0f172a" : "#111827",
      }}
      role="status"
      aria-live="polite"
      aria-label="TravelPro startup splash"
    >
      <div className="brand-splash__content flex flex-col items-center text-center">
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold shadow-2xl"
          style={{
            background: config.colors.primary,
            color: "#fff",
            boxShadow: `0 0 35px ${config.colors.primary}70`,
          }}
        >
          {config.logo}
        </div>

        <div className="font-display text-4xl font-semibold tracking-tight" style={{ color: "#fff" }}>
          {config.name}
        </div>

        <div className="mt-3 text-sm uppercase tracking-[0.35em]" style={{ color: current.accent }}>
          {current.tag}
        </div>
      </div>
    </div>
  );
}
