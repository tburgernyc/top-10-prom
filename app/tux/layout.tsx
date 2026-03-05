import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuxedos & Suits | Top 10 Prom",
  description:
    "Shop premium tuxedos and suits for prom, homecoming, and formal events. Classic black tie to modern slim-fit — styled to perfection at Top 10 Prom boutiques.",
  openGraph: {
    title: "Tuxedos & Suits | Top 10 Prom",
    description: "Premium formalwear for every occasion. Find your look at a Top 10 Prom boutique.",
  },
};

export default function TuxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
