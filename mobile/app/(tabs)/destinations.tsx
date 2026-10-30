import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBrandConfig } from "@/contexts/BrandConfigContext";
import { getDestinations } from "@/lib/apiClient";
import type { Destination } from "@/types/destination";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import { BrandEmptyState } from "@/components/brand/BrandState";
import { theme } from "@/constants/theme";

const categories = ["ALL", "ADVENTURE", "BEACH", "CULTURE", "NATURE"] as const;

export default function DestinationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; to?: string; search?: string }>();
  const { branding, primaryColor, brandKey } = useBrandConfig();

  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(
    params.q || params.to || params.search || ""
  );
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("ALL");

  const loadDestinations = useCallback(async () => {
    try {
      setError(null);
      const data = await getDestinations(undefined, brandKey);
      setDestinationsList(data);
    } catch (err: unknown) {
      console.error("[Mobile Destinations] Failed to load destinations:", err);
      setError("Failed to load destinations. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [brandKey]);

  useEffect(() => {
    setLoading(true);
    loadDestinations();
  }, [loadDestinations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDestinations();
  }, [loadDestinations]);

  useEffect(() => {
    const qParam = params.q || params.to || params.search;
    if (qParam !== undefined) {
      setSearchQuery(qParam);
    }
  }, [params.q, params.to, params.search]);

  const primary = primaryColor || theme.colors.teal;
  const brandName = branding.name || "Travel";

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cat = activeCategory.toLowerCase();

    return destinationsList.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        cat === "all" || d.tags.some((t) => t.toLowerCase() === cat);

      return matchesQuery && matchesCat;
    });
  }, [destinationsList, searchQuery, activeCategory]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: primary }]}>DEPARTURES</Text>
        <View>
          <Text style={styles.title}>Places worth exploring</Text>
        </View>
        <Text style={styles.subtitle}>
          Discover destinations that turn a simple trip into a story with {brandName}.
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search destination, country, tag..."
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  isSelected && { backgroundColor: primary, borderColor: primary },
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && { color: "#ffffff", fontWeight: "700" },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Destinations List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={styles.loadingText}>Loading destinations...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primary]} tintColor={primary} />
          }
          ListEmptyComponent={
            <BrandEmptyState
              title={error ? "Unable to load" : "No destinations found"}
              description={error || `No destinations match "${searchQuery}". Try selecting another category or clearing your search.`}
              actionLabel={error ? "Try Again" : "Reset filters"}
              onAction={() => {
                if (error) {
                  setLoading(true);
                  loadDestinations();
                } else {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }
              }}
            />
          }
          renderItem={({ item }) => (
            <DestinationCard
              destination={item}
              onPress={() => router.push(`/destinations/${item.id}` as any)}
            />
          )}
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
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  webH1: {
    margin: 0,
    padding: 0,
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
  searchSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  categoryChips: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#475569",
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
});
