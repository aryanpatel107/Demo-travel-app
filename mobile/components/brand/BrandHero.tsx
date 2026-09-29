import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

export default function BrandHero() {
  const router = useRouter();
  const { branding, primaryColor, brandKey } = useAppConfig();

  const brandName = branding.name?.trim() || "";
  const normalizedBrandName = brandName.toLowerCase().replace(/\s+/g, "");

  const resolvedPrimary = primaryColor || branding.primaryColor || theme.colors.teal;

  const isWanderly =
    brandKey === "wanderly" ||
    normalizedBrandName.includes("wanderly") ||
    normalizedBrandName.includes("gujju");

  const isTravelPro =
    brandKey === "travelpro" ||
    normalizedBrandName.includes("travelpro");

  const [toCity, setToCity] = React.useState("Bali");

  const handleSearchFlights = () => {
    const q = toCity.trim();
    if (q) {
      router.push({
        pathname: "/(tabs)/destinations" as never,
        params: { q },
      });
    } else {
      router.push("/(tabs)/destinations" as never);
    }
  };

  if (isWanderly) {
    return (
      <View style={styles.wanderlyContainer}>
        <Text style={styles.eyebrow}>
          {brandName ? `${brandName.toUpperCase()} • TRAVEL DIFFERENT` : "TRAVEL DIFFERENT"}
        </Text>

        <View style={styles.headingWrap}>
          <Text style={styles.wanderlyTitle}>
            Find places{"\n"}
            <Text style={{ color: resolvedPrimary }}>
              {brandName ? `with ${brandName}.` : "worth remembering."}
            </Text>
          </Text>
        </View>

        <Text style={styles.wanderlySubtitle}>
          Discover journeys shaped by wonder, stories, and slower, richer travel.
          From breathtaking landscapes to extraordinary escapes, we make every travel
          experience effortless and memorable.
        </Text>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: resolvedPrimary }]}
            onPress={() => router.push("/destinations")}
          >
            <Text style={styles.primaryButtonText}>Explore</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/trips/create")}
          >
            <Text style={styles.secondaryButtonText}>Plan a trip</Text>
          </Pressable>
        </View>

        <View style={styles.imageCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.floatingCard}>
            <Text style={styles.floatingLabel}>FEATURED ESCAPE</Text>
            <View style={styles.floatingRow}>
              <View>
                <Text style={styles.floatingTitle}>Kerala & Heritage</Text>
                <Text style={styles.floatingMeta}>India • Backwaters</Text>
              </View>
              <Text style={[styles.floatingPrice, { color: resolvedPrimary }]}>
                7 days
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (isTravelPro) {
    return (
      <View style={styles.travelProContainer}>
        <Text style={[styles.eyebrow, { color: "#0284c7" }]}>TRIPGOASIA</Text>
        <View style={styles.headingWrap}>
          <Text style={styles.travelProTitle}>
            Explore Asia{"\n"}
            <Text style={{ color: "#0f172a" }}>with Confidence.</Text>
          </Text>
        </View>

        <Text style={styles.travelProSubtitle}>
          Plan trips with clarity, compare routes with confidence, and keep every
          detail organized from departure to destination.
        </Text>

        <View style={styles.searchBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FROM</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Surat"
              placeholderTextColor="#94a3b8"
              defaultValue="Surat"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TO</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Destination city"
              placeholderTextColor="#94a3b8"
              value={toCity}
              onChangeText={setToCity}
            />
          </View>

          <Pressable
            style={[styles.searchButton, { backgroundColor: resolvedPrimary }]}
            onPress={handleSearchFlights}
          >
            <Text style={styles.searchButtonText}>SEARCH FLIGHTS</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Default / MyTravel
  return (
    <View style={styles.myTravelContainer}>
      <Text style={[styles.eyebrow, { color: "#7c3aed" }]}>PERSONALIZED JOURNEYS</Text>
      <View style={styles.headingWrap}>
        <Text style={styles.myTravelTitle}>
          Your journey.{"\n"}
          <Text style={{ color: resolvedPrimary }}>Your way.</Text>
        </Text>
      </View>

      <Text style={styles.myTravelSubtitle}>
        Curated ideas and flexible plans built around your pace, your preferences,
        and the moments you want to remember.
      </Text>

      <Pressable
        style={[styles.primaryButton, { backgroundColor: resolvedPrimary, alignSelf: "center", marginBottom: 28 }]}
        onPress={() => router.push("/trips/create")}
      >
        <Text style={styles.primaryButtonText}>Create my trip →</Text>
      </Pressable>

      <View style={styles.vibeCardsRow}>
        {["Weekend escapes", "Adventure", "Relaxation"].map((label) => (
          <View key={label} style={styles.vibeCard}>
            <Text style={styles.vibeText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headingWrap: {
    marginBottom: 4,
  },
  wanderlyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fffdf9",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "800",
    color: theme.colors.coral,
    marginBottom: 8,
  },
  wanderlyTitle: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    color: theme.colors.ink,
    marginBottom: 12,
  },
  wanderlySubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#1e293b",
    fontWeight: "700",
    fontSize: 14,
  },
  imageCard: {
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  heroImage: {
    width: "100%",
    height: 240,
  },
  floatingCard: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 14,
    ...theme.shadows.md,
  },
  floatingLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 4,
  },
  floatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  floatingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  floatingMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  floatingPrice: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: "auto",
  },
  travelProContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#f8fafc",
  },
  travelProTitle: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    color: "#0f172a",
    marginBottom: 12,
  },
  travelProSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
    ...theme.shadows.md,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#64748b",
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  searchButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  myTravelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#fbfbfe",
    alignItems: "center",
  },
  myTravelTitle: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 12,
  },
  myTravelSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#475569",
    marginBottom: 20,
    maxWidth: 340,
  },
  vibeCardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  vibeCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ede9fe",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...theme.shadows.sm,
  },
  vibeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e1b4b",
  },
});
