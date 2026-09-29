import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

/**
 * Mobile adapted useRequireAuth hook
 * Gated screens redirect to /login if user is unauthenticated
 */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login" as never);
    }
  }, [loading, user, router]);

  return !loading && !!user;
}
