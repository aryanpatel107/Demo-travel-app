import { View, Text, StyleSheet } from "react-native";

const stats = [
  { value: "120+", label: "Destinations" },
  { value: "48K", label: "Trips Booked" },
  { value: "4.8/5", label: "Traveler Rating" },
  { value: "24/7", label: "Support" },
];

export default function Stats() {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.value}>
              {stat.value}
            </Text>

            <Text style={styles.label}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 48,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 32,
  },

  stat: {
    width: "48%",
    alignItems: "center",
  },

  value: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "600",
    color: "#0F766E",
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "rgba(31, 41, 55, 0.5)",
    fontFamily: "monospace",
    textAlign: "center",
  },
});