import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Star, ChevronRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { PDPImageGallery, PDPCartRow, PDPTabs } from "@/components/product/pdp-interactive"
import { PixelViewContent } from "@/components/pixel/pixel-view-content"
import { getImageUrl } from "@/lib/utils/image"
import type { ProductDetailResponse, CatalogProduct } from "@/lib/types/catalog"
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld"
import connectDB from "@/lib/db"
import { ensureRedisConnected } from "@/lib/redis"
import productService from "@/lib/services/catalog/product.service"

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

const BADGE_STYLES: Record<string, string> = {
  primary: "bg-[var(--color-ink)] text-white",
  accent:  "bg-[var(--color-primary)] text-white",
}

async function fetchProduct(slug: string): Promise<ProductDetailResponse | null> {
  try {
    await connectDB()
    ensureRedisConnected() // fire-and-forget
    const result = await productService.getProductBySlug(slug)
    return result as unknown as ProductDetailResponse
  } catch {
    return null
  }
}

async function fetchRelated(slug: string): Promise<CatalogProduct[]> {
  try {
    const result = await productService.getRelatedProducts(slug, 4)
    return result as unknown as CatalogProduct[]
  } catch {
    return []
  }
}

/* ── Metadata ───────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchProduct(slug)
  if (!data) return {}
  const { product } = data
  const image = getImageUrl(product.images[0])
  return {
    title: `${product.name} — Aeroponic Tower for Indian Homes`,
    description: product.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urbanvana.com"}/shop/p/${slug}`,
    },
    openGraph: {
      title: `${product.name} — Aeroponic Tower for Indian Homes | Urbanvana`,
      description: product.description,
      images: [{ url: image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Aeroponic Tower for Indian Homes | Urbanvana`,
      description: product.description,
      images: [image],
    },
  }
}

/* ── Related product mini-card ──────────────────────────────────────── */

