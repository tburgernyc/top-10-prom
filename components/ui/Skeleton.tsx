import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Explicit width/height via Tailwind class or style */
  rounded?: boolean;
}

export function Skeleton({ className, rounded = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-onyx-50",
        rounded ? "rounded-full" : "rounded-none",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}
