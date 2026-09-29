import React, { useState } from "react";
import { Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { Colors } from "../constants/theme";
import { useBrandConfig } from "../contexts/BrandConfigContext";
import { useToast } from "./ui/Toast";
import { createCheckoutApi } from "../lib/apiClient";

interface PaymentButtonProps {
  tripId: string;
  amount?: number;
  currency?: string;
  disabled?: boolean;
  label?: string;
  onPress?: () => void;
}

export function PaymentButton({
  tripId,
  amount,
  currency = "USD",
  disabled = false,
  label,
  onPress,
}: PaymentButtonProps) {
  const router = useRouter();
  const { primaryColor, brandKey } = useBrandConfig();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || loading) return;
    if (onPress) {
      onPress();
      return;
    }
    setLoading(true);

    try {
      const response = await createCheckoutApi(
        {
          tripId,
          amount: amount || 0,
          currency,
        },
        brandKey
      );

      const checkoutUrl = response?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from payment service.");
      }

      showToast("Redirecting to checkout...", "info");

      // External payment gateway (e.g. Stripe, Razorpay)
      if (/^https?:\/\//i.test(checkoutUrl)) {
        await WebBrowser.openBrowserAsync(checkoutUrl);
      } else {
        // Internal in-app route returned by backend (e.g. /trips/:id/payment-success?...)
        router.push(checkoutUrl as any);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to initiate payment checkout.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleCheckout}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: primaryColor },
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Text style={styles.text}>
          {label || `Proceed to Checkout ${amount ? `(${currency} ${amount})` : ""}`}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default PaymentButton;
