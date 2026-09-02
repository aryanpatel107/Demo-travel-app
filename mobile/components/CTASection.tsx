import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function CTASection() {
  const router = useRouter();

  const handleExplore = () => {
    router.push("/destinations");
  };

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        {/* Label */}
        <Text style={styles.label}>
          Ready when you are
        </Text>

        {/* Heading */}
        <Text style={styles.heading}>
          Your next trip is one boarding pass away
        </Text>

        {/* Button */}
        <Pressable
          onPress={handleExplore}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            Start Exploring
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    maxWidth: 1152,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 80,
  },

  card: {
    width: "100%",
    alignItems: "center",
    gap: 24,

    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 32,
    paddingVertical: 56,
  },

  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#E76F51",
    fontFamily: "monospace",
    textAlign: "center",
  },

  heading: {
    maxWidth: 500,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },

  button: {
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: "#E76F51",
    paddingHorizontal: 32,
    paddingVertical: 12,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FAF7ED",
  },
});