import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../constants/theme";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= Math.round(rating);
    stars.push(
      <Pressable
        key={i}
        disabled={!interactive}
        onPress={() => onRatingChange && onRatingChange(i)}
        style={styles.starTouch}
      >
        <Text style={[styles.star, { fontSize: size, color: isFilled ? Colors.gold : Colors.cloud }]}>
          ★
        </Text>
      </Pressable>
    );
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starTouch: {
    paddingHorizontal: 1,
  },
  star: {
    fontWeight: "bold",
  },
});
