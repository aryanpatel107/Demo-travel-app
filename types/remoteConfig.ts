export type RemoteColorScale = Record<string, string>;

export type RemoteConfigColors = {
  primary?: RemoteColorScale | string;
  secondary?: RemoteColorScale | string;
  neutral?: RemoteColorScale | string;
  footerbgcolor?: RemoteColorScale | string;
  footertextcolor?: RemoteColorScale | string;
};

export type RemoteConfigFont = {
  family: string;
  files?: {
    url: string;
    weight: number;
  }[];
} | null;

export type RemoteConfigWebsite = {
  id?: number | string;
  name?: string;
  fullName?: string;
  footerCopyright?: string;
  icon?: string;
  favicon?: string;
  faviconImagePath?: string;
  darkThemeLogoPath?: string;
  staticPath?: string;
  logo?: string;
  logoUrl?: string;
  [key: string]: unknown;
};

export type RemoteConfigContactItem = {
  type?: number;
  name?: string;
  value?: string;
};

export type RemoteConfigSocialMediaConfigItem = {
  key: string;
  value: string;
};

export type RemoteConfigGeo = {
  country?: string | null;
  city?: string | null;
  ip?: string | null;
};

export type RemoteConfigLinks = {
  headerType?: unknown[];
  footerTypes?: unknown[];
  [key: string]: unknown;
};

export type RemoteConfigResult = {
  website?: RemoteConfigWebsite | null;
  websiteLinks?: RemoteConfigLinks | null;
  websiteExtra?: {
    social?: unknown[];
    cardInfo?: unknown[];
  } | null;

  websiteContact?: {
    contact?: RemoteConfigContactItem[];
    email?: RemoteConfigContactItem[];
  } | null;

  websiteConfiguration?: unknown | null;
  websiteModules?: unknown[];
  websiteCurrency?: unknown[];
  websiteLanguage?: unknown[]; // fixed typo

  colors?: RemoteConfigColors | null;
  theme?: unknown;
  recommendations?: unknown[];

  font?: RemoteConfigFont;

  socialMediaConfig?: RemoteConfigSocialMediaConfigItem[];
  socialMediaScript?: unknown[];

  websiteRights?: unknown[];

  geo?: RemoteConfigGeo | null;
  [key: string]: unknown;
};

export type RemoteConfigResponse = {
  result: RemoteConfigResult | null;
  error: string | null;
  isSuccess: boolean;
};

export type DynamicBranding = {
  name: string | null;
  fullName: string | null;
  logo: string | null;
  logoUrl: string | null;
  favicon: string | null;
  faviconUrl: string | null;
  copyright: string | null;
  footerCopyright: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  fontFiles?: { url: string; weight: number }[] | null;
  phone: string | null;
  email: string | null;
  currency: string | null;
  modules: unknown[];
};

export type DynamicGeo = {
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
  ip: string | null;
  displayLocation: string | null;
};

export type DynamicCurrency = {
  code: string;
  symbol: string;
  rate?: number;
};

export type ResolvedNavItem = {
  href: string;
  label: string;
};

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Extract a usable color string from either a scale object or a plain string.
 */
function extractColor(
  value: RemoteColorScale | string | undefined | null,
  preferredKey = "500"
): string | null {
  if (!value) return null;

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "object") {
    const scale = value as RemoteColorScale;
    return (
      scale[preferredKey] ||
      scale["500"] ||
      scale["600"] ||
      scale["400"] ||
      Object.values(scale).find((v) => typeof v === "string" && v.trim()) ||
      null
    );
  }

  return null;
}

/**
 * Returns the Google Maps API key when provided by the remote config.
 */
export function getGoogleMapsApiKey(
  result: RemoteConfigResult | null
): string | null {
  const entry = result?.socialMediaConfig?.find(
    (item) => item.key === "GoogleMapsApiKey"
  );
  return entry?.value?.trim() || null;
}

/**
 * Returns the primary color from the remote API.
 */
