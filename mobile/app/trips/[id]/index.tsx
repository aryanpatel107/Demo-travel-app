import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToast } from "@/components/ui/Toast";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import { getTripApi, type TripItem as ApiTripItem } from "@/lib/apiClient";
import PaymentButton from "@/components/PaymentButton";
import Footer from "@/components/Footer";
import { theme } from "@/constants/theme";

type TripItemType = "flight" | "hotel" | "visa";

interface TripItem {
  id: string;
  type: TripItemType;
  title: string;
  provider: string;
  details: string;
  price: number;
}

const ITEM_ICONS: Record<TripItemType, string> = {
  flight: "✈️",
  hotel: "🏨",
  visa: "🛂",
};

export default function TripDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { branding, primaryColor, brandKey } = useAppConfig();
  const { showToast } = useToast();

  const primary = primaryColor || theme.colors.teal;
  const [realTrip, setRealTrip] = useState<ApiTripItem | null>(null);

  React.useEffect(() => {
    if (id) {
      getTripApi(id, brandKey)
        .then((trip) => {
          if (trip) setRealTrip(trip);
        })
        .catch(() => {
          // Keep preview items if offline or mock id
        });
    }
  }, [id, brandKey]);

  const [items, setItems] = useState<TripItem[]>([
    {
      id: "item-1",
      type: "flight",
      title: "Roundtrip Flight to Bali",
      provider: "Garuda Indonesia",
      details: "Economy · 1 stop · 2 travelers",
      price: 890,
    },
    {
      id: "item-2",
      type: "hotel",
      title: "Ubud Rainforest Resort & Spa",
      provider: "Luxury Escapes",
      details: "Villa Suite · 5 nights with breakfast",
      price: 650,
    },
    {
      id: "item-3",
      type: "visa",
      title: "Tourist Visa on Arrival",
      provider: "Immigration Express",
      details: "30-day single entry permit",
      price: 70,
    },
  ]);

  const totalAmount = items.reduce((acc, curr) => acc + curr.price, 0);

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast("Item removed from itinerary", "info");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top back row */}
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: primary }]}>← Back to My Trips</Text>
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: primary }]}>ITINERARY CART</Text>
        <View>
          <Text style={styles.title}>
            {realTrip?.destinationName
              ? `Trip to ${realTrip.destinationName}`
              : `Trip Itinerary #${id || "1"}`}
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Review flight, accommodation, and travel documents before confirming.
        </Text>
      </View>

      {/* Items List */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionHeading}>BOOKED SERVICES ({items.length})</Text>

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIconBox}>
                <Text style={styles.itemIcon}>{ITEM_ICONS[item.type]}</Text>
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={[styles.itemPrice, { color: primary }]}>
                    ${item.price}
                  </Text>
                </View>

                <Text style={styles.itemProvider}>Provider: {item.provider}</Text>
                <Text style={styles.itemDetails}>{item.details}</Text>

                <Pressable
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Price Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryHeading}>PRICE SUMMARY</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryVal}>${totalAmount}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes & Fees</Text>
          <Text style={styles.summaryVal}>$0 (Included)</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[styles.totalVal, { color: primary }]}>${totalAmount}</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <PaymentButton
            tripId={id || "1"}
            amount={totalAmount}
            currency="USD"
            label={`Pay $${totalAmount} Now`}
          />
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 24,
  },
  backRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  webH1: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  itemsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#64748b",
    marginBottom: 12,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...theme.shadows.sm,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  itemIcon: {
    fontSize: 22,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
  itemProvider: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  itemDetails: {
    fontSize: 12,
    color: "#94a3b8",
  },
  removeBtn: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  removeBtnText: {
    fontSize: 11,
    color: "#ef4444",
    fontWeight: "700",
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
    ...theme.shadows.sm,
  },
  summaryHeading: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#64748b",
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  totalVal: {
    fontSize: 22,
    fontWeight: "800",
  },
});
