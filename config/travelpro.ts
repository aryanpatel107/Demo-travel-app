import { BrandConfig } from "./types";

export const travelproConfig: BrandConfig = {
  name: "TravelPro",
  logo: "TP",
  visualStyle: "professional",

  colors: {
    primary: "#7C3AED",
    secondary: "#F97316",
    background: "#F6F3FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    mutedText: "#475569",
    accent: "#0EA5E9",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "Trips" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ],

  hero: {
    badge: "Travel booking system",
    title: "Book smarter. Travel better.",
    subtitle: "Premium routes, curated packages, and reliable trip management for travelers who expect smooth planning.",
    primaryCtaLabel: "Search Trips",
    secondaryCtaLabel: "Create Booking",
    primaryCtaHref: "/destinations",
    secondaryCtaHref: "/trips/create",
  },

  features: {
    showStats: true,
    showBenefits: false,
    showDestinations: true,
    showTestimonials: true,
    showCTA: true,
    showTripPlanner: true,
    showTravelStories: false,
    showSpecialOffers: true,
    showWhySection: false,
  },

  sectionTitles: {
    featured: "Top Travel Destinations",
    benefits: "Travel planning that keeps your schedule on track",
    testimonials: "Travelers who prefer a smoother plan",
    cta: "Ready to plan your next premium trip",
    tripPlanner: "Book your next route",
    travelStories: "Traveler stories",
    specialOffers: "Special offers",
    recommended: "Trending picks",
  },

  splash: {
    title: "TravelPro",
    subtitle: "Your Journey Starts Here",
    logo: "TP",
    backgroundColor: "#1f2937",
    accentColor: "#7c3aed",
    animation: "slide",
  },

  metadata: {
    title: "TravelPro | Premium Travel Planning",
    description: "Book smarter with organized itineraries, premium destinations, and polished travel planning from TravelPro.",
  },

  contact: {
    email: "hello@travelpro.com",
    phone: "+91 98765 12345",
  },
};