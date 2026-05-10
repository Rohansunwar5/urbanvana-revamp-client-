"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"
import { ProductCardSkeleton } from "@/components/ui/skeleton"

interface ProductGridProps {
  products?: ProductCardProps[]
  loading?: boolean
  skeletonCount?: number
  title?: string
  className?: string
}

/* ── ProductGrid ─────────────────────────────────────────────────────────
   brandtheme rules:
   - 1 col mobile → 2 col sm → 3 col lg
   - Intersection Observer triggers reveal-up stagger (40ms per item)
   - reduced-motion: prefers-reduced-motion skips animation entirely
   - loading: shows ProductCardSkeleton shimmer placeholders
   - empty: helpful empty state (no silent blank grid)
───────────────────────────────────────────────────────────────────────── */

const STAGGER_MS = 40

function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 6,
  title,
  className,
}: ProductGridProps) {
  const gridRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (loading) return

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const items = gridRef.current?.querySelectorAll<HTMLElement>(".reveal-item")
    if (!items?.length) return

    if (prefersReduced) {
      items.forEach((el) => {
        el.classList.add("is-visible")
        el.style.animationDuration = "0ms"
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const idx = Number(el.dataset.index ?? 0)
            el.style.animationDelay = `${idx * STAGGER_MS}ms`
            el.classList.add("is-visible")
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading, products])

  return (
    <section aria-label={title ?? "Products"} className={cn("w-full", className)}>
      {title && (
        <h2 className="mb-8 font-heading text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
          {title}
        </h2>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div
          role="status"
          aria-label="Loading products"
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
        >
          {Array.from({ length: skeletonCount }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
          <span className="sr-only">Loading products…</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="font-heading text-lg font-semibold text-[var(--color-text-primary)]">
            No products found
          </p>
          <p className="font-body text-sm text-[var(--color-text-muted)]">
            Try adjusting your filters or check back soon.
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="reveal-item"
              data-index={i}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export { ProductGrid }
