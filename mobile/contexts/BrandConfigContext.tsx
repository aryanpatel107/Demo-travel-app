import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ACTIVE_WEBSITES,
  type BrandName,
  type SupportedHostname,
} from "../config";
import { wanderlyConfig } from "../config/wanderly";
import { travelproConfig } from "../config/travelpro";
import { mytravelConfig } from "../config/mytravel";
import type { BrandConfig } from "../config/types";
import { Colors } from "../constants/theme";

export interface MobileBranding {
  name: string;
  fullName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  phone: string;
  email: string;
  modules: unknown[];
  fontFamily?: string;
  copyright?: string;
  footerCopyright?: string;
}

interface BrandConfigContextValue {
  brandKey: BrandName;
  hostname: SupportedHostname;
  config: BrandConfig;
  branding: MobileBranding;
  primaryColor: string;
  secondaryColor: string;
  loading: boolean;
  error: string | null;
  switchBrand: (brand: BrandName) => void;
  refreshConfig: () => Promise<void>;
  geo: {
    countryName?: string;
    displayLocation?: string;
  };
  contacts: {
    emails: { value: string }[];
    phones: { value: string }[];
  };
  socials: { platform: string; url: string }[];
  defaultCurrency: {
    code: string;
    symbol: string;
    currencyCode?: string;
  };
  isBrandResolved: boolean;
  remoteConfig?: Record<string, unknown> | null;
}

const BRAND_CONFIGS: Record<BrandName, BrandConfig> = {
  wanderly: wanderlyConfig,
  travelpro: travelproConfig,
  mytravel: mytravelConfig,
};

const DEFAULT_BRAND_INFO: Record<BrandName, MobileBranding> = {
  wanderly: {
    name: "GujjuTours",
    fullName: "Gujju Tours & Travels",
    tagline: "Unforgettable Holiday Experiences",
    logoUrl: "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/a29cd3ee-d050-a34a-3a53-3a20e4faf5f3/WebsiteMaster/iconId/fdad654c-a4f9-4abc-8633-b23a28a38107_gujju-logo.svg",
    primaryColor: "#2882c5",
    secondaryColor: "#f58e83",
    currency: "INR",
    phone: "+91 9875095616",
    email: "booking@gujjutours.com",
    modules: [],
  },
  travelpro: {
    name: "TripGoAsia",
    fullName: "TripGoAsia Travel",
    tagline: "Curated Journeys Across Asia",
    logoUrl: "https://d21bqxhdty55n7.cloudfront.net/uploads/fd63c771-6a91-924c-ae5c-3a1fa5fca46b/WebsiteMaster/iconId/388648ed-fca5-4b63-95c8-9d3386ad8e4c_logo.svg",
    primaryColor: "#FF932C",
    secondaryColor: "#3F3F69",
    currency: "USD",
    phone: "+60 3 1234 5678",
    email: "support@tripgoasia.com",
    modules: [],
  },
  mytravel: {
    name: "Technoheaven",
    fullName: "Technoheaven B2B Portal",
    tagline: "Global B2B Travel Platform & Technology",
    logoUrl: "https://stagingimage.technoheaven.com/uploads/2d10d5d6-5278-817d-ddf1-3a2036a6c997/WebsiteMaster/iconId/5c478130-81dd-4b6d-b505-e63e51faaa76_technologomain.svg",
    primaryColor: "#00aacf",
    secondaryColor: "#0088a6",
    currency: "USD",
    phone: "+971 4 000 0000",
    email: "contact@technoheaven.com",
    modules: [],
  },
};

const BrandConfigContext = createContext<BrandConfigContextValue | null>(null);

/**
 * Resolves the fixed build/config-time brand.
 * Priority:
 * 1. EXPO_PUBLIC_BRAND_KEY (wanderly | travelpro | mytravel)
 * 2. EXPO_PUBLIC_HOSTNAME / HOSTNAME (mapped to brand)
 * 3. Default fallback: wanderly
 */
