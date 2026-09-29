/**
 * Application API Client for Mobile
 *
 * Aligned with ASP.NET Core API (TravelApp.Api) and Next.js lib/apiClient.ts.
 *
 * Automatically attaches:
 *  - X-Brand: <brandKey> (wanderly | travelpro | mytravel)
 *  - Authorization: Bearer <token> (from brand-isolated AsyncStorage)
 */

import {
  getApiBaseUrl,
  getAppApiBaseUrl,
  resolveBrandKey,
  getActiveHostname,
  type BrandKey,
} from "../config";
import { getStoredToken } from "./authStorage";

// Re-export getApiBaseUrl and getAppApiBaseUrl so callers can import from apiClient
export { getApiBaseUrl, getAppApiBaseUrl };

/* -------------------------------------------------------------------------- */
/* Types & Error                                                              */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status = 500, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  brandId?: string;
  brand?: string;
  isActive?: boolean;
  role?: string | null;
  token?: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  brandId?: string;
  brand?: string;
  isActive?: boolean;
  role?: string | null;
  token: string;
}

export interface TripItem {
  id: string;
  destinationId?: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes?: string | null;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
}

export interface CreateTripPayload {
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes?: string;
}

export interface CheckoutPayload {
  tripId: string;
  amount: number;
  currency?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  paymentId: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Helper: Parse error message                                                */
/* -------------------------------------------------------------------------- */

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;

  if (typeof record.error === "string" && record.error.trim()) return record.error;
  if (typeof record.message === "string" && record.message.trim()) return record.message;
  if (typeof record.title === "string" && record.title.trim()) return record.title;

  if (record.errors && typeof record.errors === "object") {
    const errors = record.errors as Record<string, unknown>;
    for (const val of Object.values(errors)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
        return val[0];
      }
      if (typeof val === "string") return val;
    }
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Core Fetch Dispatcher                                                      */
/* -------------------------------------------------------------------------- */

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  brandKeyOverride?: BrandKey
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${normalizedPath}`;

  const brandKey = brandKeyOverride || resolveBrandKey(getActiveHostname());

  const headers = new Headers(options.headers);

  // Automatically attach X-Brand header
  if (!headers.has("X-Brand")) {
    headers.set("X-Brand", brandKey);
  }

  // Automatically attach Authorization: Bearer <token> for protected endpoints
  const isAuthPublic =
    path.startsWith("/api/auth/login") ||
    path.startsWith("/api/auth/register");

  if (!isAuthPublic && !headers.has("Authorization")) {
    const token = await getStoredToken(brandKey);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Default to application/json if sending request body
  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
    });
  } catch (netErr: unknown) {
    const msg =
      netErr instanceof Error
        ? netErr.message
        : "Network request failed";
    throw new ApiError(
      `Unable to connect to server at ${baseUrl}. Please ensure the API is running and reachable: ${msg}`,
      0,
      netErr
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  let data: unknown = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data
    );
  }

  return data as T;
}

/* -------------------------------------------------------------------------- */
/* Authentication Endpoints                                                   */
/* -------------------------------------------------------------------------- */

export async function login<T = AuthResponse>(
  payload: { email: string; password: string },
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const loginApi = login;

export async function register<T = AuthResponse>(
  payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  },
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const registerApi = register;

export async function logout<T = unknown>(brandKey?: BrandKey): Promise<T> {
  return apiFetch<T>("/api/auth/logout", { method: "POST" }, brandKey);
}
export const logoutApi = logout;

export async function getCurrentUser<T = UserProfile>(brandKey?: BrandKey): Promise<T> {
  return apiFetch<T>("/api/auth/me", { method: "GET" }, brandKey);
}
export const getCurrentUserApi = getCurrentUser;

/* -------------------------------------------------------------------------- */
/* Trips Endpoints                                                            */
/* -------------------------------------------------------------------------- */

export async function getTrips<T = TripItem[]>(brandKey?: BrandKey): Promise<T> {
  return apiFetch<T>("/api/trips", { method: "GET" }, brandKey);
}
export const getTripsApi = getTrips;

export async function getTrip<T = TripItem>(
  tripId: string | number,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(`/api/trips/${tripId}`, { method: "GET" }, brandKey);
}
export const getTripApi = getTrip;

export async function createTrip<T = { id: string }>(
  payload: CreateTripPayload | unknown,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    "/api/trips",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const createTripApi = createTrip;

export async function updateTrip<T = TripItem>(
  tripId: string | number,
  payload: unknown,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    `/api/trips/${tripId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const updateTripApi = updateTrip;

export async function deleteTrip<T = unknown>(
  tripId: string | number,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    `/api/trips/${tripId}`,
    {
      method: "DELETE",
    },
    brandKey
  );
}
export const deleteTripApi = deleteTrip;

/* -------------------------------------------------------------------------- */
/* Payments Endpoints                                                         */
/* -------------------------------------------------------------------------- */

export async function createCheckout<T = CheckoutResponse>(
  payload: CheckoutPayload | unknown,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    "/api/payments/checkout",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const createCheckoutApi = createCheckout;
export const checkoutPaymentApi = createCheckout;

/* -------------------------------------------------------------------------- */
/* Contact Endpoints                                                          */
/* -------------------------------------------------------------------------- */

export async function sendContactMessage<T = unknown>(
  payload: ContactMessagePayload | unknown,
  brandKey?: BrandKey
): Promise<T> {
  return apiFetch<T>(
    "/api/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    brandKey
  );
}
export const sendContactMessageApi = sendContactMessage;
