import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { apiFetch } from "../../lib/apiClient";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      Alert.alert("Missing information", "Please complete every field.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/contact", { method: "POST", body: JSON.stringify(form) });
      setSubmitted(true);
    } catch (error) {
      Alert.alert("Message not sent", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Contact Us</Text>
      {submitted ? <Text style={styles.success}>Thanks for reaching out! We will get back to you soon.</Text> : <View style={styles.form}>
        <Field label="Name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
        <Field label="Email" value={form.email} keyboardType="email-address" onChangeText={(email) => setForm({ ...form, email })} />
        <Field label="Message" value={form.message} multiline onChangeText={(message) => setForm({ ...form, message })} />
        <Pressable disabled={submitting} onPress={handleSubmit} style={[styles.button, submitting && styles.disabled]}><Text style={styles.buttonText}>{submitting ? "Sending..." : "Send Message"}</Text></Pressable>
      </View>}
    </ScrollView>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return <View><Text style={styles.label}>{label}</Text><TextInput {...props} placeholderTextColor="#9CA3AF" style={[styles.input, props.multiline && styles.message]} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAF7ED" }, content: { padding: 24, paddingTop: 48 }, title: { color: "#1F2937", fontSize: 30, fontWeight: "700", marginBottom: 24 }, form: { gap: 18 }, label: { color: "rgba(31, 41, 55, 0.7)", fontSize: 14, fontWeight: "600", marginBottom: 6 }, input: { backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: 10, borderWidth: 1, color: "#1F2937", fontSize: 15, padding: 13 }, message: { height: 120, textAlignVertical: "top" }, button: { alignItems: "center", backgroundColor: "#0F766E", borderRadius: 999, marginTop: 6, padding: 14 }, disabled: { opacity: 0.6 }, buttonText: { color: "#FAF7ED", fontSize: 14, fontWeight: "700" }, success: { backgroundColor: "#FFF", borderColor: "#0F766E", borderRadius: 14, borderWidth: 1, color: "#0F766E", fontSize: 15, padding: 16 },
});
