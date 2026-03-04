"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Carousel } from "@/components/ui/Carousel";
import { useShopStore } from "@/lib/stores/shopStore";
import { cn } from "@/lib/utils";
import type { Dress } from "@/lib/types/dress";

export interface DressDetailPanelProps {
  dress: Dress | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called when "Check Availability" CTA is clicked */
  onCheckAvailability?: (dress: Dress, store: string) => void;
}

const COMMERCE_ENABLED = process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";

/* ── Store availability row ───────────────────────────────────────────────── */
interface StoreRowProps {
  store: string;
  onCheck: () => void;
}

function StoreRow({ store, onCheck }: StoreRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-2.5">
        {/* Status dot — always "available" at this tier */}
        <span className="w-2 h-2 rounded-full bg-emerald-500/70 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm text-platinum/80">{store}</span>
      </div>
      <button
        onClick={onCheck}
        className="text-xs text-gold hover:text-gold-light transition-colors font-medium underline underline-offset-2"
        data-cursor="pointer"
        aria-label={`Check availability at ${store}`}
      >
        Check Availability
      </button>
    </div>
  );
}

/* ── Main panel ───────────────────────────────────────────────────────────── */
export function DressDetailPanel({
  dress,
  isOpen,
  onClose,
  onCheckAvailability,
}: DressDetailPanelProps) {
  const { addItem, removeItem, isInRoom, toggleWishlist, isWishlisted } = useShopStore();

  if (!dress) return null;

  const inRoom = isInRoom(dress.id);
  const wishlisted = isWishlisted(dress.id);
  const primaryImage = dress.image_urls[0] ?? "/images/placeholder-dress.avif";

  function handleFittingRoom() {
    if (inRoom) {
      removeItem(dress!.id);
    } else {
      addItem({
        id: dress!.id,
        name: dress!.name,
        designer: dress!.designer,
        image_url: primaryImage,
      });
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={dress.name}
      side="right"
      className="max-w-lg"
    >
      <div className="flex flex-col gap-6 pb-8">

        {/* ── Image Carousel ─────────────────────────────────────────────── */}
        {dress.image_urls.length > 0 ? (
          <Carousel showDots className="-mx-5 px-5">
            {dress.image_urls.map((url, i) => (
              <div key={url} className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white/[0.04]">
                <Image
                  src={url}
                  alt={`${dress.name} — view ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 512px"
                  className="object-cover object-top"
                  priority={i === 0}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white/[0.04]">
            <Image
              src={primaryImage}
              alt={dress.name}
              fill
              sizes="512px"
              className="object-cover object-top"
              priority
            />
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold/70 mb-1">
              {dress.designer}
            </p>
            <h2 className="font-display text-xl font-medium text-ivory leading-tight">
              {dress.name}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Inventory badge */}
            <Badge
              variant={
                dress.inventory_status === "available"
                  ? "platinum"
                  : dress.inventory_status === "limited"
                  ? "gold"
                  : "onyx"
              }
              size="sm"
            >
              {dress.inventory_status === "available"
                ? "Available"
                : dress.inventory_status === "limited"
                ? "Limited Stock"
                : "Sold Out"}
            </Badge>

            {/* Price — commerce-gated */}
            {COMMERCE_ENABLED && dress.price != null && (
              <span className="text-lg font-semibold text-ivory">
                ${dress.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>

        {/* ── Description ────────────────────────────────────────────────── */}
        {dress.description && (
          <p className="text-sm text-platinum/60 leading-relaxed">{dress.description}</p>
        )}

        {/* ── Attributes ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4 text-xs text-platinum/50">
          {dress.attributes.silhouette && (
            <span>
              <span className="text-platinum/30 mr-1">Silhouette</span>
              {dress.attributes.silhouette}
            </span>
          )}
          {dress.attributes.length && (
            <span>
              <span className="text-platinum/30 mr-1">Length</span>
              {dress.attributes.length}
            </span>
          )}
          {dress.attributes.sizes && dress.attributes.sizes.length > 0 && (
            <span>
              <span className="text-platinum/30 mr-1">Sizes</span>
              {dress.attributes.sizes.join(", ")}
            </span>
          )}
        </div>

        {/* ── Available Boutiques ─────────────────────────────────────────── */}
        {dress.available_stores.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
              Available At
            </h3>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 divide-y divide-white/[0.06]">
              {dress.available_stores.map((store) => (
                <StoreRow
                  key={store}
                  store={store}
                  onCheck={() => onCheckAvailability?.(dress, store)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Action buttons ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Primary: Add to / Remove from Fitting Room */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleFittingRoom}
            aria-label={inRoom ? "Remove from fitting room" : "Add to fitting room"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={inRoom ? "in" : "out"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {inRoom ? "✓ In My Fitting Room" : "+ Add to Fitting Room"}
              </motion.span>
            </AnimatePresence>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {/* Wishlist — optimistic, auth-gated in production */}
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => toggleWishlist(dress.id)}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: wishlisted ? [1, 1.4, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {wishlisted ? "♥" : "♡"}
                </motion.span>
                {wishlisted ? "Saved" : "Wishlist"}
              </span>
            </Button>

            {/* VTO — foundational button, Phase 2 feature */}
            <Button
              variant="ghost"
              size="md"
              className="w-full border border-white/[0.08] text-platinum/60 hover:text-platinum"
              disabled={dress.inventory_status === "sold_out"}
              aria-label="Virtual try-on — coming soon"
              title="Virtual try-on coming in Phase 2"
            >
              <span className="flex items-center gap-1.5">
                {/* Sparkle icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                </svg>
                Try On
              </span>
            </Button>
          </div>
        </div>

      </div>
    </Drawer>
  );
}
