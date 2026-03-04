"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AriaChatPanel } from "./AriaChatPanel";
import { cn } from "@/lib/utils";

export function AriaChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating trigger — bottom-left, above mobile nav clearance */}
      <div className="fixed bottom-6 left-6 z-[200]">
        {/* Gold pulse ring — CSS keyframe from globals.css, paused when open */}
        <div
          className={cn(
            "rounded-full",
            !open && "animate-gold-pulse"
          )}
        >
          <motion.button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center",
              "border transition-all duration-300",
              open
                ? "bg-gold/20 border-gold/60 text-gold"
                : "bg-onyx border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60"
            )}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label={open ? "Close Aria style concierge" : "Open Aria style concierge"}
            aria-expanded={open}
            aria-haspopup="dialog"
            data-cursor="pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                /* Close × */
                <motion.svg
                  key="close"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </motion.svg>
              ) : (
                /* Sparkle / Aria icon */
                <motion.svg
                  key="sparkle"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* "Style AI" label tooltip — fades in on initial mount, gone after first open */}
        <AnimatePresence>
          {!open && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5
                         whitespace-nowrap text-[10px] font-medium text-gold/60
                         bg-onyx/80 border border-gold/20 rounded-full px-2.5 py-1
                         pointer-events-none"
              aria-hidden="true"
            >
              Style AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel rendered via portal */}
      <AriaChatPanel isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
