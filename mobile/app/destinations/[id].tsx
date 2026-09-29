import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDestinationById } from "@/data/destinations";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import Footer from "@/components/Footer";
import { theme } from "@/constants/theme";

export default function DestinationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { branding, primaryColor } = useAppConfig();

  const destination = getDestinationById(id);
  const primary = primaryColor || theme.colors.teal;
  const brandName = branding.name || "Travel";

  if (!destination) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>Destination not found</Text>
        <Text style={styles.notFoundSub}>
          The destination you are looking for does not exist.
        </Text>
        <Pressable
          style={[styles.backHomeBtn, { backgroundColor: primary }]}
          onPress={() => router.push("/(tabs)/destinations")}
        >
          <Text style={styles.backHomeBtnText}>Back to destinations</Text>
        </Pressable>
      </View>
    );
  }

  const handlePlanTrip = () => {
    router.push(`/trips/create?destinationId=${encodeURIComponent(destination.id)}` as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top back link */}
      <Pressable
        style={styles.backRow}
        onPress={() => router.back()}
      >
        <Text style={[styles.backText, { color: primary }]}>
          ← Back to destinations
        </Text>
      </Pressable>

      {/* Main card */}
      <View style={styles.card}>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: destination.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>${destination.price}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={[styles.kicker, { color: primary }]}>
            {destination.country.toUpperCase()}
          </Text>
          <View>
            <Text style={styles.title}>{destination.name}</Text>
          </View>
          <Text style={styles.description}>{destination.description}</Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DURATION</Text>
              <Text style={styles.statVal}>{destination.duration || "5-7 days"}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>RATING</Text>
              <Text style={styles.statVal}>⭐ {destination.rating || 4.8}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>EXPERIENCE</Text>
              <Text style={styles.statVal}>{destination.tags?.[0]?.toUpperCase() || "CURATED"}</Text>
            </View>
          </View>

          {/* Long Description / Why Go */}
          <View style={styles.whyGoSection}>
            <Text style={styles.whyGoHeading}>Why go?</Text>
            <Text style={styles.whyGoText}>{destination.longDescription}</Text>
          </View>

          {/* Plan Trip CTA Button */}
          <Pressable
            style={[styles.planBtn, { backgroundColor: primary }]}
            onPress={handlePlanTrip}
          >
            <Text style={styles.planBtnText}>Plan Trip to {destination.name} →</Text>
          </Pressable>
        </View>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsWrapper}>
        <ReviewsSection />
      </View>

      {/* Footer */}
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 24,
  },
  backRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  imageBox: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 240,
  },
  pricePill: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pricePillText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  body: {
    padding: 20,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
  },
  webH1: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statLabel: {
    fontSize: 9,
    fontFamily: "monospace",
    letterSpacing: 1,
    color: "#64748b",
    marginBottom: 4,
  },
  statVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  whyGoSection: {
    backgroundColor: "#fffdf9",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1e5d1",
    marginBottom: 20,
  },
  whyGoHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16241f",
    marginBottom: 6,
  },
  whyGoText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#33433d",
  },
  highlightsSection: {
    marginBottom: 24,
  },
  highlightsHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  highlightsList: {
    gap: 10,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  highlightBullet: {
    fontSize: 14,
    marginTop: 1,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
    flex: 1,
  },
  planBtn: {
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  planBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  reviewsWrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  notFoundSub: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "center",
  },
  backHomeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  backHomeBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
