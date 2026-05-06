import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, Droplets, ShieldCheck, Zap } from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── HeroSection — Biologica-faithful layout ─────────────────────────────
   Structure (desktop):
     BG image fills full section, dark overlay on top.
     Left ~55%:  huge Inter Black headline  →  sub-value-prop  →  body copy
                 →  trust badges (icon above label, 4 in a row)  →  CTA.
     Right 45%:  image bleeds through overlay naturally.
   The whole content block is vertically centred (items-center).
   Everything fits inside h-dvh — no overflow, no split justify-between.
───────────────────────────────────────────────────────────────────────── */

const TRUST_BADGES = [
  { icon: Leaf, label: "Zero\nSoil" },
  { icon: Droplets, label: "90% Less\nWater" },
  { icon: ShieldCheck, label: "Non-Toxic\nCertified" },
  { icon: Zap, label: "30-Min\nSetup" },
]

function HeroSection() {
  return (
    <section
      aria-label="Hero — Grow fresh food at home"
      className="relative h-dvh min-h-[580px] overflow-hidden bg-[var(--color-ink)]"
    >
      {/* ── Full-bleed background image ── */}
      <Image
        src="/hero-section.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* ── Dark gradient overlay — heavy left, fades right so image shows ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,35,4,0.96) 0%, rgba(0,35,4,0.82) 38%, rgba(0,35,4,0.35) 65%, rgba(0,35,4,0.10) 100%)",
        }}
      />

      {/* ── Content: starts at top of section, CTA pinned to bottom ── */}
      <Container className="relative z-10 flex h-full items-start pt-24 md:pt-28">
        <div className="flex h-full w-full flex-col lg:w-[54%]">

          {/* All content stacked top-to-bottom, no spacer */}
          <div className="flex flex-col gap-5">

            {/* Eyebrow */}
            {/* <p className="font-body text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Aeroponic Home Growing · Ships Across India
            </p> */}

            {/* Mega headline — inline color to beat inherited body color */}
            <h1
              className="font-heading font-black uppercase leading-[1.0] tracking-[-0.025em]"
              style={{ fontSize: "clamp(3rem, 6.5vw, 5.2rem)", color: "#ffffff" }}
            >
              Grow Fresh<br />
              Food at Home.<br />
              Every Day.
            </h1>

            {/* Body */}
            <p className="max-w-[420px] font-body text-[15px] leading-relaxed lg:text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
              You don&apos;t need a garden or experience. Our aeroponic tower grows
              herbs, greens &amp; vegetables indoors zero soil, 90% less water,
              year-round harvests.
            </p>

            {/* Trust badges — icon above label */}
            <div className="flex items-start gap-8" aria-label="Product highlights">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" style={{ color: "rgba(255,255,255,0.5)" }} />
                  <span className="whitespace-pre-line font-body text-[11px] font-medium leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA — immediately below trust badges */}
            <div className="pt-2">
              <Link
                href="/shop/towers"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-[15px] font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)]"
              >
                Shop Towers
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>

          </div>

        </div>
      </Container>
    </section>
  )
}

export { HeroSection }
