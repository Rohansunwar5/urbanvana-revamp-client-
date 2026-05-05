"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, ChevronDown, Star, ShoppingCart } from "lucide-react"
import { Container } from "@/components/layout/container"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import {
  PRODUCTS,
  CATEGORIES,
  SORT_OPTIONS,
  filterAndSort,
  type Category,
  type SortOption,
  type Product,
} from "@/lib/products"

/* ── helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-[var(--color-ink)] text-white",
  New:        "bg-[var(--color-primary)] text-white",
  "Low Stock":"bg-[var(--color-warning)] text-white",
  Sale:       "bg-[var(--color-error)] text-white",
}

/* ── ProductCard ─────────────────────────────────────────────────────── */

function PLPCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <article className="group flex flex-col bg-white">
      {/* Image zone */}
      <div className="relative" style={{ backgroundColor: "#ffffff", height: "260px" }}>
        {/* Supply badge — top left */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full border border-black/15 bg-white/80 px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-sm">
            {product.supplyLabel}
          </span>
        </div>

        {/* Badge — top right */}
        {product.badge && (
          <div className="absolute right-4 top-4 z-10">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-widest ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Category label — lower right, always visible */}
        <div className="absolute right-4 top-[52px] z-10 text-right">
          <p className="font-heading text-[10px] font-bold uppercase leading-snug tracking-widest text-[var(--color-ink)]/40">
            {product.categoryLine1}<br />{product.categoryLine2}
          </p>
        </div>

        {/* Product image */}
        <div className="absolute inset-0 flex items-center justify-center px-10 pb-6 pt-14">
          <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Info zone */}
      <div className="flex flex-1 flex-col gap-3 border-t border-[var(--color-border-strong)] bg-white p-5">
        {/* Name + stars */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] leading-snug">
            {product.name}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <Star size={10} strokeWidth={0} className="fill-[var(--color-star)]" aria-hidden="true" />
            <span className="font-body text-[11px] font-medium tabular-nums text-[var(--color-text-muted)]">
              {product.rating}
            </span>
          </div>
        </div>

        <p className="font-body text-sm leading-relaxed text-[var(--color-text-muted)] line-clamp-2">
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2 tabular-nums">
          {product.originalPrice && (
            <span className="font-body text-sm text-[var(--color-text-muted)] line-through">
              ₹{formatINR(product.originalPrice)}
            </span>
          )}
          <span className="font-heading text-xl font-bold text-[var(--color-primary)]">
            ₹{formatINR(product.price)}
          </span>
          {discount > 0 && (
            <span className="font-body text-xs font-semibold text-[var(--color-error)]">
              -{discount}%
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <AddToCartBtn
            productId={product.id}
            className="rounded-lg bg-[var(--color-ink)] font-heading text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-ink)]"
          />
          <Link
            href={`/shop/${product.slug}`}
            className="text-center font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Filter bar ──────────────────────────────────────────────────────── */

function FilterBar({
  active,
  onCategory,
  sort,
  onSort,
  count,
}: {
  active: Category | "All"
  onCategory: (c: Category | "All") => void
  sort: SortOption
  onSort: (s: SortOption) => void
  count: number
}) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort"

  return (
    <div className="sticky top-[64px] z-[40] border-b border-[var(--color-border-strong)] bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Category pills */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
            role="tablist"
            aria-label="Filter by category"
          >
            {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => onCategory(cat)}
                className={[
                  "shrink-0 rounded-full px-4 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest transition-colors duration-150",
                  active === cat
                    ? "bg-[var(--color-ink)] text-white"
                    : "border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: count + sort */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-body text-xs text-[var(--color-text-muted)] sm:block">
              {count} product{count !== 1 ? "s" : ""}
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-ink)]"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <SlidersHorizontal size={11} strokeWidth={1.5} aria-hidden="true" />
                {sortLabel}
                <ChevronDown
                  size={11}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={`transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sortOpen && (
                <div
                  className="absolute right-0 top-full z-[50] mt-1 w-40 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-white shadow-[var(--shadow-lg)]"
                  role="listbox"
                  aria-label="Sort options"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={sort === opt.value}
                      onClick={() => {
                        onSort(opt.value)
                        setSortOpen(false)
                      }}
                      className={[
                        "w-full px-4 py-2.5 text-left font-heading text-[10px] font-bold uppercase tracking-widest transition-colors duration-100",
                        sort === opt.value
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function ShopPage() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get("category") ?? "All") as Category | "All"
  const [activeCategory, setActiveCategory] = useState<Category | "All">(initialCategory)
  const [sort, setSort] = useState<SortOption>("featured")

  useEffect(() => {
    const cat = (searchParams.get("category") ?? "All") as Category | "All"
    setActiveCategory(cat)
  }, [searchParams])

  const products = useMemo(
    () => filterAndSort(PRODUCTS, activeCategory, sort),
    [activeCategory, sort],
  )

  return (
    <>
      {/* Page header */}
      <section className="border-b border-[var(--color-border-strong)] bg-white pt-16 pb-10 md:pt-20 md:pb-12">
        <Container>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Our Products
          </p>
          <div className="flex items-end justify-between gap-6">
            <h1
              className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Shop<br className="hidden sm:block" /> Everything.
            </h1>
            <p className="hidden max-w-[320px] font-body text-sm leading-relaxed text-[var(--color-text-muted)] md:block">
              Aeroponic towers, bundles, nutrients, and accessories — all you need to grow fresh food at home.
            </p>
          </div>
        </Container>
      </section>

      {/* Sticky filter bar */}
      <FilterBar
        active={activeCategory}
        onCategory={setActiveCategory}
        sort={sort}
        onSort={setSort}
        count={products.length}
      />

      {/* Product grid */}
      <section aria-label={`${activeCategory} products`} className="bg-white py-8 md:py-12">
        <Container>
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <ShoppingCart size={40} strokeWidth={1.5} className="text-[var(--color-text-muted)]/40" />
              <p className="font-heading text-base font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                No products found
              </p>
            </div>
          ) : (
            /* gap-px grid trick: parent bg shows through the 1px gaps — acts as borders */
            <div
              className="overflow-hidden border border-[var(--color-border-strong)]"
              style={{ backgroundColor: "var(--color-border-strong)" }}
            >
              <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <PLPCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
