"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── CategorySection — Full-bleed portrait card grid ─────────────────────
   4 equal portrait cards, edge-to-edge, no gap.
   Each card: image + dark gradient overlay, number badge, category name
   always visible, tagline + CTA animate up on hover (pure CSS group).
   Header stays inside Container; grid bleeds full-width.
   IntersectionObserver drives the zone-lit background effect.
───────────────────────────────────────────────────────────────────────── */

export type CategoryCardData = {
  slug: string
  name: string
  description?: string
  image?: string
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&auto=format&fit=crop&q=80",
]

function categoryGridClass(count: number): string {
  if (count === 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  if (count === 3) return "grid-cols-2 md:grid-cols-3"
  if (count === 4) return "grid-cols-2 md:grid-cols-4"
  return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
}

function CategorySection({ categories }: { categories: CategoryCardData[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.dataset.zoneLit = entry.isIntersecting ? "true" : "false"
      },
      { threshold: 0, rootMargin: "0px 0px -45% 0px" },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      delete document.documentElement.dataset.zoneLit
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Shop by category"
      className="illuminated-section bg-[var(--color-bg)]"
    >
      {/* ── Header (contained) ── */}
      <Container className="pb-10 pt-20 md:pb-14 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Categories
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-2 pb-1 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors duration-200 hover:text-[var(--color-primary)] md:inline-flex"
          >
            All products
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </Container>

      {/* ── Card grid — full-width, no gap, adapts to count ── */}
      <div className={`grid ${categoryGridClass(categories.length)}`}>
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            aria-label={`Shop ${cat.name}${cat.description ? ` — ${cat.description}` : ""}`}
            className="group relative flex aspect-[3/4] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
          >
            {/* Image — zooms gently on hover */}
            <Image
              src={cat.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              loading={i === 0 ? "eager" : "lazy"}
            />

            {/* Gradient overlay — darkens on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001403]/90 via-[#001403]/30 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

            {/* Number — top left */}
            <span className="absolute left-5 top-5 z-10 font-body text-[11px] font-medium tabular-nums text-white/45">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Bottom text block */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7">
              {/* Green accent line — slides in on hover */}
              <div className="mb-3 h-[2px] w-0 rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out group-hover:w-10" />

              {/* Category name — always visible */}
              <p className="font-heading text-xl font-black uppercase leading-tight tracking-tight text-white md:text-2xl lg:text-[1.6rem]">
                {cat.name}
              </p>

              {/* Tagline + CTA — always visible on mobile, animate up on desktop */}
              <div className="transition-all duration-[380ms] ease-out md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                {cat.description && (
                  <p className="mt-2 hidden font-body text-[13px] leading-snug text-white/65 md:block">
                    {cat.description}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-widest text-white">
                  Shop now
                  <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile CTA */}
      <Container className="py-8 lg:hidden">
        <div className="flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] underline-offset-4 hover:text-[var(--color-primary)] hover:underline"
          >
            View all products
            <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}

export { CategorySection }
