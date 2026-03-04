import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "platinum" | "onyx";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "gold",
  size = "md",
  ...props
}: BadgeProps) {
  const variants = {
    gold: "bg-gold/15 text-gold border border-gold/30",
    platinum: "bg-platinum/10 text-platinum border border-platinum/20",
    onyx: "bg-onyx/80 text-ivory border border-white/10",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-3 py-1 text-xs tracking-widest",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
