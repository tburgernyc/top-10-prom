"use client";

import { useState, useMemo } from "react";
import { FilterBar } from "@/components/shop/FilterBar";
import { DressCardGrid } from "@/components/shop/DressCardGrid";
import { DressDetailPanel } from "@/components/shop/DressDetailPanel";
import { AvailabilityForm } from "@/components/shop/AvailabilityForm";
import { useShopStore } from "@/lib/stores/shopStore";
import type { Dress } from "@/lib/types/dress";

interface CatalogClientProps {
  dresses: Dress[];
  boutiques: string[];
}

export function CatalogClient({ dresses, boutiques }: CatalogClientProps) {
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [availDress, setAvailDress] = useState<Dress | null>(null);
  const [preselectedStore, setPreselectedStore] = useState("");

  const { sizes, colors, stores } = useShopStore();

  const filtered = useMemo(() => {
    return dresses.filter((d) => {
      if (sizes.length > 0 && !sizes.some((s) => d.attributes.sizes?.includes(s))) return false;
      if (colors.length > 0 && !colors.some((c) => d.attributes.colors?.includes(c))) return false;
      if (stores.length > 0 && !stores.some((s) => d.available_stores.includes(s))) return false;
      return true;
    });
  }, [dresses, sizes, colors, stores]);

  return (
    <>
      <FilterBar availableStores={boutiques} />

      <DressCardGrid
        dresses={filtered}
        onSelectDress={setSelectedDress}
        className="mt-6"
      />

      <DressDetailPanel
        dress={selectedDress}
        isOpen={!!selectedDress}
        onClose={() => setSelectedDress(null)}
        onCheckAvailability={(dress, store) => {
          setAvailDress(dress);
          setPreselectedStore(store);
        }}
      />

      <AvailabilityForm
        isOpen={!!availDress}
        onClose={() => {
          setAvailDress(null);
          setPreselectedStore("");
        }}
        dress={availDress}
        preselectedStore={preselectedStore}
      />
    </>
  );
}
