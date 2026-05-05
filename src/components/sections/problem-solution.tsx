"use client"

import { Compare } from "@/components/ui/compare"
import { ArrowRight, X, Check } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/layout/container"

/* ── ProblemSolution — drag-to-compare before/after ─────────────────────
   Large Compare slider (spoiled.png vs fresh.png) as the visual centrepiece.
   Labels pinned inside the image zones. Comparison rows beneath.
   "use client" required because Compare is a client component.
───────────────────────────────────────────────────────────────────────── */

const COMPARISONS = [
  {
    problem: "Soil mess, pests & watering schedules",
    solution: "Zero soil — clean aeroponic mist",
  },
  {
    problem: "Needs garden space or a balcony",
    solution: "Vertical tower fits any counter",
  },
  {
    problem: "Seasonal gaps — no winter produce",
    solution: "Year-round growth under smart LED",
  },
  {
    problem: "Unknown chemicals in store greens",
    solution: "100% chemical-free, harvested fresh",
  },
  {
    problem: "High water waste in soil planters",
    solution: "90% less water than soil growing",
  },
]

function ProblemSolution() {
  return (
    <section
      id="problem-solution"
      aria-label="Before and after — traditional vs Urbanvana"
      className="bg-[var(--color-bg-subtle)] py-20 md:py-28"
    >
      <Container>

        {/* ── Header ── */}
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            The difference is clear
          </p>
          <h2
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
          >
            Before &amp; after.<br />No contest.
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
            Drag the slider to see exactly what Urbanvana does versus
            chemical-treated store produce.
          </p>
        </div>

        {/* ── Compare slider ── */}
        <div className="mx-auto max-w-[1020px]">
          <div className="relative overflow-hidden rounded-[22px] shadow-[var(--shadow-xl)]">

            {/* Zone label — left (Traditional) */}
            <div className="pointer-events-none absolute left-4 top-4 z-50">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm">
                <X size={10} strokeWidth={3} aria-hidden="true" />
                Traditional
              </span>
            </div>

            {/* Zone label — right (Urbanvana) */}
            <div className="pointer-events-none absolute right-4 top-4 z-50">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                <Check size={10} strokeWidth={3} aria-hidden="true" />
                Urbanvana
              </span>
            </div>

            <Compare
              firstImage="/spoiled.png"
              secondImage="/fresh.png"
              firstImageClassName="object-cover object-center"
              secondImageClassname="object-cover object-center"
              className="h-[340px] w-full md:h-[520px]"
              slideMode="drag"
              showHandlebar={true}
              initialSliderPercentage={50}
            />
          </div>

          {/* Drag hint */}
          <p className="mt-3 text-center font-body text-[11px] text-[var(--color-text-muted)]">
            ← Drag the handle to compare →
          </p>
        </div>

        {/* ── Comparison rows ── */}
        <div className="mx-auto mt-14 max-w-[1020px]">
          <div className="overflow-hidden rounded-[16px] border border-[var(--color-ink)]/8 bg-white">
            {COMPARISONS.map((item, i) => (
              <div
                key={i}
                className={[
                  "grid grid-cols-[1fr_1px_1fr] items-stretch",
                  i < COMPARISONS.length - 1
                    ? "border-b border-[var(--color-ink)]/8"
                    : "",
                ].join(" ")}
              >
                {/* Problem */}
                <div className="flex items-center gap-3 px-5 py-4 md:px-6">
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50"
                  >
                    <X size={10} strokeWidth={2.5} className="text-[var(--color-error)]" />
                  </span>
                  <span className="font-body text-[13px] leading-snug text-[var(--color-text-muted)]">
                    {item.problem}
                  </span>
                </div>

                {/* Divider */}
                <div className="bg-[var(--color-ink)]/8" aria-hidden="true" />

                {/* Solution */}
                <div className="flex items-center gap-3 px-5 py-4 md:px-6">
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]"
                  >
                    <Check size={10} strokeWidth={2.5} className="text-[var(--color-primary)]" />
                  </span>
                  <span className="font-body text-[13px] font-medium leading-snug text-[var(--color-text-primary)]">
                    {item.solution}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/shop/towers"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--color-ink)] px-8 py-4 font-heading text-xs font-bold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-[var(--color-primary-dark)]"
            >
              Explore Our Towers
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

      </Container>
    </section>
  )
}

export { ProblemSolution }
