import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number          /* 0–5, supports .5 increments */
  reviewCount?: number
  size?: "sm" | "default"
  showCount?: boolean
  reviewsHref?: string    /* anchor to reviews section on page */
  className?: string
}

/* ── RatingStars ─────────────────────────────────────────────────────────
   brandtheme rules:
   - color-star: #F59E0B (never use primary green for stars)
   - SVG only — no emoji stars
   - stroke width 1.5px consistent with Lucide system
   - aria-label on container carries full rating for screen readers
   - review count is a link to the reviews section when href provided
   - empty stars shown at reduced opacity (not hidden) — info density
───────────────────────────────────────────────────────────────────────── */

const STAR_SIZE = { sm: 14, default: 16 }

function StarIcon({
  fill,
  size,
}: {
  fill: "full" | "half" | "empty"
  size: number
}) {
  const id = `half-${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="var(--color-star, #F59E0B)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        strokeWidth="1.5"
        strokeLinejoin="round"
        stroke="var(--color-star, #F59E0B)"
        fill={
          fill === "full"
            ? "var(--color-star, #F59E0B)"
            : fill === "half"
            ? `url(#${id})`
            : "none"
        }
        opacity={fill === "empty" ? 0.3 : 1}
      />
    </svg>
  )
}

function RatingStars({
  rating,
  reviewCount,
  size = "default",
  showCount = true,
  reviewsHref,
  className,
}: RatingStarsProps) {
  const clampedRating = Math.min(5, Math.max(0, rating))
  const starSize = STAR_SIZE[size]

  const stars = Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1
    if (clampedRating >= pos) return "full" as const
    if (clampedRating >= pos - 0.5) return "half" as const
    return "empty" as const
  })

  const label = `Rated ${clampedRating.toFixed(1)} out of 5 stars${
    reviewCount !== undefined ? `, ${reviewCount.toLocaleString("en-IN")} reviews` : ""
  }`

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={label}
    >
      {/* Star row */}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((fill, i) => (
          <StarIcon key={i} fill={fill} size={starSize} />
        ))}
      </div>

      {/* Numeric rating */}
      <span
        className="font-body text-sm font-semibold text-[var(--color-text-primary)] tabular-nums"
        aria-hidden="true"
      >
        {clampedRating.toFixed(1)}
      </span>

      {/* Review count */}
      {showCount && reviewCount !== undefined && (
        reviewsHref ? (
          <a
            href={reviewsHref}
            className={cn(
              "font-body text-sm text-[var(--color-text-muted)]",
              "underline underline-offset-2 decoration-dotted",
              "hover:text-[var(--color-primary)] transition-colors duration-[150ms]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-primary)] focus-visible:rounded-[2px]"
            )}
            aria-label={`${reviewCount.toLocaleString("en-IN")} customer reviews`}
          >
            ({reviewCount.toLocaleString("en-IN")})
          </a>
        ) : (
          <span
            className="font-body text-sm text-[var(--color-text-muted)]"
            aria-hidden="true"
          >
            ({reviewCount.toLocaleString("en-IN")})
          </span>
        )
      )}
    </div>
  )
}

export { RatingStars }