export function getPrimaryColor(
  result: RemoteConfigResult | null
): string | null {
  return extractColor(result?.colors?.primary);
}

/**
 * Returns the secondary color from the remote API.
 */
export function getSecondaryColor(
  result: RemoteConfigResult | null
): string | null {
  return extractColor(result?.colors?.secondary);
}

/**
 * Converts an ISO country code (IN, US, etc.) into a readable name.
 */
export function getCountryDisplayName(
  countryCode?: string | null
): string | null {
  if (!countryCode) return null;

  const upper = countryCode.trim().toUpperCase();

  try {
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      const name = regionNames.of(upper);
      if (name) return name;
    }
  } catch {
    // fallback below
  }

  const commonCountries: Record<string, string> = {
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    AE: "United Arab Emirates",
    SG: "Singapore",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    JP: "Japan",
    MY: "Malaysia",
    TH: "Thailand",
    ID: "Indonesia",
  };

  return commonCountries[upper] ?? upper;
}

/**
 * Converts Technoheaven header links into navigation items.
 * Returns empty array when no links are provided (no static fallback).
 */
export function getResolvedNavItems(
  result: RemoteConfigResult | null
): ResolvedNavItem[] {
  const headerLinks = result?.websiteLinks?.headerType;

  if (!Array.isArray(headerLinks)) return [];

  return headerLinks
    .map((item) => {
      const obj = item as Record<string, unknown>;
      const href = normalizeLink(obj?.url ?? obj?.href ?? obj?.link);
      const label = String(obj?.title ?? obj?.label ?? obj?.name ?? "").trim();

      return { href, label };
    })
    .filter((item) => item.label.length > 0 && item.href.length > 0);
}

/**
 * Converts Technoheaven footer links into navigation items.
 * Returns empty array when no links are provided (no static fallback).
 */
export function getResolvedFooterLinks(
  result: RemoteConfigResult | null
): ResolvedNavItem[] {
  const footerLinks = result?.websiteLinks?.footerTypes;

  if (!Array.isArray(footerLinks)) return [];

  return footerLinks
    .map((item) => {
      const obj = item as Record<string, unknown>;
      const href = normalizeLink(obj?.url ?? obj?.href ?? obj?.link);
      const label = String(obj?.title ?? obj?.label ?? obj?.name ?? "").trim();

      return { href, label };
    })
    .filter((item) => item.label.length > 0 && item.href.length > 0);
}

function normalizeLink(value: unknown): string {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    return url.pathname || "/";
  } catch {
    return `/${trimmed.replace(/^\/+/, "")}`;
  }
}

/**
 * Returns the logo URL from the dynamic API config (`website.icon` / appropriate logo field).
 * Supports both absolute URLs and relative API asset paths.
 */
