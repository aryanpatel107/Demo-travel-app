export type VisualStyle = "editorial" | "professional" | "personal";

export interface BrandConfig {
  name: string;
  logo: string;
  visualStyle: VisualStyle;

  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    accent: string;
  };

  navigation: Array<{
    href: string;
    label: string;
  }>;

  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaHref: string;
  };

  features: {
    showStats: boolean;
    showBenefits: boolean;
    showDestinations: boolean;
    showTestimonials: boolean;
    showCTA: boolean;
    showTripPlanner: boolean;
    showTravelStories: boolean;
    showSpecialOffers: boolean;
    showWhySection?: boolean;
  };

  sectionTitles: {
    featured: string;
    benefits: string;
    testimonials: string;
    cta: string;
    tripPlanner: string;
    travelStories: string;
    specialOffers: string;
    recommended: string;
  };

  splash: {
    title: string;
    subtitle: string;
    logo: string;
    backgroundColor: string;
    accentColor: string;
    animation: string;
  };

  metadata: {
    title: string;
    description: string;
  };

  contact: {
    email: string;
    phone: string;
  };
}