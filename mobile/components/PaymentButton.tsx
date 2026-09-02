import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text } from "react-native";

import { apiFetch } from "../lib/apiClient";

interface PaymentButtonProps {
  tripId: string;
  amount: number;
}

export default function PaymentButton({ tripId, amount }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const checkout = await apiFetch<{ checkoutUrl?: string }>("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ tripId, amount }),
      });

      if (!checkout.checkoutUrl) throw new Error("The payment service did not return a checkout URL.");
      await Linking.openURL(checkout.checkoutUrl);
    } catch (error) {
      Alert.alert("Payment unavailable", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable disabled={loading} onPress={handlePay} style={[styles.button, loading && styles.disabled]}>
      <Text style={styles.text}>{loading ? "Redirecting..." : `Pay $${amount}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: 999, backgroundColor: "#E76F51", padding: 14 },
  disabled: { opacity: 0.6 },
  text: { color: "#FAF7ED", fontSize: 14, fontWeight: "700" },
});
