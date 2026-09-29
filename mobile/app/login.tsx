import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBrandConfig } from "@/contexts/BrandConfigContext";
import { useAuth } from "@/contexts/AuthContext";
import { loginApi } from "@/lib/apiClient";
import BrandLogo from "@/components/BrandLogo";

export default function LoginScreen() {
  const router = useRouter();
  const { branding, brandKey } = useBrandConfig();
  const { login, isAuthenticated, user, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = branding.primaryColor || "#2882c5";
  const brandName = branding.name || "Travel App";

  async function handleLogin() {
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const authUser = await loginApi({ email: trimmedEmail, password }, brandKey);
      await login(authUser);
      // On success: navigate back to Home
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/" as never);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (/failed to fetch|network request failed|networkerror|econnrefused/i.test(err.message)) {
          setError(
            "Unable to connect to the backend server. Please make sure the API is running or check your network."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // If already logged in on this brand, show account info and logout
  if (isAuthenticated && user) {
    const firstName = user.name?.trim() ? user.name.trim().split(" ")[0] : "Traveler";
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.brandSubtitle}>Active Session</Text>
          <Text style={styles.cardTitle}>{brandName}</Text>

          <View style={styles.profileBox}>
            <Text style={styles.profileLabel}>Signed in as:</Text>
            <Text style={styles.profileName}>Hi, {firstName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>

          <Pressable
            onPress={() => void logout()}
            style={[styles.primaryBtn, { backgroundColor: "#EF4444", marginTop: 12 }]}
          >
            <Text style={styles.primaryBtnText}>Log Out from {brandName}</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/" as never)}
            style={[styles.secondaryBtn, { marginTop: 12 }]}
          >
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <BrandLogo
              logoUrl={branding.logoUrl}
              brandName={brandName}
              brandKey={brandKey}
              primaryColor={primaryColor}
              secondaryColor={branding.secondaryColor}
              height={42}
              width={150}
              showTextFallback={false}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.brandSubtitle}>Welcome to</Text>
            <Text style={styles.cardTitle}>{brandName}</Text>
          </View>

          {/* Error Banner */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#64748B"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={[
                styles.primaryBtn,
                { backgroundColor: primaryColor },
                loading && styles.btnDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </Pressable>

            {/* Link to Register */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/register" as never)}>
                <Text style={[styles.switchLink, { color: primaryColor }]}>Create account</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/" as never);
                }
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  monogramBadge: {
    height: 48,
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  monogramText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  brandSubtitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#64748B",
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "500",
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  btnDisabled: {
    opacity: 0.7,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  switchText: {
    fontSize: 13,
    color: "#64748B",
  },
  switchLink: {
    fontSize: 13,
    fontWeight: "700",
  },
  profileBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  profileLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748B",
  },
  secondaryBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  secondaryBtnText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
});
