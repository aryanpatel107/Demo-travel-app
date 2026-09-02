import { config } from "@/config";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5019";
const BRAND_ID = config.name.toLowerCase().replace(/\s+/g, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("The server returned an empty or invalid JSON response.");
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers ?? {});

  if (!(options?.body instanceof FormData) && !headers.has("Content-Type") && options?.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  headers.set("X-Brand", BRAND_ID);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();

      let message = `Request failed with status ${res.status}`;

      if (errorText) {
        try {
          const errorBody = JSON.parse(errorText) as { error?: string; message?: string };
          message = errorBody.error ?? errorBody.message ?? message;
        } catch {
          message = errorText;
        }
      }

      throw new ApiError(res.status, message);
    }

    return parseJsonResponse<T>(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(503, "Unable to connect to the travel service.");
    }

    throw new ApiError(500, "Trips are temporarily unavailable.");
  }
}

