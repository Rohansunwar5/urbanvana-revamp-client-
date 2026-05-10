import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { AddToCartBtn } from "@/components/product/add-to-cart-btn"
import { getImageUrl } from "@/lib/utils/image"
import type { CatalogProduct } from "@/lib/types/catalog"


function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function BestsellerStrip({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) return null

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
          {/* <p className="mt-5 max-w-[480px] font-body text-base leading-relaxed text-[var(--color-text-muted)]">
            Three products. One mission — make growing fresh food at home as
            simple as possible. Pick your starting point.
          </p> */}
        </div>

        {/* Bordered grid */}
        <div className="overflow-hidden border border-[var(--color-border-strong)]">
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {products.slice(0, 3).map((p, i) => {
              const discount =
                p.originalMinPrice && p.originalMinPrice > p.minPrice
                  ? Math.round(((p.originalMinPrice - p.minPrice) / p.originalMinPrice) * 100)
                  : 0
              const isLast = i === Math.min(products.length, 3) - 1

              return (
                <article
                  key={p._id}
                  className={[
                    "group relative flex flex-col",
                    !isLast
                      ? "border-b border-[var(--color-border-strong)] sm:border-b-0 sm:border-r"
                      : "",
                  ].join(" ")}
                >
                  {/* Full-card overlay link — behind interactive elements */}
                  <Link
                    href={`/shop/${p.slug}`}
                    aria-label={`View ${p.name}`}
                    tabIndex={-1}
                    className="absolute inset-0 z-0 focus-visible:outline-none"
                  />

                  {/* Image zone — pointer-events-none so clicks fall through to overlay link */}
                  <div className="relative bg-white pointer-events-none" style={{ height: "clamp(180px, 35vw, 420px)" }}>
                    {/* Badge — top left */}
                    {p.badge && (
                      <div className="absolute left-3 top-3 z-10 sm:left-5 sm:top-5">
                        <span className="inline-flex items-center rounded-full border border-black/20 bg-white/75 px-2 py-[3px] font-heading text-[8px] font-bold uppercase tracking-widest text-[var(--color-ink)] sm:px-3 sm:py-[5px] sm:text-[10px]">
                          {p.badge.label}
                        </span>
                      </div>
                    )}

                    {/* Product image */}
                    <div className="absolute inset-0 flex items-center justify-center px-6 pb-4 pt-10 sm:px-14 sm:pb-8 sm:pt-16">
                      <div className="relative h-full w-full">
                        <Image
                          src={getImageUrl(p.images[0])}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 80vw, 30vw"
                          className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          style={{ mixBlendMode: "multiply" }}
                          priority={i === 0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info zone — pointer-events-none so clicks fall through to the overlay link */}
                  <div className="relative z-10 flex flex-1 flex-col gap-2 border-t border-[var(--color-border-strong)] bg-white p-3 sm:gap-3 sm:p-6 pointer-events-none">
                    {/* Name */}
                    <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors duration-150 group-hover:text-[var(--color-primary)]">
                      {p.name}
                    </p>

                    {/* Rating + review count */}
                    {p.rating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill={i < Math.round(p.rating) ? "var(--color-star)" : "var(--color-border-strong)"}
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="font-heading text-[10px] font-bold tabular-nums text-[var(--color-ink)]">
                          {p.rating.toFixed(1)}
                        </span>
                        {p.totalReviews > 0 && (
                          <span className="font-body text-[10px] text-[var(--color-text-muted)]">
                            ({p.totalReviews.toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 tabular-nums">
                      {discount > 0 && (
                        <span className="font-body text-sm text-[var(--color-text-muted)] line-through">
                          ₹{formatINR(p.originalMinPrice)}
                        </span>
                      )}
                      <span className="font-heading text-xl font-bold text-[var(--color-primary)]">
                        ₹{formatINR(p.minPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="font-body text-xs font-semibold text-[var(--color-error)]">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-2 pointer-events-auto">
                      <AddToCartBtn
                        variantId={p.defaultVariantId ?? ""}
                        disabled={!p.defaultVariantId}
                        className="rounded-full bg-[var(--color-ink)] font-heading text-xs font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] focus-visible:ring-[var(--color-ink)]"
                      />
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
