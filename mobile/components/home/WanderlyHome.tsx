import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import Stats from "@/components/Stats";
import WhyWanderly from "@/components/WhyWanderly";
import DestinationGrid from "@/components/DestinationGrid";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { destinations } from "@/data/destinations";
import { theme } from "@/constants/theme";

const featured = destinations.slice(0, 3);

export default function WanderlyHome() {
  const router = useRouter();
  const { branding, primaryColor, secondaryColor, config } = useAppConfig();

  const brandName = branding.name || "GujjuTours";
  const kicker = brandName.toUpperCase();
  const heroTitle = config?.hero?.title || "Explore more. Worry less.";
  const heroSubtitle =
    config?.hero?.subtitle ||
    "Handcrafted holiday packages, best hotel rates, seamless visa services, and 24/7 on-ground assistance.";

  const primary = primaryColor || theme.colors.coral;
  const secondary = secondaryColor || theme.colors.teal;

  const [fromCity, setFromCity] = useState("Surat");
  const [toCity, setToCity] = useState("");
  const [travelMonth, setTravelMonth] = useState("");

  const handleSearch = () => {
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
      {/* Hero section */}
      <View style={[styles.hero, { backgroundColor: theme.colors.ink }]}>
        <Text style={[styles.eyebrow, { color: primary }]}>{kicker}</Text>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: primary }]}
            onPress={() => router.push("/destinations")}
          >
            <Text style={styles.primaryButtonText}>Explore Destinations</Text>
          </Pressable>

          <Pressable
            style={styles.outlineButton}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.outlineButtonText}>Plan a Trip</Text>
          </Pressable>
        </View>

        <View style={styles.heroImageCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
        </View>
      </View>

      {/* Quick Search Card */}
      <View style={styles.searchCard}>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>FROM</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Origin city"
            placeholderTextColor="#94a3b8"
            value={fromCity}
            onChangeText={setFromCity}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>TO</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Anywhere (e.g. Dubai, Bali)"
            placeholderTextColor="#94a3b8"
            value={toCity}
            onChangeText={setToCity}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>MONTH</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Any time"
            placeholderTextColor="#94a3b8"
            value={travelMonth}
            onChangeText={setTravelMonth}
          />
        </View>

        <Pressable
          style={[styles.searchButton, { backgroundColor: primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>SEARCH</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <Stats />

      {/* Featured destinations */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.kicker}>FEATURED</Text>
          <Text style={styles.sectionTitle}>Featured destinations</Text>
        </View>
        <Pressable onPress={() => router.push("/destinations")}>
          <Text style={styles.viewAllText}>View all →</Text>
        </Pressable>
      </View>

      <DestinationGrid destinations={featured} />

      {/* Why Wanderly */}
      <WhyWanderly />

      {/* Experiences */}
      <View style={styles.experiencesSection}>
        <Text style={styles.kicker}>EXPERIENCES</Text>
        <Text style={styles.sectionTitle}>Travel experiences</Text>

        <View style={styles.expGrid}>
          {[
            {
              title: "Wild coastlines",
              meta: "Bali · 7 days",
              image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            },
            {
              title: "Mountain trails",
              meta: "Patagonia · 10 days",
              image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            },
            {
              title: "Temple mornings",
              meta: "Kyoto · 6 days",
              image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
            },
          ].map((exp) => (
            <View key={exp.title} style={styles.expCard}>
              <Image
                source={{ uri: exp.image }}
                style={styles.expImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.expBody}>
                <Text style={styles.expMeta}>{exp.meta}</Text>
                <Text style={styles.expTitle}>{exp.title}</Text>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
    color: theme.colors.gold,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  outlineButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  outlineButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  heroImageCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
  },
  heroImage: {
    width: "100%",
    height: 180,
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  inputBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: "#64748b",
  },
  inputField: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    paddingVertical: 4,
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
    color: theme.colors.coral,
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
    color: theme.colors.teal,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  experiencesSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#fffdf9",
  },
  expGrid: {
    gap: 16,
    marginTop: 16,
  },
  expCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  expImage: {
    width: "100%",
    height: 160,
  },
  expBody: {
    padding: 16,
  },
  expMeta: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: "monospace",
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  expTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
});
