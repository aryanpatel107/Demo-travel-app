"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppConfig } from "@/components/RemoteConfigProvider";

interface NavItem {
  href: string;
  label: string;
}

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
    { href: "/about", label: "About" },
  ],
  mytravel: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Discover" },
    { href: "/trips", label: "My Trips" },
    { href: "/about", label: "Inspiration" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    brandKey,
    config,
    remoteConfig,
    branding,
    contacts,
    primaryColor,
  } = useAppConfig();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolvedPrimary = primaryColor || branding.primaryColor || config.colors?.primary || "#2882c5";

  // Base CDN path for assets
  const website = (remoteConfig?.website || {}) as Record<string, unknown>;
  const base =
    (typeof website.staticPath === "string" && website.staticPath.trim()) ||
    (typeof website.serviceImageCdnPath === "string" && website.serviceImageCdnPath.trim()) ||
    "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/";

  // Contacts from websiteContact / config
  const contactData = remoteConfig?.websiteContact as
    | {
        contact?: Array<{ value?: string; phone?: string } | string>;
        email?: Array<{ value?: string; email?: string } | string>;
        phones?: Array<{ value?: string } | string>;
        emails?: Array<{ value?: string } | string>;
      }
    | undefined;

  const getContactVal = (
    item: { value?: string; phone?: string; email?: string } | string | undefined
  ): string | undefined => {
    if (!item) return undefined;
    if (typeof item === "string") return item.trim();
    return (item.value || item.phone || item.email)?.trim();
  };

  const phoneNumber =
    getContactVal(contactData?.contact?.[0]) ||
    getContactVal(contactData?.phones?.[0]) ||
    contacts.phones[0]?.value ||
    branding.phone ||
    "";

  const emailAddress =
    getContactVal(contactData?.email?.[0]) ||
    getContactVal(contactData?.emails?.[0]) ||
    contacts.emails[0]?.value ||
    branding.email ||
    "";

  // Currency from websiteConfiguration.currency
  const configObj = (remoteConfig?.websiteConfiguration || {}) as Record<string, unknown>;
  const currencyObj = configObj?.currency as Record<string, unknown> | string | undefined;
  const initialCurrency =
    (typeof currencyObj === "string"
      ? currencyObj.trim()
      : (currencyObj?.code as string) || (currencyObj?.currencyCode as string) || (currencyObj?.value as string)) ||
    (typeof branding.currency === "string" ? branding.currency.trim() : "INR");

  const [currentCurrency, setCurrentCurrency] = useState(initialCurrency.trim());

  useEffect(() => {
    if (initialCurrency) {
      setCurrentCurrency(initialCurrency.trim());
    }
  }, [initialCurrency]);

  const dynamicCurrencies = Array.isArray(remoteConfig?.websiteCurrency) && remoteConfig.websiteCurrency.length > 0
    ? (remoteConfig.websiteCurrency as Array<Record<string, unknown> | string>)
        .map((c) => (typeof c === "string" ? c.trim() : String(c?.code || c?.currencyCode || c?.value || "").trim()))
        .filter(Boolean)
    : ["INR", "USD", "EUR", "AED"];
  const currencyOptions = Array.from(new Set([initialCurrency, ...dynamicCurrencies]));

  // Logo: website.icon or website.faviconImagePath (full CDN URL if relative)
  const rawLogo =
    (typeof website.icon === "string" && website.icon.trim()) ||
    (typeof website.faviconImagePath === "string" && website.faviconImagePath.trim()) ||
    (typeof website.darkThemeLogoPath === "string" && website.darkThemeLogoPath.trim()) ||
    branding.logoUrl ||
    branding.logo ||
    config.logo;

  const isImagePath = Boolean(rawLogo && (rawLogo.includes("/") || rawLogo.includes(".") || rawLogo.startsWith("http")));

  const logoUrl = rawLogo && isImagePath
    ? (/^(https?:|\/\/|data:)/i.test(rawLogo)
        ? rawLogo
        : `${base.replace(/\/?$/, "/")}${rawLogo.replace(/^\//, "")}`)
    : null;

  useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

  // Brand Name
  const brandName =
    (typeof website?.name === "string" && website.name.trim()) ||
    (typeof website?.fullName === "string" && website.fullName.trim()) ||
    branding.name?.trim() ||
    config.name?.trim() ||
    "GujjuTours";

  const normalizedBrand = brandName.toLowerCase().replace(/[\s\-_]+/g, "");

  // Gujjutours check: Gujjutours uses the streamlined live header (logo | currency | cart | login)
  const isGujju =
    normalizedBrand.includes("gujju") ||
    brandKey === "wanderly" && String(website?.name || "").toLowerCase().includes("gujju") ||
    String(website?.name || "").toLowerCase().includes("gujju") ||
    String(website?.fullName || "").toLowerCase().includes("gujju");

  const activeNavKey =
    brandKey ||
    (normalizedBrand.includes("techno") ? "mytravel" : normalizedBrand.includes("tripgo") ? "travelpro" : "wanderly");

  const brandNavItems = navByBrand[activeNavKey] || navByBrand.wanderly;

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const hasTopBar = Boolean(phoneNumber || emailAddress);

  return (
    <header className="sticky top-0 z-50 w-full font-body shadow-sm">
      {/* ========================================================
          1) TOP CONTACT BAR (Dynamic Phone + Email from config)
          ======================================================== */}
      {hasTopBar && (
        <div
          className="w-full text-white text-xs font-medium"
          style={{ backgroundColor: resolvedPrimary }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
            {/* Phone & Email */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-6">
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
                  className="flex shrink-0 items-center gap-1.5 transition-opacity hover:opacity-90 text-[11px] sm:text-xs"
                  title="Call Us"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
                  </svg>
                  <span className="truncate max-w-[200px] sm:max-w-none">{phoneNumber}</span>
                </a>
              )}

              {phoneNumber && emailAddress && (
                <span className="hidden opacity-60 sm:inline">|</span>
              )}

              {emailAddress && (
                <a
                  href={`mailto:${emailAddress}`}
                  className="hidden items-center gap-1.5 transition-opacity hover:opacity-90 sm:flex text-xs"
                  title="Email Us"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="truncate">{emailAddress}</span>
                </a>
              )}
            </div>

            {/* Right: Guarantee or Currency Indicator */}
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] opacity-80 sm:inline">
                Best Rates Guaranteed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2) MAIN NAVBAR
          ======================================================== */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          {/* Left: Branded Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 sm:gap-2.5 min-w-0"
            aria-label={`${brandName} Home`}
          >
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                alt={`${brandName} Logo`}
                className="h-8 w-auto max-h-8 shrink-0 object-contain sm:h-10 sm:max-h-10 max-w-[130px] sm:max-w-none"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white font-black text-base sm:text-lg shadow-sm"
                  style={{ backgroundColor: resolvedPrimary }}
                >
                  {brandName.charAt(0).toUpperCase()}
                </span>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate max-w-[125px] sm:max-w-none">
                  {brandName}
                </span>
              </div>
            )}
          </Link>

          {/* Center: Working navigation links per brand */}
          <nav className="hidden items-center gap-1 md:flex lg:gap-2" aria-label="Main Navigation">
            {brandNavItems.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "font-bold text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  style={active ? { color: resolvedPrimary } : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Currency | Cart | Login / Logout */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {/* Currency Selector */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 sm:px-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:border-slate-300"
                aria-expanded={currencyOpen}
              >
                <span>{currentCurrency}</span>
                <span className="text-[9px] text-slate-400">▼</span>
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-1.5 w-24 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                  {currencyOptions.map((cur) => (
                    <button
                      key={`cur-${cur}`}
                      type="button"
                      onClick={() => {
                        setCurrentCurrency(cur);
                        setCurrencyOpen(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-left text-xs font-semibold ${
                        currentCurrency === cur
                          ? "bg-blue-50 text-[#2882c5]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center p-1.5 sm:p-2 text-slate-700 transition-colors hover:text-[#2882c5]"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span
                className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: resolvedPrimary }}
              >
                0
              </span>
            </Link>

            {/* Login / Auth Button (Desktop: visible md+) */}
            <div className="hidden md:flex items-center">
              {!mounted ? (
                <Link
                  href="/login"
                  className="rounded-full border px-5 py-1.5 text-sm font-semibold transition-all duration-200"
                  style={{
                    borderColor: resolvedPrimary,
                    color: resolvedPrimary,
                  }}
                >
                  Login
                </Link>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      router.push("/login");
                    }}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border px-5 py-1.5 text-sm font-semibold transition-all duration-200"
                  style={{
                    borderColor: resolvedPrimary,
                    color: resolvedPrimary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = resolvedPrimary;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = resolvedPrimary;
                  }}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Other brands keep CTA button on md+ */}
            {!isGujju && (
              <Link
                href="/trips/create"
                className="hidden rounded-full px-5 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] md:inline-block"
                style={{ backgroundColor: resolvedPrimary }}
              >
                Plan a Trip
              </Link>
            )}

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <span className="text-lg sm:text-xl leading-none">✕</span>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3) MOBILE DRAWER
          ======================================================== */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1.5">
            {brandNavItems.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={`${item.label}-mobile`}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-11 items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "bg-slate-100 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={active ? { color: resolvedPrimary } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Auth Section in Drawer (Hydration Safe) */}
            <div className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2">
              {!mounted ? (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>
              ) : user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-1 text-xs text-slate-500 font-medium">
                    Signed in as <span className="font-bold text-slate-800">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileOpen(false);
                      await logout();
                      router.push("/login");
                    }}
                    className="flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                href="/trips/create"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-xl py-2.5 text-center text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: resolvedPrimary }}
              >
                Plan a Trip
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}