import { View, Text, StyleSheet } from "react-native";

interface BoardingPassCardProps {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  date: string;
  price: number;
  duration: string;
}

export default function BoardingPassCard({
  fromCity,
  fromCode,
  toCity,
  toCode,
  date,
  price,
  duration,
}: BoardingPassCardProps) {
  return (
    <View style={styles.card}>

      {/* Top section: route */}
      <View style={styles.routeSection}>

        <View>
          <Text style={styles.label}>FROM</Text>
          <Text style={styles.code}>{fromCode}</Text>
          <Text style={styles.city}>{fromCity}</Text>
        </View>

        <View style={styles.routeLine}>
          <View style={styles.dot} />

          <View style={styles.dashedLine} />

          <Text style={styles.plane}>✈</Text>

          <View style={styles.dashedLine} />

          <View style={styles.dot} />
        </View>

        <View style={styles.toContainer}>
          <Text style={styles.label}>TO</Text>
          <Text style={styles.code}>{toCode}</Text>
          <Text style={styles.city}>{toCity}</Text>
        </View>

      </View>

      {/* Perforated divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.sideCircleLeft} />
        <View style={styles.divider} />
        <View style={styles.sideCircleRight} />
      </View>

      {/* Bottom section */}
      <View style={styles.details}>

        <View>
          <Text style={styles.label}>DEPARTS</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>

        <View>
          <Text style={styles.label}>DURATION</Text>
          <Text style={styles.detailValue}>{duration}</Text>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.label}>FARE</Text>
          <Text style={styles.fare}>${price}</Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#F5EBD7",
    borderRadius: 20,
    overflow: "hidden",

    // Android shadow
    elevation: 8,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  routeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  label: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(30, 30, 30, 0.5)",
    fontWeight: "600",
  },

  code: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },

  city: {
    marginTop: 2,
    fontSize: 12,
    color: "rgba(30, 30, 30, 0.6)",
  },

  routeLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E8C766",
  },

  dashedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(30, 30, 30, 0.3)",
    marginHorizontal: 4,
  },

  plane: {
    fontSize: 18,
    color: "#E76F51",
  },

  toContainer: {
    alignItems: "flex-end",
  },

  dividerContainer: {
    height: 1,
    position: "relative",
    justifyContent: "center",
  },

  divider: {
    width: "100%",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(30, 30, 30, 0.25)",
  },

  sideCircleLeft: {
    position: "absolute",
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0E5C56",
  },

  sideCircleRight: {
    position: "absolute",
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0E5C56",
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },

  detailValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },

  fareContainer: {
    alignItems: "flex-end",
  },

  fare: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#E76F51",
  },
});
