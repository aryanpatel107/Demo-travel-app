import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

export default function TripPlannerShowcase() {
  const { branding } = useAppConfig();
  const websiteName = branding.name?.trim() || "";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.kicker}>PLANNER</Text>
        <Text style={styles.title}>
          {websiteName ? `Plan your journey with ${websiteName}` : "Plan your journey"}
        </Text>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>STEP 1</Text>
            <Text style={styles.stepText}>Pick a vibe</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>STEP 2</Text>
            <Text style={styles.stepText}>Choose dates</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>STEP 3</Text>
            <Text style={styles.stepText}>Book with confidence</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 24,
    ...theme.shadows.md,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 20,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
  },
  stepNumber: {
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
