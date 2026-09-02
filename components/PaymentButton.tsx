"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  tripId: string;
  amount: number;
}

export default function PaymentButton({ tripId, amount }: PaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, amount }),
      });

      const responseText = await res.text();
      if (!responseText) {
        throw new Error("The payment service returned an empty response.");
      }

      const data = JSON.parse(responseText) as { checkoutUrl?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed with status ${res.status}`);
      }

      if (!data.checkoutUrl) {
        throw new Error("The payment service did not return a checkout URL.");
      }

      router.push(data.checkoutUrl);
    } catch (error) {
      console.error("Payment checkout failed:", error);
      alert(error instanceof Error ? error.message : "Payment checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-full bg-coral px-6 py-3 text-sm font-semibold text-sand transition-transform hover:scale-105 disabled:opacity-60"
    >
      {loading ? "Redirecting..." : `Pay $${amount}`}
    </button>
  );
}