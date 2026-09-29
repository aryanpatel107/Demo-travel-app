import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import SpecialOffers from "@/components/SpecialOffers";
import { destinations } from "@/data/destinations";
import { theme } from "@/constants/theme";

const featured = destinations.slice(0, 3);

export default function TravelProHome() {
  const router = useRouter();
  const { branding, primaryColor, config } = useAppConfig();

  const brandName = branding.name || "TripGoAsia";
  const kicker = brandName.toUpperCase();
  const heroTitle = config?.hero?.title || "Explore Asia with Confidence.";
  const heroSubtitle =
    config?.hero?.subtitle ||
    "Compare routes with confidence and keep every detail organized.";
  const primary = primaryColor || "#0284c7";

  const [fromCity, setFromCity] = useState("Surat");
  const [toCity, setToCity] = useState("Bali");
  const [departureDate, setDepartureDate] = useState("2026-10-15");
  const [travelersCount, setTravelersCount] = useState("2");

  const handleSearchFlights = () => {
    const q = toCity.trim();
    if (q) {
      router.push({
        pathname: "/(tabs)/destinations" as never,
        params: { q },
      });
    } else {
      router.push("/(tabs)/destinations" as never);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: "#0f172a" }]}>
        <Text style={[styles.eyebrow, { color: primary }]}>{kicker}</Text>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

        <View style={styles.searchBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FROM</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Origin city"
              placeholderTextColor="#94a3b8"
              value={fromCity}
              onChangeText={setFromCity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TO</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Destination city"
              placeholderTextColor="#94a3b8"
              value={toCity}
              onChangeText={setToCity}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>DEPARTURE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Select date"
                placeholderTextColor="#94a3b8"
                value={departureDate}
                onChangeText={setDepartureDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>TRAVELERS</Text>
              <TextInput
                style={styles.textInput}
                placeholder="2"
                placeholderTextColor="#94a3b8"
                value={travelersCount}
                onChangeText={setTravelersCount}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Pressable
            style={[styles.searchButton, { backgroundColor: primary }]}
            onPress={handleSearchFlights}
          >
            <Text style={styles.searchButtonText}>SEARCH FLIGHTS</Text>
          </Pressable>
        </View>
      </View>

      {/* Featured destinations */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.kicker, { color: primary }]}>
            POPULAR DESTINATIONS
          </Text>
          <Text style={styles.sectionTitle}>Featured destinations</Text>
        </View>
        <Pressable onPress={() => router.push("/destinations")}>
          <Text style={[styles.viewAllText, { color: primary }]}>
            Browse all →
          </Text>
        </Pressable>
      </View>

      <DestinationGrid destinations={featured} />

      {/* Special offers */}
      <SpecialOffers />

      {/* Travel packages */}
      <View style={styles.packagesSection}>
        <Text style={[styles.kicker, { color: primary }]}>TRAVEL PACKAGES</Text>
        <Text style={styles.sectionTitle}>Recommended packages</Text>

        <View style={styles.packagesGrid}>
          {[
            {
              title: "Weekend Escape",
              price: "$699",
              details: "Flights + hotel + transfer",
            },
            {
              title: "Family Retreat",
              price: "$1,299",
              details: "Flexible dates included",
            },
            {
              title: "Premium Getaway",
              price: "$2,399",
              details: "Private transfer + lounge",
            },
          ].map((pkg) => (
            <View key={pkg.title} style={styles.packageCard}>
              <Text style={styles.bundleLabel}>BUNDLE</Text>
              <Text style={styles.packageTitle}>{pkg.title}</Text>
              <Text style={[styles.packagePrice, { color: primary }]}>
                {pkg.price}
              </Text>
              <Text style={styles.packageDetails}>{pkg.details}</Text>
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
    color: "#7dd3fc",
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
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    ...theme.shadows.md,
  },
  inputGroup: {
    gap: 4,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: "#64748b",
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#0f172a",
  },
  searchButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
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
  packagesSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  packagesGrid: {
    gap: 14,
    marginTop: 16,
  },
  packageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  bundleLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "700",
    marginBottom: 6,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  packageDetails: {
    fontSize: 13,
    color: "#64748b",
  },
});
