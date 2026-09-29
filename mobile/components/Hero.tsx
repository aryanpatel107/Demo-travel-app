import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import BoardingPassCard from "./BoardingPassCard";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  const router = useRouter();
  const { primaryColor, secondaryColor } = useAppConfig();

  const primary = primaryColor || theme.colors.teal;
  const secondary = secondaryColor || theme.colors.coral;

  return (
    <View style={[styles.container, { backgroundColor: primary }]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>NOW BOARDING</Text>

        <View>
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, { backgroundColor: secondary }]}
            onPress={() => router.push("/destinations")}
          >
            <Text style={styles.buttonText}>Explore Destinations</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.outlineButton]}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.outlineButtonText}>Plan a Trip</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <BoardingPassCard
          fromCity="Surat"
          fromCode="STV"
          toCity="Bali"
          toCode="DPS"
          date="12 Nov"
          duration="7h 40m"
          price={899}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.teal,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  content: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    color: theme.colors.gold,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  webH1: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: theme.colors.sand,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  buttonText: {
    color: theme.colors.sand,
    fontWeight: "700",
    fontSize: 14,
  },
  outlineButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  outlineButtonText: {
    color: theme.colors.sand,
    fontWeight: "700",
    fontSize: 14,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
