import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { destinations } from "@/data/destinations";
import { theme } from "@/constants/theme";

const featured = destinations.slice(0, 4);

export default function BrandDestinations() {
  const router = useRouter();
  const { branding, brandKey, primaryColor } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const normalizedBrandName = brandName.toLowerCase().replace(/\s+/g, "");

  const isWanderly =
    brandKey === "wanderly" ||
    normalizedBrandName.includes("wanderly") ||
    normalizedBrandName.includes("gujju");

  const isTravelPro =
    brandKey === "travelpro" ||
    normalizedBrandName.includes("travelpro");

  const resolvedPrimary = primaryColor || branding.primaryColor || theme.colors.teal;

  if (isWanderly) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>CURATED DESTINATIONS</Text>
          <Text style={styles.sectionTitle}>Go where curiosity takes you.</Text>
        </View>

        <View style={styles.grid}>
          {featured.map((dest) => (
            <Pressable
              key={dest.id}
              style={styles.wanderlyCard}
              onPress={() => router.push(`/destinations/${dest.id}` as any)}
            >
              <Image
                source={{ uri: dest.imageUrl }}
                style={styles.cardImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardCountry}>{dest.country}</Text>
                <Text style={styles.cardName}>{dest.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {dest.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (isTravelPro) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.kicker, { color: "#0284c7" }]}>POPULAR ROUTES</Text>
            <Text style={styles.sectionTitle}>Top destinations</Text>
          </View>
          <Pressable onPress={() => router.push("/destinations")}>
            <Text style={styles.viewAllText}>View all →</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {featured.map((dest) => (
            <Pressable
              key={dest.id}
              style={styles.travelProCard}
              onPress={() => router.push(`/destinations/${dest.id}` as any)}
            >
              <Image
                source={{ uri: dest.imageUrl }}
                style={styles.travelProImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.travelProContent}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{dest.name}</Text>
                    <Text style={styles.cardCountry}>{dest.country}</Text>
                  </View>
                  <Text style={styles.priceTag}>${dest.price}</Text>
                </View>

                <View style={styles.exploreRow}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Text style={{ color: "#0284c7", fontWeight: "700" }}>→</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  // Default / MyTravel
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: "#7c3aed" }]}>CURATED PICKS</Text>
        <Text style={styles.sectionTitle}>Trips picked for you</Text>
      </View>

      <View style={styles.grid}>
        {featured.map((dest) => (
          <Pressable
            key={dest.id}
            style={styles.myTravelCard}
            onPress={() => router.push(`/destinations/${dest.id}` as any)}
          >
            <Image
              source={{ uri: dest.imageUrl }}
              style={styles.myTravelImage}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.myTravelContent}>
              <View style={styles.badgeRow}>
                <Text style={styles.recBadge}>Recommended</Text>
                <Text style={{ fontSize: 16 }}>♡</Text>
              </View>
              <Text style={styles.cardName}>{dest.name}</Text>
              <Text style={styles.cardCountry}>{dest.country}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {dest.description}
              </Text>
              <View style={styles.planRow}>
                <Text style={styles.idealForText}>Ideal for</Text>
                <Text style={{ color: "#7c3aed", fontWeight: "700", fontSize: 12 }}>
                  Plan →
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  header: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: theme.colors.coral,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284c7",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  grid: {
    gap: 16,
  },
  wanderlyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  cardCountry: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: "#475569",
  },
  travelProCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    ...theme.shadows.sm,
  },
  travelProImage: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 12,
  },
  travelProContent: {
    gap: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceTag: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0284c7",
  },
  exploreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
  exploreText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  myTravelCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ede9fe",
    ...theme.shadows.sm,
  },
  myTravelImage: {
    width: "100%",
    height: 160,
  },
  myTravelContent: {
    padding: 16,
    gap: 6,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recBadge: {
    backgroundColor: "#f5f3ff",
    color: "#7c3aed",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    textTransform: "uppercase",
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f5f3ff",
    paddingTop: 8,
    marginTop: 4,
  },
  idealForText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
});
