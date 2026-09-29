import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

const testimonials = [
  {
    quote:
      "Booked our Bali trip in ten minutes and the itinerary tool actually kept us organized the whole week.",
    name: "R. Mehta",
    location: "Surat, India",
  },
  {
    quote:
      "The pricing was exactly what we saw upfront. No surprise fees at checkout, which is rare these days.",
    name: "L. Andersen",
    location: "Oslo, Norway",
  },
  {
    quote:
      "Patagonia was the trip of a lifetime. The destination notes were more useful than any guidebook.",
    name: "T. Osei",
    location: "Accra, Ghana",
  },
];

export default function Testimonials() {
  const { branding } = useAppConfig();
  const websiteName = branding.name?.trim() || "";

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>POSTCARDS FROM TRAVELERS</Text>
      <Text style={styles.title}>
        {websiteName ? `What travelers say about ${websiteName}` : "What travelers say"}
      </Text>

      <View style={styles.list}>
        {testimonials.map((t) => (
          <View key={t.name} style={styles.card}>
            <Text style={styles.quote}>&ldquo;{t.quote}&rdquo;</Text>
            <View style={styles.authorRow}>
              <Text style={styles.authorText}>
                {t.name} · {t.location}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: theme.colors.gold,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.sand,
    marginBottom: 24,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.sand,
    borderRadius: 20,
    padding: 20,
  },
  quote: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.ink,
    marginBottom: 16,
    fontStyle: "italic",
  },
  authorRow: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    paddingTop: 10,
  },
  authorText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#64748b",
  },
});
