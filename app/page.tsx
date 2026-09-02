import BrandShell from "@/components/brand/BrandShell";
import BrandHero from "@/components/brand/BrandHero";
import BrandDestinations from "@/components/brand/BrandDestinations";
import BrandBooking from "@/components/brand/BrandBooking";
import BrandPhilosophy from "@/components/brand/BrandPhilosophy";

export default function HomePage() {
  return (
    <BrandShell>
      <BrandHero />
      <BrandDestinations />
      <BrandPhilosophy />
      <BrandBooking />
    </BrandShell>
  );
}