import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { theme } from "@/constants/theme";

export function BrandRouteLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Skeleton width={120} height={18} />
        <Skeleton width={100} height={36} borderRadius={18} />
      </View>
      <View style={styles.card}>
        <Skeleton width="60%" height={24} style={{ marginBottom: 12 }} />
        <Skeleton width="90%" height={40} style={{ marginBottom: 12 }} />
        <Skeleton width="40%" height={16} style={{ marginBottom: 24 }} />
        <Skeleton width="100%" height={160} borderRadius={16} />
      </View>
    </View>
  );
}

export function DestinationExplorerSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={32} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={16} style={{ marginBottom: 20 }} />

      <View style={styles.chipsRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={75} height={36} borderRadius={18} />
        ))}
      </View>

      <Skeleton width="100%" height={46} borderRadius={23} style={{ marginBottom: 20 }} />

      <View style={{ gap: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.cardSkeleton}>
            <Skeleton width="100%" height={160} borderRadius={16} />
            <View style={{ padding: 12, gap: 8 }}>
              <Skeleton width="30%" height={14} />
              <Skeleton width="70%" height={20} />
              <Skeleton width="100%" height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DestinationDetailSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={260} borderRadius={24} style={{ marginBottom: 20 }} />
      <Skeleton width="30%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="75%" height={32} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={80} style={{ marginBottom: 24 }} />

      <View style={styles.statsGrid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} width="30%" height={70} borderRadius={16} />
        ))}
      </View>

      <Skeleton width="100%" height={50} borderRadius={25} style={{ marginTop: 24 }} />
    </View>
  );
}

export function TripsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Skeleton width={140} height={28} />
        <Skeleton width={100} height={36} borderRadius={18} />
      </View>

      <View style={{ gap: 14 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.tripCardSkeleton}>
            <View style={{ gap: 8 }}>
              <Skeleton width={160} height={20} />
              <Skeleton width={100} height={14} />
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <Skeleton width={70} height={16} />
              <Skeleton width={50} height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function TripFormSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={30} style={{ marginBottom: 24 }} />

      <View style={styles.card}>
        <Skeleton width={120} height={18} style={{ marginBottom: 14 }} />
        <Skeleton width="100%" height={48} borderRadius={12} style={{ marginBottom: 16 }} />
        <Skeleton width="100%" height={48} borderRadius={12} style={{ marginBottom: 16 }} />
        <Skeleton width="100%" height={48} borderRadius={12} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={48} borderRadius={24} />
      </View>
    </View>
  );
}

export function BrandLoadingFragment() {
  return (
    <View style={styles.fragment}>
      <Skeleton width={120} height={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  cardSkeleton: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tripCardSkeleton: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fragment: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 12,
  },
});
