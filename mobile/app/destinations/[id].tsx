import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getDestinationById } from "../../data/destinationData";

export default function DestinationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const destinationId = Array.isArray(id) ? id[0] : id;
  const destination = destinationId ? getDestinationById(destinationId) : undefined;

  if (!destination) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Destination not found</Text>
        <Text style={styles.notFoundText}>This destination is no longer available.</Text>
        <Pressable onPress={() => router.replace("/destinations")} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to destinations</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to destinations</Text>
      </Pressable>

      <Image source={{ uri: destination.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <Text style={styles.title}>{destination.name}</Text>
          <Text style={styles.country}>{destination.country}</Text>
        </View>
        <View style={styles.rating}><Text style={styles.ratingText}>★ {destination.rating}</Text></View>
      </View>

      <Text style={styles.description}>{destination.longDescription}</Text>

      <View style={styles.detailsCard}>
        <Detail label="Price" value={`$${destination.price}`} highlight />
        <Detail label="Duration" value={destination.duration} />
        <View style={styles.tagsDetail}>
          <Text style={styles.detailLabel}>TAGS</Text>
          <View style={styles.tags}>{destination.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>
        </View>
      </View>

      <Pressable
        onPress={() => router.push({ pathname: "/trips/create", params: { destinationId: destination.id } })}
        style={({ pressed }) => [styles.planButton, pressed && styles.planButtonPressed]}
      >
        <Text style={styles.planButtonText}>Plan a Trip Here</Text>
      </Pressable>
    </ScrollView>
  );
}

function Detail({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={[styles.detailValue, highlight && styles.price]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7ED" },
  content: { padding: 24, paddingBottom: 40 },
  backLink: { alignSelf: "flex-start", marginBottom: 18, paddingVertical: 4 },
  backLinkText: { color: "#0F766E", fontFamily: "monospace", fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase" },
  image: { borderRadius: 18, height: 240, width: "100%" },
  titleRow: { alignItems: "flex-start", flexDirection: "row", gap: 16, justifyContent: "space-between", marginTop: 22 },
  titleContent: { flex: 1 },
  title: { color: "#1F2937", fontSize: 32, fontWeight: "700", lineHeight: 39 },
  country: { color: "rgba(31, 41, 55, 0.55)", fontSize: 16, marginTop: 3 },
  rating: { backgroundColor: "#FFFFFF", borderColor: "rgba(212, 175, 55, 0.7)", borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  ratingText: { color: "#0F766E", fontFamily: "monospace", fontSize: 13, fontWeight: "700" },
  description: { color: "rgba(31, 41, 55, 0.8)", fontSize: 16, lineHeight: 25, marginTop: 24 },
  detailsCard: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 18, borderWidth: 1, flexDirection: "row", flexWrap: "wrap", gap: 20, marginTop: 28, padding: 20 },
  detail: { minWidth: "42%" },
  detailLabel: { color: "rgba(31, 41, 55, 0.45)", fontFamily: "monospace", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  detailValue: { color: "#1F2937", fontSize: 15, fontWeight: "700", marginTop: 6 },
  price: { color: "#E76F51" },
  tagsDetail: { width: "100%" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { backgroundColor: "#F5EBD7", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  tagText: { color: "#1F2937", fontSize: 12, textTransform: "capitalize" },
  planButton: { alignItems: "center", backgroundColor: "#E76F51", borderRadius: 999, marginTop: 28, padding: 15 },
  planButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  planButtonText: { color: "#FAF7ED", fontSize: 15, fontWeight: "700" },
  notFound: { alignItems: "center", backgroundColor: "#FAF7ED", flex: 1, justifyContent: "center", padding: 24 },
  notFoundTitle: { color: "#1F2937", fontSize: 24, fontWeight: "700" },
  notFoundText: { color: "rgba(31, 41, 55, 0.65)", fontSize: 15, marginTop: 8, textAlign: "center" },
  backButton: { backgroundColor: "#0F766E", borderRadius: 999, marginTop: 24, paddingHorizontal: 18, paddingVertical: 12 },
  backButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
