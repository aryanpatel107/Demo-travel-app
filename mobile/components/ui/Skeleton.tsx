import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, type ViewStyle } from "react-native";
import { Colors } from "../../constants/theme";

interface SkeletonProps {
  style?: ViewStyle | ViewStyle[];
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ style, width, height, borderRadius = 8 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as never,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CartItemSkeleton() {
  return (
    <View style={styles.cartSkeletonCard}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
      <Skeleton width="100%" height={36} style={{ marginTop: 12 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.cloud,
  },
  cartSkeletonCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    marginBottom: 12,
  },
});
