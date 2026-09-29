/**
 * Brand Configuration Engine for Mobile
 *
 * Fetches dynamic website configuration from the staging API
 * and normalizes assets (logos, module icons) with CDN prefixes.
 */

import {
  BRAND_IDENTITIES,
  getActiveHostname,
  getStagingApiBaseUrl,
  resolveBrandKey,
  type BrandKey,
} from "../config";

export interface MobileModule {
  id: string;
  title: string;
  code: string;
  iconUrl?: string;
  emoji?: string;
  slug?: string;
}

export const DEFAULT_ICONS: Record<string, string> = {
  HOTEL: "🏨",
  PACKAGE: "📦",
  TOUR: "🏄",
  FLIGHT: "✈️",
  TRANSFER: "🚗",
  VISA: "🛂",
  RESTAURANT: "🍽️",
  BUILDPACKAGE: "🧳",
  MICE: "💼",
  ACTIVITY: "🧗",
};

export const BRAND_DEFAULT_MODULES: Record<BrandKey, MobileModule[]> = {
  wanderly: [
    { id: "1", code: "HOTEL", title: "Hotels", emoji: "🏨", slug: "hotel" },
    { id: "2", code: "PACKAGE", title: "Packages", emoji: "📦", slug: "package" },
    { id: "3", code: "TOUR", title: "Activities", emoji: "🏄", slug: "tour" },
    { id: "4", code: "FLIGHT", title: "Flight", emoji: "✈️", slug: "flight" },
    { id: "5", code: "TRANSFER", title: "Transfer", emoji: "🚗", slug: "transfer" },
    { id: "6", code: "VISA", title: "Visa", emoji: "🛂", slug: "visa" },
    { id: "7", code: "RESTAURANT", title: "Restaurant", emoji: "🍽️", slug: "restaurant" },
    { id: "8", code: "BUILDPACKAGE", title: "Build Package", emoji: "🧳", slug: "buildpackage" },
  ],
  travelpro: [
    { id: "1", code: "PACKAGE", title: "Asian Packages", emoji: "📦", slug: "package" },
    { id: "2", code: "HOTEL", title: "Hotels & Resorts", emoji: "🏨", slug: "hotel" },
    { id: "3", code: "TOUR", title: "Activities", emoji: "🏄", slug: "tour" },
    { id: "4", code: "TRANSFER", title: "Transfers", emoji: "🚗", slug: "transfer" },
    { id: "5", code: "FLIGHT", title: "Flights", emoji: "✈️", slug: "flight" },
    { id: "6", code: "VISA", title: "Visa Services", emoji: "🛂", slug: "visa" },
  ],
  mytravel: [
    { id: "1", code: "HOTEL", title: "Hotels Wholesale", emoji: "🏨", slug: "hotel" },
    { id: "2", code: "FLIGHT", title: "Global Flights", emoji: "✈️", slug: "flight" },
    { id: "3", code: "PACKAGE", title: "B2B Packages", emoji: "📦", slug: "package" },
    { id: "4", code: "TRANSFER", title: "Transfers", emoji: "🚗", slug: "transfer" },
    { id: "5", code: "TOUR", title: "Sightseeing", emoji: "🏄", slug: "tour" },
    { id: "6", code: "VISA", title: "Visa Assist", emoji: "🛂", slug: "visa" },
  ],
};

export interface MobileBranding {
  name: string;
  fullName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  currency: string;
  monogram: string;
  modules: MobileModule[];
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function firstString(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (isNonEmptyString(v)) return v.trim();
  }
  return undefined;
}

/**
 * Normalizes relative asset URLs to absolute CDN URLs.
 */
