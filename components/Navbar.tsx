"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { config } from "@/config";
import { useAuth } from "@/components/auth/AuthProvider";

type NavItem = {
  href: string;
  label: string;
};

const navByBrand: Record<string, NavItem[]> = {
  wanderly: [
    { href: "/", label: "Explore" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "Trips" },
    { href: "/about", label: "Stories" },
  ],
  travelpro: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "My Bookings" },
    { href: "/about", label: "TravelPro" },
  ],
  mytravel: [
    { href: "/", label: "My Travel" },
    { href: "/destinations", label: "Discover" },
    { href: "/trips", label: "My Trips" },
    { href: "/about", label: "Inspiration" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const brandKey = config.name.toLowerCase().replace(/\s+/g, "");
  const navItems = navByBrand[brandKey] ?? navByBrand.wanderly;

  const isWanderly = config.name === "Wanderly";
  const isTravelPro = config.name === "TravelPro";

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const ctaLabel = isWanderly ? "Plan a trip" : isTravelPro ? "Book Now" : "Create Trip";
  const ctaClassName = isWanderly
    ? "navbar-cta navbar-cta-wanderly"
    : isTravelPro
      ? "navbar-cta navbar-cta-travelpro"
      : "navbar-cta navbar-cta-mytravel";

  const headerClassName = isWanderly
    ? "brand-navbar wanderly-navbar animate-nav-in"
    : isTravelPro
      ? "brand-navbar travelpro-navbar animate-nav-in"
      : "brand-navbar mytravel-navbar animate-nav-in";

  const sharedLinkClassName = (active: boolean) =>
    `nav-link ${active ? "nav-link-active" : ""}`.trim();

  const showLoggedIn = !loading && !!user;

  return (
    <header className={headerClassName}>
      <nav className="brand-navbar__inner" aria-label="Main navigation">
        <Link href="/" className="brand-logo" aria-label="Home page">
          <span className="brand-logo__mark">{config.logo}</span>
          <span className="brand-logo__text">{config.name}</span>
        </Link>

        <div className="desktop-nav" aria-label="Primary navigation links">
          {navItems.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${sharedLinkClassName(active)} brand-link`}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {showLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-700 md:inline">Hi, {user!.name.split(" ")[0]}</span>
            <Link href="/trips" className="nav-link">Profile</Link>
            <Link href="/trips" className="nav-link">My Trips</Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/register" className="nav-link">Register</Link>
            <Link href="/trips/create" className={ctaClassName}>{ctaLabel}</Link>
          </div>
        )}

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {mobileOpen && (
        <div className="mobile-nav-panel" id="mobile-navigation" aria-label="Mobile navigation">
          <div className="mobile-nav-panel__inner">
            {navItems.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={`${item.label}-mobile`}
                  href={item.href}
                  className={`${sharedLinkClassName(active)} brand-link`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            {showLoggedIn ? (
              <>
                <span className="px-2 py-2 text-sm font-medium text-slate-700">Hi, {user!.name.split(" ")[0]}</span>
                <Link href="/trips" className={sharedLinkClassName(pathname === "/trips")} onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <Link href="/trips" className={sharedLinkClassName(pathname === "/trips")} onClick={() => setMobileOpen(false)}>
                  My Trips
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                    router.push("/login");
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-left text-sm font-medium text-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={sharedLinkClassName(pathname === "/login")} onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className={sharedLinkClassName(pathname === "/register")} onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
                <Link href="/trips/create" className={ctaClassName} onClick={() => setMobileOpen(false)}>
                  {ctaLabel}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}