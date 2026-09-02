import { wanderlyConfig } from "./wanderly";
import { travelproConfig } from "./travelpro";
import { mytravelConfig } from "./mytravel";
import type { BrandConfig } from "./types";

type BrandName = "wanderly" | "travelpro" | "mytravel";

const selectedBrand = process.env.NEXT_PUBLIC_BRAND?.trim().toLowerCase();
const brandMap: Record<BrandName, BrandConfig> = {
  wanderly: wanderlyConfig,
  travelpro: travelproConfig,
  mytravel: mytravelConfig,
};

export const config: BrandConfig = (() => {
  if (!selectedBrand) {
    throw new Error(
      "Missing NEXT_PUBLIC_BRAND. Set it to one of: wanderly, travelpro, mytravel."
    );
  }

  if (!(selectedBrand in brandMap)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_BRAND "${selectedBrand}". Expected one of: wanderly, travelpro, mytravel.`
    );
  }

  return brandMap[selectedBrand as BrandName];
})();