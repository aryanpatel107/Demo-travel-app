import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

interface BrandHeroProps {
  accentText?: string;
  children?: ReactNode;
}

export default function BrandHero({ accentText, children }: BrandHeroProps) {
  const router = useRouter();
  const { branding, primaryColor, secondaryColor, config } = useAppConfig();

  const websiteName = branding.name || "Travel";
  const kicker = websiteName.toUpperCase();
  const heroTitle = config?.hero?.title || "Explore with Confidence.";
  const primary = primaryColor || theme.colors.teal;
  const secondary = secondaryColor || theme.colors.coral;

  return (
    <View style={[styles.container, { backgroundColor: primary }]}>
      <Text style={styles.eyebrow}>{kicker}</Text>
      <Text style={styles.title}>{heroTitle}</Text>

      {Boolean(accentText) && (
        <Text style={styles.accentText}>{accentText}</Text>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.ctaButton, { backgroundColor: secondary }]}
          onPress={() => router.push("/destinations")}
        >
          <Text style={styles.ctaButtonText}>Explore Destinations</Text>
        </Pressable>
      </View>

      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.75)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  accentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  childrenContainer: {
    marginTop: 16,
  },
});
