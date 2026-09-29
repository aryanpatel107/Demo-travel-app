import React from "react";
import { View, StyleSheet, Text } from "react-native";
import type { Destination } from "@/data/destinations";
import { DestinationCard } from "./DestinationCard";
import { Colors } from "@/constants/theme";

interface DestinationGridProps {
  destinations: Destination[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DestinationGrid({
  destinations,
}: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No destinations found</Text>
        <Text style={styles.emptySubtitle}>Try adjusting your search criteria or tags.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {destinations.map((item) => (
        <View key={item.id} style={styles.itemWrapper}>
          <DestinationCard destination={item} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  itemWrapper: {
    marginBottom: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.slate900,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.slate500,
  },
});

export default DestinationGrid;
