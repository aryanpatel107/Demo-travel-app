"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppConfig } from "@/components/RemoteConfigProvider";

interface ServiceModuleItem {
  serviceTypeId?: number;
  serviceCode?: string;
  code?: string;
  serviceName?: string;
  name?: string;
  serviceIcon?: string;
  icon?: string;
  [key: string]: unknown;
}

const DEFAULT_ICONS: Record<string, string> = {
  HOTEL: "🏨",
  PACKAGE: "📦",
  TOUR: "🏄",
  FLIGHT: "✈️",
  TRANSFER: "🚗",
  VISA: "🛂",
  RESTAURANT: "🍽️",
  BUILDPACKAGE: "🧳",
  MICE: "💼",
  ACTIVITY: "🧗",
};

const BRAND_DEFAULT_MODULES: Record<string, ServiceModuleItem[]> = {
  wanderly: [
    { serviceTypeId: 1, serviceCode: "HOTEL", serviceName: "Hotels", icon: "🏨" },
    { serviceTypeId: 2, serviceCode: "PACKAGE", serviceName: "Packages", icon: "📦" },
    { serviceTypeId: 3, serviceCode: "TOUR", serviceName: "Activities", icon: "🏄" },
    { serviceTypeId: 4, serviceCode: "FLIGHT", serviceName: "Flight", icon: "✈️" },
    { serviceTypeId: 5, serviceCode: "TRANSFER", serviceName: "Transfer", icon: "🚗" },
    { serviceTypeId: 6, serviceCode: "VISA", serviceName: "Visa", icon: "🛂" },
    { serviceTypeId: 7, serviceCode: "RESTAURANT", serviceName: "Restaurant", icon: "🍽️" },
    { serviceTypeId: 8, serviceCode: "BUILDPACKAGE", serviceName: "Build Package", icon: "🧳" },
  ],
  travelpro: [
    { serviceTypeId: 1, serviceCode: "PACKAGE", serviceName: "Asian Packages", icon: "📦" },
    { serviceTypeId: 2, serviceCode: "HOTEL", serviceName: "Hotels & Resorts", icon: "🏨" },
    { serviceTypeId: 3, serviceCode: "TOUR", serviceName: "Activities", icon: "🏄" },
    { serviceTypeId: 4, serviceCode: "TRANSFER", serviceName: "Transfers", icon: "🚗" },
    { serviceTypeId: 5, serviceCode: "FLIGHT", serviceName: "Flights", icon: "✈️" },
    { serviceTypeId: 6, serviceCode: "VISA", serviceName: "Visa Services", icon: "🛂" },
  ],
  mytravel: [
    { serviceTypeId: 1, serviceCode: "HOTEL", serviceName: "Hotels Wholesale", icon: "🏨" },
    { serviceTypeId: 2, serviceCode: "FLIGHT", serviceName: "Global Flights", icon: "✈️" },
    { serviceTypeId: 3, serviceCode: "PACKAGE", serviceName: "B2B Packages", icon: "📦" },
    { serviceTypeId: 4, serviceCode: "TRANSFER", serviceName: "Transfers", icon: "🚗" },
    { serviceTypeId: 5, serviceCode: "TOUR", serviceName: "Sightseeing", icon: "🏄" },
    { serviceTypeId: 6, serviceCode: "VISA", serviceName: "Visa Assist", icon: "🛂" },
  ],
};

const GUJJU_DESTINATIONS = [
  {
    id: "dubai",
    title: "Dubai, UAE",
    subtitle: "Luxury Skyline & Desert Safari",
    rating: 4.9,
    price: "₹34,999",
    days: "5 Days / 4 Nights",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
  },
  {
    id: "maldives",
    title: "Maldives",
    subtitle: "Overwater Villas & Pristine Lagoons",
    rating: 5.0,
    price: "₹68,500",
    days: "4 Days / 3 Nights",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    badge: "Top Rated",
  },
  {
    id: "kashmir",
    title: "Kashmir, India",
    subtitle: "Paradise On Earth & Dal Lake Shikara",
    rating: 4.8,
    price: "₹22,999",
    days: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    badge: "Family Favorite",
  },
  {
    id: "bali",
    title: "Bali, Indonesia",
    subtitle: "Tropical Beaches, Temples & Waterfalls",
    rating: 4.9,
    price: "₹42,000",
    days: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
  },
  {
    id: "singapore",
    title: "Singapore",
    subtitle: "Marina Bay, Sentosa & Night Safari",
    rating: 4.8,
    price: "₹49,999",
    days: "5 Days / 4 Nights",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
  },
  {
    id: "kerala",
    title: "Kerala, India",
    subtitle: "Munnar Tea Hills & Alleppey Houseboat",
    rating: 4.9,
    price: "₹18,500",
    days: "5 Days / 4 Nights",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    badge: "Relaxing",
  },
];

