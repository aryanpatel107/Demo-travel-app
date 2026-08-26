"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("paymentId");

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-emerald-800">
          Payment Successful
        </h1>

        <p className="mt-3 text-emerald-700">
          Your trip has been created and your payment has been recorded.
        </p>

        {paymentId && (
          <p className="mt-4 text-sm text-slate-600">
            Payment ID: {paymentId}
          </p>
        )}

        <button
          onClick={() => router.push("/trips")}
          className="mt-6 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
        >
          View My Trips
        </button>
      </div>
    </section>
  );
}