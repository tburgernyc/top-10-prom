"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "@/components/ui";

interface FittingRoomWidgetProps {
  itemCount?: number;
}

export function FittingRoomWidget({ itemCount = 0 }: FittingRoomWidgetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button — bottom-right */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-full
                   bg-gold text-onyx font-semibold text-sm shadow-gold-glow
                   hover:bg-gold-light transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label={`Open fitting room${itemCount > 0 ? `, ${itemCount} item${itemCount > 1 ? "s" : ""}` : ""}`}
        data-cursor="pointer"
      >
        {/* Hanger icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.38 18H3.62a1 1 0 0 1-.7-1.71L12 8" />
          <path d="M12 8a2 2 0 1 0-2-2" />
          <path d="M12 8v1" />
        </svg>
        <span className="hidden sm:inline">Fitting Room</span>

        {/* Item count badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-1.5 -right-1.5 flex items-center justify-center
                         w-5 h-5 rounded-full bg-onyx text-gold text-[10px] font-bold
                         border border-gold/40"
              aria-hidden="true"
            >
              {itemCount > 9 ? "9+" : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Fitting Room Drawer */}
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="My Fitting Room"
      >
        <div className="flex flex-col items-center justify-center h-40 gap-3 text-platinum/60">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M20.38 18H3.62a1 1 0 0 1-.7-1.71L12 8" />
            <path d="M12 8a2 2 0 1 0-2-2" />
            <path d="M12 8v1" />
          </svg>
          <p className="text-sm">Your fitting room is empty.</p>
          <p className="text-xs text-platinum/40">Save dresses to try them on.</p>
        </div>
      </Drawer>
    </>
  );
}
