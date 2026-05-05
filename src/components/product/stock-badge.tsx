import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockBadgeProps {
  stock: number
  lowStockThreshold?: number
  className?: string
}

/* ── StockBadge ──────────────────────────────────────────────────────────
   brandtheme rules:
   - never convey urgency through color alone — always pair icon + text
   - in-stock (>threshold): subtle, doesn't steal attention from CTA
   - low-stock: warning orange + AlertTriangle icon
   - sold-out: muted + XCircle icon
   - icon strokeWidth 1.5 consistent with Lucide system
───────────────────────────────────────────────────────────────────────── */

function StockBadge({
  stock,
  lowStockThreshold = 10,
  className,
}: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span
        role="status"
        aria-label="Out of stock"
        className={cn(
          "inline-flex items-center gap-1.5",
          "font-body text-xs font-medium",
          "text-[var(--color-text-muted)]",
          className
        )}
      >
        <XCircle
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0"
        />
        Out of stock
      </span>
    )
  }

  if (stock <= lowStockThreshold) {
    return (
      <span
        role="status"
        aria-label={`Only ${stock} left in stock — order soon`}
        className={cn(
          "inline-flex items-center gap-1.5",
          "font-body text-xs font-semibold",
          "text-[var(--color-warning)]",
          className
        )}
      >
        <AlertTriangle
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0"
        />
        Only {stock} left
      </span>
    )
  }

  return (
    <span
      role="status"
      aria-label="In stock"
      className={cn(
        "inline-flex items-center gap-1.5",
        "font-body text-xs font-medium",
        "text-[var(--color-primary)]",
        className
      )}
    >
      <CheckCircle
        size={13}
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0"
      />
      In stock
    </span>
  )
}

export { StockBadge }
