import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

const features = [
  {
    code: "01",
    title: "Curated, not crowdsourced",
    description:
      "Every destination is reviewed by our travel team before it makes the list — no filler, no tourist traps.",
  },
  {
    code: "02",
    title: "Transparent pricing",
    description:
      "The fare you see is the fare you pay. No hidden fees revealed at checkout.",
  },
  {
    code: "03",
    title: "Flexible trip planning",
    description:
      "Build your itinerary in minutes, adjust dates and travelers anytime before you fly.",
  },
];

export default function WhyWanderly() {
  const { branding, primaryColor } = useAppConfig();
  const websiteName = branding.name?.trim() || "";

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>
        {websiteName ? `WHY ${websiteName.toUpperCase()}` : "WHY CHOOSE US"}
      </Text>

      <Text style={styles.title}>
        {websiteName ? `Why travel with ${websiteName}` : "Why travel with us"}
      </Text>

      <View style={styles.featuresList}>
        {features.map((feature) => (
          <View key={feature.code} style={styles.featureCard}>
            <Text style={styles.codeText}>{feature.code}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#fffdf9",
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: theme.colors.coral,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e8dcc5",
    ...theme.shadows.sm,
  },
  codeText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748b",
  },
});
