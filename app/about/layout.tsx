import type { Metadata } from "next";

let description: string;
let ogDescription: string;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const content = require("@/lib/content/about");
  const paragraphs: string[] = content.ABOUT_PARAGRAPHS;
  const subheadline: string = content.ABOUT_SUBHEADLINE;
  description = paragraphs[0]?.slice(0, 155) ?? subheadline;
  ogDescription = description;
} catch {
  description =
    "Top 10 Prom is the nation's largest network of specialty prom and formal wear boutiques.";
  ogDescription = description;
}

export const metadata: Metadata = {
  title: "About Us | Top 10 Prom",
  description,
  openGraph: {
    title: "About Top 10 Prom",
    description: ogDescription,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
