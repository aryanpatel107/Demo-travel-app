"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Guards a client-rendered page so it only becomes usable once the user
 * is confirmed to be authenticated.
 *
 * Why this exists: AuthProvider optimistically restores a cached user
 * from localStorage before the backend has confirmed the session is
 * still valid. Reading `!!user` directly on a protected page can
 * therefore briefly be true even for a visitor who isn't really logged
 * in, which used to cause a flash of a "Session expired" error before
 * the redirect kicked in. This hook waits for the auth check to fully
 * settle and only then decides whether to allow the page to render.
 *
 * Usage:
 *   const isReady = useRequireAuth();
 *   if (!isReady) return <LoadingOrNothing />;
 *   // safe to render protected content and call authenticated APIs here
 *
 * "Not logged in" is treated as a normal access requirement, not an
 * error — this hook redirects silently to /login with no error message.
 * If a genuinely authenticated session later fails mid-use (e.g. token
 * expired between page loads), that should be handled and messaged by
 * the page itself, since it's a different, real error condition.
 */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return !loading && !!user;
}