export function resolveAssetUrl(
  rawPath: unknown,
  brandKey: BrandKey,
  staticPath?: string
): string | undefined {
  if (!isNonEmptyString(rawPath)) return undefined;
  const path = rawPath.trim();

  // Already absolute http/https
  if (/^https?:\/\//i.test(path)) {
    if (/gujjutours\.com/i.test(path) && /WebsiteMaster/i.test(path) && !/cloudfront\.net/i.test(path)) {
      const subpath = path.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }
    if (/tripgoasia\.com/i.test(path) && /WebsiteMaster/i.test(path) && !/cloudfront\.net/i.test(path)) {
      const subpath = path.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d21bqxhdty55n7.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }
    if (/technoheaven\.com/i.test(path) && /WebsiteMaster/i.test(path) && !/stagingimage\.technoheaven\.com/i.test(path)) {
      const subpath = path.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://stagingimage.technoheaven.com/uploads/${subpath.replace(/^\/+/, "")}`;
    }
    return path;
  }

  // Data URI
  if (/^data:/i.test(path)) return path;

  // Use explicit staticPath if available
  if (staticPath && isNonEmptyString(staticPath)) {
    return `${staticPath.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  }

  // Fallback to brand CDN
  const cdnBase = BRAND_IDENTITIES[brandKey].cdnBase;
  return `${cdnBase.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/**
 * Normalizes service module items, filtering out raw file paths from titles.
 */
function normalizeModules(
  rawModules: unknown,
  brandKey: BrandKey,
  staticPath?: string
): MobileModule[] {
  if (!Array.isArray(rawModules)) return BRAND_DEFAULT_MODULES[brandKey] || [];

  const modules: MobileModule[] = [];

  for (let i = 0; i < rawModules.length; i++) {
    const item = rawModules[i];
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;

    let rawTitle = firstString(
      record.name,
      record.title,
      record.serviceName,
      record.label,
      record.displayName
    );

    if (rawTitle && (/[\/\\]/.test(rawTitle) || /\.(png|jpg|jpeg|svg|webp)$/i.test(rawTitle))) {
      rawTitle = undefined;
    }

    const title = rawTitle || `Service ${i + 1}`;

    const rawIcon = firstString(
      record.serviceIcon,
      record.icon,
      record.image,
      record.iconUrl
    );

    const iconUrl = resolveAssetUrl(rawIcon, brandKey, staticPath);
    const id = String(record.id ?? record.serviceId ?? record.serviceTypeId ?? record.code ?? `module-${i}`);
    const code = String(record.serviceCode ?? record.code ?? record.serviceName ?? title).toUpperCase().replace(/[\s_-]+/g, "");
    const emoji = DEFAULT_ICONS[code] || "✨";
    const slug = firstString(record.slug, record.code, title.toLowerCase().replace(/\s+/g, "-"));

    modules.push({
      id,
      title,
      code,
      emoji,
      iconUrl,
      slug,
    });
  }

  return modules.length > 0 ? modules : (BRAND_DEFAULT_MODULES[brandKey] || []);
}

function extractColor(value: unknown): string | undefined {
  if (isNonEmptyString(value)) return value.trim();
  if (value && typeof value === "object") {
    const scale = value as Record<string, unknown>;
    return firstString(
      scale["600"],
      scale["500"],
      scale["700"],
      scale["primary"],
      Object.values(scale).find((v) => isNonEmptyString(v))
    );
  }
  return undefined;
}

/**
 * Fetch remote brand config from the staging API.
 */
export async function fetchRemoteBrandConfig(
  hostname?: string,
  lang = "en"
): Promise<{ success: boolean; branding: MobileBranding; rawConfig: unknown }> {
  const activeHostname = hostname || getActiveHostname();
  const brandKey = resolveBrandKey(activeHostname);
  const fallbackIdentity = BRAND_IDENTITIES[brandKey];

  const defaultLogoUrl =
    "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/a29cd3ee-d050-a34a-3a53-3a20e4faf5f3/WebsiteMaster/iconId/fdad654c-a4f9-4abc-8633-b23a28a38107_gujju-logo.svg";

  const fallbackBranding: MobileBranding = {
    name: fallbackIdentity.displayName,
    fullName: fallbackIdentity.fullName,
    tagline: fallbackIdentity.tagline,
    logoUrl: defaultLogoUrl,
    primaryColor: fallbackIdentity.primaryColor,
    secondaryColor: fallbackIdentity.secondaryColor,
    phone: fallbackIdentity.phone,
    email: fallbackIdentity.email,
    currency: fallbackIdentity.defaultCurrency,
    monogram: fallbackIdentity.monogram,
    modules: BRAND_DEFAULT_MODULES[brandKey] || [],
  };

  const stagingBase = getStagingApiBaseUrl();
  const targetUrl = `${stagingBase}/api/core/v1/config/${encodeURIComponent(activeHostname)}?lang=${encodeURIComponent(lang)}`;

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller?.signal,
    });

    if (!response.ok) {
      console.warn(`[BrandConfig] Remote config HTTP ${response.status}. Using fallback.`);
      return { success: false, branding: fallbackBranding, rawConfig: null };
    }

    const json = await response.json();
    const result = (json?.result ?? json) as Record<string, unknown> | null;

    if (!result || typeof result !== "object") {
      return { success: false, branding: fallbackBranding, rawConfig: json };
    }

    const website = (result.website as Record<string, unknown> | undefined) || {};
    const colors = (result.colors as Record<string, unknown> | undefined) || {};

    const staticPath = firstString(
      website.staticPath,
      website.serviceImageCdnPath,
      result.staticPath
    );

    // Resolve Logo
    const iconPath = firstString(
      website.icon,
      website.logo,
      website.logoUrl,
      website.logoURL,
      website.darkThemeLogoPath,
      result.logo
    );
    let logoUrl: string | undefined = defaultLogoUrl;
    if (iconPath) {
      if (iconPath.startsWith("http")) {
        logoUrl = iconPath;
      } else {
        logoUrl = `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${iconPath.replace(/^\/+/, "")}`;
      }
    }

    // Resolve Name
    const name =
      firstString(website.name, website.title, result.name) ||
      fallbackIdentity.displayName;

    const fullName =
      firstString(website.fullName, website.name, result.fullName) ||
      fallbackIdentity.fullName;

    const tagline =
      firstString(website.tagline, website.description, result.description) ||
      fallbackIdentity.tagline;

    // Resolve Colors
    const primaryColor =
      extractColor(colors.primary) ||
      fallbackIdentity.primaryColor;

    const secondaryColor =
      extractColor(colors.secondary) ||
      fallbackIdentity.secondaryColor;

    // Contact
    const websiteContact = (result.websiteContact as Record<string, unknown> | undefined) || {};
    let phone = fallbackIdentity.phone;
    let email = fallbackIdentity.email;

    if (Array.isArray(websiteContact.contact) && websiteContact.contact[0]) {
      const c = websiteContact.contact[0];
      const val = typeof c === "string" ? c : (c as Record<string, unknown>)?.value;
      if (isNonEmptyString(val)) phone = val.trim();
    }
    if (Array.isArray(websiteContact.email) && websiteContact.email[0]) {
      const e = websiteContact.email[0];
      const val = typeof e === "string" ? e : (e as Record<string, unknown>)?.value;
      if (isNonEmptyString(val)) email = val.trim();
    }

    // Currency
    const currency =
      firstString(
        result.defaultCurrency,
        result.currency,
        (Array.isArray(result.websiteCurrency) && (result.websiteCurrency[0] as Record<string, unknown>)?.code)
      ) || fallbackIdentity.defaultCurrency;

    // Modules
    const rawModules = result.websiteModules || website.modules;
    const modules = normalizeModules(rawModules, brandKey, staticPath);

    const branding: MobileBranding = {
      name,
      fullName,
      tagline,
      logoUrl,
      primaryColor,
      secondaryColor,
      phone,
      email,
      currency,
      monogram: fallbackIdentity.monogram,
      modules,
    };

    return { success: true, branding, rawConfig: result };
  } catch (err) {
    console.warn("[BrandConfig] Failed to fetch remote config:", err);
    return { success: false, branding: fallbackBranding, rawConfig: null };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
