import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

export default function BrandPhilosophy() {
  const items = [
    {
      number: "01",
      title: "Discover",
      text: "Find places beyond the obvious and travel with a sense of curiosity.",
    },
    {
      number: "02",
      title: "Experience",
      text: "Travel through real experiences, slower moments and local character.",
    },
    {
      number: "03",
      title: "Remember",
      text: "Take home stories worth telling and a sense of place that lingers.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Travel is not about checking places off a list.
      </Text>
      <Text style={styles.lede}>
        We believe the best journeys leave you with stories, unexpected moments
        and places you never expected to love.
      </Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.number} style={styles.itemCard}>
            <Text style={styles.number}>{item.number}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#fffdf9",
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 32,
    marginBottom: 10,
  },
  lede: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e8dcc5",
    ...theme.shadows.sm,
  },
  number: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "800",
    color: theme.colors.coral,
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    lineHeight: 19,
    color: "#475569",
  },
});
