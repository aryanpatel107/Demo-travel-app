import { wanderlyConfig } from "./wanderly";
import { travelproConfig } from "./travelpro";
import { mytravelConfig } from "./mytravel";
import type { BrandConfig } from "./types";

export type BrandName = "wanderly" | "travelpro" | "mytravel";

const brandMap: Record<BrandName, BrandConfig> = {
  wanderly: wanderlyConfig,
  travelpro: travelproConfig,
  mytravel: mytravelConfig,
};

export interface ActiveWebsiteIdentity {
  brandKey: BrandName;
  displayName: string;
  tagline: string;
  defaultHostname: string;
  defaultPrimaryColor: string;
  defaultAccentColor: string;
}

export const ACTIVE_WEBSITES: Record<BrandName, ActiveWebsiteIdentity> = {
  mytravel: {
    brandKey: "mytravel",
    displayName: "Technoheaven",
    tagline: "Global B2B Travel Platform & Technology",
    defaultHostname: "stagingb2b.technoheaven.com",
    defaultPrimaryColor: "#00aacf",
    defaultAccentColor: "#00aacf",
  },
  travelpro: {
    brandKey: "travelpro",
    displayName: "TripGoAsia",
    tagline: "Curated Journeys Across Asia",
    defaultHostname: "www.tripgoasia.com",
    defaultPrimaryColor: "#FF932C",
    defaultAccentColor: "#3F3F69",
  },
  wanderly: {
    brandKey: "wanderly",
    displayName: "GujjuTours",
    tagline: "Unforgettable Holiday Experiences",
    defaultHostname: "www.gujjutours.com",
    defaultPrimaryColor: "#2882c5",
    defaultAccentColor: "#f58e83",
  },
};

export const SUPPORTED_HOSTNAMES = [
  "stagingb2b.technoheaven.com",
  "www.tripgoasia.com",
  "www.gujjutours.com",
] as const;

export type SupportedHostname = (typeof SUPPORTED_HOSTNAMES)[number];

export const HOSTNAME_TO_BRAND: Record<SupportedHostname, BrandName> = {
  "stagingb2b.technoheaven.com": "mytravel",
  "www.tripgoasia.com": "travelpro",
  "www.gujjutours.com": "wanderly",
};

export const BRAND_TO_HOSTNAME: Record<BrandName, SupportedHostname> = {
  mytravel: "stagingb2b.technoheaven.com",
  travelpro: "www.tripgoasia.com",
  wanderly: "www.gujjutours.com",
};

export const HOSTNAME_TO_API_BASE: Record<SupportedHostname, string> = {
  "stagingb2b.technoheaven.com": "https://stagingapi.technoheaven.com",
  "www.tripgoasia.com": "https://stagingapi.tripgoasia.com",
  "www.gujjutours.com": "https://stagingapi.gujjutours.com",
};

export function validateSupportedHostname(
  val: string | null | undefined
): SupportedHostname | null {
  if (!val) return null;
  const cleaned = val.trim().toLowerCase().split(":")[0].replace(/\.$/, "");
  const norm = cleaned.replace(/[\s_-]+/g, "");

  if (
    cleaned === "stagingb2b.technoheaven.com" ||
    norm.includes("techno") ||
    norm.includes("stagingb2b") ||
    norm.includes("mytravel")
  ) {
    return "stagingb2b.technoheaven.com";
  }

  if (
    cleaned === "www.tripgoasia.com" ||
    norm.includes("tripgo") ||
    norm.includes("travelpro")
  ) {
    return "www.tripgoasia.com";
  }

  if (
    cleaned === "www.gujjutours.com" ||
    norm.includes("gujju") ||
    norm.includes("wanderly")
  ) {
    return "www.gujjutours.com";
  }

  return null;
}

export interface ResolveHostnameContext {
  headers?: { get(name: string): string | null };
  url?: string | URL;
  searchParams?: URLSearchParams | { get(name: string): string | null };
}

/**
 * Single source of truth for the active website hostname.
 * 
 * Rules:
 * 1. Production: use the incoming request Host header.
 * 2. Localhost: use ?hostname= from the URL.
 * 3. Validate only the 3 supported hostnames:
 *    - stagingb2b.technoheaven.com
 *    - www.tripgoasia.com
 *    - www.gujjutours.com
 * 4. Never use HOSTNAME from .env to override a valid request/query hostname.
 * 5. Never default localhost to TripGoAsia.
 * 6. Fallback default: 'stagingb2b.technoheaven.com'
 */
