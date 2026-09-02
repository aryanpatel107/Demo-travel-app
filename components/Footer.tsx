import Link from "next/link";
import { config } from "@/config";

export default function Footer() {
  if (config.name === "Wanderly") {
    return (
      <footer className="wanderly-footer">
        <div className="wanderly-footer__inner">
          <div>
            <p className="wanderly-footer__brand">Wanderly</p>
            <p className="wanderly-footer__meta">Travel stories, slow journeys and unforgettable escapes.</p>
          </div>

          <div className="wanderly-footer__links">
            <Link href="/about" className="brand-link">About</Link>
            <Link href="/destinations" className="brand-link">Destinations</Link>
            <Link href="/trips" className="brand-link">Trips</Link>
            <Link href="/contact" className="brand-link">Contact</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gold/30 bg-ink text-sand/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 font-mono text-xs sm:flex-row">
        <p>&copy; {new Date().getFullYear()} {config.name.toUpperCase()} TRAVEL CO.</p>
        <p className="tracking-widest">FLY · EXPLORE · RETURN</p>
      </div>
    </footer>
  );
}