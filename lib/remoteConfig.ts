import { resolveCurrentHostname, HOSTNAME_TO_API_BASE } from "@/config";

export interface RemoteConfig {
  website?: Record<string, unknown>;
  websiteLanguage?: unknown[];
  websiteRights?: unknown[];
  font?: {
    family?: string;
    files?: { url: string; weight: number }[];
    [key: string]: unknown;
  } | unknown[];
  colors?: Record<string, unknown>;
  websiteLinks?: unknown;
  socialMediaConfig?: unknown[];
  websiteContact?: {
    contact?: { type?: number; name?: string; value?: string }[];
    email?: { type?: number; name?: string; value?: string }[];
  };
  websiteModules?: unknown[];
  theme?: unknown;
  recommendations?: unknown[];
  geo?: {
    country?: string | null;
    city?: string | null;
    ip?: string | null;
  } | null;
  websiteConfiguration?: {
    currency?: { id?: number; name?: string; code?: string; symbol?: string | null } | string;
    language?: { id?: number; name?: string; code?: string } | string;
    [key: string]: unknown;
  };
  websiteCurrency?: unknown[];
}

export interface MappedBranding {
  name: string;
  fullName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontFiles?: { url: string; weight: number }[];
  phone: string;
  email: string;
  currency: string;
  footerCopyright: string;
  modules: unknown[];
}

export function mapRemoteConfigToBranding(result: RemoteConfig | null): MappedBranding {
  const website = (result?.website && typeof result.website === "object" ? result.website : {}) as Record<string, unknown>;
  const colors = (result?.colors && typeof result.colors === "object" ? result.colors : {}) as Record<string, unknown>;
  const fontObj = result?.font && typeof result.font === "object" && !Array.isArray(result.font) ? (result.font as Record<string, unknown>) : {};
  const contact = result?.websiteContact;
  const config = (result?.websiteConfiguration && typeof result.websiteConfiguration === "object" ? result.websiteConfiguration : {}) as Record<string, unknown>;
  const currencyObj = config.currency && typeof config.currency === "object" ? (config.currency as Record<string, unknown>) : null;

  const name = String(website.name || "Gujjutours").trim();
  const fullName = String(website.fullName || website.name || "Gujjutours").trim();
  const logoUrl = String(website.faviconImagePath || website.icon || website.darkThemeLogoPath || website.logo || "").trim();
  const faviconUrl = String(website.favicon || website.icon || logoUrl).trim();

  // Primary color: check 500, 600, 900
  const primaryObj = colors.primary && typeof colors.primary === "object" ? (colors.primary as Record<string, string>) : {};
  const primaryColor = typeof colors.primary === "string" ? colors.primary : (primaryObj["500"] || primaryObj["600"] || primaryObj["900"] || "#2882c5");

  // Secondary color
  const secondaryObj = colors.secondary && typeof colors.secondary === "object" ? (colors.secondary as Record<string, string>) : {};
  const secondaryColor = typeof colors.secondary === "string" ? colors.secondary : (secondaryObj["500"] || secondaryObj["600"] || "#f58e83");

  const fontFamily = String(fontObj.family || "Poppins").trim();
  const fontFiles = Array.isArray(fontObj.files) ? (fontObj.files as { url: string; weight: number }[]) : undefined;

  const phone = contact?.contact?.[0]?.value || "+91 9875095616";
  const email = contact?.email?.[0]?.value || "booking@gujjutours.com";

  const currency = String(currencyObj?.code || "INR");
  const footerCopyright = String(website.footerCopyright || `2026 ${name.toLowerCase()}. All Rights Reserved`);
  const modules = Array.isArray(result?.websiteModules) ? result.websiteModules : [];

  return {
    name,
    fullName,
    logoUrl,
    faviconUrl,
    primaryColor,
    secondaryColor,
    fontFamily,
    fontFiles,
    phone,
    email,
    currency,
    footerCopyright,
    modules,
  };
}

export async function fetchRemoteConfig(
  lang = "en",
  overrideHost?: string
): Promise<RemoteConfig> {
  const envHost =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_HOSTNAME || process.env.HOSTNAME)) ||
    undefined;

  const hostname = resolveCurrentHostname(overrideHost || envHost);
  const apiBaseUrl =
    (process.env.API_BASE_URL &&
      (process.env.HOSTNAME === hostname ||
        process.env.NEXT_PUBLIC_HOSTNAME === hostname))
      ? process.env.API_BASE_URL.replace(/\/+$/, "")
      : HOSTNAME_TO_API_BASE[hostname];

  const url =
    `${apiBaseUrl}/api/core/v1/config/` +
    `${encodeURIComponent(hostname)}?lang=${encodeURIComponent(lang)}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Remote configuration request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return data.result ?? data;
}