const TRIPGO_DESTINATIONS = [
  {
    id: "bali",
    title: "Bali & Nusa Penida",
    subtitle: "Cliffside Temples, Private Villas & Surf",
    rating: 4.9,
    price: "$499",
    days: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    badge: "Curated Pick",
  },
  {
    id: "bangkok-phuket",
    title: "Bangkok & Phuket, Thailand",
    subtitle: "Grand Palace, Night Markets & Phi Phi Island",
    rating: 4.8,
    price: "$650",
    days: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    badge: "Most Popular",
  },
  {
    id: "tokyo-kyoto",
    title: "Tokyo & Kyoto, Japan",
    subtitle: "Shinkansen, Historic Shrines & Cherry Blossoms",
    rating: 5.0,
    price: "$1,299",
    days: "8 Days / 7 Nights",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    badge: "Top Experience",
  },
  {
    id: "singapore",
    title: "Singapore City & Marina",
    subtitle: "Gardens by the Bay & Sentosa Island",
    rating: 4.8,
    price: "$780",
    days: "5 Days / 4 Nights",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    badge: "City Break",
  },
  {
    id: "danang",
    title: "Da Nang & Hoi An, Vietnam",
    subtitle: "Golden Bridge, Lantern City & Marble Mountains",
    rating: 4.9,
    price: "$520",
    days: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
  },
  {
    id: "srilanka",
    title: "Sri Lanka Highlights",
    subtitle: "Sigiriya Rock, Tea Country & Mirissa Whales",
    rating: 4.9,
    price: "$680",
    days: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    badge: "Scenic Escape",
  },
];

const TECHNO_DESTINATIONS = [
  {
    id: "dubai-b2b",
    title: "Dubai Corporate Hub",
    subtitle: "Wholesale Portfolio & Luxury Suites",
    rating: 4.9,
    price: "$120 / night",
    days: "Instant XML Confirmation",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    badge: "Wholesale Direct",
  },
  {
    id: "singapore-b2b",
    title: "Singapore Financial District",
    subtitle: "Direct DMC Net Rates & Transfers",
    rating: 4.8,
    price: "$145 / night",
    days: "Corporate B2B Rates",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    badge: "Verified Partner",
  },
  {
    id: "london-b2b",
    title: "London Central Hotels",
    subtitle: "Premier Business Properties & Apartments",
    rating: 4.9,
    price: "$180 / night",
    days: "Direct API Access",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    badge: "High Availability",
  },
  {
    id: "tokyo-b2b",
    title: "Tokyo Business Centers",
    subtitle: "Shinjuku & Ginza Direct Allocations",
    rating: 5.0,
    price: "$160 / night",
    days: "Multi-Currency Net",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    badge: "Live Inventory",
  },
  {
    id: "bangkok-b2b",
    title: "Bangkok Metro & Riverside",
    subtitle: "Competitive DMC Net Wholesale Rates",
    rating: 4.8,
    price: "$75 / night",
    days: "Instant Voucher",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    badge: "Best Net Margin",
  },
  {
    id: "newyork-b2b",
    title: "New York Manhattan Suites",
    subtitle: "Corporate Allotments & Group Rates",
    rating: 4.9,
    price: "$210 / night",
    days: "Real-time Connect",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    badge: "Premier Partner",
  },
];

