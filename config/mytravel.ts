import { BrandConfig } from "./types";

export const mytravelConfig: BrandConfig = {
  name: "Technoheaven",
  logo: "TH",
  visualStyle: "personal",

  colors: {
    primary: "#00aacf",
    secondary: "#0088a6",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    accent: "#00aacf",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Inventory" },
    { href: "/trips", label: "Bookings" },
    { href: "/about", label: "Technology" },
    { href: "/contact", label: "Contact" },
  ],

  hero: {
    badge: "Global B2B Travel Platform & Technology",
    title: "Powering Global Travel Distribution.",
    subtitle: "Advanced booking engines connecting wholesale hotel inventory, global flight feeds, and real-time XML/API solutions for travel professionals.",
    primaryCtaLabel: "Search Inventory",
    secondaryCtaLabel: "Plan a Trip",
    primaryCtaHref: "/destinations",
    secondaryCtaHref: "/trips/create",
  },

  features: {
    showStats: true,
    showBenefits: true,
    showDestinations: true,
    showTestimonials: true,
    showCTA: true,
    showTripPlanner: true,
    showTravelStories: false,
    showSpecialOffers: false,
    showWhySection: true,
  },

  sectionTitles: {
    featured: "Global Hub Destinations",
    benefits: "B2B travel technology built for speed & scale",
    testimonials: "Trusted by travel partners worldwide",
    cta: "Connect your business with global travel inventory",
    tripPlanner: "Build your corporate itinerary",
    travelStories: "Partner insights",
    specialOffers: "Wholesale packages",
    recommended: "Top performing markets",
  },

  splash: {
    title: "Technoheaven",
    subtitle: "Global B2B Travel Technology",
    logo: "TH",
    backgroundColor: "#090d16",
    accentColor: "#00aacf",
    animation: "fade",
  },

  metadata: {
    title: "Technoheaven | Global B2B Travel Platform & Technology",
    description: "Leading B2B travel software and wholesale inventory distribution platform for agencies, tour operators, and DMC partners.",
  },

  contact: {
    email: "contact@technoheaven.com",
    phone: "+971 4 123 4567",
  },

  font: {
    family: "Plus Jakarta Sans",
  },
  websiteModules: [
    "HOTEL",
    "FLIGHT",
    "PACKAGE",
    "TRANSFER",
    "TOUR",
    "VISA",
  ],
  recommendations: ["HOTEL", "FLIGHT", "PACKAGE"],
  socialMediaConfig: [],
  geo: {
    country: "AE",
    city: "Dubai",
    ip: null,
  },
  copyright: `© ${new Date().getFullYear()} Technoheaven. All rights reserved.`,
};