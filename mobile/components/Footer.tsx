import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { theme } from "@/constants/theme";

export default function Footer() {
  const router = useRouter();
  const {
    config,
    branding,
    geo,
    contacts,
    socials,
    defaultCurrency,
    brandKey,
    primaryColor,
  } = useAppConfig();

  const brandName = branding.name?.trim() || "Travel";
  const brandFullName = branding.fullName && branding.fullName !== branding.name
    ? branding.fullName
    : "";
  const copyright = branding.footerCopyright || branding.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;

  const currencyCode = typeof defaultCurrency === "string"
    ? defaultCurrency
    : defaultCurrency?.code ?? defaultCurrency?.currencyCode ?? "USD";

  const currencySymbol = typeof defaultCurrency === "object" && defaultCurrency !== null
    ? defaultCurrency.symbol
    : "$";

  const navLinks = config.navigation ?? [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "My Trips", href: "/trips" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>{brandName}</Text>
          {Boolean(brandFullName) && (
            <Text style={styles.brandSubtitle}>{brandFullName}</Text>
          )}

          {/* Contacts */}
          {(contacts.emails.length > 0 || contacts.phones.length > 0) && (
            <View style={styles.contactRow}>
              {contacts.emails.map((email, idx) => (
                <Pressable
                  key={`email-${idx}`}
                  onPress={() => Linking.openURL(`mailto:${email.value}`)}
                >
                  <Text style={styles.contactText}>✉ {email.value}</Text>
                </Pressable>
              ))}
              {contacts.phones.map((phone, idx) => (
                <Pressable
                  key={`phone-${idx}`}
                  onPress={() => Linking.openURL(`tel:${phone.value}`)}
                >
                  <Text style={styles.contactText}>📞 {phone.value}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <View style={styles.socialRow}>
              {socials.map((social, idx) => (
                <Pressable
                  key={`social-${idx}`}
                  style={styles.socialBadge}
                  onPress={() => {
                    const url = social.url.startsWith("http")
                      ? social.url
                      : `https://${social.url}`;
                    Linking.openURL(url);
                  }}
                >
                  <Text style={styles.socialText}>{social.platform}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionHeader}>QUICK LINKS</Text>
          <View style={styles.linksGrid}>
            {navLinks.map((link, idx) => (
              <Pressable
                key={`footer-link-${idx}`}
                style={styles.linkItem}
                onPress={() => router.push(link.href as any)}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Region & Currency */}
        <View style={styles.metaRow}>
          {Boolean(geo.countryName) && (
            <Text style={styles.metaText}>
              Region: {geo.displayLocation ?? geo.countryName}
            </Text>
          )}
          {Boolean(currencyCode) && (
            <Text style={styles.metaText}>
              • Currency: {currencyCode} ({currencySymbol})
            </Text>
          )}
        </View>

        {/* Tagline & Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.tagline}>FLY · EXPLORE · RETURN</Text>
          <Text style={styles.copyrightText}>{copyright}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.ink,
    borderTopWidth: 1,
    borderTopColor: "rgba(235, 200, 120, 0.2)",
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  content: {
    gap: 20,
  },
  brandSection: {
    gap: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.sand,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: "rgba(247, 243, 235, 0.7)",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },
  contactText: {
    fontSize: 12,
    color: "rgba(247, 243, 235, 0.8)",
    textDecorationLine: "underline",
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  socialBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  socialText: {
    color: theme.colors.sand,
    fontSize: 11,
    fontWeight: "600",
  },
  linksSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 16,
    gap: 10,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: theme.colors.gold,
  },
  linksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: theme.colors.sand,
    fontSize: 13,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 12,
  },
  metaText: {
    color: "rgba(247, 243, 235, 0.6)",
    fontSize: 11,
    fontFamily: "monospace",
  },
  copyrightSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 12,
    alignItems: "center",
    gap: 6,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 4,
    color: theme.colors.gold,
    fontWeight: "700",
  },
  copyrightText: {
    fontSize: 11,
    color: "rgba(247, 243, 235, 0.5)",
    textAlign: "center",
  },
});
