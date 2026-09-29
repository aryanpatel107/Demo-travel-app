import { BrandConfig } from "./types";

export const travelproConfig: BrandConfig = {
  name: "TripGoAsia",
  logo: "https://d21bqxhdty55n7.cloudfront.net/uploads/fd63c771-6a91-924c-ae5c-3a1fa5fca46b/WebsiteMaster/iconId/388648ed-fca5-4b63-95c8-9d3386ad8e4c_logo.svg",
  visualStyle: "professional",

  colors: {
    primary: "#FF932C",
    secondary: "#3F3F69",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#1F2937",
    mutedText: "#475569",
    accent: "#3F3F69",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/trips", label: "My Bookings" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  hero: {
    badge: "Curated Journeys Across Asia",
    title: "Explore Asia with Confidence.",
    subtitle: "Handcrafted journeys across Thailand, Bali, Japan, Vietnam, and beyond with local guides and dedicated care.",
    primaryCtaLabel: "Explore Asia",
    secondaryCtaLabel: "Plan a Trip",
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
    featured: "Top Asian Destinations",
    benefits: "Travel planning that keeps your schedule on track",
    testimonials: "Travelers who love Asian exploration",
    cta: "Ready for your next unforgettable journey across Asia?",
    tripPlanner: "Book your next route",
    travelStories: "Traveler stories",
    specialOffers: "Handpicked Asian packages",
    recommended: "Trending Asian picks",
  },

  splash: {
    title: "TripGoAsia",
    subtitle: "Curated Journeys Across Asia",
    logo: "TGA",
    backgroundColor: "#1f2937",
    accentColor: "#FF932C",
    animation: "slide",
  },

  metadata: {
    title: "TripGoAsia | Curated Journeys Across Asia",
    description: "Explore Asia with curated itineraries, local guides, and seamless booking with TripGoAsia.",
  },

  contact: {
    email: "info@tripgoasia.com",
    phone: "+66 2 123 4567",
  },

  font: {
    family: "Inter",
  },
  websiteModules: ["PACKAGE", "HOTEL", "TOUR", "TRANSFER", "FLIGHT", "VISA"],
  recommendations: ["PACKAGE", "HOTEL", "TOUR"],
  socialMediaConfig: [],
  geo: {
    country: "TH",
    city: "Bangkok",
    ip: null,
  },
  copyright: `© ${new Date().getFullYear()} TripGoAsia. All rights reserved.`,
};