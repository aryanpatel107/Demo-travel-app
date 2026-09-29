import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

import BrandLogo from "@/components/BrandLogo";

let hasShownStartupSplash = false;

export default function BrandSplash() {
  const [isDone, setIsDone] = useState(() => hasShownStartupSplash);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { branding, primaryColor, brandKey, isBrandResolved } = useAppConfig();

  const brandName = isBrandResolved ? branding.name || "Travel App" : "";
  const subtitle = "Curated Travel Experiences";
  const logoUrl = branding.logoUrl;

  const primary = primaryColor || theme.colors.teal;

  useEffect(() => {
    if (hasShownStartupSplash) return;
    if (!isBrandResolved) return;

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        hasShownStartupSplash = true;
        setIsDone(true);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isBrandResolved, fadeAnim]);

  if (isDone || hasShownStartupSplash) {
    return null;
  }

  return (
    <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]}>
      <View style={styles.centerBox}>
        <View style={styles.logoWrapper}>
          <BrandLogo
            logoUrl={logoUrl}
            brandName={brandName}
            brandKey={brandKey}
            primaryColor={primary}
            height={52}
            width={200}
            showTextFallback={false}
          />
        </View>

        <Text style={styles.subtitleText}>{subtitle}</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: primary }]} />
        </View>

        <Text style={styles.loadingText}>Curating your journey...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#080c14",
    zIndex: 99999,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBox: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 32,
  },
  progressContainer: {
    width: 180,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressBar: {
    width: "60%",
    height: "100%",
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: "#64748b",
    letterSpacing: 0.5,
  },
});
