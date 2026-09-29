import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useAppConfig } from "@/contexts/BrandConfigContext";
import BrandHero from "@/components/brand/BrandHero";
import BrandModules from "@/components/brand/BrandModules";
import BrandPhilosophy from "@/components/brand/BrandPhilosophy";
import BrandDestinations from "@/components/brand/BrandDestinations";
import BrandBooking from "@/components/brand/BrandBooking";
import WanderlyHome from "@/components/home/WanderlyHome";
import TravelProHome from "@/components/home/TravelProHome";
import MyTravelHome from "@/components/home/MyTravelHome";
import Footer from "@/components/Footer";

export default function HomeScreen() {
  const { brandKey, branding } = useAppConfig();

  const brandName = branding.name?.trim().toLowerCase() || "";
  const isWanderly =
    brandKey === "wanderly" ||
    brandName.includes("wanderly") ||
    brandName.includes("gujju");
  const isTravelPro =
    brandKey === "travelpro" ||
    brandName.includes("travelpro") ||
    brandName.includes("tripgo");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand-Specific Home Views */}
      {isWanderly ? (
        <View>
          <BrandHero />
          <BrandModules />
          <BrandPhilosophy />
          <BrandDestinations />
          <BrandBooking />
        </View>
      ) : isTravelPro ? (
        <TravelProHome />
      ) : (
        <MyTravelHome />
      )}

      {/* Scrollable Bottom Footer */}
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingBottom: 24,
  },
});
