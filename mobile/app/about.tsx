import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import Footer from "@/components/Footer";
import { theme } from "@/constants/theme";

export default function AboutScreen() {
  const { branding, primaryColor } = useAppConfig();
  const brandName = branding.name || "Wanderly";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={[styles.kicker, { color: primaryColor || theme.colors.coral }]}>
          OUR STORY
        </Text>
        <View>
          <Text style={styles.title}>About {brandName}</Text>
        </View>

        <Text style={styles.bodyText}>
          {brandName} is a travel planning platform built for explorers who want
          more than a checklist of tourist spots. We curate destinations based
          on real experiences, connect you with trip-planning tools, and help
          you turn inspiration into an itinerary.
        </Text>

        <Text style={styles.bodyText}>
          Whether you are chasing mountain trails or quiet coastlines, {brandName}
          is here to help you get there with ease and joy.
        </Text>

        <View style={styles.infoBadge}>
          <Text style={styles.infoTitle}>Modern Multi-Brand Architecture</Text>
          <Text style={styles.infoSub}>
            This application showcases modern React Native, Expo Router, and
            dynamic remote configuration matching the web application.
          </Text>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingVertical: 24,
  },
  card: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  webH1: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 16,
  },
  infoBadge: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748b",
  },
});
