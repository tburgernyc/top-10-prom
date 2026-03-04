"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Override side — defaults to responsive (bottom mobile / right desktop) */
  side?: "bottom" | "right";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  className,
  side,
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ESC to close
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Body scroll lock
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawer = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-onyx/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom sheet — mobile (hidden md+) or forced */}
          {side !== "right" && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className={cn(
                "absolute bottom-0 left-0 right-0 z-10",
                "glass-4 border-t border-gold/15",
                "rounded-t-2xl max-h-[85dvh] overflow-y-auto",
                side === "bottom" ? "block" : "block md:hidden",
                className
              )}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <DrawerContent title={title} onClose={onClose}>
                {children}
              </DrawerContent>
            </motion.div>
          )}

          {/* Right panel — desktop (hidden <md) or forced */}
          {side !== "bottom" && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className={cn(
                "absolute right-0 top-0 bottom-0 z-10 w-full max-w-sm",
                "glass-4 border-l border-gold/15",
                "overflow-y-auto",
                side === "right" ? "block" : "hidden md:block",
                className
              )}
            >
              <DrawerContent title={title} onClose={onClose}>
                {children}
              </DrawerContent>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(drawer, document.body);
}

function DrawerContent({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-base font-bold tracking-wide text-ivory">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-platinum/50 hover:text-gold transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </>
  );
}
