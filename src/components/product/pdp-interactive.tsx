"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Minus, Plus, Truck, RefreshCw, ShieldCheck, Star } from "lucide-react"
import { toast } from "sonner"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import { WishlistBtn } from "@/components/product/wishlist-btn"
import { getImageUrl } from "@/lib/utils/image"
import { useAuth } from "@/lib/auth-context"
import type { ProductVariant, Review } from "@/lib/types/catalog"

/* ── Image gallery ───────────────────────────────────────────────────── */

export function PDPImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-[16px] border border-[var(--color-border-strong)]"
        style={{ backgroundColor: "#ffffff", aspectRatio: "1 / 1" }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative h-full w-full">
            <Image
              src={getImageUrl(images[active])}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-contain transition-opacity duration-200"
              style={{ mixBlendMode: "multiply" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={[
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border transition-all duration-150",
                active === i
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-1"
                  : "border-[var(--color-border-strong)] opacity-60 hover:opacity-100",
              ].join(" ")}
              style={{ backgroundColor: "#ffffff" }}
            >
              <Image
                src={getImageUrl(src)}
                alt={`${name} view ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-2"
                style={{ mixBlendMode: "multiply" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Quantity selector ───────────────────────────────────────────────── */

function QuantitySelector({
  value,
  onChange,
  max,
}: {
  value: number
  onChange: (n: number) => void
  max?: number
}) {
  return (
    <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-[var(--color-border-strong)]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex h-11 w-11 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className="flex h-11 w-10 items-center justify-center border-x border-[var(--color-border-strong)] font-heading text-sm font-bold tabular-nums text-[var(--color-ink)]"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max ?? 99, value + 1))}
        disabled={max !== undefined && value >= max}
        className="flex h-11 w-11 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ── Trust strip ─────────────────────────────────────────────────────── */

function TrustStrip() {
  const items = [
    { icon: Truck,       label: "Free delivery",  sub: "Orders above ₹999" },
    { icon: RefreshCw,   label: "30-day returns", sub: "No questions asked" },
    { icon: ShieldCheck, label: "Chemical-free",  sub: "Certified food-safe" },
  ]
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-[var(--color-border-strong)]">
      {items.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 bg-white px-3 py-3 text-center">
          <Icon size={16} strokeWidth={1.5} className="text-[var(--color-primary)]" aria-hidden="true" />
          <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] leading-snug">
            {label}
          </p>
          <p className="font-body text-[10px] text-[var(--color-text-muted)]">{sub}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Add to cart row ─────────────────────────────────────────────────── */

export function PDPCartRow({
  variantId,
  productId,
  stock,
}: {
  variantId: string
  productId?: string
  stock?: number
}) {
  const [qty, setQty] = useState(1)
  const isOutOfStock = stock !== undefined && stock === 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} max={stock} />
        <div className="flex-1">
          <AddToCartBtn variantId={variantId} qty={qty} disabled={isOutOfStock} />
        </div>
        {productId && (
          <WishlistBtn
            productId={productId}
            className="h-11 w-11 shrink-0 rounded-xl border border-[var(--color-border-strong)] bg-white"
            iconClassName="h-5 w-5"
          />
        )}
      </div>
      {isOutOfStock && (
        <p className="font-body text-sm text-[var(--color-error)]">This product is currently out of stock.</p>
      )}
      <TrustStrip />
    </div>
  )
}

/* ── Tabs (Overview | Specs | Reviews) ───────────────────────────────── */

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill={i < rating ? "var(--color-star)" : "var(--color-border-strong)"}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  )
}

/* ── Write-review form ───────────────────────────────────────────────── */

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" role="group" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="transition-transform duration-100 hover:scale-110"
        >
          <Star
            size={22}
            className={
              n <= (hover || value)
                ? "text-[var(--color-star)] fill-[var(--color-star)]"
                : "text-[var(--color-border-strong)]"
            }
          />
        </button>
      ))}
    </div>
  )
}

function WriteReviewForm({ slug, onSuccess }: { slug: string; onSuccess: () => void }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    return (
      <div className="rounded-[12px] border border-[var(--color-border-strong)] bg-[var(--color-primary-light)]/20 px-5 py-4">
        <p className="font-body text-sm text-[var(--color-text-muted)]">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('urbanvana:open-auth'))}
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            Sign in
          </button>{' '}
          to write a review.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-[12px] border border-[var(--color-border-strong)] bg-[var(--color-primary-light)]/30 px-5 py-4">
        <p className="font-body text-sm font-semibold text-[var(--color-primary)]">
          Thank you for your review!
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { toast.error("Please select a rating"); return }
    if (!title.trim()) { toast.error("Please add a title"); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/catalog/products/${slug}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title: title.trim(), body: body.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Failed to submit")
      toast.success("Review submitted!")
      setSubmitted(true)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[12px] border border-[var(--color-border-strong)] bg-white p-5">
      <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="mb-2 font-body text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Rating *</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div>
          <label htmlFor="review-title" className="mb-1.5 block font-body text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Title *
          </label>
          <input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="Summarise your experience"
            className="input-base"
            required
          />
        </div>
        <div>
          <label htmlFor="review-body" className="mb-1.5 block font-body text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Details (optional)
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Share what you liked or didn't like"
            className="input-base resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-heading text-sm font-bold text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60 transition-colors"
        >
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export function PDPTabs({
  details,
  materials,
  shipping,
  rating,
  reviewCount,
  slug,
}: {
  details: string
  materials: string
  shipping: string
  rating: number
  reviewCount: number
  slug: string
}) {
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview")
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (tab !== "reviews") return
    setReviewsLoading(true)
    fetch(`/api/catalog/products/${slug}/reviews?limit=10`)
      .then((r) => r.json())
      .then((json) => setReviews(json.data?.reviews ?? []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [tab, slug])

  const TABS = [
    { id: "overview" as const, label: "Overview" },
    { id: "specs"    as const, label: "Details" },
    { id: "reviews"  as const, label: `Reviews (${reviewCount})` },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex border-b border-[var(--color-border-strong)]"
        role="tablist"
        aria-label="Product details"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={[
              "relative px-5 py-3.5 font-heading text-xs font-bold uppercase tracking-widest transition-colors duration-150",
              tab === t.id
                ? "text-[var(--color-ink)] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[var(--color-primary)] after:content-['']"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="pt-8">
        {tab === "overview" && (
          <div>
            <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
              About this product
            </h3>
            <p className="font-body text-base leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line">
              {details}
            </p>
          </div>
        )}

        {tab === "specs" && (
          <div className="flex flex-col gap-6">
            {materials && (
              <div>
                <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Materials
                </h3>
                <p className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">{materials}</p>
              </div>
            )}
            {shipping && (
              <div>
                <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Shipping & Delivery
                </h3>
                <p className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">{shipping}</p>
              </div>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-6">
            {/* Write a review */}
            <WriteReviewForm slug={slug} onSuccess={() => {
              setReviews([])
              setReviewsLoading(true)
              fetch(`/api/catalog/products/${slug}/reviews?limit=10`)
                .then((r) => r.json())
                .then((json) => setReviews(json.data?.reviews ?? []))
                .catch(() => {})
                .finally(() => setReviewsLoading(false))
            }} />

            {/* Aggregate */}
            <div className="flex items-center gap-4 rounded-[12px] border border-[var(--color-border-strong)] bg-[var(--color-primary-light)]/30 p-5">
              <span
                className="font-heading text-5xl font-black tabular-nums text-[var(--color-ink)]"
                aria-label={`${rating} average rating`}
              >
                {rating.toFixed(1)}
              </span>
              <div className="flex flex-col gap-1">
                <StarRow rating={Math.round(rating)} />
                <p className="font-body text-sm text-[var(--color-text-muted)]">
                  {reviewCount.toLocaleString()} verified reviews
                </p>
              </div>
            </div>

            {/* Reviews list */}
            {reviewsLoading && (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-[var(--color-border-strong)] pb-5">
                    <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-border-strong)]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[var(--color-border-strong)]" />
                  </div>
                ))}
              </div>
            )}

            {!reviewsLoading && reviews.length === 0 && (
              <p className="font-body text-sm text-[var(--color-text-muted)]">
                No reviews yet. Be the first to share your experience.
              </p>
            )}

            {!reviewsLoading && reviews.map((r) => (
              <article
                key={r._id}
                className="flex flex-col gap-3 border-b border-[var(--color-border-strong)] pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-sm font-bold text-[var(--color-ink)]">{r.title}</p>
                    <p className="font-body text-xs text-[var(--color-text-muted)]">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <StarRow rating={r.rating} />
                </div>
                {r.body && (
                  <p className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
                    &ldquo;{r.body}&rdquo;
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
