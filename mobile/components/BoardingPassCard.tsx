import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

export interface BoardingPassCardProps {
  fromCity?: string;
  fromCode?: string;
  toCity?: string;
  toCode?: string;
  date?: string;
  price?: number;
  duration?: string;
}

export function BoardingPassCard({
  fromCity = "Surat",
  fromCode = "STV",
  toCity = "Bali",
  toCode = "DPS",
  date = "12 Nov",
  price = 899,
  duration = "7h 40m",
}: BoardingPassCardProps) {
  return (
    <View style={styles.card}>
      {/* Top section: route */}
      <View style={styles.topSection}>
        <View style={styles.airportCol}>
          <Text style={styles.subLabel}>FROM</Text>
          <Text style={styles.codeText}>{fromCode}</Text>
          <Text style={styles.cityText}>{fromCity}</Text>
        </View>

        <View style={styles.flightLineContainer}>
          <View style={styles.dot} />
          <View style={styles.dashedLine} />
          <Text style={styles.planeIcon}>✈</Text>
          <View style={styles.dashedLine} />
          <View style={styles.dot} />
        </View>

        <View style={[styles.airportCol, { alignItems: "flex-end" }]}>
          <Text style={styles.subLabel}>TO</Text>
          <Text style={styles.codeText}>{toCode}</Text>
          <Text style={styles.cityText}>{toCity}</Text>
        </View>
      </View>

      {/* Perforation divider with side notches */}
      <View style={styles.perforationRow}>
        <View style={styles.leftNotch} />
        <View style={styles.perforatedLine} />
        <View style={styles.rightNotch} />
      </View>

      {/* Bottom section: details */}
      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.detailLabel}>DEPARTS</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>DURATION</Text>
          <Text style={styles.detailValue}>{duration}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.detailLabel}>FARE</Text>
          <Text style={[styles.detailValue, { color: theme.colors.coral }]}>
            ${price}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: theme.colors.sand,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 16,
  },
  airportCol: {
    gap: 2,
  },
  subLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: "monospace",
    color: "rgba(22, 36, 31, 0.5)",
    textTransform: "uppercase",
  },
  codeText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  cityText: {
    fontSize: 12,
    color: "rgba(22, 36, 31, 0.65)",
    fontWeight: "600",
  },
  flightLineContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.gold,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "rgba(22, 36, 31, 0.25)",
    borderStyle: "dashed",
    marginHorizontal: 4,
  },
  planeIcon: {
    fontSize: 16,
    color: theme.colors.coral,
  },
  perforationRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    height: 24,
  },
  leftNotch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.teal,
    marginLeft: -10,
  },
  perforatedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "rgba(22, 36, 31, 0.2)",
    borderStyle: "dashed",
  },
  rightNotch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.teal,
    marginRight: -10,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  detailLabel: {
    fontSize: 9,
    fontFamily: "monospace",
    letterSpacing: 1.5,
    color: "rgba(22, 36, 31, 0.5)",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "700",
    color: theme.colors.ink,
  },
});

export default BoardingPassCard;