export function getResolvedLogo(
  result: RemoteConfigResult | null
): string | null {
  const website = result?.website as Record<string, unknown> | undefined;
  if (!website) return null;

  const rawPath =
    (typeof website.icon === "string" && website.icon.trim()) ||
    (typeof website.logo === "string" && website.logo.trim()) ||
    (typeof website.logoUrl === "string" && website.logoUrl.trim()) ||
    (typeof website.faviconImagePath === "string" && website.faviconImagePath.trim()) ||
    (typeof website.darkThemeLogoPath === "string" && website.darkThemeLogoPath.trim()) ||
    (typeof website.image === "string" && website.image.trim()) ||
    (typeof result?.logo === "string" && (result.logo as string).trim()) ||
    null;

  if (!rawPath) return null;

  const staticBase =
    (typeof website.staticPath === "string" && website.staticPath.trim()) ||
    (typeof website.serviceImageCdnPath === "string" && website.serviceImageCdnPath.trim()) ||
    "";

  // Preserve letter monograms like "W", "TP", "MT"
  if (/^[A-Za-z0-9]{1,4}$/.test(rawPath)) {
    return rawPath;
  }

  // Rewrite absolute URLs that erroneously pointed to API base or website root
  if (/^(https?:|\/\/)/i.test(rawPath)) {
    if (
      /gujjutours\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/cloudfront\.net/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    if (
      /tripgoasia\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/cloudfront\.net/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d21bqxhdty55n7.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    if (
      /technoheaven\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/stagingimage\.technoheaven\.com/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://stagingimage.technoheaven.com/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    return rawPath;
  }

  // Data URIs
  if (/^data:/i.test(rawPath)) {
    return rawPath;
  }

  // If we have an explicit staticPath from the dynamic config JSON
  if (staticBase) {
    return `${staticBase.replace(/\/+$/, "")}/${rawPath.replace(/^\/+/, "")}`;
  }

  // Relative remote asset path fallbacks by brand name
  const name = String(website.name || "").toLowerCase();
  if (name.includes("gujju")) {
    return `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${rawPath.replace(/^\/+/, "")}`;
  }
  if (name.includes("tripgoasia")) {
    return `https://d21bqxhdty55n7.cloudfront.net/uploads/${rawPath.replace(/^\/+/, "")}`;
  }
  if (name.includes("techno") || name.includes("stagingb2b")) {
    return `https://stagingimage.technoheaven.com/uploads/${rawPath.replace(/^\/+/, "")}`;
  }

  // Local relative path
  return `/${rawPath.replace(/^\/+/, "")}`;
}

/**
 * Maps RemoteConfigResult into DynamicBranding object.
 */
export function getDynamicBranding(
  result: RemoteConfigResult | null
): DynamicBranding {
  const website = (result?.website && typeof result.website === "object"
    ? result.website
    : {}) as Record<string, unknown>;
  const fontObj =
    result?.font && typeof result.font === "object" && !Array.isArray(result.font)
      ? (result.font as Record<string, unknown>)
      : {};
  const contact = result?.websiteContact;
  const config = (result?.websiteConfiguration &&
  typeof result.websiteConfiguration === "object"
    ? result.websiteConfiguration
    : {}) as Record<string, unknown>;
  const currencyObj =
    config.currency && typeof config.currency === "object"
      ? (config.currency as Record<string, unknown>)
      : null;

  const name =
    (typeof website.name === "string" && website.name.trim()) || "Gujjutours";
  const fullName =
    (typeof website.fullName === "string" && website.fullName.trim()) || name;
  const resolvedLogo = getResolvedLogo(result);
  const logoUrl =
    (typeof website.faviconImagePath === "string" && website.faviconImagePath) ||
    (typeof website.icon === "string" && website.icon) ||
    resolvedLogo;
  const faviconUrl =
    (typeof website.favicon === "string" && website.favicon) ||
    (typeof website.icon === "string" && website.icon) ||
    logoUrl;

  const primaryColor = getPrimaryColor(result) || "#2882c5";
  const secondaryColor = getSecondaryColor(result) || "#f58e83";
  const fontFamily =
    (typeof fontObj.family === "string" && fontObj.family.trim()) || "Poppins";
  const fontFiles = Array.isArray(fontObj.files)
    ? (fontObj.files as { url: string; weight: number }[])
    : null;

  const phone = contact?.contact?.[0]?.value || "+91 9875095616";
  const email = contact?.email?.[0]?.value || "booking@gujjutours.com";

  const currency =
    (typeof currencyObj?.code === "string" && currencyObj.code) || "INR";
  const footerCopyright =
    (typeof website.footerCopyright === "string" && website.footerCopyright) ||
    `2026 ${name.toLowerCase()}. All Rights Reserved`;
  const modules = Array.isArray(result?.websiteModules)
    ? result.websiteModules
    : [];

  return {
    name,
    fullName,
    logo: resolvedLogo,
    logoUrl,
    favicon: faviconUrl,
    faviconUrl,
    copyright: footerCopyright,
    footerCopyright,
    primaryColor,
    secondaryColor,
    fontFamily,
    fontFiles,
    phone,
    email,
    currency,
    modules,
  };
}