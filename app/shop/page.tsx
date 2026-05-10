"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SlidersHorizontal, ChevronDown, Star, ShoppingCart } from "lucide-react"
import { Container } from "@/components/layout/container"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import { getImageUrl } from "@/lib/utils/image"
import type { CatalogProduct, ApiCategory, PaginatedProducts } from "@/lib/types/catalog"

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

const BADGE_STYLES: Record<string, string> = {
  primary: "bg-[var(--color-ink)] text-white",
  accent:  "bg-[var(--color-primary)] text-white",
}

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "newest",     label: "Newest" },
  { value: "rating",     label: "Top Rated" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
]

/* ── Product Card ────────────────────────────────────────────────────── */

function PLPCard({ product }: { product: CatalogProduct }) {
  const discount =
    product.originalMinPrice && product.originalMinPrice > product.minPrice
      ? Math.round(((product.originalMinPrice - product.minPrice) / product.originalMinPrice) * 100)
      : 0

  return (
    <article className="group relative flex flex-col bg-white">
      {/* Full-card overlay link */}
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        tabIndex={-1}
        className="absolute inset-0 z-0"
      />

      {/* Image zone — pointer-events-none so clicks fall through to overlay link */}
      <div className="relative aspect-square sm:aspect-[5/4] overflow-hidden bg-white pointer-events-none">
        {/* Badge */}
        {product.badge && (
          <div className="absolute right-2 top-2 z-10 sm:right-4 sm:top-4">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-heading text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${BADGE_STYLES[product.badge.variant] ?? BADGE_STYLES.primary}`}>
              {product.badge.label}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:px-10 sm:pb-6 sm:pt-10">
          <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <Image
              src={getImageUrl(product.images[0])}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Info zone — pointer-events-none so clicks fall through to the overlay link */}
      <div className="relative z-10 flex flex-1 flex-col gap-2 border-t border-[var(--color-border-strong)] bg-white p-3 sm:gap-3 sm:p-5 pointer-events-none">
        {/* Name + stars */}
        <div className="flex items-start justify-between gap-1">
          <p className="font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] leading-snug line-clamp-2">
            {product.name}
          </p>
          {product.rating > 0 && (
            <div className="flex shrink-0 items-center gap-0.5">
              <Star size={9} strokeWidth={0} className="fill-[var(--color-star)]" aria-hidden="true" />
              <span className="font-body text-[10px] font-medium tabular-nums text-[var(--color-text-muted)]">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Variant labels */}
        {product.defaultVariantLabels && product.defaultVariantLabels.length > 0 && (
          <p className="font-body text-[9px] sm:text-[10px] text-[var(--color-text-muted)] truncate">
            {product.defaultVariantLabels.join(" · ")}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-1 sm:gap-2 tabular-nums">
          {discount > 0 && (
            <span className="font-body text-xs text-[var(--color-text-muted)] line-through">
              ₹{formatINR(product.originalMinPrice)}
            </span>
          )}
          <span className="font-heading text-base sm:text-xl font-bold text-[var(--color-primary)]">
            ₹{formatINR(product.minPrice)}
          </span>
          {discount > 0 && (
            <span className="font-body text-[10px] font-semibold text-[var(--color-error)]">
              -{discount}%
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto pt-0.5 pointer-events-auto">
          <AddToCartBtn
            variantId={product.defaultVariantId ?? ""}
            disabled={!product.defaultVariantId}
            className="min-h-[40px] sm:min-h-[48px] rounded-full bg-[var(--color-ink)] font-heading text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-ink)]"
          />
        </div>
      </div>
    </article>
  )
}

/* ── Skeleton card ───────────────────────────────────────────────────── */

function PLPCardSkeleton() {
  return (
    <div className="flex flex-col bg-white">
      <div className="aspect-square sm:aspect-[5/4] animate-pulse bg-[var(--color-border-strong)]" />
      <div className="flex flex-col gap-2 border-t border-[var(--color-border-strong)] p-3 sm:gap-3 sm:p-5">
        <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--color-border-strong)]" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-[var(--color-border-strong)]" />
        <div className="h-10 sm:h-12 w-full animate-pulse rounded-full bg-[var(--color-border-strong)]" />
      </div>
    </div>
  )
}

/* ── Filter bar ──────────────────────────────────────────────────────── */

function FilterBar({
  categories,
  activeSlug,
  onCategory,
  sort,
  onSort,
  count,
}: {
  categories: ApiCategory[]
  activeSlug: string
  onCategory: (slug: string) => void
  sort: string
  onSort: (s: string) => void
  count: number
}) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort"

  return (
    <div className="sticky top-[68px] md:top-[72px] z-[30] border-b border-[var(--color-border-strong)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Category pills */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
            role="tablist"
            aria-label="Filter by category"
          >
            <button
              role="tab"
              aria-selected={activeSlug === ""}
              onClick={() => onCategory("")}
              className={[
                "shrink-0 rounded-full px-4 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest transition-colors duration-150",
                activeSlug === ""
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                role="tab"
                aria-selected={activeSlug === cat.slug}
                onClick={() => onCategory(cat.slug)}
                className={[
                  "shrink-0 rounded-full px-4 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest transition-colors duration-150",
                  activeSlug === cat.slug
                    ? "bg-[var(--color-ink)] text-white"
                    : "border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right: count + sort */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-body text-xs text-[var(--color-text-muted)] sm:block">
              {count} product{count !== 1 ? "s" : ""}
            </span>

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
                  className="absolute right-0 top-full z-[50] mt-1 w-44 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-white shadow-[var(--shadow-lg)]"
                  role="listbox"
                  aria-label="Sort options"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={sort === opt.value}
                      onClick={() => { onSort(opt.value); setSortOpen(false) }}
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

/* ── Page inner ──────────────────────────────────────────────────────── */

function ShopPageInner() {
  const searchParams   = useSearchParams()
  const router         = useRouter()
  const [categories, setCategories]   = useState<ApiCategory[]>([])
  const [products, setProducts]       = useState<CatalogProduct[]>([])
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [pages, setPages]             = useState(1)
  const [loading, setLoading]         = useState(true)
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category") ?? "")
  const [sort, setSort]               = useState(searchParams.get("sort") ?? "featured")

  /* Fetch categories once */
  useEffect(() => {
    fetch("/api/catalog/categories")
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(() => {})
  }, [])

  /* Fetch products on filter/sort/page change */
  const fetchProducts = useCallback(async (cat: string, s: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort: s, page: String(p), limit: "12" })
      if (cat) params.set("category", cat)
      const res = await fetch(`/api/catalog/products?${params}`)
      const json = await res.json()
      const data = json.data as PaginatedProducts
      setProducts(data?.products ?? [])
      setTotal(data?.pagination?.total ?? 0)
      setPages(data?.pagination?.pages ?? 1)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    fetchProducts(categorySlug, sort, 1)
  }, [categorySlug, sort, fetchProducts])

  useEffect(() => {
    if (page === 1) return
    fetchProducts(categorySlug, sort, page)
  }, [page, categorySlug, sort, fetchProducts])

  /* Sync URL params */
  const handleCategory = (slug: string) => {
    setCategorySlug(slug)
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set("category", slug)
    else params.delete("category")
    router.replace(`/shop?${params}`, { scroll: false })
  }

  const handleSort = (s: string) => {
    setSort(s)
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", s)
    router.replace(`/shop?${params}`, { scroll: false })
  }

  return (
    <>
      {/* Page header */}
      <section className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg)] pt-16 pb-10 md:pt-20 md:pb-12">
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
        categories={categories}
        activeSlug={categorySlug}
        onCategory={handleCategory}
        sort={sort}
        onSort={handleSort}
        count={total}
      />

      {/* Product grid */}
      <section aria-label="Products" className="bg-[var(--color-bg)] py-8 md:py-12">
        <Container>
          {loading ? (
            <div
              className="overflow-hidden border border-[var(--color-border-strong)]"
              style={{ backgroundColor: "var(--color-border-strong)" }}
            >
              <div className="grid grid-cols-2 gap-px lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <PLPCardSkeleton key={i} />)}
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <ShoppingCart size={40} strokeWidth={1.5} className="text-[var(--color-text-muted)]/40" />
              <p className="font-heading text-base font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                No products found
              </p>
            </div>
          ) : (
            <div
              className="overflow-hidden border border-[var(--color-border-strong)]"
              style={{ backgroundColor: "var(--color-border-strong)" }}
            >
              <div className="grid grid-cols-2 gap-px lg:grid-cols-3">
                {products.map((product) => (
                  <PLPCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-body text-sm text-[var(--color-text-muted)]">
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function ShopPage() {
  return (
    <Suspense>
      <ShopPageInner />
    </Suspense>
  )
}