function resolveInitialBrand(): BrandName {
  const envBrandKey = process.env.EXPO_PUBLIC_BRAND_KEY?.toLowerCase().trim();
  if (envBrandKey === "wanderly" || envBrandKey === "travelpro" || envBrandKey === "mytravel") {
    return envBrandKey;
  }
  if (envBrandKey === "gujjutours" || envBrandKey === "gujju") return "wanderly";
  if (envBrandKey === "tripgoasia" || envBrandKey === "tripgo") return "travelpro";
  if (envBrandKey === "technoheaven" || envBrandKey === "techno") return "mytravel";

  const envHost = (
    process.env.EXPO_PUBLIC_HOSTNAME ||
    process.env.HOSTNAME ||
    "www.gujjutours.com"
  ).toLowerCase();

  if (envHost.includes("tripgo") || envHost.includes("travelpro")) {
    return "travelpro";
  }
  if (envHost.includes("techno") || envHost.includes("stagingb2b") || envHost.includes("mytravel")) {
    return "mytravel";
  }
  return "wanderly";
}

export function BrandConfigProvider({ children }: { children: React.ReactNode }) {
  // Brand is strictly fixed at build/config time from environment variables only
  const brandKey = useMemo<BrandName>(() => resolveInitialBrand(), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeWebsite = ACTIVE_WEBSITES[brandKey];
  const hostname = activeWebsite.defaultHostname as SupportedHostname;
  const config = BRAND_CONFIGS[brandKey];
  const defaultBranding = DEFAULT_BRAND_INFO[brandKey];

  const primaryColor = config.colors?.primary || defaultBranding.primaryColor || Colors.teal;
  const secondaryColor = config.colors?.secondary || defaultBranding.secondaryColor || Colors.coral;

  const branding = useMemo<MobileBranding>(() => {
    return {
      name: activeWebsite.displayName || defaultBranding.name,
      fullName: defaultBranding.fullName,
      tagline: activeWebsite.tagline || defaultBranding.tagline,
      logoUrl: defaultBranding.logoUrl,
      primaryColor,
      secondaryColor,
      currency: brandKey === "wanderly" ? "INR" : "USD",
      phone: defaultBranding.phone,
      email: defaultBranding.email,
      modules: (config.websiteModules as unknown[]) || [],
      copyright: `© ${new Date().getFullYear()} ${activeWebsite.displayName || defaultBranding.name}. All rights reserved.`,
      footerCopyright: `© ${new Date().getFullYear()} ${activeWebsite.displayName || defaultBranding.name}. All rights reserved.`,
    };
  }, [activeWebsite, defaultBranding, primaryColor, secondaryColor, brandKey, config]);

  const refreshConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for remote staging API call
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load remote brand config");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<BrandConfigContextValue>(
    () => ({
      brandKey,
      hostname,
      config,
      branding,
      primaryColor,
      secondaryColor,
      loading,
      error,
      switchBrand: (_brand: BrandName) => {
        console.warn(
          "[BrandConfig] Runtime brand switching is disabled. Brand is locked to EXPO_PUBLIC_BRAND_KEY at build time."
        );
      },
      refreshConfig,
      geo: {
        countryName: brandKey === "wanderly" ? "India" : brandKey === "travelpro" ? "Malaysia" : "UAE",
        displayLocation: brandKey === "wanderly" ? "India" : brandKey === "travelpro" ? "Malaysia" : "United Arab Emirates",
      },
      contacts: {
        emails: [{ value: defaultBranding.email }],
        phones: [{ value: defaultBranding.phone }],
      },
      socials: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "Facebook", url: "https://facebook.com" },
      ],
      defaultCurrency: {
        code: brandKey === "wanderly" ? "INR" : "USD",
        symbol: brandKey === "wanderly" ? "₹" : "$",
      },
      isBrandResolved: true,
      remoteConfig: null,
    }),
    [brandKey, hostname, config, branding, primaryColor, secondaryColor, loading, error, refreshConfig, defaultBranding]
  );

  return (
    <BrandConfigContext.Provider value={value}>
      {children}
    </BrandConfigContext.Provider>
  );
}

export function useBrandConfig(): BrandConfigContextValue {
  const ctx = useContext(BrandConfigContext);
  if (!ctx) {
    throw new Error("useBrandConfig must be used within a BrandConfigProvider");
  }
  return ctx;
}

// Alias for compatibility with Next.js useAppConfig
export const useAppConfig = useBrandConfig;
