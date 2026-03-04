"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// Onyx (#050505) curtain wipe — 350ms total (175ms exit + 175ms enter)
const HALF = 0.175;
const ease = [0.76, 0, 0.24, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Onyx curtain: drops from top to cover (exit), then retracts to top to reveal (enter) */}
        <motion.div
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{ backgroundColor: "#050505" }}
          initial={{ y: "0%" }}
          animate={{ y: "-100%", transition: { duration: HALF, ease } }}
          exit={{ y: "0%", transition: { duration: HALF, ease } }}
        />

        {/* Page content: fades in after curtain clears */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: HALF, delay: HALF } }}
          exit={{ opacity: 0, transition: { duration: HALF * 0.6 } }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