export default function HomePage() {
  const { branding, remoteConfig, config, contacts, primaryColor, brandKey } = useAppConfig();

  const brandNormalized = (branding.name || "").toLowerCase().replace(/[\s\-_]+/g, "");

  const activeBrandKey =
    brandKey ||
    (brandNormalized.includes("techno")
      ? "mytravel"
      : brandNormalized.includes("tripgo")
        ? "travelpro"
        : "wanderly");

  const resolvedPrimary =
    primaryColor ||
    branding.primaryColor ||
    (activeBrandKey === "travelpro"
      ? "#FF932C"
      : activeBrandKey === "mytravel"
        ? "#00aacf"
        : "#2882c5");

  const website = (remoteConfig?.website || {}) as Record<string, unknown>;
  const base =
    (typeof website.staticPath === "string" && website.staticPath.trim()) ||
    (typeof website.serviceImageCdnPath === "string" && website.serviceImageCdnPath.trim()) ||
    "https://d3bfv5x1dw8ekm.cloudfront.net/uploads/";

  // Service Modules from remoteConfig or brand-specific fallback
  const rawModules = (
    Array.isArray(remoteConfig?.websiteModules) && remoteConfig.websiteModules.length > 0
      ? remoteConfig.websiteModules
      : Array.isArray(branding.modules) && branding.modules.length > 0
        ? branding.modules
        : BRAND_DEFAULT_MODULES[activeBrandKey] || BRAND_DEFAULT_MODULES.wanderly
  ) as ServiceModuleItem[];

  const modulesList = rawModules.filter(
    (m) => Boolean(m.serviceCode || m.code || m.serviceName || m.name)
  );

  const [activeTab, setActiveTab] = useState<string>("HOTEL");

  useEffect(() => {
    if (modulesList.length > 0) {
      const exists = modulesList.some(
        (m) => String(m.serviceCode ?? m.code ?? "").toUpperCase() === activeTab
      );
      if (!exists) {
        const firstCode = String(modulesList[0].serviceCode ?? modulesList[0].code ?? "").toUpperCase();
        if (firstCode) setActiveTab(firstCode);
      }
    }
  }, [modulesList, activeTab]);

  // Search State
  const [destination, setDestination] = useState<string>("");
  const [nationality, setNationality] = useState<string>("India");
  const [checkInDate] = useState<string>("2026-10-01");
  const [checkOutDate] = useState<string>("2026-10-06");
  const [guestRooms, setGuestRooms] = useState<string>("2 Guests, 1 Room");
  const [selectedStar, setSelectedStar] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("Hotel");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");

  // WhatsApp Contact Phone
  const rawPhone = contacts.phones[0]?.value || branding.phone || "+91 9875095616";
  const cleanPhone = rawPhone.replace(/[^\d]/g, "") || "919875095616";

  // Distinct brand hero configurations
  const heroContent = {
    wanderly: {
      badge: "Top Holiday Escapes",
      title: "Explore more. Worry less.",
      accent: "Travel With Confidence",
      subtitle:
        "Handcrafted holiday packages, best hotel rates, seamless visa services, and 24/7 on-ground assistance for unforgettable memories.",
      bgImage:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80",
      destinations: GUJJU_DESTINATIONS,
      searchTitle: "Where are you going?",
      searchPlaceholder: "Search Goa, Dubai, Maldives, Kashmir...",
      ctaLabel: "Explore Packages",
      perks: [
        { icon: "🛡️", title: "Best Price Guarantee", desc: "Unbeatable rates directly from local operators" },
        { icon: "📞", title: "24/7 Dedicated Support", desc: "Assistance at every step of your journey" },
        { icon: "🍲", title: "Jain & Veg Meals Care", desc: "Special dietary arrangements across tours" },
        { icon: "⚡", title: "Instant Confirmation", desc: "Fast, hassle-free booking vouchers" },
      ],
    },
    travelpro: {
      badge: "Curated Journeys Across Asia",
      title: "Explore Asia with Confidence.",
      accent: "Authentic Asian Escapes",
      subtitle:
        "Curated itineraries across Thailand, Bali, Japan, Vietnam, and Singapore with local insider guides and complete booking flexibility.",
      bgImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
      destinations: TRIPGO_DESTINATIONS,
      searchTitle: "Where in Asia?",
      searchPlaceholder: "Search Bali, Bangkok, Tokyo, Da Nang...",
      ctaLabel: "Explore Asia",
      perks: [
        { icon: "⛩️", title: "Local Insider Guides", desc: "Authentic cultural connections & trusted routes" },
        { icon: "🌴", title: "Curated Itineraries", desc: "Handpicked tropical resorts & boutique stays" },
        { icon: "🧭", title: "Flexible Planning", desc: "Customized schedules that suit your personal pace" },
        { icon: "📱", title: "24/7 Asia Concierge", desc: "English-speaking support throughout your trip" },
      ],
    },
    mytravel: {
      badge: "Global B2B Travel Platform & Technology",
      title: "Powering Global Travel Distribution.",
      accent: "B2B Wholesale Travel Engine",
      subtitle:
        "Advanced booking engines connecting wholesale hotel inventory, global flight feeds, and real-time XML/API solutions for travel professionals.",
      bgImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
      destinations: TECHNO_DESTINATIONS,
      searchTitle: "Search Global Inventory",
      searchPlaceholder: "Search city, hotel code, or airport...",
      ctaLabel: "Search Inventory",
      perks: [
        { icon: "🌐", title: "Global Wholesale Feeds", desc: "500,000+ properties with direct net contracting" },
        { icon: "⚡", title: "Real-Time XML / API", desc: "Lightning fast integration with robust uptime" },
        { icon: "💳", title: "Multi-Currency Net Rates", desc: "Flexible settlement in USD, EUR, AED, and more" },
        { icon: "💼", title: "Corporate Desk", desc: "Dedicated account managers for enterprise partners" },
      ],
    },
  }[activeBrandKey] || {
    badge: "Top Holiday Escapes",
    title: "Explore more. Worry less.",
    accent: "Travel With Confidence",
    subtitle: "Handcrafted holiday packages and best hotel rates for unforgettable memories.",
    bgImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80",
    destinations: GUJJU_DESTINATIONS,
    searchTitle: "Where are you going?",
    searchPlaceholder: "Search destination...",
    ctaLabel: "Search",
    perks: [],
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-body text-slate-900">
      {/* ========================================================
          1) BRAND-SPECIFIC HERO SECTION
          ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src={heroContent.bgImage}
            alt={`${branding.name} Hero`}
            className="h-full w-full object-cover object-center brightness-[0.82] transition-transform duration-700"
          />
          {/* Subtle gradient overlay for contrast and brand tone */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        </div>

        {/* Centered Hero Text */}
        <div className="relative z-10 mx-auto flex min-h-[380px] sm:min-h-[460px] md:min-h-[500px] max-w-5xl flex-col items-center justify-center px-4 pt-12 pb-24 sm:pt-16 sm:pb-32 text-center text-white">
          <span
            className="inline-block rounded-full px-3 py-1 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-2 sm:mb-3"
            style={{
              backgroundColor: `${resolvedPrimary}33`,
              color: resolvedPrimary === "#2882c5" ? "#60a5fa" : resolvedPrimary,
              border: `1px solid ${resolvedPrimary}55`,
            }}
          >
            {heroContent.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {heroContent.title}
          </h1>
          <p
            className="mt-2 sm:mt-3 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black drop-shadow-md"
            style={{ color: activeBrandKey === "travelpro" ? "#FFB067" : activeBrandKey === "mytravel" ? "#38bdf8" : "#f59e0b" }}
          >
            {heroContent.accent}
          </p>
          <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base text-slate-200 drop-shadow">
            {heroContent.subtitle}
          </p>
        </div>
      </section>

      {/* ========================================================
          2) SEARCH CARD (Overlapping Bottom of Hero)
          ======================================================== */}
      <section className="relative z-30 mx-auto -mt-16 sm:-mt-20 md:-mt-24 max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl md:rounded-3xl border border-slate-100/90 bg-white p-4 sm:p-7 shadow-2xl backdrop-blur-md">
          {/* Service Tabs Row from websiteModules */}
          <div className="no-scrollbar flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-100 -mx-1 px-1">
            {modulesList.map((m, index) => {
              const code = String(m.serviceCode ?? m.code ?? "").toUpperCase();
              const serviceName = String(m.serviceName ?? m.name ?? "Service");
              const rawIcon = m.serviceIcon || (typeof m.icon === "string" && m.icon.includes("/") ? m.icon : undefined);
              const iconUrl = rawIcon
                ? (rawIcon.startsWith("http")
                    ? rawIcon
                    : `${base.replace(/\/?$/, "/")}${rawIcon.replace(/^\//, "")}`)
                : null;
              const isActive = activeTab === code;

              return (
                <button
                  key={`module-${index}-${m.serviceTypeId ?? m.serviceCode}`}
                  type="button"
                  onClick={() => setActiveTab(code)}
                  className={`flex shrink-0 min-h-10 items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-md"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: resolvedPrimary }
                      : undefined
                  }
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={serviceName}
                      className={`h-4 w-4 sm:h-5 sm:w-5 object-contain ${isActive ? "brightness-0 invert" : ""}`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement?.querySelector(".tab-fallback-emoji");
                        if (fallback) (fallback as HTMLElement).style.display = "inline-block";
                      }}
                    />
                  ) : null}
                  <span className={`tab-fallback-emoji text-sm sm:text-base ${iconUrl ? "hidden" : ""}`}>
                    {DEFAULT_ICONS[code] || (typeof m.icon === "string" && m.icon.length <= 4 ? m.icon : "✨")}
                  </span>
                  <span>{serviceName}</span>
                </button>
              );
            })}
          </div>

          {/* Search Fields Row */}
          <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Destination */}
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Destination
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={heroContent.searchPlaceholder}
                  className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 placeholder-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-1"
                />
              </div>
            </div>

            {/* 2. Brand Context (Nationality / Region / Class) */}
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {activeBrandKey === "mytravel"
                  ? "Rate Type"
                  : activeBrandKey === "travelpro"
                    ? "Departure City"
                    : "Nationality"}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                {activeBrandKey === "mytravel" ? (
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full min-h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none"
                  >
                    <option value="B2B Wholesale">B2B Wholesale Net</option>
                    <option value="Direct Contract">Direct Contract</option>
                    <option value="Corporate Net">Corporate Account</option>
                    <option value="XML API Feed">XML API Feed</option>
                  </select>
                ) : activeBrandKey === "travelpro" ? (
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full min-h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none"
                  >
                    <option value="Bangkok">Bangkok (BKK)</option>
                    <option value="Singapore">Singapore (SIN)</option>
                    <option value="Bali">Bali (DPS)</option>
                    <option value="Tokyo">Tokyo (TYO)</option>
                    <option value="India">Surat / Mumbai (BOM)</option>
                  </select>
                ) : (
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full min-h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none"
                  >
                    <option value="India">India (IN)</option>
                    <option value="United Arab Emirates">UAE (AE)</option>
                    <option value="United States">United States (US)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Singapore">Singapore (SG)</option>
                  </select>
                )}
                <span className="pointer-events-none absolute right-3 text-xs text-slate-400">▼</span>
              </div>
            </div>

            {/* 3. Dates */}
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Check-In / Out
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={`${checkInDate} - ${checkOutDate}`}
                  readOnly
                  className="w-full min-h-11 cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Guests & Rooms */}
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Guests & Rooms
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={guestRooms}
                  onChange={(e) => setGuestRooms(e.target.value)}
                  className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* 5. Primary Search Button */}
            <div className="flex flex-col justify-end">
              <Link
                href={`/trips/create?service=${encodeURIComponent(
                  activeTab
                )}&dest=${encodeURIComponent(destination)}`}
                className="flex min-h-11 h-11 sm:h-[46px] w-full items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
                style={{ backgroundColor: resolvedPrimary }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </Link>
            </div>
          </div>

          {/* Contextual Filter Row (Star Rating / Category / Travel Style) */}
          {activeBrandKey === "travelpro" ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-600 mr-1">Travel Style:</span>
                {["All", "Island Hopping", "Heritage & Temples", "Luxury Villas", "Adventure"].map((style) => {
                  const isActive = selectedStyle === style;
                  return (
                    <button
                      key={`style-${style}`}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                        isActive
                          ? "text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      style={isActive ? { backgroundColor: resolvedPrimary } : undefined}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : activeBrandKey === "mytravel" ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-600 mr-1">Hotel Category:</span>
                {["All Grades", "5-Star Luxury", "4-Star Business", "Resort Portfolio", "Boutique Corporate"].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={`cat-${cat}`}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                        isActive
                          ? "text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      style={isActive ? { backgroundColor: resolvedPrimary } : undefined}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
              {/* Star Rating Selection */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-600 mr-1">Star Rating:</span>
                {["All", "1★", "2★", "3★", "4★", "5★"].map((star) => {
                  const isStarActive = selectedStar === star;
                  return (
                    <button
                      key={`star-${star}`}
                      type="button"
                      onClick={() => setSelectedStar(star)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                        isStarActive
                          ? "text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      style={isStarActive ? { backgroundColor: resolvedPrimary } : undefined}
                    >
                      {star}
                    </button>
                  );
                })}
              </div>

              {/* Property Categories */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-600 mr-1">Category:</span>
                {["Hotel", "Aparthotel", "Apartment", "Hostel", "Villa"].map((cat) => {
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={`cat-${cat}`}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full border px-2.5 py-1 font-semibold transition-all ${
                        isCatActive
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          3) POPULAR DESTINATIONS & PACKAGES (Brand-Specific)
          ======================================================== */}
      <section className="mx-auto mt-12 sm:mt-16 max-w-6xl px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: resolvedPrimary }}
            >
              {activeBrandKey === "mytravel"
                ? "Top Performing Hubs"
                : activeBrandKey === "travelpro"
                  ? "Handpicked Asian Escapes"
                  : "Top Holiday Escapes"}
            </span>
            <h2 className="mt-1 text-xl sm:text-3xl font-extrabold text-slate-900">
              {activeBrandKey === "mytravel"
                ? "Global Wholesale Portfolio"
                : activeBrandKey === "travelpro"
                  ? "Featured Asian Journeys"
                  : "Popular Destinations & Packages"}
            </h2>
          </div>
          <Link
            href="/destinations"
            className="text-xs sm:text-sm font-bold hover:underline"
            style={{ color: resolvedPrimary }}
          >
            View all destinations →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroContent.destinations.map((dest) => (
            <div
              key={dest.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                  {dest.badge}
                </span>
                <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-2 py-0.5 text-xs font-bold text-slate-900 shadow">
                  ⭐ {dest.rating}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 transition-colors">
                    {dest.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 shrink-0 ml-2">
                    {dest.days}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                  {dest.subtitle}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[11px] text-slate-400">
                      {activeBrandKey === "mytravel" ? "Net B2B from" : "Starting from"}
                    </span>
                    <p
                      className="text-base font-extrabold"
                      style={{ color: resolvedPrimary }}
                    >
                      {dest.price}
                    </p>
                  </div>

                  <Link
                    href={`/trips/create?dest=${encodeURIComponent(dest.title)}`}
                    className="flex min-h-9 items-center justify-center rounded-xl px-3.5 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: resolvedPrimary }}
                  >
                    {activeBrandKey === "mytravel" ? "Book Net" : "Explore"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4) BRAND TRUST PERKS
          ======================================================== */}
      {heroContent.perks.length > 0 && (
        <section className="mx-auto my-10 sm:my-16 max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {heroContent.perks.map((perk, i) => (
              <div
                key={`perk-${i}`}
                className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 text-center shadow-sm"
              >
                <span className="mb-2 text-2xl sm:text-3xl">{perk.icon}</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{perk.title}</h4>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          5) FLOATING WHATSAPP BUTTON (With Brand Phone)
          ======================================================== */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Hello ${branding.name}, I would like to inquire about bookings and packages.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2 sm:px-4 sm:py-2.5 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#20ba59]"
          title="Chat with us on WhatsApp"
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 fill-current shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.99.582 3.847 1.59 5.419L2.1 22l4.67-1.455a10.02 10.02 0 005.261 1.486c5.536 0 10.031-4.495 10.031-10.031C22.062 6.495 17.567 2 12.031 2zm5.882 14.156c-.244.686-1.42 1.309-1.97 1.371-.527.06-1.218.084-3.52-.871-2.946-1.22-4.846-4.225-4.992-4.42-.147-.195-1.196-1.59-1.196-3.033 0-1.442.757-2.15 1.026-2.443.268-.293.585-.366.781-.366.195 0 .39.002.562.01.182.01.427-.069.667.509.244.585.83 2.025.903 2.172.073.146.122.317.024.512-.097.195-.146.317-.293.488-.146.171-.308.382-.44.513-.146.146-.299.305-.128.598.17.293.757 1.246 1.624 2.018 1.114.992 2.053 1.3 2.346 1.446.293.146.464.122.635-.073.17-.195.732-.854.928-1.147.195-.293.39-.244.659-.146.268.098 1.708.806 2.001.952.293.146.488.22.562.342.073.122.073.708-.171 1.394z" />
          </svg>
          <span className="text-xs sm:text-sm font-bold tracking-wide">Chat with us</span>
        </a>
      </div>
    </div>
  );
}