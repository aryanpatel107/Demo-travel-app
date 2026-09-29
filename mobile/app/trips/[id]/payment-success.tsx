import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToast } from "@/components/ui/Toast";
import { theme } from "@/constants/theme";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    paymentId?: string;
    status?: string;
  }>();
  const { showToast } = useToast();

  const status = params.status || "success";
  const paymentId = params.paymentId || "PAY-123456";

  const isSuccess = status === "success";
  const isFailed = status === "failed";
  const isCancelled = status === "cancelled";

  useEffect(() => {
    if (isSuccess) {
      showToast("Payment completed successfully.", "success");
    } else if (isFailed) {
      showToast("Payment could not be completed.", "error");
    } else {
      showToast("Payment was cancelled.", "info");
    }
  }, [isSuccess, isFailed]);

  const heading = isCancelled
    ? "Payment Cancelled"
    : isFailed
    ? "Payment Failed"
    : "Payment Successful";

  const message = isCancelled
    ? "Your trip remains created, and you can retry payment when you are ready."
    : isFailed
    ? "Your trip has been created, but the payment could not be completed."
    : "Your payment has been completed successfully. Your booking is confirmed!";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          isSuccess && styles.successCard,
          isFailed && styles.failedCard,
          isCancelled && styles.cancelledCard,
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            isSuccess && styles.successIcon,
            isFailed && styles.failedIcon,
            isCancelled && styles.cancelledIcon,
          ]}
        >
          <Text style={styles.iconText}>
            {isSuccess ? "✓" : isFailed ? "✕" : "!"}
          </Text>
        </View>

        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.message}>{message}</Text>

        {Boolean(paymentId) && (
          <Text style={styles.paymentId}>Reference: {paymentId}</Text>
        )}

        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: isSuccess ? "#059669" : "#0284c7" }]}
            onPress={() => router.push("/(tabs)/trips")}
          >
            <Text style={styles.primaryBtnText}>View My Trips</Text>
          </Pressable>

          {!isSuccess && (
            <Pressable
              style={styles.retryBtn}
              onPress={() => router.push(`/trips/${params.id}` as any)}
            >
              <Text style={styles.retryBtnText}>Retry payment</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.md,
  },
  successCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  failedCard: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  cancelledCard: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: "#dcfce7",
  },
  failedIcon: {
    backgroundColor: "#fee2e2",
  },
  cancelledIcon: {
    backgroundColor: "#fef3c7",
  },
  iconText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
  },
  paymentId: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#64748b",
    marginBottom: 24,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  retryBtn: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  retryBtnText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
});
