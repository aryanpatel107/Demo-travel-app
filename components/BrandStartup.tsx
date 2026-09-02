"use client";

import { useEffect, useState } from "react";
import BrandSplash from "@/components/brand/BrandSplash";

let hasShownStartupSplash = false;

export default function BrandStartup() {
  const [showSplash, setShowSplash] = useState(() => !hasShownStartupSplash);

  useEffect(() => {
    if (hasShownStartupSplash) {
      return;
    }

    hasShownStartupSplash = true;

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1650);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!showSplash) {
    return null;
  }

  return <BrandSplash />;
}
