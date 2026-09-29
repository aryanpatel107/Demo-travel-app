"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiError,
  apiFetch,
  getCachedBrandId,
  getCachedRemoteConfig,
  getCanonicalBrandKey,
  resolveBrandFromConfig,
} from "@/lib/apiClient";
import { useAppConfig } from "@/components/RemoteConfigProvider";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  brandId: string;
  brand: string;
  role?: string | null;
  token?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  mounted: boolean;
  login: (nextUser: AuthUser) => void;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

function isValidAuthUser(
  u: Partial<AuthUser> | null | undefined
): u is AuthUser {
  return (
    !!u?.id &&
    !!u?.email &&
    !!u?.name &&
    (!!u?.brand || !!u?.brandId)
  );
}

function readStoredBrandUser(brandKey: string): AuthUser | null {
  if (typeof window === "undefined" || !brandKey) {
    return null;
  }

  try {
    const canonicalKey = getCanonicalBrandKey(brandKey);
    const userKey = `auth_user_${canonicalKey}`;
    const legacyKey = `travelapp_auth_${canonicalKey}`;
    const tokenKey = `auth_token_${canonicalKey}`;

    const stored =
      window.localStorage.getItem(userKey) ||
      window.localStorage.getItem(legacyKey);

    const directToken = window.localStorage.getItem(tokenKey)?.trim() || null;

    if (!stored && !directToken) {
      return null;
    }

    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AuthUser>;
      if (isValidAuthUser(parsed)) {
        return {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          brandId: parsed.brandId || canonicalKey,
          brand: parsed.brand || canonicalKey,
          role: parsed.role || null,
          token: directToken || parsed.token || null,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

function persistBrandUser(
  nextUser: AuthUser | null,
  brandKey: string
) {
  if (typeof window === "undefined" || !brandKey) {
    return;
  }

  const canonicalKey = getCanonicalBrandKey(brandKey);
  const userKey = `auth_user_${canonicalKey}`;
  const tokenKey = `auth_token_${canonicalKey}`;
  const legacyKey = `travelapp_auth_${canonicalKey}`;

  if (!nextUser) {
    window.localStorage.removeItem(userKey);
    window.localStorage.removeItem(tokenKey);
    window.localStorage.removeItem(legacyKey);
    return;
  }

  const payload = JSON.stringify(nextUser);
  window.localStorage.setItem(userKey, payload);
  window.localStorage.setItem(legacyKey, payload);

  if (nextUser.token?.trim()) {
    window.localStorage.setItem(tokenKey, nextUser.token.trim());
  } else {
    window.localStorage.removeItem(tokenKey);
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let appConfigBrand: string | null = null;
  try {
    const config = useAppConfig();
    appConfigBrand = config.brandKey;
  } catch {
    // Outside RemoteConfigProvider fallback
  }

  const activeBrand = useMemo(() => {
    return getCanonicalBrandKey(
      appConfigBrand ||
      getCachedBrandId() ||
      resolveBrandFromConfig(getCachedRemoteConfig())
    );
  }, [appConfigBrand]);

  // Hydration-safe initial state: null on first paint matching SSR
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback(
    (nextUser: AuthUser) => {
      if (!isValidAuthUser(nextUser)) {
        setUser(null);
        persistBrandUser(null, activeBrand);
        setLoading(false);
        return;
      }

      const targetBrand = getCanonicalBrandKey(
        nextUser.brandId || nextUser.brand || activeBrand
      );

      persistBrandUser(nextUser, targetBrand);

      if (targetBrand === activeBrand) {
        setUser(nextUser);
      }
      setLoading(false);
    },
    [activeBrand]
  );

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiFetch<AuthUser>("/api/auth/me", {
        headers: {
          "X-Brand": activeBrand,
        },
      });

      if (!isValidAuthUser(response)) {
        setUser(null);
        persistBrandUser(null, activeBrand);
        return null;
      }

      const resolvedUser: AuthUser = {
        ...response,
        brandId: response.brandId || activeBrand,
        brand: response.brand || activeBrand,
        token:
          response.token ||
          user?.token ||
          readStoredBrandUser(activeBrand)?.token ||
          null,
      };

      setUser(resolvedUser);
      persistBrandUser(resolvedUser, activeBrand);

      return resolvedUser;
    } catch (err) {
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.status === 403)
      ) {
        setUser(null);
        persistBrandUser(null, activeBrand);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeBrand, user]);

  const logout = useCallback(async () => {
    try {
      await apiFetch<{ message: string }>("/api/auth/logout", {
        method: "POST",
        headers: {
          "X-Brand": activeBrand,
        },
      });
    } catch {
      // Ignore logout errors
    }

    setUser(null);
    persistBrandUser(null, activeBrand);
    setLoading(false);
  }, [activeBrand]);

  useEffect(() => {
    let isMounted = true;
    setMounted(true);

    const loadUser = async () => {
      // 1. Read brand-specific stored user
      const storedUser = readStoredBrandUser(activeBrand);

      if (storedUser && isMounted) {
        setUser(storedUser);
      } else if (isMounted) {
        setUser(null);
      }

      // If no stored user or token for this brand, don't bother fetching /me
      if (!storedUser?.token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await apiFetch<AuthUser>("/api/auth/me", {
          headers: {
            "X-Brand": activeBrand,
          },
        });

        if (!isMounted) return;

        if (isValidAuthUser(response)) {
          const resolvedUser: AuthUser = {
            ...response,
            brandId: response.brandId || activeBrand,
            brand: response.brand || activeBrand,
            token: response.token || storedUser.token,
          };
          setUser(resolvedUser);
          persistBrandUser(resolvedUser, activeBrand);
        } else {
          setUser(null);
          persistBrandUser(null, activeBrand);
        }
      } catch (err) {
        if (isMounted) {
          if (
            err instanceof ApiError &&
            (err.status === 401 || err.status === 403)
          ) {
            setUser(null);
            persistBrandUser(null, activeBrand);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [activeBrand]);

  const value = useMemo(
    () => ({
      user,
      loading,
      mounted,
      login,
      refreshUser,
      logout,
    }),
    [user, loading, mounted, login, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}