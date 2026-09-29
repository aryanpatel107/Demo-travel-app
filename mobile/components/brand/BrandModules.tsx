import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

interface ServiceModule {
  serviceTypeId?: number;
  serviceName?: string;
  serviceCode?: string;
  serviceIcon?: string;
  code?: string;
  name?: string;
  icon?: string;
  displayOrder?: number;
  [key: string]: unknown;
}

const DEFAULT_ICONS: Record<string, string> = {
  HOTEL: "🏨",
  PACKAGE: "📦",
  TOUR: "🏄",
  FLIGHT: "✈️",
  TRANSFER: "🚗",
  VISA: "🛂",
  RESTAURANT: "🍽️",
  BUILDPACKAGE: "🧳",
};

export default function BrandModules() {
  const router = useRouter();
  const { branding, remoteConfig, primaryColor } = useAppConfig();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const rawModules = (
    Array.isArray(branding.modules) && branding.modules.length > 0
      ? branding.modules
      : Array.isArray(remoteConfig?.websiteModules)
        ? remoteConfig?.websiteModules
        : []
  ) as ServiceModule[];

  // Fallback default modules if none configured
  const fallbackModules: ServiceModule[] = [
    { code: "FLIGHT", name: "Flights", displayOrder: 1 },
    { code: "HOTEL", name: "Hotels", displayOrder: 2 },
    { code: "PACKAGE", name: "Packages", displayOrder: 3 },
    { code: "TOUR", name: "Activities", displayOrder: 4 },
    { code: "TRANSFER", name: "Transfers", displayOrder: 5 },
    { code: "VISA", name: "Visas", displayOrder: 6 },
  ];

  const modulesToUse = rawModules.length > 0 ? rawModules : fallbackModules;

  const sortedModules = [...modulesToUse]
    .filter((m) => Boolean(m.serviceCode || m.code || m.serviceName || m.name))
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  const resolvedPrimary = primaryColor || branding.primaryColor || theme.colors.teal;

  const website = (remoteConfig?.website || {}) as Record<string, unknown>;
  const base =
    (typeof website.staticPath === "string" && website.staticPath.trim()) ||
    (typeof website.serviceImageCdnPath === "string" && website.serviceImageCdnPath.trim()) ||
    "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {branding.name ? `${branding.name} Services` : "Travel Services"}
          </Text>
          <View style={[styles.countBadge, { backgroundColor: resolvedPrimary }]}>
            <Text style={styles.countText}>{sortedModules.length} AVAILABLE</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {sortedModules.map((module, index) => {
            const code = String(module.serviceCode ?? module.code ?? "").toUpperCase();
            const serviceName = String(module.serviceName ?? module.name ?? "Service");
            const rawIcon =
              module.serviceIcon ||
              (typeof module.icon === "string" && module.icon.includes("/") ? module.icon : undefined);
            const iconUrl = rawIcon
              ? rawIcon.startsWith("http")
                ? rawIcon
                : `${base.replace(/\/?$/, "/")}${rawIcon.replace(/^\//, "")}`
              : null;
            const isSelected = activeTab === code;

            return (
              <Pressable
                key={`module-${index}-${module.serviceTypeId ?? module.serviceCode ?? code}`}
                style={[
                  styles.moduleItem,
                  isSelected && { borderColor: resolvedPrimary, backgroundColor: "#f8fafc" },
                ]}
                onPress={() => {
                  setActiveTab(code);
                  router.push(`/trips/create?service=${encodeURIComponent(code)}` as any);
                }}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${resolvedPrimary}15` },
                  ]}
                >
                  {iconUrl ? (
                    <Image
                      source={{ uri: iconUrl }}
                      style={styles.moduleImage}
                      contentFit="contain"
                    />
                  ) : (
                    <Text style={styles.emojiText}>
                      {DEFAULT_ICONS[code] || "✨"}
                    </Text>
                  )}
                </View>

                <Text style={styles.serviceName} numberOfLines={1}>
                  {serviceName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 16,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#64748b",
    textTransform: "uppercase",
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  countText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  scrollContent: {
    gap: 10,
    paddingVertical: 4,
  },
  moduleItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 84,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  moduleImage: {
    width: 24,
    height: 24,
  },
  emojiText: {
    fontSize: 22,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
});
