import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Skeleton — uses brand shimmer from globals.css .skeleton class ── */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  )
}

/* ── ProductCardSkeleton — matches ProductCard layout exactly ── */
function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white"
      aria-label="Loading product"
      role="status"
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 md:p-6">
        {/* Category label */}
        <Skeleton className="h-4 w-20" />
        {/* Product name */}
        <Skeleton className="h-6 w-3/4" />
        {/* Stars */}
        <Skeleton className="h-4 w-28" />
        {/* Price */}
        <Skeleton className="h-7 w-24" />
        {/* Button */}
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export { Skeleton, ProductCardSkeleton }
