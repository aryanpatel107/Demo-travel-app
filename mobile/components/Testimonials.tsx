import { View, Text, StyleSheet } from "react-native";

const testimonials = [
  {
    quote:
      "Booked our Bali trip in ten minutes and the itinerary tool actually kept us organized the whole week.",
    name: "R. Mehta",
    location: "Surat, India",
  },
  {
    quote:
      "The pricing was exactly what we saw upfront. No surprise fees at checkout, which is rare these days.",
    name: "L. Andersen",
    location: "Oslo, Norway",
  },
  {
    quote:
      "Patagonia was the trip of a lifetime. Wanderly's destination notes were more useful than any guidebook.",
    name: "T. Osei",
    location: "Accra, Ghana",
  },
];

export default function Testimonials() {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {/* Section Label */}
        <Text style={styles.label}>
          Postcards from travelers
        </Text>

        {/* Heading */}
        <Text style={styles.heading}>
          Trusted by wanderers everywhere
        </Text>

        {/* Testimonials */}
        <View style={styles.testimonialsContainer}>
          {testimonials.map((testimonial) => (
            <View
              key={testimonial.name}
              style={styles.testimonialCard}
            >
              <Text style={styles.quote}>
                “{testimonial.quote}”
              </Text>

              <View style={styles.authorContainer}>
                <Text style={styles.author}>
                  {testimonial.name} · {testimonial.location}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    backgroundColor: "#0F4C4C",
    paddingVertical: 80,
  },

  container: {
    width: "100%",
    maxWidth: 1152,
    alignSelf: "center",
    paddingHorizontal: 24,
  },

  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#D4AF37",
    fontFamily: "monospace",
  },

  heading: {
    marginTop: 8,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "600",
    color: "#FAF7ED",
  },

  testimonialsContainer: {
    marginTop: 48,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 24,
  },

  testimonialCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FAF7ED",
    padding: 24,
  },

  quote: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(31, 41, 55, 0.8)",
  },

  authorContainer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: "#E5E7EB",
  },

  author: {
    fontSize: 12,
    color: "rgba(31, 41, 55, 0.5)",
    fontFamily: "monospace",
  },
});