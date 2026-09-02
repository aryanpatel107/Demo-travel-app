import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { paymentId } = useLocalSearchParams<{ paymentId?: string }>();
  return <View style={styles.screen}><View style={styles.card}><View style={styles.icon}><Text style={styles.iconText}>✓</Text></View><Text style={styles.title}>Payment Successful</Text><Text style={styles.body}>Your trip has been created and your payment has been recorded.</Text>{paymentId ? <Text style={styles.id}>Payment ID: {paymentId}</Text> : null}<Pressable onPress={() => router.replace("/trips")} style={styles.button}><Text style={styles.buttonText}>View My Trips</Text></Pressable></View></View>;
}

const styles = StyleSheet.create({ screen: { alignItems: "center", backgroundColor: "#FAF7ED", flex: 1, justifyContent: "center", padding: 24 }, card: { alignItems: "center", backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", borderRadius: 20, borderWidth: 1, padding: 28, width: "100%" }, icon: { alignItems: "center", backgroundColor: "#D1FAE5", borderRadius: 32, height: 64, justifyContent: "center", width: 64 }, iconText: { color: "#047857", fontSize: 32, fontWeight: "700" }, title: { color: "#065F46", fontSize: 27, fontWeight: "700", marginTop: 18 }, body: { color: "#047857", fontSize: 15, lineHeight: 22, marginTop: 12, textAlign: "center" }, id: { color: "#4B5563", fontSize: 12, marginTop: 16 }, button: { backgroundColor: "#0F766E", borderRadius: 999, marginTop: 24, paddingHorizontal: 22, paddingVertical: 13 }, buttonText: { color: "#FFF", fontSize: 14, fontWeight: "700" } });
