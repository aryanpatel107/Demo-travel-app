
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getStaticBrandConfig,
  resolveRemoteBrandKey,
  resolveEnvironmentBrandKey,
  resolveActiveWebsite,
  resolveCurrentHostname,
  HOSTNAME_TO_BRAND,
  type BrandName,
} from "@/config";
import type {
  BrandConfig,
  Recommendation,
  ThemeConfig,
  WebsiteConfiguration,
  WebsiteCurrencyItem,
  WebsiteLinksConfig,
  WebsiteModule,
  WebsiteRightItem,
} from "@/config/types";
import { fetchBrandConfig, setCachedRemoteConfig, setCachedBrandId } from "@/lib/apiClient";
import type { RemoteConfigResult } from "@/types/remoteConfig";

/* =========================================================
   Types
   ========================================================= */

type RemoteConfig = RemoteConfigResult | null;

export interface BrandingInfo {
  name: string;
  fullName: string;
  logo: string;
  logoUrl: string;
  faviconUrl: string;
  copyright: string;
  footerCopyright: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontFiles?: { url: string; weight: number }[];
  phone: string;
  email: string;
  currency: string;
  modules: unknown[];
}

interface GeoInfo {
  country: string | null;
  countryName: string | null;
  city: string | null;
  ip: string | null;
  displayLocation: string;
}

interface ContactItem {
  value: string;
}

interface ContactsInfo {
  emails: ContactItem[];
  phones: ContactItem[];
}

interface SocialItem {
  key: string;
  value: string;
  platform: string;
  url: string;
}

interface CurrencyItem {
  code?: string;
  currencyCode?: string;
  value?: string;
  name?: string;
  symbol?: string;
  [key: string]: unknown;
}

interface AppConfigContextValue {
  config: BrandConfig;
  remoteConfig: RemoteConfig;
  brandKey: BrandName | null;
  loading: boolean;
  error: string | null;
  branding: BrandingInfo;
  geo: GeoInfo;
  contacts: ContactsInfo;
  socials: SocialItem[];
  currencies: CurrencyItem[];
  defaultCurrency: CurrencyItem | string | null;
  recommendations: unknown[];
  modules: unknown[];
  primaryColor: string;
  secondaryColor: string;
  isBrandResolved: boolean;
}

const RemoteConfigContext =
  createContext<AppConfigContextValue | null>(null);

/* =========================================================
   Helpers
   ========================================================= */

const isStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const firstStr = (...vals: unknown[]): string | undefined => {
  for (const v of vals) {
    if (isStr(v)) {
      return v.trim();
    }
  }

  return undefined;
};

/**
 * Extract a usable color from either:
 * - a string
 * - an object containing color scale values
 */
function extractColor(value: unknown): string | undefined {
  if (isStr(value)) {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const scale = value as Record<string, unknown>;

    return firstStr(
      scale["600"],
      scale["500"],
      scale["700"],
      scale["800"],
      scale["900"],
      scale["400"],
      Object.values(scale).find((v) => isStr(v))
    );
  }

  return undefined;
}

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  MY: "Malaysia",
  US: "United States",
  GB: "United Kingdom",
  AE: "United Arab Emirates",
  SG: "Singapore",
  TH: "Thailand",
  ID: "Indonesia",
  AU: "Australia",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  JP: "Japan",
  CN: "China",
};

function getCountryName(
  code: string | null
): string | null {
  if (!code) {
    return null;
  }

  const normalized = code.trim().toUpperCase();

  return COUNTRY_NAMES[normalized] ?? normalized;
}

/* =========================================================
   Remote extraction
   ========================================================= */

