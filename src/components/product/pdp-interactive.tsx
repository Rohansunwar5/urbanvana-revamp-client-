"use client"

import Image from "next/image"
import { useState } from "react"
import { Minus, Plus, Check, Truck, RefreshCw, ShieldCheck } from "lucide-react"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import type { Product, ProductSpec } from "@/lib/products"

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
              src={images[active]}
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
                src={src}
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
}: {
  value: number
  onChange: (n: number) => void
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
        onClick={() => onChange(Math.min(99, value + 1))}
        className="flex h-11 w-11 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
      >
        <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ── Trust strip ─────────────────────────────────────────────────────── */

function TrustStrip() {
  const items = [
    { icon: Truck,       label: "Free delivery",     sub: "Orders above ₹999" },
    { icon: RefreshCw,   label: "30-day returns",    sub: "No questions asked" },
    { icon: ShieldCheck, label: "Chemical-free",     sub: "Certified food-safe" },
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

export function PDPCartRow({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} />
        <div className="flex-1">
          <AddToCartBtn productId={productId} />
        </div>
      </div>
      <TrustStrip />
    </div>
  )
}

/* ── Tabs (Overview | Specs | Reviews) ───────────────────────────────── */

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Priya M.",
    location: "Bangalore",
    rating: 5,
    date: "March 2025",
    text: "Set up in 20 minutes and had fresh basil within 3 weeks. The quality is exceptional — no pests, no soil mess, just clean greens every morning.",
  },
  {
    id: "r2",
    name: "Arjun S.",
    location: "Mumbai",
    rating: 5,
    date: "February 2025",
    text: "I was sceptical about aeroponics but this product converted me. The pump is whisper quiet and the nutrient instructions are crystal clear.",
  },
  {
    id: "r3",
    name: "Deepa K.",
    location: "Chennai",
    rating: 5,
    date: "January 2025",
    text: "My kids now eat vegetables they used to refuse because they grew them themselves. Completely changed our relationship with food.",
  },
]

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

export function PDPTabs({
  longDescription,
  features,
  specs,
  rating,
  reviewCount,
}: {
  longDescription: string
  features: string[]
  specs: ProductSpec[]
  rating: number
  reviewCount: number
}) {
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview")

  const TABS = [
    { id: "overview" as const, label: "Overview" },
    { id: "specs"    as const, label: "Specifications" },
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
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                About this product
              </h3>
              <p className="font-body text-base leading-relaxed text-[var(--color-text-muted)]">
                {longDescription}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Key features
              </h3>
              <ul className="flex flex-col gap-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                      <Check size={10} strokeWidth={2.5} className="text-[var(--color-primary)]" aria-hidden="true" />
                    </span>
                    <span className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "specs" && (
          <div className="overflow-hidden rounded-[12px] border border-[var(--color-border-strong)]">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "grid grid-cols-[180px_1fr] items-baseline gap-4 px-5 py-3.5",
                  i % 2 === 0 ? "bg-white" : "bg-[var(--color-primary-light)]/30",
                  i < specs.length - 1 ? "border-b border-[var(--color-border-strong)]" : "",
                ].join(" ")}
              >
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {s.label}
                </span>
                <span className="font-body text-sm text-[var(--color-ink)]">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-6">
            {/* Aggregate */}
            <div className="flex items-center gap-4 rounded-[12px] border border-[var(--color-border-strong)] bg-[var(--color-primary-light)]/30 p-5">
              <span
                className="font-heading text-5xl font-black tabular-nums text-[var(--color-ink)]"
                aria-label={`${rating} average rating`}
              >
                {rating}
              </span>
              <div className="flex flex-col gap-1">
                <StarRow rating={Math.round(rating)} />
                <p className="font-body text-sm text-[var(--color-text-muted)]">
                  {reviewCount.toLocaleString()} verified reviews
                </p>
              </div>
            </div>

            {/* Individual reviews */}
            {MOCK_REVIEWS.map((r) => (
              <article
                key={r.id}
                className="flex flex-col gap-3 border-b border-[var(--color-border-strong)] pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-sm font-bold text-[var(--color-ink)]">{r.name}</p>
                    <p className="font-body text-xs text-[var(--color-text-muted)]">{r.location} · {r.date}</p>
                  </div>
                  <StarRow rating={r.rating} />
                </div>
                <p className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
                  &ldquo;{r.text}&rdquo;
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
