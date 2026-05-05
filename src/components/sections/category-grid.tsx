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

const CATEGORIES = [
  {
    number: "01",
    name: "Towers",
    tagline: "Flagship aeroponic growing systems",
    href: "/shop/towers",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Aeroponic tower growing fresh greens indoors",
  },
  {
    number: "02",
    name: "Bundles",
    tagline: "Complete starter kits, ready to grow",
    href: "/shop/bundles",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Complete aeroponic starter bundle",
  },
  {
    number: "03",
    name: "Nutrients",
    tagline: "Clean, certified plant nutrition",
    href: "/shop/nutrients",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Nutrient solution bottles for hydroponics",
  },
  {
    number: "04",
    name: "Accessories",
    tagline: "Pods, pumps & expansion parts",
    href: "/shop/accessories",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Growing accessories and replacement parts",
  },
] as const

function CategorySection() {
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
      className="illuminated-section bg-white"
    >
      {/* ── Header (contained) ── */}
      <Container className="pb-10 pt-20 md:pb-14 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Categories
            </p>
            {/* <h2
              className="font-heading font-black uppercase leading-[0.9] tracking-tight text-[var(--color-ink)]"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
            >
              Explore<br />the range.
            </h2> */}
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

      {/* ── Card grid — full-width, no gap ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.number}
            href={cat.href}
            aria-label={`Shop ${cat.name} — ${cat.tagline}`}
            className="group relative flex aspect-[3/4] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
          >
            {/* Image — zooms gently on hover */}
            <Image
              src={cat.image}
              alt={cat.imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              loading={i === 0 ? "eager" : "lazy"}
            />

            {/* Gradient overlay — darkens on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001403]/90 via-[#001403]/30 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

            {/* Number — top left */}
            <span className="absolute left-5 top-5 z-10 font-body text-[11px] font-medium tabular-nums text-white/45">
              {cat.number}
            </span>

            {/* Bottom text block */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7">
              {/* Green accent line — slides in on hover */}
              <div className="mb-3 h-[2px] w-0 rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out group-hover:w-10" />

              {/* Category name — always visible */}
              <p className="font-heading text-xl font-black uppercase leading-tight tracking-tight text-white md:text-2xl lg:text-[1.6rem]">
                {cat.name}
              </p>

              {/* Tagline + CTA — animate up from below on hover */}
              <div className="translate-y-4 opacity-0 transition-all duration-[380ms] ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mt-2 font-body text-[13px] leading-snug text-white/65">
                  {cat.tagline}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
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
