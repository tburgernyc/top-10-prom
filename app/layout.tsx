import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LenisProvider } from "@/components/animations/LenisProvider";
import { Cursor } from "@/components/layout/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FittingRoomWidget } from "@/components/layout/FittingRoomWidget";
import { PageTransition } from "@/components/animations/PageTransition";
import { ToastProvider } from "@/components/ui/Toast";
import { AriaChatButton } from "@/components/chat/AriaChatButton";

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Luxury display font for headings
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ─── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Top 10 Prom — Curated Prom Collections",
    template: "%s | Top 10 Prom",
  },
  description:
    "Discover the region's finest prom collections. Explore designer gowns, book boutique appointments, and find your perfect look with our AI Style Concierge.",
  keywords: [
    "prom dresses",
    "prom gowns",
    "boutique prom",
    "prom 2025",
    "designer prom dresses",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Top 10 Prom",
    title: "Top 10 Prom — Curated Prom Collections",
    description:
      "Discover the region's finest prom collections. Explore designer gowns, book boutique appointments, and find your perfect look.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 10 Prom",
    description: "Curated prom collections from the region's finest boutiques.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ─────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <LenisProvider>
            {/* Custom cursor — client only, hidden on touch */}
            <Cursor />

            {/* Global chrome */}
            <Navbar />

            {/* Toast notifications portal */}
            <ToastProvider>
              {/* Page content with transition wipes */}
              <PageTransition>
                <main className="min-h-[calc(100dvh-4rem)] pt-16">
                  {children}
                </main>
              </PageTransition>
            </ToastProvider>

            <Footer />

            {/* Floating fitting room FAB */}
            <FittingRoomWidget />

            {/* Aria AI Concierge — floating bottom-left */}
            <AriaChatButton />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
