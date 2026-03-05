import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridal Collection | Top 10 Prom",
  description:
    "Discover our curated bridal collection — elegant gowns for every ceremony, from intimate celebrations to grand affairs. Available exclusively at Top 10 Prom partner boutiques.",
  openGraph: {
    title: "Bridal Collection | Top 10 Prom",
    description: "Timeless bridal gowns curated by the nation's leading formal wear network.",
  },
};

export default function BridalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
