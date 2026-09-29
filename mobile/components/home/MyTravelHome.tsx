import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { destinations } from "@/data/destinations";
import { theme } from "@/constants/theme";

const featured = destinations.slice(0, 3);

export default function MyTravelHome() {
  const router = useRouter();
  const { branding, primaryColor, config } = useAppConfig();

  const brandName = branding.name || "Technoheaven";
  const kicker = brandName.toUpperCase();
  const heroTitle = config?.hero?.title || "Powering Global Travel Distribution.";
  const heroSubtitle =
    config?.hero?.subtitle ||
    "Curated ideas and flexible plans built around your pace and preferences.";
  const primary = primaryColor || "#059669";

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: primary }]}>
        <Text style={styles.eyebrow}>{kicker}</Text>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.whiteButton}
            onPress={() => router.push("/destinations")}
          >
            <Text style={[styles.whiteButtonText, { color: primary }]}>
              Explore Destinations
            </Text>
          </Pressable>

          <Pressable
            style={styles.outlineButton}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.outlineButtonText}>Plan a Trip</Text>
          </Pressable>
        </View>

        {/* Feature box */}
        <View style={styles.featureBox}>
          <View style={styles.featureHeader}>
            <View>
              <Text style={styles.featureKicker}>TRIPS PICKED FOR YOU</Text>
              <Text style={styles.featureTitle}>Your next escape</Text>
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.featureItems}>
            {[
              { label: "Best for", value: "Slow travel" },
              { label: "Travel style", value: "Beach + culture" },
              { label: "Ideal window", value: "Nov - Jan" },
            ].map((item) => (
              <View key={item.label} style={styles.featureRow}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recommended destinations */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.kicker, { color: primary }]}>RECOMMENDED</Text>
          <Text style={styles.sectionTitle}>Featured destinations</Text>
        </View>
        <Pressable onPress={() => router.push("/destinations")}>
          <Text style={[styles.viewAllText, { color: primary }]}>See more →</Text>
        </Pressable>
      </View>

      <DestinationGrid destinations={featured} />

      {/* Plan your trip steps */}
      <View style={styles.stepsSection}>
        <Text style={[styles.kicker, { color: primary }]}>BUILT AROUND YOU</Text>
        <Text style={styles.sectionTitle}>Plan your trip</Text>

        <View style={styles.stepsList}>
          {[
            { title: "Pick your vibe", note: "Beach, culture, or nature" },
            { title: "Shape the plan", note: "Save favorites and compare ideas" },
            { title: "Travel with ease", note: "Move from inspiration to booking" },
          ].map((step, idx) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={[styles.checkCircle, { backgroundColor: `${primary}15` }]}>
                <Text style={[styles.checkMark, { color: primary }]}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepCardTitle}>{step.title}</Text>
                <Text style={styles.stepCardNote}>{step.note}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials & CTA */}
      <Testimonials />
      <CTASection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  whiteButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  whiteButtonText: {
    fontWeight: "700",
    fontSize: 13,
  },
  outlineButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  outlineButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  featureBox: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    ...theme.shadows.md,
  },
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureKicker: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: "#64748b",
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  liveBadgeText: {
    color: "#059669",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  featureItems: {
    gap: 8,
  },
  featureRow: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
  },
  itemLabel: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  itemValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  stepsSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  stepsList: {
    gap: 12,
    marginTop: 16,
  },
  stepCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    fontSize: 16,
    fontWeight: "800",
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  stepCardNote: {
    fontSize: 13,
    color: "#64748b",
  },
});
