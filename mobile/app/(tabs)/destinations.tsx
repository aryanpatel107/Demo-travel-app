import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { destinations, Destination } from "@/data/destinations";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import { BrandEmptyState } from "@/components/brand/BrandState";
import { theme } from "@/constants/theme";

const categories = ["ALL", "ADVENTURE", "BEACH", "CULTURE", "NATURE"] as const;

export default function DestinationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; to?: string; search?: string }>();
  const { branding, primaryColor } = useAppConfig();

  const [searchQuery, setSearchQuery] = useState(
    params.q || params.to || params.search || ""
  );
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("ALL");

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

    return destinations.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        cat === "all" || d.tags.some((t) => t.toLowerCase() === cat);

      return matchesQuery && matchesCat;
    });
  }, [searchQuery, activeCategory]);

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
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <BrandEmptyState
            title="No destinations found"
            description={`No destinations match "${searchQuery}". Try selecting another category or clearing your search.`}
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery("");
              setActiveCategory("ALL");
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
});
