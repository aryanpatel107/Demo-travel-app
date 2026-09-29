import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

const offers = [
  {
    name: "Coastal Escape",
    price: "$899",
    note: "7 nights from Lisbon",
  },
  {
    name: "City Sprint",
    price: "$649",
    note: "3-day Paris upgrade",
  },
  {
    name: "Alpine Reset",
    price: "$1,199",
    note: "Swiss mountain route",
  },
];

export default function SpecialOffers() {
  const { branding, primaryColor } = useAppConfig();
  const websiteName = branding.name?.trim() || "";
  const resolvedColor = primaryColor || theme.colors.coral;

  return (
    <View style={styles.container}>
      <Text style={[styles.kicker, { color: resolvedColor }]}>OFFERS</Text>
      <Text style={styles.title}>
        {websiteName ? `Special offers from ${websiteName}` : "Special offers"}
      </Text>

      <View style={styles.offersGrid}>
        {offers.map((offer) => (
          <View key={offer.name} style={styles.offerCard}>
            <Text style={styles.limitedBadge}>LIMITED</Text>
            <Text style={styles.offerName}>{offer.name}</Text>
            <Text style={[styles.offerPrice, { color: resolvedColor }]}>
              {offer.price}
            </Text>
            <Text style={styles.offerNote}>{offer.note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },
  offersGrid: {
    gap: 14,
  },
  offerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  limitedBadge: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "700",
    marginBottom: 6,
  },
  offerName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  offerPrice: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  offerNote: {
    fontSize: 13,
    color: "#64748b",
  },
});
