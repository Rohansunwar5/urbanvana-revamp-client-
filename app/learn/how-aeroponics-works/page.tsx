import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "How Aeroponics Works — Complete Guide",
  description:
    "A complete guide to aeroponic growing: the science of mist-based nutrients, root oxygenation, and why aeroponics grows food 3× faster than soil with 95% less water.",
  path: "/learn/how-aeroponics-works",
})

export default function HowAeroponicsWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "How Aeroponics Works", href: "/learn/how-aeroponics-works" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
          { name: "How Aeroponics Works", href: "/learn/how-aeroponics-works" },
        ]}
        eyebrow="Growing Science"
        title="How Aeroponics Works"
        intro="Aeroponics is the most water-efficient plant-growing method ever developed. Understanding the science helps you grow better — and appreciate why your Urbanvana tower produces such clean, fast results."
        cta={{ label: "Shop Towers", href: "/shop/towers" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Soil vs. Hydroponics vs. Aeroponics
            </h2>
            <p className="mb-4">
              In <strong className="text-[var(--color-ink)]">soil growing</strong>, plants extract nutrients dissolved in soil water. The process is slow — roots must physically grow toward nutrient sources, and soil microbes must break down organic matter before plants can absorb it.
            </p>
            <p className="mb-4">
              In <strong className="text-[var(--color-ink)]">hydroponics</strong>, roots sit in a nutrient solution. This removes the soil barrier and speeds growth. But waterlogged roots still have limited oxygen, which restricts the rate of nutrient uptake.
            </p>
            <p>
              In <strong className="text-[var(--color-ink)]">aeroponics</strong>, roots hang in air and are misted with a fine nutrient spray every few minutes. Roots are always surrounded by oxygen — the same oxygen-rich environment that makes breathing efficient for animals. This is the key difference: aeroponic roots absorb nutrients at their maximum biological rate, with nothing slowing them down.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              The Misting Cycle
            </h2>
            <p className="mb-4">
              The Urbanvana tower's pump activates on a timer — typically 3–5 minutes on, 10–15 minutes off. During the active phase, nutrient solution is pumped from the reservoir at the base up through the central column. At the top, it flows down over the roots hanging inside the sealed tower body.
            </p>
            <p>
              This short-cycle approach does two things: it gives roots a constant supply of nutrients, and it ensures roots dry out slightly between cycles — enough to maximise oxygen exposure without stressing the plant. The balance is what makes aeroponics so effective.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Root Oxygenation: The Growth Accelerator
            </h2>
            <p>
              Oxygen is required by root cells to metabolise nutrients through aerobic respiration. When roots are waterlogged — as in poorly draining soil or some hydroponic systems — oxygen is depleted and nutrient uptake slows. Aeroponic roots, hanging in air between mist cycles, maintain near-100% oxygen saturation. This allows continuous, uninhibited nutrient absorption — which directly translates to faster cell division and growth above ground.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Water Efficiency
            </h2>
            <p>
              Because the nutrient solution recirculates in a closed loop, almost no water is lost to evaporation or runoff. The City Tower 40 uses approximately 5–8 litres per week for 40 plants. An equivalent soil container garden requires 40–60 litres for the same number of plants. For urban Indian households where balcony space and water supply are both limited, this efficiency is transformative.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Why Results Are Faster
            </h2>
            <p>
              Plants allocate energy between root growth (searching for nutrients) and shoot growth (leaves, stems, fruit). In aeroponics, nutrients come to the root — so plants redirect almost all their energy into shoot growth. Lettuce that takes 60 days in soil is ready in 21 days. Herbs that take 6 weeks take 3–4 weeks. You're not adding hormones or tricks — you're removing the single biggest constraint on plant growth.
            </p>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
