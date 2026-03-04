"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/lib/stores/shopStore";

/* ─── Static option lists (will eventually be driven from DB aggregates) ─── */

const SIZE_OPTIONS = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20"];

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Champagne",
  "Rose Gold",
  "Midnight Blue",
  "Emerald",
  "Burgundy",
  "Lavender",
  "Coral",
];

export interface FilterBarProps {
  /** Available stores for the store-filter chips (sourced from catalog data) */
  availableStores?: string[];
  className?: string;
}

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium",
        "border transition-all duration-200 whitespace-nowrap",
        "focus-visible:outline-1 focus-visible:outline-gold",
        active
          ? "glass-2 border-gold/50 text-gold shadow-[0_0_8px_rgba(212,175,55,0.15)]"
          : "border-white/[0.08] text-platinum/60 hover:text-platinum hover:border-white/[0.16] hover:bg-white/[0.04]"
      )}
      whileTap={{ scale: 0.96 }}
      data-cursor="pointer"
      aria-pressed={active}
    >
      {label}
    </motion.button>
  );
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="flex-shrink-0 text-[10px] font-semibold tracking-widest uppercase text-platinum/30">
        {label}
      </span>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {children}
      </div>
    </div>
  );
}

export function FilterBar({ availableStores = [], className }: FilterBarProps) {
  const {
    sizes, toggleSize,
    colors, toggleColor,
    stores, toggleStore,
    clearFilters,
  } = useShopStore();

  const hasActiveFilters = sizes.length > 0 || colors.length > 0 || stores.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4",
        "border-b border-white/[0.06]",
        className
      )}
      aria-label="Catalog filters"
    >
      {/* Size row */}
      <FilterGroup label="Size">
        {SIZE_OPTIONS.map((s) => (
          <Chip
            key={s}
            label={s}
            active={sizes.includes(s)}
            onClick={() => toggleSize(s)}
          />
        ))}
      </FilterGroup>

      {/* Color row */}
      <FilterGroup label="Color">
        {COLOR_OPTIONS.map((c) => (
          <Chip
            key={c}
            label={c}
            active={colors.includes(c)}
            onClick={() => toggleColor(c)}
          />
        ))}
      </FilterGroup>

      {/* Store row — only when stores are available */}
      {availableStores.length > 0 && (
        <FilterGroup label="Boutique">
          {availableStores.map((store) => (
            <Chip
              key={store}
              label={store}
              active={stores.includes(store)}
              onClick={() => toggleStore(store)}
            />
          ))}
        </FilterGroup>
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <motion.button
          onClick={clearFilters}
          className="self-start text-xs text-platinum/40 hover:text-platinum/70 transition-colors underline underline-offset-2"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          data-cursor="pointer"
        >
          Clear all filters
        </motion.button>
      )}
    </div>
  );
}
