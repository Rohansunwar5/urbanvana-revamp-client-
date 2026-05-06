"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

/* ── ProductCarousel — Barcoop-style center-featured carousel ─────────────
   5 slots visible: center (large), ±1 (medium), ±2 (small/faded).
   Auto-advances every 3.5 s. Pauses on hover. Wraps infinitely.
   All positioning via combined transform so scale + translate compose cleanly.
───────────────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    id:      "tower-pro-30",
    name:    "Tower Pro 30",
    tagline: "30 plants. Zero soil. Total control.",
    href:    "/shop/aeroponic-tower-pro-30",
    image:   "/mock1.png",
  },
  {
    id:      "herb-starter-kit",
    name:    "Herb Starter Kit",
    tagline: "12 pre-germinated varieties, ready to drop in.",
    href:    "/shop/herb-seed-starter-kit",
    image:   "/mock2.png",
  },
  {
    id:      "complete-grow-pack",
    name:    "Complete Grow Pack",
    tagline: "3 months of clean, pH-balanced nutrition.",
    href:    "/shop/complete-nutrient-pack-3-month",
    image:   "/mock3.png",
  },
  {
    id:      "tower-lite-20",
    name:    "Tower Lite 20",
    tagline: "Compact form, full aeroponic power.",
    href:    "/shop/aeroponic-tower-lite-20",
    image:   "/mock4.png",
  },
  {
    id:      "tower-pro-30-b",
    name:    "Tower Pro 30",
    tagline: "30 plants. Zero soil. Total control.",
    href:    "/shop/aeroponic-tower-pro-30",
    image:   "/mock1.png",
  },
  {
    id:      "herb-starter-kit-b",
    name:    "Herb Starter Kit",
    tagline: "12 pre-germinated varieties, ready to drop in.",
    href:    "/shop/herb-seed-starter-kit",
    image:   "/mock2.png",
  },
  {
    id:      "complete-grow-pack-b",
    name:    "Complete Grow Pack",
    tagline: "3 months of clean, pH-balanced nutrition.",
    href:    "/shop/complete-nutrient-pack-3-month",
    image:   "/mock3.png",
  },
]

/* Each item is 260px wide, placed at left: 50% of the stage.
   translateX(-50%) centers it.  Additional px offset moves it to its slot.
   Scale is applied after translation so items shrink in-place.            */
function slotStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset)
  const sign = Math.sign(offset) || 1

  const configs = [
    { tx:    0, scale: 1.00, opacity: 1.00, z: 5 }, // center — largest, full opacity
    { tx:  305, scale: 0.78, opacity: 1.00, z: 4 }, // ±1 — no fade
    { tx:  530, scale: 0.60, opacity: 1.00, z: 3 }, // ±2 — no fade
  ]

  const cfg = configs[abs] ?? { tx: 720, scale: 0.50, opacity: 0, z: 1 }

  return {
    transform: `translateX(calc(-50% + ${sign * cfg.tx}px)) scale(${cfg.scale})`,
    opacity:    cfg.opacity,
    zIndex:     cfg.z,
    transition: "transform 560ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease",
  }
}

function ProductCarousel() {
  const count                         = PRODUCTS.length
  const [active, setActive]           = useState(0)
  const [paused, setPaused]           = useState(false)
  const [prev,   setPrev]             = useState<number | null>(null)
  const intervalRef                   = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(
    (dir: 1 | -1) => {
      setActive((p) => {
        setPrev(p)
        return (p + dir + count) % count
      })
    },
    [count],
  )

  /* Auto-play */
  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => advance(1), 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, advance])

  return (
    <section
      aria-label="Featured products"
      className="overflow-hidden bg-white py-24 md:py-32"
    >
      {/* ── Header ── */}
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

      {/* ── Stage ── */}
      <div
        className="relative mx-auto select-none"
        style={{ height: "460px", maxWidth: "1120px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {PRODUCTS.map((product, i) => {
          /* Shortest-path circular offset */
          let off = i - active
          if (off >  Math.floor(count / 2)) off -= count
          if (off < -Math.floor(count / 2)) off += count

          const isCenter = off === 0

          return (
            <div
              key={product.id}
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
                  src={product.image}
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

      {/* ── Active product info ── */}
      <div
        className="mt-6 px-4 text-center"
        style={{ minHeight: "100px" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-heading text-lg font-bold uppercase tracking-widest text-[var(--color-ink)]">
          {PRODUCTS[active].name}
        </p>
        <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
          {PRODUCTS[active].tagline}
        </p>
        <Link
          href={PRODUCTS[active].href}
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] px-7 py-3 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all duration-200 active:scale-[0.95] hover:bg-[var(--color-ink)] hover:text-white"
        >
          Shop Now
          <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>

      {/* ── Controls ── */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => advance(-1)}
          aria-label="Previous product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/20 bg-white text-[var(--color-ink)] transition-all duration-200 hover:border-[var(--color-ink)] hover:shadow-md active:scale-90"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>

        {/* Pill dots */}
        <div
          className="flex items-center gap-[6px]"
          role="tablist"
          aria-label="Select product"
        >
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Product ${i + 1}`}
              onClick={() => { setPrev(active); setActive(i) }}
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
