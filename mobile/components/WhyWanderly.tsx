import { View, Text, StyleSheet } from "react-native";

const features = [
  {
    code: "01",
    title: "Curated, not crowdsourced",
    description:
      "Every destination is reviewed by our travel team before it makes the list — no filler, no tourist traps.",
  },
  {
    code: "02",
    title: "Transparent pricing",
    description:
      "The fare you see is the fare you pay. No hidden fees revealed at checkout.",
  },
  {
    code: "03",
    title: "Flexible trip planning",
    description:
      "Build your itinerary in minutes, adjust dates and travelers anytime before you fly.",
  },
];

export default function WhyWanderly() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Why Wanderly</Text>

      <Text style={styles.heading}>
        Travel planning that respects your time
      </Text>

      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <View key={feature.code} style={styles.feature}>
            <Text style={styles.code}>{feature.code}</Text>

            <Text style={styles.title}>{feature.title}</Text>

            <Text style={styles.description}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1152,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 80,
  },

  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#E76F51",
    fontFamily: "monospace",
  },

  heading: {
    marginTop: 8,
    maxWidth: 520,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "600",
    color: "#1F2937",
  },

  featuresContainer: {
    marginTop: 48,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 32,
  },

  feature: {
    flex: 1,
    minWidth: 250,
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 175, 55, 0.5)",
    paddingTop: 20,
  },

  code: {
    fontSize: 12,
    color: "rgba(31, 41, 55, 0.4)",
    fontFamily: "monospace",
  },

  title: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: "#1F2937",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(31, 41, 55, 0.7)",
  },
});