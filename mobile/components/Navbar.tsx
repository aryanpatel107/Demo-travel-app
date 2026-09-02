import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter, usePathname } from "expo-router";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/trips", label: "Trips" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      <Pressable style={styles.logo} onPress={() => router.push("/")}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>✈</Text>
        </View>
        <Text style={styles.logoText}>Wanderly</Text>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.linksRow}
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Pressable
              key={link.href}
              onPress={() => router.push(link.href)}
              style={styles.linkItem}
            >
              <Text style={[styles.linkText, active && styles.linkActive]}>
                {link.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.3)",
    backgroundColor: "#FAF7ED",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  logoBadge: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    color: "#FAF7ED",
    fontSize: 14,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  linksRow: {
    flexDirection: "row",
    gap: 24,
  },
  linkItem: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  linkText: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "rgba(31, 41, 55, 0.7)",
    fontFamily: "monospace",
  },
  linkActive: {
    color: "#1F2937",
    borderBottomColor: "#E76F51",
  },
});