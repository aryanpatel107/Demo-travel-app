
import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandStartup from "@/components/BrandStartup";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { RemoteConfigProvider } from "@/components/RemoteConfigProvider";
import {
  resolveCurrentHostname,
  HOSTNAME_TO_BRAND,
  type BrandName,
  type SupportedHostname,
} from "@/config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Travel",
  description: "Travel website",
};

async function detectRequestedHostname(): Promise<SupportedHostname> {
  try {
    const headerList = await headers();

    return resolveCurrentHostname({
      headers: headerList,
    });
  } catch {
    return resolveCurrentHostname();
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialHostname = await detectRequestedHostname();
  const initialBrand: BrandName = HOSTNAME_TO_BRAND[initialHostname] || "wanderly";

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-sand font-body text-ink antialiased">
        <RemoteConfigProvider
          initialBrand={initialBrand}
          initialHostname={initialHostname}
        >
          <ToastProvider>
            <AuthProvider>
              <BrandStartup />

              <Navbar />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </AuthProvider>
          </ToastProvider>
        </RemoteConfigProvider>
      </body>
    </html>
  );
}

