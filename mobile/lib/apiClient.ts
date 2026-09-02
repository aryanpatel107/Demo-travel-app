const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before using the trip services.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (!errorText) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    try {
      const errorBody = JSON.parse(errorText) as { error?: string };
      throw new Error(errorBody.error ?? `Request failed with status ${response.status}`);
    } catch {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  return parseJsonResponse<T>(response);
}
