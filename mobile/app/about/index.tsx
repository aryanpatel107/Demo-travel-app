import { ScrollView, StyleSheet, Text } from "react-native";

export default function AboutPage() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Text style={styles.eyebrow}>OUR STORY</Text>
      <Text style={styles.title}>About Wanderly</Text>
      <Text style={styles.body}>
        Wanderly is a travel planning platform built for explorers who want more than a checklist of tourist spots. We curate destinations based on real experiences, connect you with trip-planning tools, and help you turn inspiration into an itinerary. Whether you are chasing mountain trails or quiet coastlines, Wanderly is here to help you get there.
      </Text>
      <Text style={styles.body}>
        This project is a demo application showcasing modern React, TypeScript, and Expo Router.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7ED" },
  content: { padding: 24, paddingTop: 48 },
  eyebrow: { color: "#E76F51", fontFamily: "monospace", fontSize: 12, letterSpacing: 2 },
  title: { marginTop: 8, marginBottom: 24, color: "#1F2937", fontSize: 30, fontWeight: "700" },
  body: { marginBottom: 16, color: "rgba(31, 41, 55, 0.8)", fontSize: 16, lineHeight: 25 },
});
