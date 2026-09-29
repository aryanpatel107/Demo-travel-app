import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useBrandConfig } from "./BrandConfigContext";
import {
  logoutApi,
  getCurrentUserApi,
} from "../lib/apiClient";
import {
  getStoredAuth,
  persistAuthToken,
  persistAuthUser,
  clearBrandAuth,
} from "../lib/authStorage";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  brandId?: string;
  brand?: string;
  role?: string | null;
  token?: string | null;
  isActive?: boolean;
};

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (nextUser: AuthUser | null) => Promise<void> | void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { brandKey } = useBrandConfig();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session on app start / brand change via GET /api/auth/me (sends X-Brand)
  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const stored = await getStoredAuth<AuthUser>(brandKey);
      if (stored.token) {
        setToken(stored.token);
        if (stored.user) {
          setUser(stored.user);
        }

        // Verify token with backend /api/auth/me (sends X-Brand header)
        try {
          const freshUser = await getCurrentUserApi(brandKey);
          if (freshUser) {
            const resolvedUser: AuthUser = {
              ...freshUser,
              brandId: freshUser.brandId || brandKey,
              brand: freshUser.brand || brandKey,
              token: freshUser.token || stored.token || null,
            };
            setUser(resolvedUser);
            await persistAuthUser(resolvedUser, brandKey);
            return resolvedUser;
          }
        } catch (verifyErr: any) {
          // If token expired or unauthorized (401), clean up
          if (verifyErr?.status === 401 || verifyErr?.status === 403) {
            await clearBrandAuth(brandKey);
            setUser(null);
            setToken(null);
          }
        }
      } else {
        setUser(null);
        setToken(null);
      }
      return null;
    } catch {
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [brandKey]);

  const refreshAuth = useCallback(async () => {
    await refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      await refreshUser();
      if (isMounted) {
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  // login() receives the already-authenticated user object and stores it in brand-scoped storage
  const login = useCallback(
    async (nextUser: AuthUser | null) => {
      if (!nextUser) {
        setUser(null);
        setToken(null);
        await clearBrandAuth(brandKey);
        setLoading(false);
        return;
      }

      const targetBrand = nextUser.brandId || nextUser.brand || brandKey;

      const userWithBrand: AuthUser = {
        ...nextUser,
        brandId: targetBrand,
        brand: targetBrand,
      };

      if (nextUser.token) {
        await persistAuthToken(nextUser.token, targetBrand);
        setToken(nextUser.token);
      }
      await persistAuthUser(userWithBrand, targetBrand);
      setUser(userWithBrand);
      setLoading(false);
    },
    [brandKey]
  );

  // logout() calls POST /api/auth/logout (sends X-Brand) and clears local storage
  const logout = useCallback(async () => {
    try {
      await logoutApi(brandKey);
    } catch {
      // Ignore network failure during logout
    } finally {
      await clearBrandAuth(brandKey);
      setUser(null);
      setToken(null);
    }
  }, [brandKey]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      logout,
      refreshAuth,
      refreshUser,
    }),
    [user, token, loading, login, logout, refreshAuth, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
