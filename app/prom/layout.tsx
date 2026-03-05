import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prom 2026 Dresses | Top 10 Prom",
  description:
    "Shop the most sought-after prom gowns of 2026. Exclusive styles from Sherri Hill, Mac Duggal, Jovani, and more — available only at Top 10 Prom boutiques.",
  openGraph: {
    title: "Prom 2026 | Top 10 Prom",
    description: "Exclusive 2026 prom gowns. Find your boutique, claim your color.",
  },
};

export default function PromLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
