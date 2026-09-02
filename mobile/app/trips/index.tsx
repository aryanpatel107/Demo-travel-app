import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { apiFetch } from "../../lib/apiClient";

type Trip = { id: string; destinationName: string; startDate: string; endDate: string; travelers: number; paymentStatus?: string };

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try { setTrips(await apiFetch<Trip[]>("/api/trips")); setError(""); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load your trips."); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { void loadTrips(); }, [loadTrips]));

  return <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
    <View style={styles.header}><Text style={styles.title}>Your Trips</Text><Pressable onPress={() => router.push("/trips/create")} style={styles.newButton}><Text style={styles.newText}>+ New Trip</Text></Pressable></View>
    {loading ? <ActivityIndicator color="#0F766E" /> : error ? <Text style={styles.error}>{error}</Text> : trips.length === 0 ? <Text style={styles.empty}>You have not planned any trips yet.</Text> : <View style={styles.list}>{trips.map((trip) => <View key={trip.id} style={styles.card}><View><Text style={styles.destination}>{trip.destinationName}</Text><Text style={styles.date}>{trip.startDate.slice(0, 10)} → {trip.endDate.slice(0, 10)}</Text></View><View style={styles.right}><Text style={styles.travelers}>{trip.travelers} traveler{trip.travelers === 1 ? "" : "s"}</Text><Text style={trip.paymentStatus === "paid" ? styles.paid : styles.pending}>{trip.paymentStatus === "paid" ? "Paid" : "Payment pending"}</Text></View></View>)}</View>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7ED" }, content: { padding: 24, paddingTop: 48 }, header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 28 }, title: { color: "#1F2937", fontSize: 30, fontWeight: "700" }, newButton: { backgroundColor: "#E76F51", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 }, newText: { color: "#FAF7ED", fontSize: 13, fontWeight: "700" }, list: { gap: 14 }, card: { alignItems: "center", backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: 16, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: 18 }, destination: { color: "#1F2937", fontSize: 17, fontWeight: "700" }, date: { color: "rgba(31, 41, 55, 0.55)", fontFamily: "monospace", fontSize: 11, marginTop: 5 }, right: { alignItems: "flex-end" }, travelers: { color: "rgba(31, 41, 55, 0.7)", fontSize: 13 }, paid: { color: "#0F766E", fontFamily: "monospace", fontSize: 11, marginTop: 5 }, pending: { color: "#E76F51", fontFamily: "monospace", fontSize: 11, marginTop: 5 }, empty: { color: "rgba(31, 41, 55, 0.55)", fontSize: 15 }, error: { color: "#B91C1C", fontSize: 14 },
});
