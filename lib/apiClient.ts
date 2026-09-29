
import type { RemoteConfigResult } from "@/types/remoteConfig";
import { resolveCurrentHostname } from "@/config";

/* -------------------------------------------------------------------------- */
/* Application API                                                            */
/* -------------------------------------------------------------------------- */

/*
 * This URL is used for your application's own ASP.NET API:
 *
 * /api/auth
 * /api/trips
 * /api/payments
 * /api/contact
 *
 * Keep this separate from the remote website configuration API.
 *
 * Browser:
 *   http://localhost:3000
 *
 * ASP.NET API:
 *   http://localhost:5019
 *
 * NEXT_PUBLIC_API_URL can therefore remain:
 *
 * NEXT_PUBLIC_API_URL=http://localhost:5019
 */
const APP_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:5019";

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status = 500,
    data: unknown = null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiFetchOptions = RequestInit & {
  skipJsonContentType?: boolean;
};

/* -------------------------------------------------------------------------- */
/* URL helpers                                                                */
/* -------------------------------------------------------------------------- */

function getApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${APP_API_BASE_URL}${normalizedPath}`;
}

/* -------------------------------------------------------------------------- */
/* Response helpers                                                           */
/* -------------------------------------------------------------------------- */

async function parseResponseBody(
  response: Response
): Promise<unknown> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.message === "string" &&
    record.message.trim()
  ) {
    return record.message;
  }

  if (
    typeof record.error === "string" &&
    record.error.trim()
  ) {
    return record.error;
  }

  if (
    typeof record.title === "string" &&
    record.title.trim()
  ) {
    return record.title;
  }

  if (
    record.errors &&
    typeof record.errors === "object"
  ) {
    const errors =
      record.errors as Record<string, unknown>;

    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value.length > 0) {
        const firstError = value.find(
          (item) => typeof item === "string"
        );

        if (
          typeof firstError === "string" &&
          firstError.trim()
        ) {
          return firstError;
        }
      }

      if (
        typeof value === "string" &&
        value.trim()
      ) {
        return value;
      }
    }
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Auth Storage Helpers (Brand-Isolated)                                     */
/* -------------------------------------------------------------------------- */

export function getCanonicalBrandKey(brandOrHost?: string | null): string {
  if (brandOrHost && brandOrHost.trim()) {
    const cleaned = brandOrHost.trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (cleaned.includes("gujju") || cleaned.includes("wanderly")) return "wanderly";
    if (cleaned.includes("tripgo") || cleaned.includes("travelpro")) return "travelpro";
    if (
      cleaned.includes("techno") ||
      cleaned.includes("stagingb2b") ||
      cleaned.includes("mytravel")
    ) {
      return "techno-b2b";
    }
    return cleaned;
  }

  const cached = getCachedBrandId();
  if (cached) return cached;

  return resolveBrandFromConfig(null);
}

export function getAuthTokenStorageKey(brandOrHost?: string | null): string {
  const brandKey = getCanonicalBrandKey(brandOrHost);
  return `auth_token_${brandKey}`;
}

export function getAuthUserStorageKey(brandOrHost?: string | null): string {
  const brandKey = getCanonicalBrandKey(brandOrHost);
  return `auth_user_${brandKey}`;
}

export function getStoredAuth(brandOrHost?: string | null): {
  token: string | null;
  brandId: string | null;
  brand: string | null;
} {
  if (typeof window === "undefined") {
    return {
      token: null,
      brandId: null,
      brand: null,
    };
  }

  try {
    const brandKey = getCanonicalBrandKey(brandOrHost);
    const tokenKey = `auth_token_${brandKey}`;
    const userKey = `auth_user_${brandKey}`;
    const legacyKey = `travelapp_auth_${brandKey}`;

    // 1. Check dedicated token key
    const directToken = window.localStorage.getItem(tokenKey)?.trim() || null;

    // 2. Check brand-isolated user object
    const userJson =
      window.localStorage.getItem(userKey) ||
      window.localStorage.getItem(legacyKey);

    if (userJson) {
      const parsed = JSON.parse(userJson) as Record<string, unknown>;
      if (parsed && typeof parsed === "object") {
        const token =
          directToken ||
          (typeof parsed.token === "string" && parsed.token.trim()
            ? parsed.token.trim()
            : null);

        const brandId =
          typeof parsed.brandId === "string" && parsed.brandId.trim()
            ? parsed.brandId.trim()
            : brandKey;

        const brand =
          typeof parsed.brand === "string" && parsed.brand.trim()
            ? parsed.brand.trim()
            : brandKey;

        return { token, brandId, brand };
      }
    }

    if (directToken) {
      return {
        token: directToken,
        brandId: brandKey,
        brand: brandKey,
      };
    }

    return {
      token: null,
      brandId: null,
      brand: null,
    };
  } catch {
    return {
      token: null,
      brandId: null,
      brand: null,
    };
  }
}

export function getStoredToken(brandOrHost?: string | null): string | null {
  return getStoredAuth(brandOrHost).token;
}

export function persistAuthToken(
  token: string | null,
  brandOrHost?: string | null
): void {
  if (typeof window === "undefined") return;
  const brandKey = getCanonicalBrandKey(brandOrHost);
  const tokenKey = `auth_token_${brandKey}`;
  if (token && token.trim()) {
    window.localStorage.setItem(tokenKey, token.trim());
  } else {
    window.localStorage.removeItem(tokenKey);
  }
}

export function persistAuthUser(
  user: unknown | null,
  brandOrHost?: string | null
): void {
  if (typeof window === "undefined") return;
  const brandKey = getCanonicalBrandKey(
    brandOrHost ||
      (user && typeof user === "object" ? (user as Record<string, unknown>).brandId as string : null) ||
      (user && typeof user === "object" ? (user as Record<string, unknown>).brand as string : null)
  );

  const tokenKey = `auth_token_${brandKey}`;
  const userKey = `auth_user_${brandKey}`;
  const legacyKey = `travelapp_auth_${brandKey}`;

  if (user && typeof user === "object") {
    const userRecord = user as Record<string, unknown>;
    window.localStorage.setItem(userKey, JSON.stringify(user));
    window.localStorage.setItem(legacyKey, JSON.stringify(user));

    if (typeof userRecord.token === "string" && userRecord.token.trim()) {
      window.localStorage.setItem(tokenKey, userRecord.token.trim());
    }
  } else {
    window.localStorage.removeItem(userKey);
    window.localStorage.removeItem(tokenKey);
    window.localStorage.removeItem(legacyKey);
  }
}

/* -------------------------------------------------------------------------- */
/* Brand Resolution Helpers                                                   */
/* -------------------------------------------------------------------------- */

let cachedBrandId: string | null = null;
let cachedRemoteConfig: RemoteConfigResult | null = null;

export function getCachedBrandId(): string | null {
  return cachedBrandId;
}

export function setCachedBrandId(brandId: string | null): void {
  cachedBrandId = brandId;
}

export function getCachedRemoteConfig(): RemoteConfigResult | null {
  return cachedRemoteConfig;
}

export function setCachedRemoteConfig(config: RemoteConfigResult | null): void {
  cachedRemoteConfig = config;
  if (config) {
    cachedBrandId = resolveBrandFromConfig(config);
  }
}

export function resolveBrandFromConfig(
  remoteConfig?: RemoteConfigResult | null,
  fallbackHostname?: string | null
): string {
  // 1. Check website name / title in remoteConfig
  const website = remoteConfig?.website as Record<string, unknown> | undefined;
  const name = (
    (typeof website?.name === "string" && website.name) ||
    (typeof website?.fullName === "string" && website.fullName) ||
    (typeof website?.title === "string" && website.title) ||
    (typeof remoteConfig?.name === "string" && remoteConfig.name) ||
    ""
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (name.includes("gujju") || name.includes("wanderly")) {
    return "wanderly";
  }
  if (name.includes("tripgoasia") || name.includes("travelpro")) {
    return "travelpro";
  }
  if (
    name.includes("techno") ||
    name.includes("stagingb2b") ||
    name.includes("mytravel")
  ) {
    return "techno-b2b";
  }

  // 2. Check website.url or external ID if present
  const websiteUrl = (
    (typeof website?.url === "string" && website.url) ||
    ""
  ).toLowerCase();

  if (websiteUrl.includes("gujjutours") || websiteUrl.includes("wanderly")) {
    return "wanderly";
  }
  if (websiteUrl.includes("tripgoasia") || websiteUrl.includes("travelpro")) {
    return "travelpro";
  }
  if (
    websiteUrl.includes("technoheaven") ||
    websiteUrl.includes("stagingb2b")
  ) {
    return "techno-b2b";
  }

  if (website?.id === 2) {
    return "techno-b2b";
  }

  // 3. Check fallback hostname or current resolved hostname
  const host = (
    resolveCurrentHostname(fallbackHostname) ||
    ""
  ).toLowerCase();

  if (host.includes("gujju") || host.includes("wanderly")) {
    return "wanderly";
  }
  if (host.includes("tripgoasia") || host.includes("travelpro")) {
    return "travelpro";
  }
  if (
    host.includes("techno") ||
    host.includes("stagingb2b") ||
    host.includes("mytravel")
  ) {
    return "techno-b2b";
  }

  // 4. Default fallback: GujjuTours (wanderly)
  return "wanderly";
}


/* -------------------------------------------------------------------------- */
/* Generic API request helper                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Generic application API request helper.
 *
 * Used for:
 *
 * /api/auth/login
 * /api/auth/register
 * /api/auth/logout
 * /api/auth/me
 * /api/trips
 * /api/payments/checkout
 * /api/contact
 *
 * Remote website configuration is handled separately through:
 *
 * /api/proxy/brand-config
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    headers,
    body,
    skipJsonContentType,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  /*
   * Resolve active brand for this request.
   */
  const activeBrand =
    requestHeaders.get("X-Brand") ||
    getCachedBrandId() ||
    resolveBrandFromConfig(null);

  if (!requestHeaders.has("X-Brand") && activeBrand) {
    requestHeaders.set("X-Brand", activeBrand);
  }

  /*
   * Exclude public authentication endpoints from
   * receiving Authorization automatically.
   */
  const isAuthPublicEndpoint =
    path.startsWith("/api/auth/login") ||
    path.startsWith("/api/auth/register");

  // Read stored auth strictly for the active brand!
  const storedAuth = getStoredAuth(activeBrand);

  if (
    !isAuthPublicEndpoint &&
    !requestHeaders.has("Authorization")
  ) {
    if (storedAuth.token) {
      requestHeaders.set(
        "Authorization",
        `Bearer ${storedAuth.token}`
      );
    }
  }

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  if (
    body !== undefined &&
    body !== null &&
    !isFormData &&
    !skipJsonContentType &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  const response = await fetch(
    getApiUrl(path),
    {
      ...requestOptions,
      headers: requestHeaders,
      credentials: "include",
      body,
    }
  );

  const data =
    await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(
        data,
        `API request failed with status ${response.status}.`
      ),
      response.status,
      data
    );
  }

  return data as T;
}

/* -------------------------------------------------------------------------- */
/* Brand / Website configuration                                              */
/* -------------------------------------------------------------------------- */

type BrandConfigResponse = {
  isSuccess: boolean;
  result: RemoteConfigResult | null;
  error: string | null;
};

/**
 * Fetch website configuration through the local
 * Next.js proxy.
 *
 * Browser:
 *
 * /api/proxy/brand-config?hostname=...&lang=en
 *
 * Proxy:
 *
 * /api/proxy/brand-config
 *        ↓
 * API_BASE_URL
 *        +
 * /api/core/v1/config/
 *        +
 * HOSTNAME
 *
 * Example:
 *
 * API_BASE_URL=https://stagingapi.technoheaven.com
 * HOSTNAME=stagingb2b.technoheaven.com
 *
 * becomes:
 *
 * https://stagingapi.technoheaven.com/api/core/v1/config/stagingb2b.technoheaven.com?lang=en
 */
export function getCurrentHostname(overrideHost?: string | null): string {
  return resolveCurrentHostname(overrideHost);
}

export async function fetchBrandConfig(
  lang = "en",
  overrideHost?: string | null
): Promise<BrandConfigResponse> {
  const controller =
    typeof AbortController !== "undefined"
      ? new AbortController()
      : null;

  const timeoutId = controller
    ? setTimeout(
      () => controller.abort(),
      12000
    )
    : null;

  try {
    const hostname =
      getCurrentHostname(overrideHost);

    // Clear any legacy cookie to avoid sticky brand pollution
    if (typeof document !== "undefined") {
      try {
        document.cookie = "active_brand_hostname=; path=/; max-age=0; SameSite=Lax";
      } catch {
        // ignore
      }
    }

    /*
     * IMPORTANT:
     *
     * Do NOT call external API directly from the browser.
     * Always call the local Next.js proxy.
     */
    const params =
      new URLSearchParams();

    params.set(
      "hostname",
      hostname
    );

    params.set(
      "lang",
      lang
    );

    const url =
      `/api/proxy/brand-config?${params.toString()}`;

    console.log(
      "[fetchBrandConfig] Current hostname:",
      hostname
    );

    console.log(
      "[fetchBrandConfig] Proxy request:",
      url
    );

    /*
     * The proxy route is same-origin with the
     * Next.js application.
     */
    const response =
      await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          credentials: "include",
          signal: controller?.signal,
        }
      );

    const data =
      await parseResponseBody(response);

    if (!response.ok) {
      return {
        isSuccess: false,
        result: null,
        error: getErrorMessage(
          data,
          `Configuration proxy request failed with status ${response.status}.`
        ),
      };
    }

    if (
      !data ||
      typeof data !== "object"
    ) {
      return {
        isSuccess: false,
        result: null,
        error:
          "Invalid configuration response.",
      };
    }

    const record =
      data as Record<string, unknown>;

    if (
      record.isSuccess === false ||
      !record.result
    ) {
      return {
        isSuccess: false,
        result: null,
        error:
          typeof record.error === "string"
            ? record.error
            : "Website configuration could not be loaded.",
      };
    }

    const configResult =
      record.result as RemoteConfigResult;

    const resolvedBrand =
      resolveBrandFromConfig(configResult, hostname);
    setCachedBrandId(resolvedBrand);

    return {
      isSuccess: true,
      result: configResult,
      error:
        typeof record.error === "string"
          ? record.error
          : null,
    };
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (
        error.name === "AbortError" ||
        error.message
          .toLowerCase()
          .includes("abort") ||
        error.message
          .toLowerCase()
          .includes("timeout")
      );

    if (isTimeout) {
      return {
        isSuccess: false,
        result: null,
        error:
          "Configuration request timed out.",
      };
    }

    if (error instanceof ApiError) {
      return {
        isSuccess: false,
        result: null,
        error: error.message,
      };
    }

    return {
      isSuccess: false,
      result: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load website configuration.",
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export async function login<T = unknown>(
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function register<T = unknown>(
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function logout<T = unknown>(): Promise<T> {
  return apiFetch<T>(
    "/api/auth/logout",
    {
      method: "POST",
    }
  );
}

export async function getCurrentUser<T = unknown>(): Promise<T> {
  return apiFetch<T>(
    "/api/auth/me",
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Trips                                                                      */
/* -------------------------------------------------------------------------- */

export async function getTrips<T = unknown>(): Promise<T> {
  return apiFetch<T>(
    "/api/trips",
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

export async function getTrip<T = unknown>(
  tripId: string | number
): Promise<T> {
  return apiFetch<T>(
    `/api/trips/${tripId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

export async function createTrip<T = unknown>(
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    "/api/trips",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateTrip<T = unknown>(
  tripId: string | number,
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    `/api/trips/${tripId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteTrip<T = unknown>(
  tripId: string | number
): Promise<T> {
  return apiFetch<T>(
    `/api/trips/${tripId}`,
    {
      method: "DELETE",
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Payments                                                                   */
/* -------------------------------------------------------------------------- */

export async function createCheckout<T = unknown>(
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    "/api/payments/checkout",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export async function sendContactMessage<T = unknown>(
  payload: unknown
): Promise<T> {
  return apiFetch<T>(
    "/api/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

