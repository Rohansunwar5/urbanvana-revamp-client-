'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2, PackageSearch } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/image'
import { WishlistBtn } from '@/components/product/wishlist-btn'
import { AddToCartBtn } from '@/components/product/add-to-cart-btn'
import { cn } from '@/lib/utils'

interface SearchProduct {
  _id: string
  name: string
  slug: string
  images: string[]
  badge: { label: string; variant: 'primary' | 'accent' } | null
  rating: number
  totalReviews: number
  minPrice: number
  originalMinPrice: number
  defaultVariantId?: string
}

interface SearchResult {
  products: SearchProduct[]
  pagination: { total: number; page: number; limit: number; pages: number }
}

function ResultCard({ p }: { p: SearchProduct }) {
  const hasDiscount = p.originalMinPrice > p.minPrice
  const discountPct = hasDiscount
    ? Math.round(((p.originalMinPrice - p.minPrice) / p.originalMinPrice) * 100)
    : 0

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-1">
      <Link href={`/shop/${p.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-subtle)]" tabIndex={-1}>
        {p.images[0] ? (
          <img
            src={getImageUrl(p.images[0])}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/30">
            <PackageSearch className="h-10 w-10" />
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[var(--color-error)] px-2 py-0.5 text-[10px] font-bold text-white">
            -{discountPct}%
          </span>
        )}
        <WishlistBtn
          productId={p._id}
          className="absolute right-2.5 top-2.5 h-8 w-8 bg-white/80 shadow-sm backdrop-blur-sm"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link
          href={`/shop/${p.slug}`}
          className="font-heading text-sm font-semibold leading-snug text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors"
        >
          {p.name}
        </Link>

        {p.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <span className="text-[var(--color-star)]">★</span>
            <span>{p.rating.toFixed(1)}</span>
            <span>({p.totalReviews})</span>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-heading text-base font-bold text-[var(--color-primary)]">
            ₹{p.minPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              ₹{p.originalMinPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <AddToCartBtn
          variantId={p.defaultVariantId ?? ''}
          disabled={!p.defaultVariantId}
        />
      </div>
    </article>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(initialQ)
  const [query, setQuery] = useState(initialQ)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounce input → update query + URL
  const handleInput = (value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQuery(value)
      setPage(1)
      const params = new URLSearchParams()
      if (value) params.set('q', value)
      router.replace(`/search?${params.toString()}`, { scroll: false })
    }, 350)
  }

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setResult(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `/api/catalog/search?q=${encodeURIComponent(query)}&page=${page}&limit=12`,
      )
      const json = await res.json()
      if (res.ok) setResult(json.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [query, page])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const products = result?.products ?? []
  const pagination = result?.pagination

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="relative mx-auto mb-10 max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-2xl border border-[var(--color-border-strong)] bg-white py-4 pl-12 pr-4 text-base shadow-[var(--shadow-sm)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/40 transition-shadow"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-[var(--color-text-muted)]" />
        )}
      </div>

      {/* Empty state — no query */}
      {!query && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Search className="h-12 w-12 text-[var(--color-text-muted)]/30" />
          <p className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
            Search for products
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Try "aeroponic tower", "nutrients", or "seeds"
          </p>
        </div>
      )}

      {/* No results */}
      {query && !loading && products.length === 0 && result && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <PackageSearch className="h-12 w-12 text-[var(--color-text-muted)]/30" />
          <p className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Try a different keyword or{' '}
            <Link href="/shop" className="text-[var(--color-primary)] hover:underline">
              browse the shop
            </Link>
            .
          </p>
        </div>
      )}

      {/* Results */}
      {products.length > 0 && (
        <>
          <p className="mb-5 text-sm text-[var(--color-text-muted)]">
            {pagination?.total ?? 0} result{(pagination?.total ?? 0) !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-[var(--color-text-primary)]">&ldquo;{query}&rdquo;</span>
          </p>

          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ResultCard key={p._id} p={p} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((n) => Math.max(1, n - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-text-muted)]">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage((n) => Math.min(pagination.pages, n + 1))}
                disabled={page >= pagination.pages}
                className="rounded-xl border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-text-muted)]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
