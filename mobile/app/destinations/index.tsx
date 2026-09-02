import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import DestinationGrid from "../../components/DestinationGrid";
import SearchBar from "../../components/SearchBar";
import { destinations } from "../../data/destinationData";

export default function DestinationsPage() {
  const [query, setQuery] = useState("");

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return destinations;

    return destinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(normalizedQuery) ||
        destination.country.toLowerCase().includes(normalizedQuery) ||
        destination.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  }, [query]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.title}>All Destinations</Text>
        <Text style={styles.subtitle}>Find your next unforgettable escape.</Text>
      </View>

      <SearchBar
        onSearch={setQuery}
        placeholder="Search by name, country, or tag..."
      />

      <DestinationGrid destinations={filteredDestinations} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 24,
    gap: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "rgba(31, 41, 55, 0.65)",
  },
});