function RelatedCard({ product }: { product: CatalogProduct }) {
  const discount =
    product.originalMinPrice && product.originalMinPrice > product.minPrice
      ? Math.round(((product.originalMinPrice - product.minPrice) / product.originalMinPrice) * 100)
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
              src={getImageUrl(product.images[0])}
              alt={product.name}
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
          {discount > 0 && (
            <span className="font-body text-xs text-[var(--color-text-muted)] line-through">
              ₹{formatINR(product.originalMinPrice)}
            </span>
          )}
          <span className="font-heading text-base font-bold text-[var(--color-primary)]">
            ₹{formatINR(product.minPrice)}
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
  const data = await fetchProduct(slug)
  if (!data) notFound()

  const { product, variants } = data
  const related = await fetchRelated(slug)

  /* Use the first active variant for pricing, fall back to first variant */
  const primaryVariant = variants.find((v) => v.isActive && v.stock > 0) ?? variants[0]

  /* Videos: active variant videos take precedence, fall back to product videos */
  const displayVideos: string[] =
    (primaryVariant?.videos?.length ? primaryVariant.videos : product.videos) ?? []

  const price = primaryVariant?.price ?? 0
  const originalPrice = primaryVariant?.originalPrice
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  /* Category display name */
  const categoryName =
    typeof product.category === "object" ? product.category.name : "Products"
  const categorySlug =
    typeof product.category === "object" ? product.category.slug : ""


  const PRODUCT_FAQ = [
    {
      question: "What if the pump fails?",
      answer: "The pump is timer-automated and tested before shipping. It runs on a 5-minute-on / 15-minute-off cycle that prevents overheating. Full setup support is available via WhatsApp and call.",
    },
    {
      question: "Which vegetables can I grow?",
      answer: "The tower grows 40+ varieties including coriander (dhaniya), spinach (palak), fenugreek (methi), curry leaves, mint (pudina), tulsi, lettuce, arugula, cherry tomatoes, chillies, and capsicum.",
    },
    {
      question: "How long does setup take?",
      answer: "Under 30 minutes from unboxing to first seeds planted. The tower ships fully assembled — fill the reservoir, mix nutrients, plant seeds. A complete setup guide is included in the box.",
    },
    {
      question: "What is included in the kit?",
      answer: "Tower body, 60L reservoir, pump with timer, net pots, Urbanvana nutrient mix (Part A and B), pH test strips, pH adjustment solution, coco disc starter plugs, and 6 types of seeds. Everything you need to start on day one.",
    },
    {
      question: "Do I need gardening experience?",
      answer: "No. The tower is designed for complete beginners. The automated pump and timer handle the watering cycle. You plant seeds, check the reservoir weekly, and harvest.",
    },
    {
      question: "How long until my first harvest?",
      answer: "Fast-growing crops like coriander and lettuce are ready in 14–21 days. Spinach and methi in 18–22 days. Cherry tomatoes take 50–60 days.",
    },
  ]

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: getImageUrl(product.images[0]),
    description: product.description,
    brand: { "@type": "Brand", name: "Urbanvana" },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.totalReviews ?? 0,
      },
    }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "INR",
      availability:
        (primaryVariant?.stock ?? 0) === 0
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
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        ...(categoryName && categorySlug ? [{ name: categoryName, href: `/shop/${categorySlug}` }] : []),
        { name: product.name, href: `/shop/p/${product.slug}` },
      ]} />
      <FaqJsonLd items={PRODUCT_FAQ} />
      <PixelViewContent
        productId={product._id?.toString() ?? product.slug}
        name={product.name}
        category={categoryName}
        price={price}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg)] pt-8 md:pt-12">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5">
            <Link href="/" className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">
              Home
            </Link>
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <Link href="/shop" className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">
              Shop
            </Link>
            {categoryName && (
              <>
                <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
                <Link href={`/shop/${categorySlug}`} className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
              {product.name}
            </span>
          </nav>

          {/* 2-column layout */}
          <div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
            {/* Left — image gallery */}
            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <PDPImageGallery
                images={product.images}
                videos={displayVideos}
                name={product.name}
              />
            </div>

            {/* Right — product info */}
            <div className="flex flex-col gap-6 pb-12">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.badge && (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest ${BADGE_STYLES[product.badge.variant] ?? BADGE_STYLES.primary}`}>
                    {product.badge.label}
                  </span>
                )}
                {categoryName && (
                  <span className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {categoryName}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1
                className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                {product.name}
              </h1>

              {/* Rating row */}
              {product.rating > 0 && (
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
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="font-body text-sm text-[var(--color-text-muted)]">
                    ({product.totalReviews.toLocaleString()} verified reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 tabular-nums">
                <span
                  className="font-heading font-bold text-[var(--color-primary)]"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
                >
                  ₹{formatINR(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="font-body text-base text-[var(--color-text-muted)] line-through">
                    ₹{formatINR(originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-[var(--color-error)] px-2.5 py-1 font-heading text-xs font-bold text-white">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Variant attribute pills */}
              {primaryVariant && primaryVariant.attributes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {primaryVariant.attributes.map((attr) => (
                    <span
                      key={attr.attributeSlug}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)]"
                    >
                      <span className="text-[var(--color-text-muted)]">{attr.attributeName}:</span>
                      {attr.valueLabel}
                    </span>
                  ))}
                </div>
              )}

              {/* Short description */}
              <p className="font-body text-base leading-relaxed text-[var(--color-text-muted)]">
                {product.description}
              </p>

              <div className="h-px bg-[var(--color-border-strong)]" />

              {/* Quantity + Add to Cart */}
              <PDPCartRow
                variantId={primaryVariant?._id?.toString() ?? ""}
                productId={product._id?.toString()}
                stock={primaryVariant?.stock}
                productName={product.name}
                price={price}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Tabs section ─────────────────────────────────────────────── */}
      <section aria-label="Product details" className="border-t border-[var(--color-border-strong)] bg-[var(--color-bg)] py-12 md:py-16">
        <Container>
          <PDPTabs
            details={product.details}
            materials={product.materials}
            shipping={product.shipping}
            rating={product.rating}
            reviewCount={product.totalReviews}
            slug={product.slug}
          />
        </Container>
      </section>

      {/* ── Related products ─────────────────────────────────────────── */}
      {/* ── FAQ section ──────────────────────────────────────────────── */}
      <section
        aria-label="Frequently asked questions"
        className="border-t border-[var(--color-border-strong)] bg-[var(--color-bg)] py-12 md:py-16"
      >
        <Container>
          <h2
            className="mb-8 font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            Frequently Asked Questions
          </h2>
          <dl className="divide-y divide-[var(--color-border-strong)]">
            {PRODUCT_FAQ.map(({ question, answer }) => (
              <div key={question} className="py-5">
                <dt className="font-heading text-sm font-bold text-[var(--color-ink)]">{question}</dt>
                <dd className="mt-2 font-body text-base leading-relaxed text-[var(--color-text-muted)]">{answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

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
              <Link href="/shop" className="hidden shrink-0 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)] sm:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <RelatedCard key={p._id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
