import { BrandConfig } from "./types";

export const wanderlyConfig: BrandConfig = {
  name: "GujjuTours",
  logo: "G",
  visualStyle: "editorial",

  colors: {
    primary: "#2882c5",
    secondary: "#f58e83",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    accent: "#f58e83",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "Trips" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  hero: {
    badge: "Top Holiday Escapes",
    title: "Explore more. Worry less.",
    subtitle: "Handcrafted holiday packages, best hotel rates, seamless visa services, and 24/7 on-ground assistance for unforgettable memories.",
    primaryCtaLabel: "Explore Destinations",
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
    showTripPlanner: false,
    showTravelStories: true,
    showSpecialOffers: false,
    showWhySection: true,
  },

  sectionTitles: {
    featured: "Popular Destinations & Packages",
    benefits: "Travel planning that respects your time",
    testimonials: "Trusted by travelers everywhere",
    cta: "Your next family holiday is one click away",
    tripPlanner: "Plan your next escape",
    travelStories: "Travel stories from our travelers",
    specialOffers: "Exclusive holiday packages",
    recommended: "Recommended for you",
  },

  splash: {
    title: "GujjuTours",
    subtitle: "Unforgettable Holiday Experiences",
    logo: "G",
    backgroundColor: "#0f172a",
    accentColor: "#2882c5",
    animation: "pulse",
  },

  metadata: {
    title: "GujjuTours | Unforgettable Holiday Experiences",
    description: "Discover handcrafted holiday packages, best hotel deals, and complete travel support with GujjuTours.",
  },

  contact: {
    email: "booking@gujjutours.com",
    phone: "+91 9875095616",
  },

  font: {
    family: "Poppins",
  },
  websiteModules: [
    "HOTEL",
    "PACKAGE",
    "TOUR",
    "FLIGHT",
    "TRANSFER",
    "VISA",
    "RESTAURANT",
    "BUILDPACKAGE",
  ],
  recommendations: ["PACKAGE", "HOTEL", "TOUR"],
  socialMediaConfig: [],
  geo: {
    country: "IN",
    city: null,
    ip: null,
  },
  copyright: `© ${new Date().getFullYear()} GujjuTours. All rights reserved.`,
};