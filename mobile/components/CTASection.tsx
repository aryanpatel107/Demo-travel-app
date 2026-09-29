import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

export default function CTASection() {
  const router = useRouter();
  const { branding, primaryColor } = useAppConfig();

  const websiteName = branding.name?.trim() || "";
  const resolvedColor = primaryColor || theme.colors.coral;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.kicker, { color: resolvedColor }]}>
          READY WHEN YOU ARE
        </Text>

        <Text style={styles.title}>
          {websiteName
            ? `Plan your next journey with ${websiteName}`
            : "Plan your next journey"}
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: resolvedColor }]}
          onPress={() => router.push("/destinations")}
        >
          <Text style={styles.buttonText}>Start Exploring</Text>
        </Pressable>
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
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.ink,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
