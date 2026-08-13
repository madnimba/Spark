import type { Metadata, Viewport } from "next";
import { Outfit, Permanent_Marker, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Absolute base for OG/Twitter tags. Vercel injects
 * `VERCEL_PROJECT_PRODUCTION_URL` at build time, so the deployed site gets the
 * right absolute URLs without anyone hardcoding a domain. Set
 * NEXT_PUBLIC_SITE_URL once a custom domain is attached.
 */
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Spark Prepaid Card — Follow ur Spark",
    template: "%s · Spark",
  },
  description:
    "The prepaid card built for how you actually spend. Load it, tap it, own it. Spark by Dhaka Bank PLC — pick your design and make it yours.",
  keywords: [
    "Spark card",
    "Dhaka Bank prepaid card",
    "prepaid card Bangladesh",
    "student card",
    "youth card Bangladesh",
  ],
  openGraph: {
    title: "Spark Prepaid Card — Follow ur Spark",
    description: "Load it, tap it, own it. Pick your design and make it yours.",
    url: SITE,
    siteName: "Spark",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark Prepaid Card — Follow ur Spark",
    description: "Load it, tap it, own it.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f6fea",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom stays enabled. The card's `touch-action: pan-y` already keeps
  // its one-finger drag from fighting the page, and blocking zoom would fail
  // WCAG 1.4.4 for anyone who needs to enlarge the text.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${marker.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
