import { Package, Sprout, Salad } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

/* ── HowItWorks ──────────────────────────────────────────────────────────
   brandtheme: bg #002304 (ink) — dark section for visual rhythm contrast.
   3 steps: numbered + icon + heading + body. Connected by dashed rule on md+.
   Server Component.
───────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    icon: Package,
    number: "01",
    heading: "Set Up Your Tower",
    body: "Unbox, fill the reservoir, and plug in. Your aeroponic tower assembles in under 30 minutes — no tools, no soil, no expertise needed.",
  },
  {
    icon: Sprout,
    number: "02",
    heading: "Plant Your Seedlings",
    body: "Drop our pre-germinated seedlings into the grow ports. Add nutrient solution to the water. The tower does the rest — misting roots every few minutes.",
  },
  {
    icon: Salad,
    number: "03",
    heading: "Harvest Fresh, Daily",
    body: "In 2–3 weeks you'll have your first harvest. Cut-and-come-again herbs and greens grow continuously. Fresh produce, every single day.",
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How Urbanvana works — 3 simple steps"
      className="bg-[var(--color-ink)] py-20 md:py-28"
    >
      <Container>
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Simple by design
          </p>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            From Box to Harvest in 3 Steps
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-white/60">
            We engineered Urbanvana to require zero gardening knowledge.
            If you can plug in a phone charger, you can grow your own food.
          </p>
        </div>

        {/* Steps */}
        <ol
          role="list"
          className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
          aria-label="3 steps to grow with Urbanvana"
        >
          {/* Dashed connecting line — decorative, hidden from a11y */}
          <div
            aria-hidden="true"
            className="absolute top-10 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-white/20 md:block"
          />

          {STEPS.map(({ icon: Icon, number, heading, body }) => (
            <li key={number} className="flex flex-col items-center text-center">
              {/* Icon ring */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                {/* Step number badge */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] font-body text-[10px] font-bold text-white"
                >
                  {number}
                </span>
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[var(--color-primary)]"
                />
              </div>

              <h3 className="font-heading text-lg font-semibold text-white">
                {heading}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-white/60">
                {body}
              </p>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link href="/shop/towers">
            <Button variant="primary" size="lg">
              Get Your Tower Today
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}

export { HowItWorks }
