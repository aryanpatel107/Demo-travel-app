"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status") ?? "success";

  const paymentState = useMemo(() => {
    if (status === "cancelled") return "cancelled";
    if (status === "failed") return "failed";
    return "success";
  }, [status]);

  const heading =
    paymentState === "cancelled"
      ? "Payment Cancelled"
      : paymentState === "failed"
        ? "Payment Failed"
        : "Payment Successful";

  const message =
    paymentState === "cancelled"
      ? "Your trip remains created, and you can retry payment when you are ready."
      : paymentState === "failed"
        ? "Your trip has been created, but the payment could not be completed."
        : "Your payment has been completed successfully.";

  const successIcon =
    paymentState === "cancelled"
      ? "!"
      : paymentState === "failed"
        ? "×"
        : "✓";

  const successTone =
    paymentState === "cancelled"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : paymentState === "failed"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-emerald-200 bg-emerald-50 text-emerald-800";

  const buttonLabel = paymentState === "cancelled" || paymentState === "failed" ? "Back to trips" : "View My Trips";

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <div className={`rounded-2xl border p-8 shadow-sm ${successTone}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-3xl">
          {successIcon}
        </div>

        <h1 className="text-3xl font-bold">
          {heading}
        </h1>

        <p className="mt-3">
          {message}
        </p>

        {paymentId && (
          <p className="mt-4 text-sm text-slate-600">
            Payment ID: {paymentId}
          </p>
        )}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/trips")}
            className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            {buttonLabel}
          </button>

          {(paymentState === "cancelled" || paymentState === "failed") && (
            <button
              onClick={() => router.push("/trips/create")}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Retry payment
            </button>
          )}
        </div>
      </div>
    </section>
  );
}