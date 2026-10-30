import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useBrandConfig } from "@/contexts/BrandConfigContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import DestinationCard from "@/components/DestinationCard";
import { BrandEmptyState } from "@/components/brand/BrandState";
import { theme } from "@/constants/theme";

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { branding, primaryColor } = useBrandConfig();
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, refreshWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);

  const primary = primaryColor || theme.colors.teal;
  const brandName = branding.name || "Travel";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshWishlist();
    setRefreshing(false);
  }, [refreshWishlist]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={[styles.iconCircle, { backgroundColor: `${primary}15` }]}>
          <FontAwesome5 name="heart" size={36} color={primary} />
        </View>
        <Text style={styles.notLoggedInTitle}>Save your dream destinations</Text>
        <Text style={styles.notLoggedInSubtitle}>
          Sign in to access your personal wishlist and plan your next journey with {brandName}.
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: primary }]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryButtonText}>Sign In / Create Account</Text>
        </Pressable>
        <Pressable
          style={styles.textButton}
          onPress={() => router.push("/(tabs)/destinations")}
        >
          <Text style={[styles.textButtonLabel, { color: primary }]}>
            Browse Destinations
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: primary }]}>SAVED PLACES</Text>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.subtitle}>
          {wishlist.length === 1
            ? "1 destination saved to your journey bucket list"
            : `${wishlist.length} destinations saved to your journey bucket list`}
        </Text>
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={styles.loadingText}>Loading your wishlist...</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id || item.destinationId}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[primary]}
              tintColor={primary}
            />
          }
          ListEmptyComponent={
            <BrandEmptyState
              title="Nothing saved yet"
              description="Your wishlist is empty. Tap the heart icon on any destination to save it here for later."
              actionLabel="Explore Destinations"
              onAction={() => router.push("/(tabs)/destinations")}
            />
          }
          renderItem={({ item }) =>
            item.destination ? (
              <DestinationCard
                destination={item.destination}
                onPress={() =>
                  router.push(`/destinations/${item.destination.id}` as any)
                }
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  notLoggedInTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  notLoggedInSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    maxWidth: 280,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  textButton: {
    marginTop: 14,
    padding: 8,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