export function resolveCurrentHostname(
  ctx?: ResolveHostnameContext | string | null
): SupportedHostname {
  // 1. Client-side on localhost: URL query param (?hostname=...) is king
  if (typeof window !== "undefined" && window.location) {
    try {
      const sp = new URLSearchParams(window.location.search);
      const q =
        sp.get("hostname") ||
        sp.get("host") ||
        sp.get("brand") ||
        sp.get("site");
      const validated = validateSupportedHostname(q);
      if (validated) return validated;
    } catch {
      // ignore
    }

    // Client-side production host (when not localhost)
    const browserHost = window.location.hostname;
    if (browserHost && browserHost !== "localhost" && browserHost !== "127.0.0.1") {
      const validated = validateSupportedHostname(browserHost);
      if (validated) return validated;
    }
  }

  // 2. Explicit string passed directly
  if (typeof ctx === "string" && ctx.trim()) {
    const validated = validateSupportedHostname(ctx);
    if (validated) return validated;
  }

  const context = typeof ctx === "object" && ctx !== null ? ctx : undefined;

  // 3. Explicit searchParams or URL (localhost ?hostname=...)
  if (context?.searchParams) {
    const q =
      context.searchParams.get("hostname") ||
      context.searchParams.get("host") ||
      context.searchParams.get("brand") ||
      context.searchParams.get("site");
    const validated = validateSupportedHostname(q);
    if (validated) return validated;
  }

  if (context?.url) {
    try {
      const u =
        typeof context.url === "string"
          ? new URL(context.url, "http://localhost:3000")
          : context.url;
      const q =
        u.searchParams.get("hostname") ||
        u.searchParams.get("host") ||
        u.searchParams.get("brand") ||
        u.searchParams.get("site");
      const validated = validateSupportedHostname(q);
      if (validated) return validated;
    } catch {
      // ignore
    }
  }

  // 4. Server-side: check request headers
  if (context?.headers) {
    // Check custom header set by proxy middleware for the current request
    const customHeader =
      context.headers.get("x-current-hostname") ||
      context.headers.get("x-brand-hostname");
    if (customHeader) {
      const validated = validateSupportedHostname(customHeader);
      if (validated) return validated;
    }

    // Check referer header on localhost if query was passed on the page
    const referer = context.headers.get("referer");
    if (referer) {
      try {
        const refUrl = new URL(referer);
        const q =
          refUrl.searchParams.get("hostname") ||
          refUrl.searchParams.get("host") ||
          refUrl.searchParams.get("brand") ||
          refUrl.searchParams.get("site");
        const validated = validateSupportedHostname(q);
        if (validated) return validated;
      } catch {
        // ignore
      }
    }

    // Check incoming Host header (Production)
    const hostHeader =
      context.headers.get("x-forwarded-host") ||
      context.headers.get("host");
    if (hostHeader) {
      const hostOnly = hostHeader.split(":")[0];
      if (hostOnly !== "localhost" && hostOnly !== "127.0.0.1") {
        const validated = validateSupportedHostname(hostOnly);
        if (validated) return validated;
      }
    }
  }

  // 5. Prefer: process.env.NEXT_PUBLIC_HOSTNAME || process.env.HOSTNAME || "www.gujjutours.com"
  return getDefaultHostname();
}

/**
 * Default hostname resolved from environment or fallback.
 * Prefers: process.env.NEXT_PUBLIC_HOSTNAME || process.env.HOSTNAME || "www.gujjutours.com"
 */
export function getDefaultHostname(): SupportedHostname {
  // On server, check active .env directly to avoid stale process.env in long-running dev servers
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("#") && trimmed.includes("=")) {
            const [k, ...v] = trimmed.split("=");
            const key = k.trim();
            const val = v.join("=").trim().replace(/^['"]|['"]$/g, "");
            if ((key === "HOSTNAME" || key === "NEXT_PUBLIC_HOSTNAME") && val) {
              const validated = validateSupportedHostname(val);
              if (validated) return validated;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const envVal =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_HOSTNAME || process.env.HOSTNAME)) ||
    "www.gujjutours.com";

  return validateSupportedHostname(envVal) || "www.gujjutours.com";
}

/**
 * Resolve any input identifier (hostname, subdomain, brand name, query value)
 * to one of the 3 canonical production hostnames.
 * Returns null if the identifier does not correspond to any known brand.
 */
export function resolveCanonicalHostname(
  raw: string | null | undefined
): string | null {
  return validateSupportedHostname(raw);
}

/**
 * Resolve the internal application brand from a remote website name.
 *
 * External API names → Internal brand
 *
 *   Technoheaven / MyTravel     → mytravel
 *   Tripgoasia / TravelPro      → travelpro
 *   Gujjutours / Wanderly       → wanderly
 */
export function resolveRemoteBrandKey(
  websiteName: string | null | undefined
): BrandName | null {
  if (!websiteName) return null;

  const normalized = websiteName
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  // Technoheaven / MyTravel
  if (
    normalized.includes("technoheaven") ||
    normalized.includes("mytravel") ||
    normalized.includes("stagingb2b") ||
    normalized.includes("techno")
  ) {
    return "mytravel";
  }

  // Tripgoasia / TravelPro
  if (
    normalized.includes("tripgoasia") ||
    normalized.includes("travelpro")
  ) {
    return "travelpro";
  }

  // Gujjutours / Wanderly
  if (
    normalized.includes("gujjutours") ||
    normalized.includes("wanderly") ||
    normalized.includes("gujju")
  ) {
    return "wanderly";
  }

  return null;
}

export function resolveActiveWebsite(
  identifier: string | null | undefined
): ActiveWebsiteIdentity {
  const brandKey = resolveRemoteBrandKey(identifier) || "mytravel";
  return ACTIVE_WEBSITES[brandKey];
}

/**
 * Resolve the old environment-based brand value.
 * Used only as fallback before remote config loads.
 */
export function resolveEnvironmentBrandKey(
  rawValue?: string | null
): BrandName | null {
  if (!rawValue) return null;

  const normalized = rawValue.trim().toLowerCase();

  if (normalized.includes("wanderly")) return "wanderly";
  if (normalized.includes("travelpro")) return "travelpro";
  if (normalized.includes("mytravel")) return "mytravel";

  return null;
}

/**
 * Get a static configuration by its internal brand key.
 */
export function getStaticBrandConfig(brand: BrandName): BrandConfig {
  return brandMap[brand];
}

/**
 * Static fallback configuration.
 * Defaults to mytravel if no NEXT_PUBLIC_BRAND is set.
 */
const environmentBrand = resolveEnvironmentBrandKey(
  process.env.NEXT_PUBLIC_BRAND
);

export const config: BrandConfig = environmentBrand
  ? brandMap[environmentBrand]
  : wanderlyConfig;