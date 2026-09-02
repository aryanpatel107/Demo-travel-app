import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

import Hero from "../components/Hero";
import Stats from "../components/Stats";
import WhyWanderly from "../components/WhyWanderly";
import DestinationGrid from "../components/DestinationGrid";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

import { destinations } from "../data/destinationData";

export default function HomePage() {
  const router = useRouter();

  const featured = destinations.slice(0, 3);

  const handleViewAll = () => {
    router.push("/destinations");
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <Hero
        title="Explore the World, One Trip at a Time"
        subtitle="Curated destinations, unforgettable experiences, and trips built around you."
      />

      {/* Stats */}
      <Stats />

      {/* Why Wanderly */}
      <WhyWanderly />

      {/* Featured Destinations */}
      <View style={styles.featuredSection}>
        <View style={styles.featuredHeader}>
          <View>
            <Text style={styles.label}>
              Featured
            </Text>

            <Text style={styles.heading}>
              Popular Destinations
            </Text>
          </View>

          <Pressable
            onPress={handleViewAll}
            style={({ pressed }) => [
              styles.viewAllButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.viewAllText}>
              View all →
            </Text>
          </Pressable>
        </View>

        <DestinationGrid destinations={featured} />
      </View>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <CTASection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FAF7ED",
  },

  contentContainer: {
    paddingBottom: 20,
  },

  featuredSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  featuredHeader: {
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#E76F51",
    fontFamily: "monospace",
  },

  heading: {
    marginTop: 4,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
    color: "#1F2937",
  },

  viewAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  buttonPressed: {
    opacity: 0.6,
  },

  viewAllText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#0F766E",
    fontFamily: "monospace",
  },
});
