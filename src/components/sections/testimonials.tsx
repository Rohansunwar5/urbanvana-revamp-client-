import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Star } from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── Testimonials — compact portrait video-card row ─────────────────────
   Header: centered above the row.
   Cards: narrow portrait (175px), 6+ visible on desktop, horizontal scroll.
   Each card is image-dominant (product photo) with compact quote below.
   Server Component.
───────────────────────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    id:           "priya",
    name:         "Priya M.",
    location:     "Bangalore",
    rating:       5,
    productName:  "Tower Pro 30",
    productHref:  "/shop/aeroponic-tower-pro-30",
    productImage: "/mock1.png",
    quote:        "Set up in 20 mins. Fresh basil & spinach in 3 weeks.",
  },
  {
    id:           "arjun",
    name:         "Arjun S.",
    location:     "Mumbai",
    rating:       5,
    productName:  "Starter Bundle",
    productHref:  "/shop/bundles",
    productImage: "/mock2.png",
    quote:        "30 plants on a kitchen counter. Foolproof nutrients.",
  },
  {
    id:           "deepa",
    name:         "Deepa K.",
    location:     "Chennai",
    rating:       5,
    productName:  "Herb Starter Kit",
    productHref:  "/shop/herb-seed-starter-kit",
    productImage: "/mock3.png",
    quote:        "Kids eat veg they used to refuse — they grew it themselves!",
  },
  {
    id:           "rahul",
    name:         "Rahul V.",
    location:     "Delhi",
    rating:       5,
    productName:  "Grow Pack",
    productHref:  "/shop/nutrients",
    productImage: "/mock4.png",
    quote:        "Every ingredient checked. Clean formula. Consistent growth.",
  },
  {
    id:           "sneha",
    name:         "Sneha P.",
    location:     "Pune",
    rating:       5,
    productName:  "Tower Pro 30",
    productHref:  "/shop/aeroponic-tower-pro-30",
    productImage: "/mock1.png",
    quote:        "Quiet, compact, and beautiful. Fresh greens every morning.",
  },
  {
    id:           "meera",
    name:         "Meera N.",
    location:     "Hyderabad",
    rating:       5,
    productName:  "Grow Pack",
    productHref:  "/shop/nutrients",
    productImage: "/mock4.png",
    quote:        "Non-toxic and certified. I recommend this to all my clients.",
  },
  {
    id:           "kavya",
    name:         "Kavya R.",
    location:     "Kochi",
    rating:       5,
    productName:  "Herb Starter Kit",
    productHref:  "/shop/herb-seed-starter-kit",
    productImage: "/mock3.png",
    quote:        "First harvest in under a month. Couldn't believe how easy it was.",
  },
  {
    id:           "nikhil",
    name:         "Nikhil T.",
    location:     "Ahmedabad",
    rating:       5,
    productName:  "Starter Bundle",
    productHref:  "/shop/bundles",
    productImage: "/mock2.png",
    quote:        "The bundle has everything. Zero separate purchases needed.",
  },
]

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-px" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          strokeWidth={0}
          aria-hidden="true"
          className={i < rating ? "fill-[var(--color-star)]" : "fill-[var(--color-ink)]/15"}
        />
      ))}
    </div>
  )
}

function ReviewCard({ name, location, rating, productName, productHref, productImage, quote }: (typeof REVIEWS)[number]) {
  return (
    <article className="flex w-[175px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[var(--color-ink)]/10 bg-white">
      {/* Image zone — portrait, product on soft green bg */}
      <Link
        href={productHref}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block h-[215px] shrink-0 bg-[#EDF7F1]"
      >
        <Image
          src={productImage}
          alt={productName}
          fill
          sizes="175px"
          className="object-contain p-4"
          style={{ mixBlendMode: "multiply" }}
          loading="lazy"
        />
        {/* Bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a03]/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <span className="font-heading text-[9px] font-bold uppercase tracking-widest text-white/90 leading-tight">
            {productName}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-1 font-heading text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
            Shop <ArrowUpRight size={8} strokeWidth={2.5} />
          </span>
        </div>
      </Link>

      {/* Text zone — compact */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <MiniStars rating={rating} />
        <p className="font-body text-[12px] leading-[1.55] text-[var(--color-text-primary)] line-clamp-3">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="mt-auto pt-1 border-t border-[var(--color-ink)]/8">
          <p className="font-heading text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink)]">
            {name}
          </p>
          <p className="font-body text-[10px] text-[var(--color-text-muted)]">{location}</p>
        </div>
      </div>
    </article>
  )
}

function Testimonials() {
  return (
    <section aria-label="Customer testimonials" className="overflow-hidden bg-[#F2F4F2] py-16 md:py-24">

      {/* ── Centered header ── */}
      <Container>
        <div className="mb-10 text-center md:mb-12">
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Real growers, real results
          </p>
          <h2
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Loved by 12,000+ growers.
          </h2>

          {/* Aggregate */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} strokeWidth={0} className="fill-[var(--color-star)]" aria-hidden="true" />
              ))}
            </div>
            <span className="font-heading text-sm font-bold text-[var(--color-ink)]">4.9</span>
            <span className="font-body text-xs text-[var(--color-text-muted)]">/ 5 · 3,284 verified reviews</span>
          </div>
        </div>
      </Container>

      {/* ── Card row — bleeds past container, scroll-snap ── */}
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
        role="list"
        aria-label="Customer reviews"
      >
        {REVIEWS.map((review) => (
          <div key={review.id} role="listitem" style={{ scrollSnapAlign: "start" }}>
            <ReviewCard {...review} />
          </div>
        ))}

        {/* "Read all" terminal card */}
        <div
          role="listitem"
          style={{ scrollSnapAlign: "start" }}
          className="flex w-[175px] shrink-0 flex-col items-center justify-center gap-4 rounded-[12px] border border-[var(--color-ink)]/10 bg-white p-6 text-center"
        >
          <div className="flex flex-col items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} strokeWidth={0} className="fill-[var(--color-star)]" aria-hidden="true" />
            ))}
          </div>
          <p className="font-body text-xs leading-snug text-[var(--color-text-muted)]">
            3,284 verified reviews
          </p>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ink)] px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
          >
            Read all
            <ArrowUpRight size={10} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Swipe hint — mobile only */}
      <p className="mt-2 px-4 font-body text-[11px] text-[var(--color-text-muted)] sm:hidden">
        Swipe to see more →
      </p>

    </section>
  )
}

export { Testimonials }
