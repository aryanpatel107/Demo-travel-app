"use client";

import Link from "next/link";
import { useAppConfig } from "@/components/RemoteConfigProvider";
import { getResolvedFooterLinks } from "@/types/remoteConfig";


export default function Footer() {
  const {
    config,
    remoteConfig,
    branding,
    geo,
    contacts,
    socials,
    defaultCurrency,
    brandKey,
  } = useAppConfig();

  const remoteFooterLinks = getResolvedFooterLinks(remoteConfig);
  const footerLinks =
    remoteFooterLinks.length > 0
      ? remoteFooterLinks
      : (config.navigation ?? []);

  const brandName = branding.name?.trim() || "";
  const normalizedBrand = brandName.toLowerCase();
  const isWanderly =
    brandKey === "wanderly" ||
    normalizedBrand.includes("wanderly") ||
    normalizedBrand.includes("gujju");

  const currencyCode =
    typeof defaultCurrency === "string"
      ? defaultCurrency
      : defaultCurrency?.code ?? defaultCurrency?.currencyCode;
  const currencySymbol =
    typeof defaultCurrency === "object" && defaultCurrency !== null
      ? defaultCurrency.symbol
      : undefined;

  if (isWanderly) {
    return (
      <footer className="wanderly-footer">
        <div className="wanderly-footer__inner">
          <div>
            <p className="wanderly-footer__brand">
              {branding.name || "Travel"}
            </p>

            <p className="wanderly-footer__meta">
              {branding.fullName &&
              branding.fullName !== branding.name
                ? branding.fullName
                : ""}
            </p>

            {/* Dynamic Contacts from API */}
            {(contacts.emails.length > 0 ||
              contacts.phones.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs opacity-80">
                {contacts.emails.map((email, index) => (
                  <a
                    key={`${email.value}-${index}`}
                    href={`mailto:${email.value}`}
                    className="hover:underline"
                  >
                    ✉ {email.value}
                  </a>
                ))}

                {contacts.phones.map((phone, index) => (
                  <a
                    key={`${phone.value}-${index}`}
                    href={`tel:${phone.value}`}
                    className="hover:underline"
                  >
                    📞 {phone.value}
                  </a>
                ))}
              </div>
            )}

            {/* Dynamic Social Links from API */}
            {socials.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {socials.map((social, index) => (
                  <a
                    key={`${social.platform}-${index}`}
                    href={
                      social.url.startsWith("http")
                        ? social.url
                        : `https://${social.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-black/10 px-2 py-0.5 text-xs hover:bg-black/20"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="wanderly-footer__links">
              {footerLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="brand-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Dynamic Geo & Currency Info */}
            {(geo.countryName || currencyCode) && (
              <div className="flex items-center gap-2 font-mono text-[11px] opacity-75">
                {geo.countryName && (
                  <span>
                    Region: {geo.displayLocation ?? geo.countryName}
                  </span>
                )}

                {geo.countryName && currencyCode && (
                  <span>•</span>
                )}

                {currencyCode && (
                  <span>
                    Currency: {currencyCode}
                    {currencySymbol ? ` (${currencySymbol})` : ""}
                  </span>
                )}
              </div>
            )}

            {/* Copyright from API */}
            {(branding.footerCopyright || branding.copyright) && (
              <p className="font-mono text-[11px] opacity-60">
                {branding.footerCopyright || branding.copyright}
              </p>
            )}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gold/30 bg-ink text-sand/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 font-mono text-xs sm:flex-row">
        <div>
          <p>{branding.footerCopyright || branding.copyright || ""}</p>

          {/* Dynamic Contacts from API */}
          {(contacts.emails.length > 0 ||
            contacts.phones.length > 0) && (
            <div className="mt-1 flex gap-3 text-[11px] text-sand/50">
              {contacts.emails.map((email, index) => (
                <a
                  key={`${email.value}-${index}`}
                  href={`mailto:${email.value}`}
                  className="hover:underline"
                >
                  {email.value}
                </a>
              ))}

              {contacts.phones.map((phone, index) => (
                <a
                  key={`${phone.value}-${index}`}
                  href={`tel:${phone.value}`}
                  className="hover:underline"
                >
                  {phone.value}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {geo.countryName && (
            <span className="text-sand/50">
              Region: {geo.displayLocation ?? geo.countryName}
            </span>
          )}

          <p className="tracking-widest">
            FLY · EXPLORE · RETURN
          </p>
        </div>
      </div>
    </footer>
  );
}