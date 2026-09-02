import { BrandConfig } from "./types";

export const mytravelConfig: BrandConfig = {
  name: "MyTravel",
  logo: "MT",
  visualStyle: "personal",

  colors: {
    primary: "#059669",
    secondary: "#14B8A6",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    accent: "#F59E0B",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/trips", label: "My Trips" },
    { href: "/trips/create", label: "Plan a Trip" },
    { href: "/destinations", label: "Discover" },
    { href: "/contact", label: "Contact" },
  ],

  hero: {
    badge: "Personalized travel planner",
    title: "Plan your next escape.",
    subtitle: "Trips picked around your pace, preferences, and the moments you want to remember most.",
    primaryCtaLabel: "Build My Trip",
    secondaryCtaLabel: "Saved Ideas",
    primaryCtaHref: "/trips/create",
    secondaryCtaHref: "/destinations",
  },

  features: {
    showStats: false,
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
    featured: "Recommended For You",
    benefits: "Personal travel planning built around your pace",
    testimonials: "Travelers who like their plans personal",
    cta: "Let’s design your next memorable trip",
    tripPlanner: "Build your ideal getaway",
    travelStories: "Memory-making journeys",
    specialOffers: "Seasonal ideas",
    recommended: "Suggested for you",
  },

  splash: {
    title: "MyTravel",
    subtitle: "Your Trip. Your Way.",
    logo: "MT",
    backgroundColor: "#0f172a",
    accentColor: "#14b8a6",
    animation: "fade",
  },

  metadata: {
    title: "MyTravel | Personalized Trips & Flexible Getaways",
    description: "Build your perfect trip with flexible planning, curated ideas, and personalized travel experiences from MyTravel.",
  },

  contact: {
    email: "hello@mytravel.com",
    phone: "+91 98765 67890",
  },
};