"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { cn } from "@/lib/utils";

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  /** Gap between slides in px */
  gap?: number;
  /** Show dot indicators */
  showDots?: boolean;
  /** Auto-advance interval in ms (0 = disabled) */
  autoplay?: number;
}

export function Carousel({
  children,
  className,
  gap = 16,
  showDots = true,
  autoplay = 0,
}: CarouselProps) {
  const count = React.Children.count(children);
  const [current, setCurrent] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Measure container width
  React.useEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Animate to slide
  const goTo = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(count - 1, index));
      setCurrent(clamped);
      animate(x, -(clamped * (width + gap)), {
        type: "spring",
        stiffness: 300,
        damping: 35,
      });
    },
    [count, width, gap, x]
  );

  // Autoplay
  React.useEffect(() => {
    if (!autoplay || count <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % count;
        animate(x, -(next * (width + gap)), {
          type: "spring",
          stiffness: 300,
          damping: 35,
        });
        return next;
      });
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, count, width, gap, x]);

  // Drag end — snap to nearest slide
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = width * 0.25;
    if (info.offset.x < -threshold) goTo(current + 1);
    else if (info.offset.x > threshold) goTo(current - 1);
    else goTo(current);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} ref={containerRef}>
      <motion.div
        drag="x"
        dragConstraints={{
          left: -((count - 1) * (width + gap)),
          right: 0,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex cursor-grab active:cursor-grabbing"
      >
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width, marginRight: i < count - 1 ? gap : 0 }}
          >
            {child}
          </div>
        ))}
      </motion.div>

      {/* Dot indicators */}
      {showDots && count > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-platinum/30 hover:bg-platinum/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
