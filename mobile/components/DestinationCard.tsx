import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import type { Destination } from "../type/destination";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({
  destination,
}: DestinationCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/destinations/${destination.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: destination.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Rating */}
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            {destination.rating}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>
          {destination.name}
        </Text>

        <Text style={styles.country}>
          {destination.country}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {destination.description}
        </Text>

        {/* Bottom information */}
        <View style={styles.bottomRow}>
          <Text style={styles.duration}>
            {destination.duration}
          </Text>

          <Text style={styles.price}>
            ${destination.price}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",

    // Shadow - iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    // Shadow - Android
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.9,
  },

  imageContainer: {
    height: 192,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    height: "100%",
    width: "100%",
  },

  rating: {
    position: "absolute",
    right: 12,
    top: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.6)",
    backgroundColor: "rgba(250, 247, 237, 0.95)",
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
    fontFamily: "monospace",
  },

  content: {
    padding: 20,
  },

  name: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: "#1F2937",
  },

  country: {
    marginTop: 2,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(31, 41, 55, 0.5)",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(31, 41, 55, 0.7)",
  },

  bottomRow: {
    marginTop: 16,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderStyle: "dashed",
  },

  duration: {
    fontSize: 12,
    color: "rgba(31, 41, 55, 0.5)",
    fontFamily: "monospace",
  },

  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E76F51",
    fontFamily: "monospace",
  },
});
