import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/product/rating-stars"
import { PriceDisplay } from "@/components/product/price-display"
import { StockBadge } from "@/components/product/stock-badge"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"

export interface ProductCardProps {
  id: string
  slug: string
  name: string
  category: string
  image: string
  imageAlt: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  stock: number
  badge?: "new" | "bestseller" | "sale" | "organic" | "low-stock" | "sold-out"
  className?: string
}

/* ── ProductCard ─────────────────────────────────────────────────────────
   brandtheme rules:
   - image aspect-ratio 4/3 — never distort, always object-cover
   - card: 12px radius, ink shadow, -translate-y-1 hover lift
   - one primary CTA per card (Add to Cart)
   - badge overlaid top-left on image
   - category label: Raleway uppercase xs muted
   - name: Lora font, 2-line clamp
   - sold-out: AddToCartBtn disabled, image grayscale
───────────────────────────────────────────────────────────────────────── */

function ProductCard({
  id,
  slug,
  name,
  category,
  image,
  imageAlt,
  price,
  originalPrice,
  rating,
  reviewCount,
  stock,
  badge,
  className,
}: ProductCardProps) {
  const isSoldOut = stock <= 0

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-[12px] bg-white",
        "shadow-[var(--shadow-sm)]",
        "hover:shadow-[var(--shadow-md)]",
        "transition-all duration-[200ms]",
        "hover:-translate-y-1",
        className
      )}
    >
      {/* ── Product image ── */}
      <Link
        href={`/shop/${slug}`}
        aria-label={`View ${name}`}
        tabIndex={-1}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-subtle)]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-[300ms]",
              "group-hover:scale-[1.03]",
              isSoldOut && "grayscale opacity-70"
            )}
          />

          {/* Badge overlay */}
          {badge && (
            <div className="absolute left-3 top-3 z-10">
              <Badge variant={badge} shape="tag" />
            </div>
          )}
        </div>
      </Link>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">

        {/* Category label */}
        <p className="font-body text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {category}
        </p>

        {/* Product name */}
        <Link
          href={`/shop/${slug}`}
          className={cn(
            "font-heading text-base font-semibold leading-snug",
            "text-[var(--color-text-primary)]",
            "line-clamp-2",
            "hover:text-[var(--color-primary)] transition-colors duration-[150ms]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--color-primary)] focus-visible:rounded-[4px]"
          )}
        >
          {name}
        </Link>

        {/* Rating */}
        <RatingStars
          rating={rating}
          reviewCount={reviewCount}
          size="sm"
          reviewsHref={`/shop/${slug}#reviews`}
        />

        {/* Spacer pushes price + CTA to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          size="default"
        />

        {/* Stock status */}
        <StockBadge stock={stock} />

        {/* Add to cart */}
        <AddToCartBtn
          productId={id}
          disabled={isSoldOut}
        />
      </div>
    </article>
  )
}

export { ProductCard }
