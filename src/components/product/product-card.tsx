import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/product/rating-stars"
import { PriceDisplay } from "@/components/product/price-display"
import { StockBadge } from "@/components/product/stock-badge"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import { WishlistBtn } from "@/components/product/wishlist-btn"

export interface ProductCardProps {
  id: string
  slug: string
  defaultVariantId?: string
  defaultVariantLabels?: string[]
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
  defaultVariantId,
  defaultVariantLabels,
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
      {/* Full-card clickable overlay — behind all interactive elements */}
      <Link
        href={`/shop/${slug}`}
        aria-label={`View ${name}`}
        tabIndex={-1}
        className="absolute inset-0 z-0 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
      />

      {/* ── Product image — pointer-events-none so clicks fall through to overlay link ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-subtle)] pointer-events-none">
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

        {/* Wishlist button — pointer-events-auto so it still works */}
        <WishlistBtn
          productId={id}
          className="absolute right-2.5 top-2.5 z-10 h-8 w-8 bg-white/80 shadow-sm backdrop-blur-sm pointer-events-auto"
          iconClassName="h-4 w-4"
        />
      </div>

      {/* ── Card body — pointer-events-none so clicks fall through to the overlay link ── */}
      <div className="relative z-10 flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4 pointer-events-none">

        {/* Category label */}
        <p className="font-body text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {category}
        </p>

        {/* Product name */}
        <span
          className={cn(
            "font-heading text-sm sm:text-base font-semibold leading-snug",
            "text-[var(--color-text-primary)]",
            "line-clamp-2",
            "group-hover:text-[var(--color-primary)] transition-colors duration-[150ms]",
          )}
        >
          {name}
        </span>

        {/* Variant labels */}
        {defaultVariantLabels && defaultVariantLabels.length > 0 && (
          <p className="font-body text-[9px] sm:text-[10px] text-[var(--color-text-muted)] truncate">
            {defaultVariantLabels.join(" · ")}
          </p>
        )}

        {/* Rating — re-enable pointer events so the reviews link works */}
        <div className="pointer-events-auto">
          <RatingStars
            rating={rating}
            reviewCount={reviewCount}
            size="sm"
            reviewsHref={`/shop/${slug}#reviews`}
          />
        </div>

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

        {/* Add to cart — re-enable pointer events */}
        <div className="pointer-events-auto">
          <AddToCartBtn
            variantId={defaultVariantId ?? ""}
            disabled={isSoldOut || !defaultVariantId}
          />
        </div>
      </div>
    </article>
  )
}

export { ProductCard }
