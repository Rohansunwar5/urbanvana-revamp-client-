import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"

const PRODUCTS = [
  {
    id: "tower-pro-30",
    slug: "aeroponic-tower-pro-30",
    supplyLabel: "30-PORT TOWER",
    categoryLine1: "FLAGSHIP",
    categoryLine2: "AEROPONIC",
    name: "TOWER PRO 30",
    description: "Grow 30 plants at once — herbs, greens & vegetables. The complete indoor farm.",
    price: 7999,
    originalPrice: 10999 as number | undefined,
    image: "/mock1.png",
    imageAlt: "Urbanvana Aeroponic Tower Pro 30",
    cardBg: "#ffffff",
  },
  {
    id: "herb-seed-kit",
    slug: "herb-seed-starter-kit",
    supplyLabel: "12 VARIETIES",
    categoryLine1: "SEEDS &",
    categoryLine2: "PLANTS",
    name: "HERB STARTER KIT",
    description: "Pre-germinated seeds ready to drop in. Basil, mint, spinach, coriander & more.",
    price: 599,
    originalPrice: undefined as number | undefined,
    image: "/mock2.png",
    imageAlt: "Urbanvana Herb Starter Seed Kit",
    cardBg: "#ffffff",
  },
  {
    id: "nutrient-pack-3mo",
    slug: "complete-nutrient-pack-3-month",
    supplyLabel: "3-MONTH SUPPLY",
    categoryLine1: "NUTRIENTS",
    categoryLine2: "FORMULA",
    name: "COMPLETE GROW PACK",
    description: "pH-balanced, non-toxic nutrient formula. Everything your tower needs for 3 months.",
    price: 1299,
    originalPrice: 1599 as number | undefined,
    image: "/mock1.png",
    imageAlt: "Urbanvana Complete Grow Nutrient Pack",
    cardBg: "#ffffff",
  },
]

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function BestsellerStrip() {
  return (
    <section aria-label="Bestselling products" className="illuminated-section bg-[var(--color-bg-subtle)] py-20 md:py-28">
      <Container>

        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Customer Favourites
          </p>
          <h2 className="font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl">
            Grow Fresh.<br />Eat Well.<br />Every Day.
          </h2>
          <p className="mt-5 max-w-[480px] font-body text-base leading-relaxed text-[var(--color-text-muted)]">
            Three products. One mission make growing fresh food at home as
            simple as possible. Pick your starting point.
          </p>
        </div>

        {/* Bordered grid */}
        <div className="overflow-hidden border border-[var(--color-border-strong)]">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {PRODUCTS.map((p, i) => {
              const discount = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 0
              const isLast = i === PRODUCTS.length - 1

              return (
                <article
                  key={p.id}
                  className={[
                    "flex flex-col",
                    !isLast
                      ? "border-b border-[var(--color-border-strong)] sm:border-b-0 sm:border-r"
                      : "",
                  ].join(" ")}
                >
                  {/* ── Coloured image zone — product floats transparently on bg ── */}
                  <div
                    className="relative"
                    style={{ backgroundColor: p.cardBg, height: "420px" }}
                  >
                    {/* Supply badge — top left */}
                    <div className="absolute left-5 top-5 z-10">
                      <span className="inline-flex items-center rounded-full border border-black/20 bg-white/75 px-3 py-[5px] font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
                        {p.supplyLabel}
                      </span>
                    </div>

                    {/* Category — top right */}
                    <div className="absolute right-5 top-5 z-10 text-right">
                      <p className="font-heading text-[11px] font-bold uppercase leading-snug tracking-widest text-[var(--color-ink)]/50">
                        {p.categoryLine1}<br />{p.categoryLine2}
                      </p>
                    </div>

                    {/* Product image — transparent, centred, object-contain */}
                    {/* Padded so product never touches the zone edges */}
                    <div className="absolute inset-0 flex items-center justify-center px-14 pb-8 pt-16">
                      <div className="relative h-full w-full">
                        <Image
                          src={p.image}
                          alt={p.imageAlt}
                          fill
                          sizes="(max-width: 640px) 80vw, 30vw"
                          className="object-contain"
                          style={{ mixBlendMode: "multiply" }}
                          priority={i === 0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Info zone ── */}
                  <div className="flex flex-1 flex-col gap-3 border-t border-[var(--color-border-strong)] bg-white p-6">
                    <div>
                      <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)]">
                        {p.name}
                      </p>
                      <p className="mt-2 font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {p.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 tabular-nums">
                      {p.originalPrice && (
                        <span className="font-body text-sm text-[var(--color-text-muted)] line-through">
                          ₹{formatINR(p.originalPrice)}
                        </span>
                      )}
                      <span className="font-heading text-xl font-bold text-[var(--color-primary)]">
                        ₹{formatINR(p.price)}
                      </span>
                      {discount > 0 && (
                        <span className="font-body text-xs font-semibold text-[var(--color-error)]">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto flex flex-col gap-2 pt-2">
                      <AddToCartBtn
                        productId={p.id}
                        className="rounded-full bg-[var(--color-ink)] font-heading text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-ink)]"
                      />
                      <Link
                        href={`/shop/${p.slug}`}
                        className="text-center font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

      </Container>
    </section>
  )
}

export { BestsellerStrip }
