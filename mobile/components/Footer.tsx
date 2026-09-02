import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© {new Date().getFullYear()} WANDERLY TRAVEL CO.</Text>
      <Text style={styles.text}>FLY · EXPLORE · RETURN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "#1F2937",
  },
  text: {
    color: "rgba(250, 247, 237, 0.7)",
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "center",
  },
});
