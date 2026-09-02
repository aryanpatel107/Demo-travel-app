import Link from "next/link";
import { config } from "@/config";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-gold/40 bg-white px-8 py-14 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-coral">Ready when you are</p>
        <h2 className="max-w-lg font-display text-3xl font-semibold text-ink">
          {config.sectionTitles.cta}
        </h2>
        <Link
          href="/destinations"
          className="rounded-full bg-coral px-8 py-3 text-sm font-semibold text-sand transition-transform hover:scale-105"
        >
          Start Exploring
        </Link>
      </div>
    </section>
  );
}