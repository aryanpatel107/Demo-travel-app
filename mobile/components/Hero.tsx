import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import BoardingPassCard from "./BoardingPassCard";

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <View style={styles.textSection}>
          <Text style={styles.eyebrow}>NOW BOARDING</Text>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.buttons}>

            <Pressable
              style={styles.exploreButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.exploreText}>
                Explore Destinations
              </Text>
            </Pressable>

            <Pressable
              style={styles.planButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.planText}>
                Plan a Trip
              </Text>
            </Pressable>

          </View>
        </View>

        <View style={styles.cardSection}>
          <BoardingPassCard
            fromCity="Surat"
            fromCode="STV"
            toCity="Bali"
            toCode="DPS"
            date="12 Nov"
            duration="7h 40m"
            price={899}
          />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F766E",
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 60,
  },

  textSection: {
    marginBottom: 40,
  },

  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: "600",
    color: "#E8C766",
  },

  title: {
    marginTop: 16,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    color: "#F5EBD7",
  },

  subtitle: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 25,
    color: "#CCFBF1",
  },

  buttons: {
    marginTop: 30,
    gap: 12,
  },

  exploreButton: {
    backgroundColor: "#E76F51",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  exploreText: {
    color: "#F5EBD7",
    fontSize: 14,
    fontWeight: "600",
  },

  planButton: {
    borderWidth: 1,
    borderColor: "rgba(245, 235, 215, 0.4)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  planText: {
    color: "#F5EBD7",
    fontSize: 14,
    fontWeight: "600",
  },

  cardSection: {
    alignItems: "center",
  },
});