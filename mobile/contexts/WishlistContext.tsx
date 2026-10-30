import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";
import { useBrandConfig } from "./BrandConfigContext";
import { useToast } from "../components/ui/Toast";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../lib/apiClient";
import type { WishlistItem } from "../types/destination";

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

const PENDING_WISHLIST_KEY = "pending_wishlist_destination";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { brandKey } = useBrandConfig();
  const { showToast } = useToast();
  const router = useRouter();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch wishlist when user logs in or brand changes
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const items = await getWishlist(brandKey);
      setWishlist(items);
      setWishlistIds(new Set(items.map((i) => i.destinationId)));
    } catch (err) {
      console.error("[Mobile Wishlist] Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, brandKey]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Handle pending wishlist save after login
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;
    (async () => {
      try {
        const pendingId = await AsyncStorage.getItem(
          `${PENDING_WISHLIST_KEY}_${brandKey}`
        );
        if (pendingId) {
          await AsyncStorage.removeItem(`${PENDING_WISHLIST_KEY}_${brandKey}`);
          await addToWishlist(pendingId, brandKey);
          if (isMounted) {
            showToast("Saved to your wishlist!", "success");
            await refreshWishlist();
          }
        }
      } catch (err) {
        console.error("[Mobile Wishlist] Failed auto-save pending item:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, brandKey, showToast, refreshWishlist]);

  const isWishlisted = useCallback(
    (destinationId: string) => {
      return wishlistIds.has(destinationId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (destinationId: string): Promise<boolean> => {
      if (!isAuthenticated || !user) {
        try {
          await AsyncStorage.setItem(
            `${PENDING_WISHLIST_KEY}_${brandKey}`,
            destinationId
          );
        } catch (storageErr) {
          console.error("Failed to store pending destination:", storageErr);
        }
        router.push("/login");
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
        setWishlist((prev) =>
          prev.filter((item) => item.destinationId !== destinationId)
        );
      }

      try {
        if (wasWishlisted) {
          await removeFromWishlist(destinationId, brandKey);
          showToast("Removed from wishlist", "info");
        } else {
          const newItem = await addToWishlist(destinationId, brandKey);
          setWishlist((prev) => [
            newItem,
            ...prev.filter((i) => i.destinationId !== destinationId),
          ]);
          showToast("Added to wishlist", "success");
        }
        return !wasWishlisted;
      } catch (err: unknown) {
        // Rollback optimistic update
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (wasWishlisted) {
            next.add(destinationId);
          } else {
            next.delete(destinationId);
          }
          return next;
        });
        showToast("Failed to update wishlist", "error");
        await refreshWishlist();
        return wasWishlisted;
      }
    },
    [isAuthenticated, user, wishlistIds, brandKey, router, showToast, refreshWishlist]
  );

  const value = {
    wishlist,
    wishlistIds,
    wishlistCount: wishlist.length,
    isWishlisted,
    toggleWishlist,
    loading,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
