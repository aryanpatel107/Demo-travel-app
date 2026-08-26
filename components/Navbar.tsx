import Link from "next/link";

export default function Navbar() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "Trips" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-sand/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm text-sand">
            ✈
          </span>
          <span className="font-display text-xl font-semibold text-ink">
            Wanderly
          </span>
        </Link>
        <ul className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-ink/70">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="border-b border-transparent pb-1 transition-colors hover:border-coral hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}