function resolveRemoteLogo(remote: RemoteConfig): string | undefined {
  if (!remote) return undefined;
  const website =
    remote.website && typeof remote.website === "object"
      ? (remote.website as Record<string, unknown>)
      : {};

  const rawPath = firstStr(
    website.icon,
    website.logo,
    website.logoUrl,
    website.logoURL,
    website.faviconImagePath,
    website.darkThemeLogoPath,
    website.image,
    remote.logo
  );

  if (!rawPath) return undefined;

  const staticBase = firstStr(
    website.staticPath,
    website.serviceImageCdnPath,
    remote.staticPath
  );

  // Preserve letter monograms like "W", "TP", "MT"
  if (/^[A-Za-z0-9]{1,4}$/.test(rawPath)) {
    return rawPath;
  }

  // Rewrite absolute URLs that erroneously pointed to API base or website root
  if (/^(https?:|\/\/)/i.test(rawPath)) {
    if (
      /gujjutours\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/cloudfront\.net/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    if (
      /tripgoasia\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/cloudfront\.net/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://d21bqxhdty55n7.cloudfront.net/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    if (
      /technoheaven\.com/i.test(rawPath) &&
      /WebsiteMaster/i.test(rawPath) &&
      !/stagingimage\.technoheaven\.com/i.test(rawPath)
    ) {
      const subpath = rawPath.replace(/^https?:\/\/[^/]+\//i, "");
      return `https://stagingimage.technoheaven.com/uploads/${subpath.replace(/^\/+/, "")}`;
    }

    return rawPath;
  }

  // Data URIs
  if (/^data:/i.test(rawPath)) {
    return rawPath;
  }

  // If we have an explicit staticPath from the dynamic config JSON
  if (staticBase) {
    return `${staticBase.replace(/\/+$/, "")}/${rawPath.replace(/^\/+/, "")}`;
  }

  // Relative remote asset path fallbacks by brand name
  const name = String(website.name || "").toLowerCase();
  if (name.includes("gujju")) {
    return `https://d3bfv5x1dw8ekm.cloudfront.net/uploads/${rawPath.replace(/^\/+/, "")}`;
  }
  if (name.includes("tripgoasia")) {
    return `https://d21bqxhdty55n7.cloudfront.net/uploads/${rawPath.replace(/^\/+/, "")}`;
  }
  if (name.includes("techno") || name.includes("stagingb2b")) {
    return `https://stagingimage.technoheaven.com/uploads/${rawPath.replace(/^\/+/, "")}`;
  }

  // Local relative path
  return `/${rawPath.replace(/^\/+/, "")}`;
}

function extractRemote(remote: RemoteConfig) {
  const website =
    remote?.website &&
    typeof remote.website === "object"
      ? (remote.website as Record<string, unknown>)
      : {};

  const colors =
    remote?.colors &&
    typeof remote.colors === "object"
      ? (remote.colors as Record<string, unknown>)
      : {};

  return {
    name: firstStr(
      website.name,
      website.fullName,
      website.title,
      remote?.name
    ),

    fullName: firstStr(
      website.fullName,
      website.name,
      website.title,
      remote?.fullName
    ),

    /* -------------------------------------------------------
       Logo
       ------------------------------------------------------- */

    logo: resolveRemoteLogo(remote),

    /* -------------------------------------------------------
       Colors
       ------------------------------------------------------- */

    primary: extractColor(colors.primary),

    secondary: extractColor(colors.secondary),

    background:
      extractColor(colors.background) ??
      extractColor(colors.neutral),

    surface: extractColor(colors.surface),

    text: extractColor(colors.text),

    mutedText:
      extractColor(colors.mutedText) ??
      extractColor(colors.muted),

    accent: extractColor(colors.accent),

    /* -------------------------------------------------------
       Font
       ------------------------------------------------------- */

    font: (() => {
      const fontValue = remote?.font;

      if (!fontValue) {
        return undefined;
      }

      if (isStr(fontValue)) {
        return {
          family: fontValue.trim(),
        };
      }

      if (
        typeof fontValue === "object" &&
        fontValue !== null
      ) {
        const fontObj =
          fontValue as Record<string, unknown>;

        const family = firstStr(
          fontObj.family,
          fontObj.name,
          fontObj.fontFamily
        );

        if (family) {
          return {
            family,
            files: Array.isArray(fontObj.files)
              ? fontObj.files
              : undefined,
          };
        }
      }

      return undefined;
    })(),

    /* -------------------------------------------------------
       Copyright
       ------------------------------------------------------- */

    copyright: firstStr(
      website.footerCopyright,
      website.copyright,
      remote?.copyright
    ),

    /* -------------------------------------------------------
       Navigation
       ------------------------------------------------------- */

    navigation: Array.isArray(website.navigation)
      ? website.navigation
      : undefined,

    /* -------------------------------------------------------
       Modules
       ------------------------------------------------------- */

    modules: Array.isArray(remote?.websiteModules)
      ? remote.websiteModules
      : [],

    /* -------------------------------------------------------
       Recommendations
       ------------------------------------------------------- */

    recommendations: Array.isArray(
      remote?.recommendations
    )
      ? remote.recommendations
      : [],

    /* -------------------------------------------------------
       Currency
       ------------------------------------------------------- */

    currencies: Array.isArray(
      remote?.websiteCurrency
    )
      ? remote.websiteCurrency
      : [],

    /* -------------------------------------------------------
       Social Media
       ------------------------------------------------------- */

    socials: Array.isArray(
      remote?.socialMediaConfig
    )
      ? remote.socialMediaConfig
          .map((item: unknown): SocialItem => {
            const obj =
              item && typeof item === "object"
                ? (item as Record<string, unknown>)
                : {};

            return {
              key:
                firstStr(
                  obj.key,
                  obj.name,
                  obj.platform
                ) ?? "",

              value:
                firstStr(
                  obj.value,
                  obj.url,
                  obj.link
                ) ?? "",

              platform:
                firstStr(
                  obj.platform,
                  obj.key,
                  obj.name
                ) ?? "",

              url:
                firstStr(
                  obj.url,
                  obj.value,
                  obj.link
                ) ?? "",
            };
          })
          .filter(
            (social) =>
              social.key ||
              social.value ||
              social.platform ||
              social.url
          )
      : [],

    /* -------------------------------------------------------
       Geo
       ------------------------------------------------------- */

    geo: (() => {
      const g =
        remote?.geo &&
        typeof remote.geo === "object"
          ? (remote.geo as Record<string, unknown>)
          : {};

      const country = isStr(g.country)
        ? g.country.trim()
        : null;

      const city = isStr(g.city)
        ? g.city.trim()
        : null;

      const ip = isStr(g.ip)
        ? g.ip.trim()
        : null;

      const countryName =
        getCountryName(country);

      let displayLocation = "";

      if (city && countryName) {
        displayLocation = `${city}, ${countryName}`;
      } else if (countryName) {
        displayLocation = countryName;
      } else if (city) {
        displayLocation = city;
      }

      return {
        country,
        countryName,
        city,
        ip,
        displayLocation,
      };
    })(),

    /* -------------------------------------------------------
       Contacts
       ------------------------------------------------------- */

    contacts: (() => {
      const raw =
        remote?.websiteContact &&
        typeof remote.websiteContact === "object"
          ? (remote.websiteContact as Record<
              string,
              unknown
            >)
          : {};

      const emails: ContactItem[] = [];
      const phones: ContactItem[] = [];

      const add = (
        list: ContactItem[],
        value: unknown
      ) => {
        if (
          isStr(value) &&
          !list.some(
            (item) =>
              item.value === value.trim()
          )
        ) {
          list.push({
            value: value.trim(),
          });
        }
      };

      const getItemValue = (
        item: unknown,
        fallbackKey?: string
      ): unknown => {
        if (typeof item === "string") {
          return item;
        }

        if (
          item &&
          typeof item === "object"
        ) {
          const obj =
            item as Record<string, unknown>;

          if (isStr(obj.value)) {
            return obj.value;
          }

          if (
            fallbackKey &&
            isStr(obj[fallbackKey])
          ) {
            return obj[fallbackKey];
          }
        }

        return undefined;
      };

      /* New structure */

      if (Array.isArray(raw.email)) {
        raw.email.forEach(
          (item: unknown) => {
            add(
              emails,
              getItemValue(item, "email")
            );
          }
        );
      }

      if (Array.isArray(raw.contact)) {
        raw.contact.forEach(
          (item: unknown) => {
            add(
              phones,
              getItemValue(item, "phone")
            );
          }
        );
      }

      /* Old structure fallback */

      if (Array.isArray(raw.emails)) {
        raw.emails.forEach(
          (item: unknown) => {
            add(
              emails,
              getItemValue(item, "email")
            );
          }
        );
      }

      if (Array.isArray(raw.phones)) {
        raw.phones.forEach(
          (item: unknown) => {
            add(
              phones,
              getItemValue(item, "phone")
            );
          }
        );
      }

      add(emails, raw.email);
      add(phones, raw.phone);

      return {
        emails,
        phones,
      };
    })(),

    /* -------------------------------------------------------
       Hero
       ------------------------------------------------------- */

    hero: {
      badge: undefined,
      title: undefined,
      subtitle: undefined,
      primaryCtaLabel: undefined,
      secondaryCtaLabel: undefined,
      primaryCtaHref: undefined,
      secondaryCtaHref: undefined,
    },

    /* -------------------------------------------------------
       Splash
       ------------------------------------------------------- */

    splash: {
      title: firstStr(
        website.fullName,
        website.name,
        website.title,
        remote?.fullName,
        remote?.name
      ),
      subtitle: firstStr(
        website.tagline,
        website.description,
        remote?.description
      ),
      logo: resolveRemoteLogo(remote),
    },

    /* -------------------------------------------------------
       Metadata
       ------------------------------------------------------- */

    metadata: {
      title: firstStr(
        website.fullName,
        website.name
      ),

      description: firstStr(
        website.description,
        remote?.description
      ),
    },
  };
}

/* =========================================================
   Merge static + remote configuration
   ========================================================= */

function mergeBrandConfig(
  staticConfig: BrandConfig,
  remote: RemoteConfig
): BrandConfig {
  const r = extractRemote(remote);

  return {
    ...staticConfig,

    name:
      r.name ??
      staticConfig.name,

    logo:
      r.logo ??
      staticConfig.logo,

    visualStyle:
      staticConfig.visualStyle,

    colors: {
      ...staticConfig.colors,

      primary:
        r.primary ??
        staticConfig.colors.primary,

      secondary:
        r.secondary ??
        staticConfig.colors.secondary,

      background:
        r.background ??
        staticConfig.colors.background,

      surface:
        r.surface ??
        staticConfig.colors.surface,

      text:
        r.text ??
        staticConfig.colors.text,

      mutedText:
        r.mutedText ??
        staticConfig.colors.mutedText,

      accent:
        r.accent ??
        staticConfig.colors.accent,
    },

    navigation:
      r.navigation &&
      r.navigation.length > 0
        ? r.navigation
        : staticConfig.navigation,

    hero: {
      ...staticConfig.hero,

      badge:
        r.hero.badge ??
        staticConfig.hero.badge,

      title:
        r.hero.title ??
        staticConfig.hero.title,

      subtitle:
        r.hero.subtitle ??
        staticConfig.hero.subtitle,

      primaryCtaLabel:
        r.hero.primaryCtaLabel ??
        staticConfig.hero.primaryCtaLabel,

      secondaryCtaLabel:
        r.hero.secondaryCtaLabel ??
        staticConfig.hero.secondaryCtaLabel,

      primaryCtaHref:
        r.hero.primaryCtaHref ??
        staticConfig.hero.primaryCtaHref,

      secondaryCtaHref:
        r.hero.secondaryCtaHref ??
        staticConfig.hero.secondaryCtaHref,
    },

    features: {
      ...staticConfig.features,
    },

    sectionTitles: {
      ...staticConfig.sectionTitles,
    },

    splash: {
      ...staticConfig.splash,

      title:
        r.splash.title ||
        r.fullName ||
        r.name ||
        staticConfig.splash.title,

      subtitle:
        r.splash.subtitle ||
        staticConfig.splash.subtitle,

      logo:
        r.splash.logo ||
        r.logo ||
        staticConfig.splash.logo,

      backgroundColor:
        r.background ||
        staticConfig.splash.backgroundColor ||
        "#090d16",

      accentColor:
        r.primary ||
        r.secondary ||
        staticConfig.splash.accentColor,

      animation:
        staticConfig.splash.animation,
    },

    metadata: {
      ...staticConfig.metadata,

      title:
        r.metadata.title ??
        staticConfig.metadata.title,

      description:
        r.metadata.description ??
        staticConfig.metadata.description,
    },

    contact: {
      ...staticConfig.contact,

      email:
        r.contacts.emails[0]?.value ??
        staticConfig.contact.email,

      phone:
        r.contacts.phones[0]?.value ??
        staticConfig.contact.phone,
    },

    font:
      r.font ??
      staticConfig.font,

    websiteModules:
      r.modules.length > 0
        ? (r.modules as WebsiteModule[])
        : staticConfig.websiteModules,

    recommendations:
      r.recommendations.length > 0
        ? (r.recommendations as Recommendation[])
        : staticConfig.recommendations,

    socialMediaConfig:
      r.socials.length > 0
        ? r.socials
        : staticConfig.socialMediaConfig,

    geo:
      remote?.geo
        ? r.geo
        : staticConfig.geo,

    websiteConfiguration:
      (remote?.websiteConfiguration as WebsiteConfiguration | null | undefined) ??
      staticConfig.websiteConfiguration,

    websiteCurrency:
      r.currencies.length > 0
        ? (r.currencies as WebsiteCurrencyItem[])
        : staticConfig.websiteCurrency,

    websiteRights:
      Array.isArray(remote?.websiteRights) &&
      remote.websiteRights.length > 0
        ? (remote.websiteRights as WebsiteRightItem[])
        : staticConfig.websiteRights,

    websiteLinks:
      (remote?.websiteLinks as WebsiteLinksConfig | null | undefined) ??
      staticConfig.websiteLinks,

    theme:
      (remote?.theme as ThemeConfig | null | undefined) ??
      staticConfig.theme,

    copyright:
      r.copyright ??
      staticConfig.copyright,
  };
}

/* =========================================================
   Provider
   ========================================================= */

export function RemoteConfigProvider({
  children,
  initialBrand = null,
  initialHostname = null,
}: {
  children: ReactNode;
  initialBrand?: BrandName | null;
  initialHostname?: string | null;
}) {
  const [remoteConfig, setRemoteConfig] =
    useState<RemoteConfig>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const activeHost = resolveCurrentHostname(initialHostname);
        const res =
          await fetchBrandConfig("en", activeHost);

        if (cancelled) {
          return;
        }

        if (!res?.isSuccess) {
          console.warn(
            "[RemoteConfigProvider] Remote configuration unavailable, falling back to static config:",
            res?.error ?? "Unable to load website configuration."
          );
          setRemoteConfig(null);
          return;
        }

        const resultConfig = res?.result ?? null;
        setRemoteConfig(resultConfig);
        setCachedRemoteConfig(resultConfig);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.warn(
          "[RemoteConfigProvider] Remote configuration error, falling back to static config:",
          err
        );

        setRemoteConfig(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [initialHostname]);

  /* -------------------------------------------------------
     Resolve brand
     ------------------------------------------------------- */

  const currentHostname = useMemo(() => {
    return resolveCurrentHostname(initialHostname);
  }, [initialHostname]);

  const brandKey =
    useMemo<BrandName | null>(() => {
      const name =
        extractRemote(remoteConfig).name;

      if (name) {
        const resolved = resolveRemoteBrandKey(name);
        if (resolved) return resolved;
      }

      return HOSTNAME_TO_BRAND[currentHostname] || initialBrand || "wanderly";
    }, [remoteConfig, initialBrand, currentHostname]);

  /*
   * Resolve brand fallback: priority brandKey -> initialBrand -> currentHostname brand
   */

  const resolvedBrandKey =
    brandKey ?? initialBrand ?? HOSTNAME_TO_BRAND[currentHostname] ?? "wanderly";

  useEffect(() => {
    setCachedBrandId(resolvedBrandKey);
  }, [resolvedBrandKey]);

  /* -------------------------------------------------------
     Static configuration
     ------------------------------------------------------- */

  const staticConfig = useMemo(
    () =>
      getStaticBrandConfig(
        resolvedBrandKey
      ),
    [resolvedBrandKey]
  );

  /* -------------------------------------------------------
     Merged configuration
     ------------------------------------------------------- */

  const config = useMemo(
    () =>
      mergeBrandConfig(
        staticConfig,
        remoteConfig
      ),
    [staticConfig, remoteConfig]
  );

  /* -------------------------------------------------------
     Geo
     ------------------------------------------------------- */

  const geo = useMemo<GeoInfo>(
    () =>
      extractRemote(remoteConfig).geo,
    [remoteConfig]
  );

  /* -------------------------------------------------------
     Contacts
     ------------------------------------------------------- */

  const contacts =
    useMemo<ContactsInfo>(() => {
      const remoteContacts =
        extractRemote(
          remoteConfig
        ).contacts;

      const emails = [
        ...remoteContacts.emails,
      ];

      const phones = [
        ...remoteContacts.phones,
      ];

      if (
        config.contact?.email &&
        !emails.some(
          (e) =>
            e.value ===
            config.contact!.email
        )
      ) {
        emails.push({
          value: config.contact.email,
        });
      }

      if (
        config.contact?.phone &&
        !phones.some(
          (p) =>
            p.value ===
            config.contact!.phone
        )
      ) {
        phones.push({
          value: config.contact.phone,
        });
      }

      return {
        emails,
        phones,
      };
    }, [
      remoteConfig,
      config.contact,
    ]);

  /* -------------------------------------------------------
     Colors
     ------------------------------------------------------- */

  const primaryColor =
    config.colors?.primary ||
    "#2882c5";

  const secondaryColor =
    config.colors?.secondary ||
    "#f58e83";

  /* -------------------------------------------------------
     Currencies
     ------------------------------------------------------- */

  const currencies =
    useMemo<CurrencyItem[]>(() => {
      if (
        !Array.isArray(
          config.websiteCurrency
        )
      ) {
        return [];
      }

      return config.websiteCurrency.filter(
        (
          item
        ): item is CurrencyItem =>
          typeof item === "object" &&
          item !== null
      );
    }, [
      config.websiteCurrency,
    ]);

  /* -------------------------------------------------------
     Default currency
     ------------------------------------------------------- */

  const defaultCurrency =
    useMemo<
      CurrencyItem | string | null
    >(() => {
      if (currencies.length > 0) {
        const preferred =
          currencies.find(
            (currency) => {
              const code =
                currency.code ??
                currency.currencyCode ??
                currency.value ??
                currency.name;

              return (
                typeof code ===
                  "string" &&
                code
                  .toLowerCase() ===
                  "usd"
              );
            }
          );

        return (
          preferred ??
          currencies[0]
        );
      }

      const remoteDefaultCurrency =
        remoteConfig?.defaultCurrency;

      const remoteCurrency =
        remoteConfig?.currency;

      if (
        typeof remoteDefaultCurrency ===
        "string"
      ) {
        return remoteDefaultCurrency;
      }

      if (
        remoteDefaultCurrency &&
        typeof remoteDefaultCurrency ===
          "object"
      ) {
        return remoteDefaultCurrency as CurrencyItem;
      }

      if (
        typeof remoteCurrency ===
        "string"
      ) {
        return remoteCurrency;
      }

      if (
        remoteCurrency &&
        typeof remoteCurrency ===
          "object"
      ) {
        return remoteCurrency as CurrencyItem;
      }

      return null;
    }, [
      currencies,
      remoteConfig,
    ]);

  /* -------------------------------------------------------
     Branding
     ------------------------------------------------------- */

  const branding =
    useMemo<BrandingInfo>(() => {
      const r =
        extractRemote(remoteConfig);
      const website =
        (remoteConfig?.website && typeof remoteConfig.website === "object"
          ? (remoteConfig.website as Record<string, unknown>)
          : {}) as Record<string, unknown>;
      const configObj =
        (remoteConfig?.websiteConfiguration &&
        typeof remoteConfig.websiteConfiguration === "object"
          ? (remoteConfig.websiteConfiguration as Record<string, unknown>)
          : {}) as Record<string, unknown>;
      const currencyObj =
        configObj.currency && typeof configObj.currency === "object"
          ? (configObj.currency as Record<string, unknown>)
          : null;

      const activeWebsite = resolveActiveWebsite(
        r.name || brandKey || resolvedBrandKey
      );

      const name =
        r.name ??
        (brandKey ? activeWebsite.displayName : config.name ?? staticConfig.name ?? "GujjuTours");

      const fullName =
        r.fullName ??
        (brandKey ? activeWebsite.displayName : config.name ?? staticConfig.name ?? "GujjuTours");

      const resolvedLogo =
        r.logo ??
        config.logo ??
        staticConfig.logo ??
        "";

      const faviconUrl =
        (typeof website?.faviconImagePath === "string" && website.faviconImagePath) ||
        (typeof website?.icon === "string" && website.icon) ||
        (typeof website?.favicon === "string" && website.favicon) ||
        (typeof website?.darkThemeLogoPath === "string" && website.darkThemeLogoPath) ||
        resolvedLogo;

      const footerCopyright =
        (typeof website?.footerCopyright === "string" && website.footerCopyright) ||
        (typeof website?.copyright === "string" && website.copyright) ||
        r.copyright ||
        config.copyright ||
        staticConfig.copyright ||
        `© ${new Date().getFullYear()} ${fullName}. All rights reserved.`;

      // Brand-specific fallback contacts
      const fallbackPhone =
        staticConfig.contact?.phone ||
        (resolvedBrandKey === "travelpro"
          ? "+66 2 123 4567"
          : resolvedBrandKey === "mytravel"
            ? "+971 4 123 4567"
            : "+91 9875095616");

      const fallbackEmail =
        staticConfig.contact?.email ||
        (resolvedBrandKey === "travelpro"
          ? "info@tripgoasia.com"
          : resolvedBrandKey === "mytravel"
            ? "contact@technoheaven.com"
            : "booking@gujjutours.com");

      const phone =
        contacts.phones[0]?.value ||
        fallbackPhone;

      const email =
        contacts.emails[0]?.value ||
        fallbackEmail;

      const fallbackCurrency =
        resolvedBrandKey === "wanderly" ? "INR" : "USD";

      const currency =
        (typeof defaultCurrency === "string"
          ? defaultCurrency
          : defaultCurrency?.code ?? defaultCurrency?.currencyCode) ||
        (typeof currencyObj?.code === "string" ? currencyObj.code : fallbackCurrency);

      const modulesList =
        Array.isArray(config.websiteModules) && config.websiteModules.length > 0
          ? config.websiteModules
          : (Array.isArray(remoteConfig?.websiteModules) ? remoteConfig.websiteModules : staticConfig.websiteModules || []);

      return {
        name,
        fullName,
        logo: resolvedLogo,
        logoUrl: resolvedLogo,
        faviconUrl,
        copyright: footerCopyright,
        footerCopyright,
        primaryColor,
        secondaryColor,
        fontFamily: config.font?.family || "Poppins",
        fontFiles: r.font?.files,
        phone,
        email,
        currency,
        modules: modulesList,
      };
    }, [
      remoteConfig,
      config,
      staticConfig,
      brandKey,
      resolvedBrandKey,
      contacts,
      defaultCurrency,
      primaryColor,
      secondaryColor,
    ]);

  /* -------------------------------------------------------
     Socials
     ------------------------------------------------------- */

  const socials =
    useMemo<SocialItem[]>(
      () =>
        extractRemote(
          remoteConfig
        ).socials,
      [remoteConfig]
    );

  /* -------------------------------------------------------
     Recommendations
     ------------------------------------------------------- */

  const recommendations =
    useMemo<unknown[]>(
      () =>
        Array.isArray(
          config.recommendations
        )
          ? config.recommendations
          : [],
      [config.recommendations]
    );

  /* -------------------------------------------------------
     Modules
     ------------------------------------------------------- */

  const modules =
    useMemo<unknown[]>(
      () =>
        Array.isArray(
          config.websiteModules
        )
          ? config.websiteModules
          : [],
      [config.websiteModules]
    );

  /* -------------------------------------------------------
     CSS variables
     ------------------------------------------------------- */

  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    const root =
      document.documentElement;

    root.style.setProperty(
      "--brand-primary",
      primaryColor
    );

    root.style.setProperty(
      "--brand-secondary",
      secondaryColor
    );

    root.style.setProperty(
      "--wanderly-orange",
      primaryColor
    );

    root.style.setProperty(
      "--wanderly-forest",
      primaryColor
    );

    if (config.colors?.background) {
      root.style.setProperty(
        "--brand-background",
        config.colors.background
      );
    }

    if (config.colors?.surface) {
      root.style.setProperty(
        "--brand-surface",
        config.colors.surface
      );
    }

    if (config.colors?.text) {
      root.style.setProperty(
        "--brand-text",
        config.colors.text
      );
    }

    if (
      config.colors?.mutedText
    ) {
      root.style.setProperty(
        "--brand-muted",
        config.colors.mutedText
      );
    }

    if (config.colors?.accent) {
      root.style.setProperty(
        "--brand-accent",
        config.colors.accent
      );
    }

    if (config.font?.family) {
      const family = config.font.family;
      root.style.setProperty(
        "--brand-font-family",
        `"${family}", var(--font-body), system-ui, sans-serif`
      );

      // Inject Poppins stylesheet if requested
      if (family.toLowerCase().includes("poppins")) {
        root.style.setProperty("--font-body", '"Poppins", system-ui, sans-serif');
        const linkId = "brand-font-poppins";
        if (!document.getElementById(linkId)) {
          const fontLink = document.createElement("link");
          fontLink.id = linkId;
          fontLink.rel = "stylesheet";
          fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
          document.head.appendChild(fontLink);
        }
      }
    }

    root.dataset.brand =
      brandKey ??
      resolvedBrandKey;
  }, [
    config,
    primaryColor,
    secondaryColor,
    brandKey,
    resolvedBrandKey,
  ]);

  /* -------------------------------------------------------
     Context value
     ------------------------------------------------------- */

  const isBrandResolved = hydrated && (!loading || remoteConfig !== null);

  const value =
    useMemo<AppConfigContextValue>(
      () => ({
        config,
        remoteConfig,
        brandKey,
        loading,
        error,
        branding,
        geo,
        contacts,
        socials,
        currencies,
        defaultCurrency,
        recommendations,
        modules,
        primaryColor,
        secondaryColor,
        isBrandResolved,
      }),
      [
        config,
        remoteConfig,
        brandKey,
        loading,
        error,
        branding,
        geo,
        contacts,
        socials,
        currencies,
        defaultCurrency,
        recommendations,
        modules,
        primaryColor,
        secondaryColor,
        isBrandResolved,
      ]
    );

  return (
    <RemoteConfigContext.Provider
      value={value}
    >
      {children}
    </RemoteConfigContext.Provider>
  );
}

/* =========================================================
   Hooks
   ========================================================= */

export function useAppConfig() {
  const ctx =
    useContext(
      RemoteConfigContext
    );

  if (!ctx) {
    throw new Error(
      "useAppConfig must be used inside RemoteConfigProvider."
    );
  }

  return ctx;
}

/**
 * Backward-compatible alias
 */
export function useRemoteConfig() {
  return useAppConfig();
}

