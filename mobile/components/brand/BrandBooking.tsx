import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

export default function BrandBooking() {
  const router = useRouter();
  const { branding, primaryColor, brandKey } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const normalizedBrandName = brandName.toLowerCase().replace(/\s+/g, "");

  const isWanderly =
    brandKey === "wanderly" ||
    normalizedBrandName.includes("wanderly") ||
    normalizedBrandName.includes("gujju");

  const isTravelPro =
    brandKey === "travelpro" ||
    normalizedBrandName.includes("travelpro");

  const resolvedPrimary = primaryColor || branding.primaryColor || theme.colors.coral;

  if (isWanderly) {
    return (
      <View style={styles.container}>
        <View style={styles.wanderlyCard}>
          <Text style={styles.kicker}>YOUR NEXT STORY</Text>
          <Text style={styles.wanderlyTitle}>
            Your next journey{"\n"}
            {brandName ? `with ${brandName}.` : "starts here."}
          </Text>
          <Text style={styles.wanderlyText}>
            Build a trip around the places, experiences and moments you&apos;ve
            been dreaming about.
          </Text>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: resolvedPrimary }]}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.primaryButtonText}>Start planning →</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isTravelPro) {
    return (
      <View style={styles.container}>
        <View style={styles.travelProCard}>
          <Text style={[styles.kicker, { color: "#0284c7" }]}>SMART TRAVEL</Text>
          <Text style={styles.travelProTitle}>
            Everything you need{"\n"}for a better trip.
          </Text>

          <View style={styles.featuresList}>
            {["Flexible planning", "Simple booking", "Organized itineraries"].map(
              (feat) => (
                <View key={feat} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              )
            )}
          </View>

          <Pressable
            style={styles.darkButton}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.darkButtonText}>CREATE BOOKING</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Default / MyTravel
  return (
    <View style={styles.container}>
      <View style={[styles.myTravelCard, { backgroundColor: resolvedPrimary }]}>
        <Text style={styles.myTravelKicker}>TRAVEL PLANNING</Text>
        <Text style={styles.myTravelTitle}>
          One place for{"\n"}all your adventures.
        </Text>
        <Text style={styles.myTravelText}>
          Create, organize and manage your trips without the stress.
        </Text>

        <Pressable
          style={styles.whiteButton}
          onPress={() => router.push("/trips/create")}
        >
          <Text style={[styles.whiteButtonText, { color: resolvedPrimary }]}>
            Plan a trip
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  wanderlyCard: {
    backgroundColor: theme.colors.sand,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e8dcc5",
    ...theme.shadows.md,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: theme.colors.coral,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  wanderlyTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    color: theme.colors.ink,
    marginBottom: 8,
  },
  wanderlyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  travelProCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  travelProTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    color: "#0f172a",
    marginBottom: 16,
  },
  featuresList: {
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  featureBullet: {
    color: "#0284c7",
    fontWeight: "800",
    fontSize: 14,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  darkButton: {
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  darkButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  myTravelCard: {
    borderRadius: 24,
    padding: 24,
    ...theme.shadows.md,
  },
  myTravelKicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  myTravelTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    color: "#ffffff",
    marginBottom: 8,
  },
  myTravelText: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  whiteButton: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  whiteButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
