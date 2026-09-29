import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HOSTNAME:
      process.env.NEXT_PUBLIC_HOSTNAME ||
      process.env.HOSTNAME ||
      "www.gujjutours.com",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.technoheaven.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
