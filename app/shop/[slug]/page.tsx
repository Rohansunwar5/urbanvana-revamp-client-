import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ChevronRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { PDPImageGallery, PDPCartRow, PDPTabs } from "@/components/product/pdp-interactive"
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/lib/products"
import Image from "next/image"

/* ── Static params for build-time generation ────────────────────────── */

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

/* ── Per-product metadata ───────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Urbanvana`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Urbanvana`,
      description: product.description,
      images: [product.image],
    },
  }
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-[var(--color-ink)] text-white",
  New:        "bg-[var(--color-primary)] text-white",
  "Low Stock":"bg-[var(--color-warning)] text-white",
  Sale:       "bg-[var(--color-error)] text-white",
}

/* ── Related product mini-card ──────────────────────────────────────── */

function RelatedCard({ product }: { product: ReturnType<typeof getProductBySlug> & object }) {
  if (!product) return null
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-[var(--color-border-strong)] bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative" style={{ backgroundColor: "#ffffff", height: "200px" }}>
        <div className="absolute inset-0 flex items-center justify-center px-8 py-6">
          <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 768px) 45vw, 25vw"
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-[var(--color-border-strong)] p-4">
        <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] leading-snug">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5 tabular-nums">
          {product.originalPrice && (
            <span className="font-body text-xs text-[var(--color-text-muted)] line-through">
              ₹{formatINR(product.originalPrice)}
            </span>
          )}
          <span className="font-heading text-base font-bold text-[var(--color-primary)]">
            ₹{formatINR(product.price)}
          </span>
          {discount > 0 && (
            <span className="font-body text-[10px] font-semibold text-[var(--color-error)]">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { "@type": "Brand", name: "Urbanvana" },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount ?? 0,
      },
    }),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.stock === "Out of Stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg)] pt-8 md:pt-12">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5">
            <Link
              href="/"
              className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
            >
              Home
            </Link>
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <Link
              href="/shop"
              className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
            >
              Shop
            </Link>
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <Link
              href={`/shop?category=${product.category}`}
              className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
            >
              {product.category}
            </Link>
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
              {product.name}
            </span>
          </nav>

          {/* 2-column layout */}
          <div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
            {/* Left — image gallery (sticky on desktop) */}
            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <PDPImageGallery images={product.images} name={product.name} />
            </div>

            {/* Right — product info */}
            <div className="flex flex-col gap-6 pb-12">
              {/* Badges row */}
              <div className="flex items-center gap-2">
                {product.badge && (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest ${BADGE_STYLES[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {product.category}
                </span>
              </div>

              {/* Supply label */}
              <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {product.supplyLabel}
              </p>

              {/* Name */}
              <h1
                className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      strokeWidth={0}
                      aria-hidden="true"
                      className={i < Math.round(product.rating) ? "fill-[var(--color-star)]" : "fill-[var(--color-border-strong)]"}
                    />
                  ))}
                </div>
                <span className="font-heading text-sm font-bold tabular-nums text-[var(--color-ink)]">
                  {product.rating}
                </span>
                <span className="font-body text-sm text-[var(--color-text-muted)]">
                  ({product.reviewCount.toLocaleString()} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 tabular-nums">
                <span
                  className="font-heading font-bold text-[var(--color-primary)]"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
                >
                  ₹{formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-body text-base text-[var(--color-text-muted)] line-through">
                    ₹{formatINR(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-[var(--color-error)] px-2.5 py-1 font-heading text-xs font-bold text-white">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="font-body text-base leading-relaxed text-[var(--color-text-muted)]">
                {product.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-[var(--color-border-strong)]" />

              {/* Feature highlights */}
              <ul className="flex flex-col gap-2.5">
                {product.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                      <svg width="8" height="8" viewBox="0 0 24 24" aria-hidden="true">
                        <polyline
                          points="20 6 9 17 4 12"
                          fill="none"
                          stroke="var(--color-primary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="font-body text-sm leading-relaxed text-[var(--color-text-muted)]">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="h-px bg-[var(--color-border-strong)]" />

              {/* Quantity + Add to Cart */}
              <PDPCartRow productId={product.id} />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Tabs section ─────────────────────────────────────────────── */}
      <section aria-label="Product details" className="border-t border-[var(--color-border-strong)] bg-[var(--color-bg)] py-12 md:py-16">
        <Container>
          <PDPTabs
            longDescription={product.longDescription}
            features={product.features}
            specs={product.specs}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </Container>
      </section>

      {/* ── Related products ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-label="Related products"
          className="border-t border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-12 md:py-16"
        >
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  From the same range
                </p>
                <h2
                  className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  You may also like.
                </h2>
              </div>
              <Link
                href={`/shop`}
                className="hidden shrink-0 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)] sm:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
