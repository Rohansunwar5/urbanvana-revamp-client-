"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getImageUrl } from "@/lib/utils/image"
import type { CatalogProduct } from "@/lib/types/catalog"

/* ── Slot positioning ────────────────────────────────────────────────── */

function slotStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset)
  const sign = Math.sign(offset) || 1

  const configs = [
    { tx:    0, scale: 1.00, opacity: 1.00, z: 5 },
    { tx:  305, scale: 0.78, opacity: 1.00, z: 4 },
    { tx:  530, scale: 0.60, opacity: 1.00, z: 3 },
  ]

  const cfg = configs[abs] ?? { tx: 720, scale: 0.50, opacity: 0, z: 1 }

  return {
    transform: `translateX(calc(-50% + ${sign * cfg.tx}px)) scale(${cfg.scale})`,
    opacity:    cfg.opacity,
    zIndex:     cfg.z,
    transition: "transform 560ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease",
  }
}

/* ── ProductCarousel ─────────────────────────────────────────────────── */

function ProductCarousel({ products }: { products: CatalogProduct[] }) {
  const count                         = products.length
  const [active, setActive]           = useState(0)
  const [paused, setPaused]           = useState(false)
  const intervalRef                   = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(
    (dir: 1 | -1) => {
      setActive((p) => (p + dir + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (paused || count === 0) return
    intervalRef.current = setInterval(() => advance(1), 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, advance, count])

  if (count === 0) return null

  const current = products[active]

  return (
    <section
      aria-label="Featured products"
      className="overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Header */}
      <div className="mb-16 px-4 text-center">
        <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
          The Collection
        </p>
        <h2
          className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
        >
          Meet the lineup.
        </h2>
      </div>

      {/* Stage */}
      <div
        className="relative mx-auto select-none"
        style={{ height: "460px", maxWidth: "1120px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {products.map((product, i) => {
          let off = i - active
          if (off >  Math.floor(count / 2)) off -= count
          if (off < -Math.floor(count / 2)) off += count
          const isCenter = off === 0

          return (
            <div
              key={product._id}
              aria-hidden={!isCenter}
              style={{
                position: "absolute",
                left:     "50%",
                top:      0,
                width:    "260px",
                height:   "100%",
                transformOrigin: "bottom center",
                ...slotStyle(off),
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={isCenter ? product.name : ""}
                  fill
                  sizes="260px"
                  className="object-contain"
                  style={{ mixBlendMode: "multiply" }}
                  draggable={false}
                  priority={i === 0}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Active product info */}
      <div
        className="mt-6 px-4 text-center"
        style={{ minHeight: "100px" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-heading text-lg font-bold uppercase tracking-widest text-[var(--color-ink)]">
          {current.name}
        </p>
        <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
          {current.description}
        </p>
        <Link
          href={`/shop/${current.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] px-7 py-3 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all duration-200 active:scale-[0.95] hover:bg-[var(--color-ink)] hover:text-white"
        >
          Shop Now
          <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => advance(-1)}
          aria-label="Previous product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/20 bg-white text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-ink)] hover:shadow-md active:scale-90"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-[6px]" role="tablist" aria-label="Select product">
          {products.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Product ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "rounded-full transition-all duration-300",
                i === active
                  ? "h-[8px] w-6 bg-[var(--color-ink)]"
                  : "h-[8px] w-[8px] bg-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/45",
              ].join(" ")}
            />
          ))}
        </div>

        <button
          onClick={() => advance(1)}
          aria-label="Next product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/20 bg-white text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-ink)] hover:shadow-md active:scale-90"
        >
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </section>
  )
}

export { ProductCarousel }
