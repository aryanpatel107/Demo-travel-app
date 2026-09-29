import React, { useState } from "react";
import { View, Text, StyleSheet, Image, StyleProp, ViewStyle } from "react-native";
import Svg, { SvgUri, Path, Rect, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface BrandLogoProps {
  logoUrl?: string | null;
  brandName?: string;
  brandKey?: string;
  primaryColor?: string;
  secondaryColor?: string;
  monogram?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  showTextFallback?: boolean;
}

export default function BrandLogo({
  logoUrl,
  brandName = "Travel App",
  brandKey = "wanderly",
  primaryColor = "#2882c5",
  secondaryColor = "#f58e83",
  monogram,
  width = 120,
  height = 36,
  style,
  showTextFallback = true,
}: BrandLogoProps) {
  const [loadError, setLoadError] = useState(false);

  const isSvg = Boolean(
    logoUrl &&
      (logoUrl.toLowerCase().endsWith(".svg") ||
        logoUrl.toLowerCase().includes(".svg?") ||
        logoUrl.toLowerCase().includes(".svg"))
  );

  // If remote logo is available and hasn't errored
  if (logoUrl && !loadError) {
    if (isSvg) {
      return (
        <View style={[{ width, height, justifyContent: "center", alignItems: "center" }, style]}>
          <SvgUri
            uri={logoUrl}
            width={width}
            height={height}
            onError={() => setLoadError(true)}
          />
        </View>
      );
    }

    return (
      <View style={[{ width, height, justifyContent: "center", alignItems: "center" }, style]}>
        <Image
          source={{ uri: logoUrl }}
          style={{ width, height }}
          resizeMode="contain"
          onError={() => setLoadError(true)}
        />
      </View>
    );
  }

  // Graceful Branded Fallback
  const key = (brandKey || "").toLowerCase();
  const initial = (
    monogram ||
    (key.includes("wanderly") || key.includes("gujju")
      ? "G"
      : key.includes("travelpro") || key.includes("tripgo")
      ? "TGA"
      : "TH")
  ).toUpperCase();

  const resolvedName =
    brandName && brandName !== "Travel App"
      ? brandName
      : key.includes("wanderly") || key.includes("gujju")
      ? "GujjuTours"
      : key.includes("travelpro") || key.includes("tripgo")
      ? "TripGoAsia"
      : "Technoheaven";

  return (
    <View style={[styles.container, style]}>
      {/* Branded Vector Mark */}
      {key === "travelpro" ? (
        <Svg width={height} height={height} viewBox="0 0 36 36">
          <Defs>
            <LinearGradient id="tgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FF932C" />
              <Stop offset="100%" stopColor="#E06D00" />
            </LinearGradient>
          </Defs>
          <Rect width="36" height="36" rx="9" fill="url(#tgGrad)" />
          {/* Compass / flight swoosh */}
          <Path
            d="M10 24L18 8L26 24L18 20L10 24Z"
            fill="#FFFFFF"
            opacity={0.95}
          />
          <Circle cx="18" cy="18" r="3" fill="#3F3F69" />
        </Svg>
      ) : key === "mytravel" ? (
        <Svg width={height} height={height} viewBox="0 0 36 36">
          <Defs>
            <LinearGradient id="thGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#00aacf" />
              <Stop offset="100%" stopColor="#007799" />
            </LinearGradient>
          </Defs>
          <Rect width="36" height="36" rx="9" fill="url(#thGrad)" />
          {/* Tech T geometry */}
          <Path
            d="M9 12H27V16H20V26H16V16H9V12Z"
            fill="#FFFFFF"
          />
        </Svg>
      ) : (
        <View
          style={[
            styles.monogramBadge,
            {
              backgroundColor: primaryColor,
              width: height,
              height: height,
              borderRadius: 9,
            },
          ]}
        >
          <Text style={styles.monogramText}>{initial}</Text>
        </View>
      )}

      {showTextFallback && (
        <View style={styles.nameBlock}>
          <Text style={styles.brandTitle} numberOfLines={1}>
            {resolvedName}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monogramBadge: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  monogramText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  nameBlock: {
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
});
