import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

const stats = [
  { value: "120+", label: "Destinations" },
  { value: "48K", label: "Trips Booked" },
  { value: "4.8/5", label: "Traveler Rating" },
  { value: "24/7", label: "Support" },
];

export default function Stats() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statBox}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  statBox: {
    width: "48%",
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.teal,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#64748b",
    textTransform: "uppercase",
  },
});
