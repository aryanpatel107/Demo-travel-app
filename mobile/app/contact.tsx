import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { useToast } from "@/components/ui/Toast";
import { sendContactMessageApi } from "@/lib/apiClient";
import Footer from "@/components/Footer";
import { theme } from "@/constants/theme";

export default function ContactScreen() {
  const { branding, primaryColor, brandKey } = useAppConfig();
  const { showToast } = useToast();
  const brandName = branding.name || "Wanderly";
  const primary = primaryColor || theme.colors.teal;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill in your name, email, and message.", "info");
      return;
    }

    setLoading(true);
    try {
      await sendContactMessageApi(
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
        brandKey
      );
      setSubmitted(true);
      showToast("Message sent successfully!", "success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={[styles.kicker, { color: primary }]}>GET IN TOUCH</Text>
        <View>
          <Text style={styles.title}>Contact Us</Text>
        </View>
        <Text style={styles.subtitle}>
          Have questions or want to collaborate with {brandName}? Send us a
          message and we will get back to you shortly.
        </Text>

        {submitted ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Thank you!</Text>
            <Text style={styles.successText}>
              Thanks for reaching out! We have received your message and will get
              back to you soon.
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: "top" }]}
                value={message}
                onChangeText={setMessage}
                placeholder="How can we help?"
                placeholderTextColor="#94a3b8"
                multiline
              />
            </View>

            <Pressable
              style={[
                styles.submitButton,
                { backgroundColor: primary },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Send Message</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingVertical: 24,
  },
  card: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  webH1: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  submitButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    ...theme.shadows.sm,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  successBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#065f46",
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#047857",
  },
});
