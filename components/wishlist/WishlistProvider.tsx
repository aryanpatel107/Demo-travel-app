"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/apiClient";

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistIds: Set<string>;
  wishlistCount: number;
  isWishlisted: (destinationId: string) => boolean;
  toggleWishlist: (destinationId: string) => Promise<boolean>;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user logs in or brand changes
  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const items = await getWishlist();
      setWishlist(items);
      setWishlistIds(new Set(items.map((i) => i.destinationId)));
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Handle pending wishlist save after login
  useEffect(() => {
    if (!user) return;

    const pendingId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("pending_wishlist_destination")
        : null;

    if (pendingId) {
      window.localStorage.removeItem("pending_wishlist_destination");
      addToWishlist(pendingId)
        .then(() => {
          showToast("Saved to your wishlist!", "success");
          refreshWishlist();
        })
        .catch((err) => {
          console.error("Failed to auto-save wishlist item:", err);
        });
    }
  }, [user, showToast, refreshWishlist]);

  const isWishlisted = useCallback(
    (destinationId: string) => {
      return wishlistIds.has(destinationId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (destinationId: string): Promise<boolean> => {
      if (!user) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("pending_wishlist_destination", destinationId);
        }
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/login?returnUrl=${returnUrl}&saveWishlist=${encodeURIComponent(destinationId)}`);
        return false;
      }

      const wasWishlisted = wishlistIds.has(destinationId);

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) {
          next.delete(destinationId);
        } else {
          next.add(destinationId);
        }
        return next;
      });

      if (wasWishlisted) {
        setWishlist((prev) => prev.filter((item) => item.destinationId !== destinationId));
      }

      try {
        if (wasWishlisted) {
          await removeFromWishlist(destinationId);
          showToast("Removed from wishlist", "info");
        } else {
          const newItem = await addToWishlist(destinationId);
          setWishlist((prev) => [newItem, ...prev.filter((i) => i.destinationId !== destinationId)]);
          showToast("Added to wishlist", "success");
        }
        return !wasWishlisted;
      } catch (err: unknown) {
        // Revert optimistic update on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (wasWishlisted) {
            next.add(destinationId);
          } else {
            next.delete(destinationId);
          }
          return next;
        });
        await refreshWishlist();
        const msg = err instanceof Error ? err.message : "Failed to update wishlist";
        showToast(msg, "error");
        return wasWishlisted;
      }
    },
    [user, wishlistIds, showToast, router, refreshWishlist]
  );

  const value = useMemo(
    () => ({
      wishlist,
      wishlistIds,
      wishlistCount: wishlistIds.size,
      isWishlisted,
      toggleWishlist,
      loading,
      refreshWishlist,
    }),
    [wishlist, wishlistIds, isWishlisted, toggleWishlist, loading, refreshWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
