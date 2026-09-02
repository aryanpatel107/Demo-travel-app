"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { config } from "@/config";
import { apiFetch } from "@/lib/apiClient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  brandId: string;
  brand: string;
  role?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (nextUser: AuthUser) => void;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const getBrandStorageKey = () => {
  const brandKey = config.name.toLowerCase().replace(/\s+/g, "");
  return `travelapp_auth_${brandKey}`;
};

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(getBrandStorageKey());
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<AuthUser>;
    if (!parsed?.id || !parsed?.email || !parsed?.name) {
      window.localStorage.removeItem(getBrandStorageKey());
      return null;
    }

    return parsed as AuthUser;
  } catch {
    window.localStorage.removeItem(getBrandStorageKey());
    return null;
  }
}

function persistUser(nextUser: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  const key = getBrandStorageKey();

  if (!nextUser) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(nextUser));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    persistUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiFetch<AuthUser>("/api/auth/me");
      setUser(response);
      persistUser(response);
      return response;
    } catch {
      setUser(null);
      persistUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch<{ message: string }>("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore logout errors and clear the local session state.
    }

    setUser(null);
    persistUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const storedUser = readStoredUser();

      if (storedUser && isMounted) {
        setUser(storedUser);
      }

      try {
        const response = await apiFetch<AuthUser>("/api/auth/me");
        if (isMounted) {
          setUser(response);
          persistUser(response);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          persistUser(null);
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
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, refreshUser, logout }),
    [user, loading, login, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
