import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";

interface BrandShellProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function BrandShell({ children, style }: BrandShellProps) {
  const { branding, brandKey } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const normalizedBrandName = brandName.toLowerCase();

  const isWanderly =
    (brandKey === "wanderly" && !normalizedBrandName.includes("gujju")) ||
    normalizedBrandName.includes("wanderly");

  return (
    <View
      style={[
        styles.container,
        isWanderly && styles.wanderlyBackground,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  wanderlyBackground: {
    backgroundColor: "#fffdf9",
  },
});
