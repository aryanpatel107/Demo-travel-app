module.exports = ({ config }) => {
  // Automatically detect and sync machine's active LAN IP for physical device testing
  try {
    const { detectAndSyncIp } = require("./scripts/detect-ip");
    detectAndSyncIp();
  } catch (err) {
    // Non-fatal fallback
  }

  // Determine active brand from environment variable or active hostname
  const rawBrand = (process.env.APP_BRAND || "").toLowerCase().trim();
  const rawHostname = (process.env.EXPO_PUBLIC_HOSTNAME || "").toLowerCase().trim();

  let brandKey = "tripgoasia";
  if (rawBrand === "gujjutours" || rawBrand === "wanderly" || rawHostname.includes("gujjutours")) {
    brandKey = "gujjutours";
  } else if (rawBrand === "technoheaven" || rawBrand === "mytravel" || rawHostname.includes("technoheaven")) {
    brandKey = "technoheaven";
  } else if (rawBrand === "tripgoasia" || rawBrand === "travelpro" || rawHostname.includes("tripgoasia")) {
    brandKey = "tripgoasia";
  }

  const brandProfiles = {
    tripgoasia: {
      name: "TripGoAsia",
      slug: "tripgoasia-travel",
      scheme: "tripgoasia",
      bundleIdentifier: "com.tripgoasia.travel",
      package: "com.tripgoasia.travel",
      adaptiveIconBg: "#FFF6ED"
    },
    gujjutours: {
      name: "GujjuTours",
      slug: "gujjutours-travel",
      scheme: "gujjutours",
      bundleIdentifier: "com.gujjutours.travel",
      package: "com.gujjutours.travel",
      adaptiveIconBg: "#EBF5FB"
    },
    technoheaven: {
      name: "Technoheaven B2B",
      slug: "technoheaven-b2b",
      scheme: "technoheaven",
      bundleIdentifier: "com.technoheaven.b2b",
      package: "com.technoheaven.b2b",
      adaptiveIconBg: "#E6F7FA"
    }
  };

  const active = brandProfiles[brandKey] || brandProfiles.tripgoasia;

  return {
    ...config,
    name: active.name,
    slug: active.slug,
    scheme: active.scheme,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    plugins: [
      ...(config.plugins || []),
      "@react-native-community/datetimepicker"
    ],
    ios: {
      ...(config.ios || {}),
      supportsTablet: true,
      bundleIdentifier: active.bundleIdentifier,
      buildNumber: "1",
      infoPlist: {
        ...(config.ios?.infoPlist || {}),
        NSAllowsArbitraryLoads: true
      }
    },
    android: {
      ...(config.android || {}),
      package: active.package,
      versionCode: 1,
      // Minimal necessary permissions: network access only
      permissions: ["INTERNET"],
      usesCleartextTraffic: true,
      adaptiveIcon: {
        backgroundColor: active.adaptiveIconBg,
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      predictiveBackGestureEnabled: false
    }
  };
};
