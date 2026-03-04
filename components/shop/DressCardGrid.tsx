"use client";

import { cn } from "@/lib/utils";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { Skeleton } from "@/components/ui/Skeleton";
import { DressCard } from "./DressCard";
import type { Dress } from "@/lib/types/dress";

export interface DressCardGridProps {
  dresses: Dress[];
  loading?: boolean;
  skeletonCount?: number;
  onSelectDress?: (dress: Dress) => void;
  className?: string;
}

/** Skeleton placeholder — matches DressCard aspect ratio */
function DressCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-white/[0.06]">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4 mt-1" />
      </div>
    </div>
  );
}

export function DressCardGrid({
  dresses,
  loading = false,
  skeletonCount = 6,
  onSelectDress,
  className,
}: DressCardGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
          className
        )}
        aria-busy="true"
        aria-label="Loading dresses"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <DressCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && dresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="text-platinum/50 text-sm">No dresses match your current filters.</p>
        <p className="text-platinum/30 text-xs">Try adjusting your selections above.</p>
      </div>
    );
  }

  return (
    <StaggerChildren
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
        className
      )}
      aria-label="Dress catalog"
    >
      {dresses.map((dress) => (
        <StaggerItem key={dress.id}>
          <DressCard dress={dress} onSelect={onSelectDress} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
