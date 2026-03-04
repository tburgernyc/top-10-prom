"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useShopStore } from "@/lib/stores/shopStore";
import { cn } from "@/lib/utils";
import type { DressStub } from "@/lib/types/dress";

export interface FittingRoomSessionProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when "Book Consultation" is clicked */
  onBookConsultation?: () => void;
}

/* ── Single item row ──────────────────────────────────────────────────────── */
interface SessionItemProps {
  item: DressStub;
  onRemove: (id: string) => void;
}

function SessionItem({ item, onRemove }: SessionItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0"
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-[4.75rem] rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
        <Image
          src={item.image_url}
          alt={`${item.name} by ${item.designer}`}
          fill
          sizes="56px"
          className="object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium tracking-wide uppercase text-gold/60 truncate">
          {item.designer}
        </p>
        <p className="text-sm font-medium text-ivory leading-snug line-clamp-2">
          {item.name}
        </p>
      </div>

      {/* Remove button */}
      <motion.button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                   text-platinum/30 hover:text-red-400 hover:bg-red-400/10
                   transition-all duration-200"
        whileTap={{ scale: 0.9 }}
        data-cursor="pointer"
        aria-label={`Remove ${item.name} from fitting room`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className="text-platinum/20"
        aria-hidden="true"
      >
        <path d="M20.38 18H3.62a1 1 0 0 1-.7-1.71L12 8" />
        <path d="M12 8a2 2 0 1 0-2-2" />
        <path d="M12 8v1" />
      </svg>
      <p className="text-sm text-platinum/40">Your fitting room is empty.</p>
      <p className="text-xs text-platinum/25 max-w-[200px] leading-relaxed">
        Browse the catalog and add dresses to try them on.
      </p>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function FittingRoomSession({
  isOpen,
  onClose,
  onBookConsultation,
}: FittingRoomSessionProps) {
  const { items, removeItem, clearRoom } = useShopStore();
  const count = items.length;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="My Fitting Room"
      side="right"
    >
      <div className="flex flex-col h-full">

        {/* ── Header meta ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <p className="text-xs text-platinum/40">
            {count === 0
              ? "No items saved"
              : `${count} item${count !== 1 ? "s" : ""} saved`}
          </p>
          <AnimatePresence>
            {count > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={clearRoom}
                className="text-xs text-platinum/30 hover:text-red-400 transition-colors underline underline-offset-2"
                data-cursor="pointer"
                aria-label="Clear all items from fitting room"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Item list ────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex-1 overflow-y-auto min-h-0",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          )}
          role="list"
          aria-label="Fitting room items"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {count === 0 ? (
              <EmptyState key="empty" />
            ) : (
              items.map((item) => (
                <SessionItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer CTA ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 mt-4 border-t border-white/[0.06] flex flex-col gap-3"
            >
              <p className="text-xs text-platinum/40 text-center leading-relaxed">
                Ready to visit a boutique? Book a private consultation with your selections.
              </p>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  onBookConsultation?.();
                  onClose();
                }}
                aria-label={`Book consultation with ${count} item${count !== 1 ? "s" : ""}`}
              >
                Book Consultation
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-platinum/40 hover:text-platinum/70"
                onClick={onClose}
              >
                Continue Browsing
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Drawer>
  );
}
