"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useShopStore } from "@/lib/stores/shopStore";
import type { Dress } from "@/lib/types/dress";

export interface DressCardProps {
  dress: Dress;
  /** Called when card body is clicked (opens DressDetailPanel) */
  onSelect?: (dress: Dress) => void;
  className?: string;
}

const COMMERCE_ENABLED = process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";

export function DressCard({ dress, onSelect, className }: DressCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem, removeItem, isInRoom } = useShopStore();
  const inRoom = isInRoom(dress.id);

  const primaryImage = dress.image_urls[0] ?? "/images/placeholder-dress.avif";
  const hoverImage = dress.image_urls[1] ?? primaryImage;

  function handleFittingRoom(e: React.MouseEvent) {
    e.stopPropagation();
    if (inRoom) {
      removeItem(dress.id);
    } else {
      addItem({
        id: dress.id,
        name: dress.name,
        designer: dress.designer,
        image_url: primaryImage,
      });
    }
  }

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden cursor-pointer",
        "border border-white/[0.06] bg-white/[0.02]",
        "transition-all duration-300",
        hovered && "glass-1 shadow-glass border-white/[0.10]",
        className
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect?.(dress)}
      data-cursor="pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(dress)}
      aria-label={`View ${dress.name} by ${dress.designer}`}
    >
      {/* Image container — fixed aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.04]">
        {/* Primary image */}
        <Image
          src={primaryImage}
          alt={`${dress.name} by ${dress.designer}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover object-top transition-all duration-500",
            hovered && dress.image_urls.length > 1 ? "opacity-0" : "opacity-100"
          )}
          // Next.js serves AVIF/WebP automatically when next.config optimizes images
          priority={false}
        />

        {/* Hover image (second photo) */}
        {dress.image_urls.length > 1 && (
          <Image
            src={hoverImage}
            alt={`${dress.name} — alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover object-top transition-all duration-500 absolute inset-0",
              hovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Inventory badge */}
        {dress.inventory_status !== "available" && (
          <div className="absolute top-3 left-3">
            <Badge
              variant={dress.inventory_status === "limited" ? "gold" : "onyx"}
              size="sm"
            >
              {dress.inventory_status === "limited" ? "Almost Gone" : "Sold Out"}
            </Badge>
          </div>
        )}

        {/* Add to Fitting Room CTA — slides up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 p-3"
            >
              <motion.button
                onClick={handleFittingRoom}
                className={cn(
                  "w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200",
                  inRoom
                    ? "bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30"
                    : "bg-gold text-onyx hover:bg-gold-light"
                )}
                whileTap={{ scale: 0.97 }}
                data-cursor="pointer"
                aria-label={inRoom ? "Remove from fitting room" : "Add to fitting room"}
              >
                {inRoom ? "✓ In Fitting Room" : "+ Add to Fitting Room"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-1.5">
        <p className="text-xs text-gold/70 font-medium tracking-wide uppercase truncate">
          {dress.designer}
        </p>
        <h3 className="text-sm font-medium text-ivory leading-snug line-clamp-2">
          {dress.name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          {/* Price — only shown when COMMERCE_ENABLED */}
          {COMMERCE_ENABLED && dress.price != null ? (
            <span className="text-sm text-platinum/70">
              ${dress.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </span>
          ) : (
            <span className="text-xs text-platinum/40">
              {dress.available_stores.length} boutique
              {dress.available_stores.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Color swatches — up to 4 */}
          {dress.attributes.colors && dress.attributes.colors.length > 0 && (
            <div className="flex gap-1" aria-label="Available colors">
              {dress.attributes.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="w-3 h-3 rounded-full border border-white/10 bg-platinum/30"
                  title={color}
                  aria-label={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
