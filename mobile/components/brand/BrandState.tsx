import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

interface BrandStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  tone?: "error" | "empty";
}

export function BrandStateCard({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  tone = "empty",
}: BrandStateProps) {
  const router = useRouter();
  const { branding, primaryColor } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const brandKey = brandName.toLowerCase().replace(/\s+/g, "");

  const isWanderly = brandKey === "wanderly";
  const isTravelPro = brandKey === "travelpro";

  const resolvedPrimary = primaryColor || branding.primaryColor || theme.colors.coral;

  const handlePress = () => {
    if (actionHref) {
      router.push(actionHref as any);
    } else if (onAction) {
      onAction();
    }
  };

  const isError = tone === "error";

  return (
    <View
      style={[
        styles.card,
        isWanderly && styles.wanderlyCard,
        isTravelPro && styles.travelProCard,
        isError && styles.errorCard,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          isError ? styles.errorIconCircle : styles.emptyIconCircle,
        ]}
      >
        <Text style={[styles.iconText, isError && { color: "#dc2626" }]}>
          {isError ? "⚠" : "✦"}
        </Text>
      </View>

      <Text style={[styles.title, isError && { color: "#991b1b" }]}>
        {title}
      </Text>

      <Text style={styles.description}>{description}</Text>

      {Boolean(actionLabel) && (
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: isError ? "#dc2626" : resolvedPrimary },
          ]}
          onPress={handlePress}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function BrandErrorState(props: Omit<BrandStateProps, "tone">) {
  return <BrandStateCard {...props} tone="error" />;
}

export function BrandEmptyState(props: Omit<BrandStateProps, "tone">) {
  return <BrandStateCard {...props} tone="empty" />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  wanderlyCard: {
    backgroundColor: "#fffaf3",
    borderColor: "#e8dcc5",
  },
  travelProCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
  errorCard: {
    backgroundColor: "#fff4f2",
    borderColor: "#f1c9c4",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyIconCircle: {
    backgroundColor: "#f1f5f9",
  },
  errorIconCircle: {
    backgroundColor: "#fee2e2",
  },
  iconText: {
    fontSize: 24,
    color: "#475569",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
