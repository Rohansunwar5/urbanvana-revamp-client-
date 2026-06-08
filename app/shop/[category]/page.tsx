import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"
import { getImageUrl } from "@/lib/utils/image"
import connectDB from "@/lib/db"
import { ensureRedisConnected } from "@/lib/redis"
import categoryService from "@/lib/services/catalog/category.service"
import productService from "@/lib/services/catalog/product.service"
import type { CatalogProduct } from "@/lib/types/catalog"

/* ── Category content ────────────────────────────────────────────────────
   Drafted copy for each category. Refine wording in admin or here.
────────────────────────────────────────────────────────────────────────── */
const CATEGORY_CONTENT: Record<string, { title: string; headline: string; description: string }> = {
  towers: {
    title: "Aeroponic Towers — Grow 40+ Plants at Home",
    headline: "Aeroponic Towers",
    description:
      "Urbanvana aeroponic towers let you grow up to 40 plants in the space of a single pot — no soil, no mess, no garden needed. Using a fine mist of oxygenated nutrient solution, our towers deliver water and minerals directly to plant roots, producing harvests 3× faster than traditional growing. Whether you're a first-time home grower in a Mumbai apartment or an experienced urban farmer in Bangalore, our city towers are engineered for India's climate and designed to sit on any balcony, terrace, or kitchen counter. Each tower ships fully assembled with a starter nutrient kit, HD pump, and a step-by-step growing manual — everything you need to harvest fresh lettuce, herbs, and greens within 21 days of planting.",
  },
  bundles: {
    title: "Starter Bundles — Everything to Start Growing Today",
    headline: "Starter Bundles",
    description:
      "Our starter bundles take the guesswork out of aeroponic growing. Each bundle pairs an Urbanvana tower with the exact seeds, nutrients, and accessories you need to get your first harvest within three weeks. We've tested every combination — tower size, seed variety, nutrient ratio — so you don't have to. Bundles are especially popular with Indian households looking for a complete, cost-effective entry into home growing. Save up to 25% versus buying components separately, and get exclusive bundle-only seed varieties curated for India's growing conditions. Perfect as a gift or for anyone who wants to start growing immediately without any research.",
  },
  nutrients: {
    title: "Hydroponic Nutrients for Aeroponic Growing — India",
    headline: "Nutrients & Growing Solutions",
    description:
      "Plants grown aeroponically have no soil buffer — the nutrient solution is their entire food source. That's why the quality of your nutrients matters more than in any other growing method. Urbanvana nutrients are formulated specifically for aeroponic and hydroponic systems, with balanced NPK ratios, chelated micronutrients, and pH buffers optimised for India's water quality. Our two-part grow and bloom formulas take plants through every stage of their lifecycle, from germination to harvest. Each bottle is concentrated and yields hundreds of litres of feeding solution. Compatible with all Urbanvana towers and any standard hydroponic system — from NFT rigs to deep water culture setups.",
  },
  seeds: {
    title: "Seeds & Plants for Aeroponic Towers — Grow at Home India",
    headline: "Seeds & Plants",
    description:
      "Not all seeds perform equally in aeroponic systems — the variety, germination rate, and root structure all affect how quickly you reach harvest. Urbanvana seeds are selected for rapid germination, strong root development, and high yield in soil-free environments. Our range includes fast-growing salad greens, herbs popular in Indian cooking (methi, coriander, palak, tulsi), cherry tomatoes, and exotic microgreens. All seeds are non-GMO, untreated, and tested for viability in aeroponic conditions before we stock them. Each packet includes planting instructions specific to aeroponic and hydroponic use, with recommended nutrient concentrations and expected days-to-harvest for Indian growing conditions.",
  },
}

const VALID_SLUGS = Object.keys(CATEGORY_CONTENT)

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

/* ── Metadata ───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const content = CATEGORY_CONTENT[category]
  if (!content) return {}
  return pageMetadata({
    title: content.title,
    path: `/shop/${category}`,
  })
}

/* ── Product card ───────────────────────────────────────────────────────── */
function CategoryProductCard({ product }: { product: CatalogProduct }) {
  const discount =
    product.originalMinPrice && product.originalMinPrice > product.minPrice
      ? Math.round(((product.originalMinPrice - product.minPrice) / product.originalMinPrice) * 100)
      : 0

  return (
    <article className="group relative flex flex-col bg-white">
      <Link
        href={`/shop/p/${product.slug}`}
        aria-label={`View ${product.name}`}
        tabIndex={-1}
        className="absolute inset-0 z-0"
      />
      <div className="relative aspect-square sm:aspect-[5/4] overflow-hidden bg-white pointer-events-none">
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
      <div className="relative z-10 flex flex-1 flex-col gap-2 border-t border-[var(--color-border-strong)] bg-white p-3 sm:gap-3 sm:p-5 pointer-events-none">
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

/* ── Page ───────────────────────────────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!VALID_SLUGS.includes(category)) notFound()

  const content = CATEGORY_CONTENT[category]

  await connectDB()
  ensureRedisConnected()

  const result = await productService.listProducts({ category, limit: 50, page: 1 })
  const products = result.products as CatalogProduct[]

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: content.headline, href: `/shop/${category}` },
      ]} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg)] pt-16 pb-10 md:pt-20 md:pb-12">
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
            <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
              {content.headline}
            </span>
          </nav>

          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
          <h1
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            {content.headline}
          </h1>
        </Container>
      </section>

      {/* ── Category description (SEO copy) ────────────────────────────── */}
      <section className="border-b border-[var(--color-border-strong)] bg-white py-8">
        <Container>
          <p className="max-w-3xl font-body text-base leading-relaxed text-[var(--color-text-muted)]">
            {content.description}
          </p>
        </Container>
      </section>

      {/* ── Product grid ───────────────────────────────────────────────── */}
      <section aria-label={`${content.headline} products`} className="bg-[var(--color-bg)] py-8 md:py-12">
        <Container>
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="font-heading text-base font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                No products found in this category
              </p>
              <Link href="/shop" className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
                Browse all products →
              </Link>
            </div>
          ) : (
            <div
              className="overflow-hidden border border-[var(--color-border-strong)]"
              style={{ backgroundColor: "var(--color-border-strong)" }}
            >
              <div className="grid grid-cols-2 gap-px lg:grid-cols-3">
                {products.map((product) => (
                  <CategoryProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Browse other categories ─────────────────────────────────────── */}
      <section className="border-t border-[var(--color-border-strong)] bg-white py-12">
        <Container>
          <p className="mb-6 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Browse other categories
          </p>
          <div className="flex flex-wrap gap-3">
            {VALID_SLUGS.filter((s) => s !== category).map((slug) => (
              <Link
                key={slug}
                href={`/shop/${slug}`}
                className="rounded-full border border-[var(--color-border-strong)] px-5 py-2 font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              >
                {CATEGORY_CONTENT[slug].headline}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
