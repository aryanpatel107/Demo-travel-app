import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { Destination } from "@/data/destinations";
import { Colors, Shadows } from "@/constants/theme";
import { useBrandConfig } from "@/contexts/BrandConfigContext";

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
}

export function DestinationCard({ destination, onPress }: DestinationCardProps) {
  const router = useRouter();
  const { primaryColor } = useBrandConfig();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress || (() => router.push(`/destinations/${destination.id}` as never))}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: destination.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {destination.rating ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {destination.rating}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{destination.name}</Text>
          <Text style={styles.country}>📍 {destination.country}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {destination.description}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={[styles.priceValue, { color: primaryColor }]}>
              ${destination.price}
            </Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{destination.duration}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.slate200,
    overflow: "hidden",
    marginBottom: 16,
    ...Shadows.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: Colors.slate100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  header: {
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.slate900,
  },
  country: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.slate500,
  },
  description: {
    fontSize: 13,
    color: Colors.slate600,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.slate500,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  durationBadge: {
    backgroundColor: Colors.slate100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.slate700,
  },
});

export default DestinationCard;
