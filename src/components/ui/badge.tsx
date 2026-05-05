import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base — xs uppercase label, pill or tag shape
  [
    "inline-flex items-center gap-1",
    "px-2 py-0.5 rounded-[4px]",
    "font-body text-xs font-semibold uppercase tracking-wide whitespace-nowrap",
    "transition-colors duration-[150ms]",
    "[&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // ── Product status badges ──
        new: [
          "bg-[var(--color-primary)] text-white",
        ],
        bestseller: [
          "bg-[var(--color-ink)] text-white",
        ],
        "low-stock": [
          "bg-[var(--color-warning)] text-white",
        ],
        "sold-out": [
          "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
          "border border-[var(--color-border)]",
        ],
        sale: [
          "bg-[var(--color-error)] text-white",
        ],
        organic: [
          "bg-[var(--color-primary-light)] text-[var(--color-ink)]",
          "border border-[var(--color-primary)]",
        ],
        // ── UI utility badges ──
        default: [
          "bg-[var(--color-primary)] text-white",
        ],
        secondary: [
          "bg-[var(--color-primary-light)] text-[var(--color-ink)]",
        ],
        outline: [
          "bg-transparent text-[var(--color-ink)]",
          "border border-[var(--color-border)]",
        ],
        destructive: [
          "bg-[var(--color-error)] text-white",
        ],
      },
      shape: {
        tag:  "rounded-[4px]",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "tag",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
