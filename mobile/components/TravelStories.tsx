import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

const stories = [
  {
    title: "Bali sunrise reset",
    summary: "A slow island week with beach mornings and temple evenings.",
  },
  {
    title: "Kyoto in motion",
    summary: "Historic lanes, tea rituals, and quiet city mornings.",
  },
  {
    title: "Patagonia at full scale",
    summary: "Long trails, big skies, and unforgettable glacier views.",
  },
];

export default function TravelStories() {
  const { branding, primaryColor } = useAppConfig();
  const websiteName = branding.name?.trim() || "";
  const resolvedColor = primaryColor || theme.colors.coral;

  return (
    <View style={styles.container}>
      <Text style={[styles.kicker, { color: resolvedColor }]}>TRAVEL STORIES</Text>
      <Text style={styles.title}>
        {websiteName ? `Travel stories from ${websiteName}` : "Travel stories"}
      </Text>

      <View style={styles.grid}>
        {stories.map((story) => (
          <View key={story.title} style={styles.storyCard}>
            <Text style={styles.storyBadge}>STORY</Text>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storySummary}>{story.summary}</Text>
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
  grid: {
    gap: 14,
  },
  storyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  storyBadge: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "700",
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  storySummary: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748b",
  },
});
