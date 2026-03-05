import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CatalogClient } from "./CatalogClient";
import type { Dress } from "@/lib/types/dress";

export const metadata: Metadata = {
  title: "Dress Catalog | Top 10 Prom",
  description:
    "Browse our curated 2026 collection of prom, bridal, and formal gowns from top designers.",
};

export default async function DressesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let dresses: Dress[] = [];
  let boutiques: string[] = [];

  try {
    const supabase = await createSupabaseServerClient();

    const { data: dressData } = await supabase
      .from("dresses")
      .select("*")
      .order("created_at", { ascending: false });

    dresses = (dressData ?? []) as Dress[];

    const { data: boutiqueData } = await supabase
      .from("boutiques")
      .select("name")
      .order("name");

    boutiques = (boutiqueData ?? []).map((b: { name: string }) => b.name);
  } catch {
    // DB unavailable — render empty catalog
  }

  const categoryLabel = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
    : "All Styles";

  return (
    <div className="min-h-screen bg-onyx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-2">
            {categoryLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ivory font-medium">
            2026 Catalog
          </h1>
          <p className="mt-2 text-platinum/50 text-sm">
            {dresses.length} {dresses.length === 1 ? "style" : "styles"} available
          </p>
        </div>

        <CatalogClient dresses={dresses} boutiques={boutiques} />
      </div>
    </div>
  );
}
