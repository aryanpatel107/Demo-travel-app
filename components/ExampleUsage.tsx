"use client";

import { useRemoteConfig } from "@/components/RemoteConfigProvider";
import { getGoogleMapsApiKey } from "@/types/remoteConfig";

export default function ExampleUsage() {
  const { remoteConfig, loading, error } = useRemoteConfig();

  if (loading) return <p>Loading brand config...</p>;
  if (error) return <p>Could not load config: {error}</p>;
  if (!remoteConfig) return null;

  const mapsKey = getGoogleMapsApiKey(remoteConfig);
  const primaryColor =
    typeof remoteConfig.colors?.primary === "object"
      ? remoteConfig.colors.primary?.["500"]
      : remoteConfig.colors?.primary;
  const fontFamily = remoteConfig.font?.family;

  return (
    <div className="space-y-2 text-sm">
      <p>Website name: {remoteConfig.website?.fullName ?? "(not set yet)"}</p>
      <p>Font: {fontFamily ?? "(not set yet)"}</p>
      <p>Primary color: {primaryColor ?? "(not set yet)"}</p>
      <p>Google Maps key: {mapsKey ? "✓ present" : "(not set)"}</p>

      {primaryColor && (
        <div style={{ backgroundColor: primaryColor, padding: "1rem", color: "white" }}>
          This box uses the fetched primary color.
        </div>
      )}
    </div>
  );
}