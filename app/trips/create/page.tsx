import { Suspense } from "react";
import BrandTripCreate from "@/components/trips/BrandTripCreate";

export default function CreateTripPage() {
  return (
    <Suspense fallback={<div className="px-6 py-16 text-center text-slate-600">Loading...</div>}>
      <BrandTripCreate />
    </Suspense>
  );
}