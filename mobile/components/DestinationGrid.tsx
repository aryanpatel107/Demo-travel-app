import { View, Text, StyleSheet } from "react-native";
import type { Destination } from "../type/destination";
import DestinationCard from "./DestinationCard";

interface DestinationGridProps {
  destinations: Destination[];
}

export default function DestinationGrid({
  destinations,
}: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <Text style={styles.emptyText}>
        No destinations match your search.
      </Text>
    );
  }

  return (
    <View style={styles.grid}>
      {destinations.map((destination) => (
        <View key={destination.id} style={styles.cardWrapper}>
          <DestinationCard destination={destination} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 24,
  },

  cardWrapper: {
    width: "100%",
  },

  emptyText: {
    paddingVertical: 48,
    textAlign: "center",
    fontSize: 14,
    color: "rgba(31, 41, 55, 0.5)",
  },
});
