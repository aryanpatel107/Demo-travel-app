import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useBrandConfig } from "@/contexts/BrandConfigContext";
import { useAuth } from "@/contexts/AuthContext";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const router = useRouter();
  const { branding, brandKey } = useBrandConfig();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  const primaryColor = branding.primaryColor || "#2882c5";
  const brandName = branding.name || "Travel App";

  return (
    <View style={styles.container}>
      {/* Brand Logo */}
      <Pressable
        style={styles.brandRow}
        onPress={() => router.push("/" as never)}
      >
        <BrandLogo
          logoUrl={branding.logoUrl}
          brandName={brandName}
          brandKey={brandKey}
          primaryColor={primaryColor}
          secondaryColor={branding.secondaryColor}
          height={34}
        />
      </Pressable>

      {/* Auth Status for current brand only */}
      <View style={styles.authRow}>
        {authLoading ? (
          <ActivityIndicator size="small" color={primaryColor} />
        ) : isAuthenticated && user ? (
          <View style={styles.userContainer}>
            <Text style={styles.userGreeting} numberOfLines={1}>
              Hi, {user?.name?.trim() ? user.name.trim().split(" ")[0] : "User"}
            </Text>
            <Pressable
              onPress={() => void logout()}
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/login" as never)}
            style={({ pressed }) => [
              styles.loginBtn,
              { backgroundColor: primaryColor },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  authRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userGreeting: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    maxWidth: 90,
  },
  logoutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  logoutBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
});
