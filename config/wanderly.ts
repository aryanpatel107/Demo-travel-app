import { BrandConfig } from "./types";

export const wanderlyConfig: BrandConfig = {
  name: "Wanderly",
  logo: "W",
  visualStyle: "editorial",

  colors: {
    primary: "#0F766E",
    secondary: "#F59E0B",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    accent: "#F97316",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "Trips" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  hero: {
    badge: "Explore Beyond",
    title: "Find places worth remembering.",
    subtitle: "Curated escapes, immersive journeys, and story-rich experiences designed for bold travelers.",
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
    featured: "Popular Destinations",
    benefits: "Travel planning that respects your time",
    testimonials: "Trusted by wanderers everywhere",
    cta: "Your next trip is one boarding pass away",
    tripPlanner: "Plan your next escape",
    travelStories: "Travel stories from the road",
    specialOffers: "Handpicked escapes",
    recommended: "Recommended for you",
  },

  splash: {
    title: "Wanderly",
    subtitle: "Explore Beyond",
    logo: "W",
    backgroundColor: "#0f172a",
    accentColor: "#f59e0b",
    animation: "pulse",
  },

  metadata: {
    title: "Wanderly | Slow Travel & Curated Escapes",
    description: "Discover story-rich destinations and beautifully paced itineraries designed for meaningful travel with Wanderly.",
  },

  contact: {
    email: "hello@wanderly.com",
    phone: "+91 98765 43210",
  },
};