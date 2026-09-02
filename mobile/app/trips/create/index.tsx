import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { destinations } from "../../../data/destinationData";
import { apiFetch } from "../../../lib/apiClient";

type TripResponse = { id: string };
type CheckoutResponse = { checkoutUrl: string; paymentId: string };

export default function CreateTripPage() {
  const router = useRouter();
  const { destinationId: selectedId } = useLocalSearchParams<{ destinationId?: string }>();
  const [destinationId, setDestinationId] = useState(selectedId ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("1000");
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const destination = destinations.find((item) => item.id === destinationId);
    if (!destination || !startDate || !endDate || Number(travelers) < 1 || Number(amount) < 1) { Alert.alert("Check your trip details", "Select a destination and enter valid dates, travelers, and amount."); return; }
    setLoading(true);
    try {
      const trip = await apiFetch<TripResponse>("/api/trips", { method: "POST", body: JSON.stringify({ destinationId: destination.id, destinationName: destination.name, startDate, endDate, travelers: Number(travelers), notes: notes || null }) });
      const checkout = await apiFetch<CheckoutResponse>("/api/payments/checkout", { method: "POST", body: JSON.stringify({ tripId: trip.id, amount: Number(amount), currency }) });
      if (checkout.checkoutUrl.startsWith("/")) {
        router.replace(checkout.checkoutUrl as never);
      } else {
        await Linking.openURL(checkout.checkoutUrl);
      }
    } catch (error) { Alert.alert("Trip not created", error instanceof Error ? error.message : "Please try again."); }
    finally { setLoading(false); }
  }

  return <ScrollView contentContainerStyle={styles.content} style={styles.screen} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Plan a New Trip</Text><Text style={styles.label}>Destination</Text><View style={styles.destinations}>{destinations.map((destination) => <Pressable key={destination.id} onPress={() => setDestinationId(destination.id)} style={[styles.choice, destination.id === destinationId && styles.choiceActive]}><Text style={styles.choiceText}>{destination.name}, {destination.country}</Text></Pressable>)}</View>
    <Field label="Start date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} placeholder="2026-12-01" /><Field label="End date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} placeholder="2026-12-08" /><Field label="Travelers" value={travelers} onChangeText={setTravelers} keyboardType="number-pad" /><Field label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="Any special requirements?" />
    <View style={styles.payment}><Text style={styles.paymentTitle}>Payment</Text><Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" /><Text style={styles.label}>Currency</Text><View style={styles.currencyRow}>{["usd", "inr", "eur", "gbp"].map((item) => <Pressable key={item} onPress={() => setCurrency(item)} style={[styles.currency, item === currency && styles.choiceActive]}><Text style={styles.choiceText}>{item.toUpperCase()}</Text></Pressable>)}</View><Text style={styles.total}>Payment amount: {currency.toUpperCase()} {amount || "0"}</Text></View>
    <Pressable disabled={loading} onPress={submit} style={[styles.pay, loading && styles.disabled]}><Text style={styles.payText}>{loading ? "Creating trip..." : `Pay ${currency.toUpperCase()} ${amount || "0"}`}</Text></Pressable>
  </ScrollView>;
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} placeholderTextColor="#9CA3AF" style={[styles.input, props.multiline && styles.notes]} /></View>; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#FAF7ED" }, content: { padding: 24, paddingTop: 48, gap: 16 }, title: { color: "#1F2937", fontSize: 30, fontWeight: "700", marginBottom: 10 }, label: { color: "rgba(31, 41, 55, 0.7)", fontSize: 14, fontWeight: "600", marginBottom: 7 }, destinations: { gap: 8 }, choice: { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: 10, borderWidth: 1, padding: 12 }, choiceActive: { borderColor: "#0F766E", borderWidth: 2 }, choiceText: { color: "#1F2937", fontSize: 14 }, field: { gap: 0 }, input: { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: 10, borderWidth: 1, color: "#1F2937", fontSize: 15, padding: 13 }, notes: { height: 100, textAlignVertical: "top" }, payment: { backgroundColor: "rgba(255,255,255,0.6)", borderColor: "#E5E7EB", borderRadius: 14, borderWidth: 1, gap: 14, padding: 16 }, paymentTitle: { color: "#1F2937", fontSize: 19, fontWeight: "700" }, currencyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, currency: { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: 9, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 }, total: { color: "#1F2937", fontSize: 15, fontWeight: "700" }, pay: { alignItems: "center", backgroundColor: "#0F766E", borderRadius: 999, marginTop: 8, padding: 15 }, disabled: { opacity: 0.6 }, payText: { color: "#FAF7ED", fontSize: 14, fontWeight: "700" } });
