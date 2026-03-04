"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";

export interface FadeInProps {
  children: React.ReactNode;
  /** Extra vertical offset to animate from (default 16px) */
  y?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  y = 16,
  delay = 0,
  duration = 0.5,
  className,
}: FadeInProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-64px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
