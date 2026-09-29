export type VisualStyle = "editorial" | "professional" | "personal";

export interface BrandColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  [key: string]: string;
}

export interface NavigationItem {
  href: string;
  label: string;
}

export interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaHref: string;
}

export interface FeatureConfig {
  showStats: boolean;
  showBenefits: boolean;
  showDestinations: boolean;
  showTestimonials: boolean;
  showCTA: boolean;
  showTripPlanner: boolean;
  showTravelStories: boolean;
  showSpecialOffers: boolean;
  showWhySection?: boolean;
}

export interface SectionTitles {
  featured: string;
  benefits: string;
  testimonials: string;
  cta: string;
  tripPlanner: string;
  travelStories: string;
  specialOffers: string;
  recommended: string;
}

export interface SplashConfig {
  title: string;
  subtitle: string;
  logo: string;
  backgroundColor: string;
  accentColor: string;
  animation: string;
}

export interface MetadataConfig {
  title: string;
  description: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
}

export interface FontFile {
  url: string;
  weight: number;
}

export interface FontConfig {
  family: string;
  files?: FontFile[];
}

export type WebsiteModule = string | Record<string, unknown>;

export type Recommendation = string | Record<string, unknown>;

export interface SocialMediaItem {
  key: string;
  value: string;
}

export interface GeoConfig {
  country?: string | null;
  city?: string | null;
  ip?: string | null;
}

export type WebsiteLinkItem = string | Record<string, unknown>;

export interface WebsiteLinksConfig {
  headerType?: WebsiteLinkItem[];
  footerTypes?: WebsiteLinkItem[];
}

export interface WebsiteCurrencyItem {
  code?: string;
  currencyCode?: string;
  value?: string;
  name?: string;
  symbol?: string;
  [key: string]: unknown;
}

export type WebsiteRightItem = string | Record<string, unknown>;

export type WebsiteConfiguration = Record<string, unknown>;

export type ThemeConfig = Record<string, unknown>;

export interface BrandConfig {
  name: string;

  logo: string;

  visualStyle: VisualStyle;

  colors: BrandColors;

  navigation: NavigationItem[];

  hero: HeroConfig;

  features: FeatureConfig;

  sectionTitles: SectionTitles;

  splash: SplashConfig;

  metadata: MetadataConfig;

  contact: ContactConfig;

  // Optional fields that can also come from the remote API

  font?: FontConfig | null;

  websiteModules?: WebsiteModule[];

  recommendations?: Recommendation[];

  socialMediaConfig?: SocialMediaItem[];

  geo?: GeoConfig | null;

  websiteConfiguration?: WebsiteConfiguration | null;

  websiteCurrency?: WebsiteCurrencyItem[];

  websiteRights?: WebsiteRightItem[];

  websiteLinks?: WebsiteLinksConfig | null;

  theme?: ThemeConfig | null;

  copyright?: string;
}