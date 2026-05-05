import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: "sm" | "default" | "lg"
  className?: string
}

/* ── PriceDisplay ────────────────────────────────────────────────────────
   brandtheme rules:
   - font-variant-numeric: tabular-nums — prevents layout shift on update
   - sale: strike-through original, primary-colored current price
   - size variants match type scale (sm=16, default=24, lg=32)
   - currency symbol always ₹ (India)
   - WCAG: strike-through has sr-only "was" label — not color alone
───────────────────────────────────────────────────────────────────────── */

const sizeMap = {
  sm:      "text-base",  /* 16px */
  default: "text-2xl",   /* 24px — text-price from brandtheme */
  lg:      "text-4xl",   /* 36px — product detail hero price */
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function PriceDisplay({
  price,
  originalPrice,
  currency = "₹",
  size = "default",
  className,
}: PriceDisplayProps) {
  const isOnSale = originalPrice !== undefined && originalPrice > price
  const discount = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <div
      className={cn("flex items-baseline gap-2 tabular-nums", className)}
      aria-label={
        isOnSale
          ? `Price: ${currency}${formatPrice(price)}, was ${currency}${formatPrice(originalPrice!)}, ${discount}% off`
          : `Price: ${currency}${formatPrice(price)}`
      }
    >
      {/* Current price */}
      <span
        className={cn(
          "font-body font-bold leading-none",
          sizeMap[size],
          isOnSale
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-primary)]"
        )}
        aria-hidden="true"
      >
        {currency}{formatPrice(price)}
      </span>

      {isOnSale && (
        <>
          {/* Original price — strike-through */}
          <span
            className={cn(
              "font-body font-medium leading-none",
              "line-through text-[var(--color-text-muted)]",
              size === "lg" ? "text-xl" : "text-sm"
            )}
            aria-hidden="true"
          >
            {currency}{formatPrice(originalPrice!)}
          </span>

          {/* Discount badge */}
          <span
            className={cn(
              "inline-flex items-center rounded-[4px]",
              "bg-[var(--color-error)] px-1.5 py-0.5",
              "font-body text-xs font-bold text-white leading-none"
            )}
            aria-hidden="true"
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  )
}

export { PriceDisplay }
