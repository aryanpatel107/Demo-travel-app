import AsyncStorage from "@react-native-async-storage/async-storage";
import { resolveBrandKey } from "../config";

/**
 * Returns the brand-isolated token storage key: auth_token_${brandKey}
 */
export function getAuthTokenKey(brandKeyOrHost?: string | null): string {
  const brand = resolveBrandKey(brandKeyOrHost);
  return `auth_token_${brand}`;
}

/**
 * Returns the brand-isolated user storage key: auth_user_${brandKey}
 */
export function getAuthUserKey(brandKeyOrHost?: string | null): string {
  const brand = resolveBrandKey(brandKeyOrHost);
  return `auth_user_${brand}`;
}

/**
 * Retrieve stored token for the given brand
 */
export async function getStoredToken(brandKeyOrHost?: string | null): Promise<string | null> {
  try {
    const key = getAuthTokenKey(brandKeyOrHost);
    const token = await AsyncStorage.getItem(key);
    return token ? token.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Persist or clear token for the given brand
 */
export async function persistAuthToken(token: string | null, brandKeyOrHost?: string | null): Promise<void> {
  try {
    const key = getAuthTokenKey(brandKeyOrHost);
    if (token && token.trim()) {
      await AsyncStorage.setItem(key, token.trim());
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch {}
}

/**
 * Retrieve stored user object for the given brand
 */
export async function getStoredUser<T = unknown>(brandKeyOrHost?: string | null): Promise<T | null> {
  try {
    const key = getAuthUserKey(brandKeyOrHost);
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Persist or clear user object for the given brand
 */
export async function persistAuthUser<T = unknown>(user: T | null, brandKeyOrHost?: string | null): Promise<void> {
  try {
    const key = getAuthUserKey(brandKeyOrHost);
    if (user && typeof user === "object") {
      await AsyncStorage.setItem(key, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch {}
}

/**
 * Get both token and user for current or specified brand
 */
export async function getStoredAuth<T = unknown>(brandKeyOrHost?: string | null): Promise<{ token: string | null; user: T | null }> {
  const [token, user] = await Promise.all([
    getStoredToken(brandKeyOrHost),
    getStoredUser<T>(brandKeyOrHost),
  ]);
  return { token, user };
}

/**
 * Clear authentication session for a brand
 */
export async function clearBrandAuth(brandKeyOrHost?: string | null): Promise<void> {
  const tokenKey = getAuthTokenKey(brandKeyOrHost);
  const userKey = getAuthUserKey(brandKeyOrHost);
  try {
    await Promise.all([AsyncStorage.removeItem(tokenKey), AsyncStorage.removeItem(userKey)]);
  } catch {}
}
