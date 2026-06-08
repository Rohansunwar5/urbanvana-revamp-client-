import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "Nutrient Guide for Aeroponic Towers — pH, TDS & Mixing",
  description:
    "Complete nutrient guide for aeroponic growing. Learn how to mix nutrients, manage pH (5.5–6.5), check TDS/EC, and diagnose deficiencies in your Urbanvana tower.",
  path: "/learn/nutrient-guide",
})

export default function NutrientGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "Nutrient Guide", href: "/learn/nutrient-guide" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
          { name: "Nutrient Guide", href: "/learn/nutrient-guide" },
        ]}
        eyebrow="Plant Nutrition"
        title="Nutrient Guide"
        intro="In aeroponics, your nutrient solution is everything your plant eats and drinks. Getting it right means faster growth, better flavour, and healthier plants. Getting it wrong is the most common reason towers underperform."
        cta={{ label: "Shop Nutrients", href: "/shop/nutrients" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              The Big Three: NPK
            </h2>
            <p className="mb-4">
              Every plant nutrient product lists an NPK ratio — Nitrogen (N), Phosphorus (P), and Potassium (K). These are the three macronutrients that plants need in the largest quantities.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Nitrogen (N)</strong> drives leaf and stem growth. High-N formulas are used during the vegetative stage.</li>
              <li><strong className="text-[var(--color-ink)]">Phosphorus (P)</strong> supports root development and flowering. Higher P is used when plants transition to bloom.</li>
              <li><strong className="text-[var(--color-ink)]">Potassium (K)</strong> improves disease resistance, water regulation, and overall plant health.</li>
            </ul>
            <p className="mt-4">
              For leafy greens and herbs — the most popular crops in an Urbanvana tower — you'll typically stay on a high-N grow formula for the entire lifecycle. Fruiting plants like tomatoes and chillies need a bloom formula once they start flowering.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              pH: The Most Important Variable
            </h2>
            <p className="mb-4">
              pH controls which nutrients your plant can absorb. Even if your solution contains the perfect nutrient mix, if pH is outside the ideal range, plants can't access them — a condition called nutrient lockout.
            </p>
            <p className="mb-4">
              <strong className="text-[var(--color-ink)]">Target range: pH 5.5–6.5</strong> (ideal: 5.8–6.2). Below 5.5, some nutrients become toxic. Above 6.5, iron, manganese, and zinc become unavailable.
            </p>
            <p>
              Check pH every 2–3 days. Most Indian tap water runs pH 7–8, so you'll almost always need pH Down. Add it slowly — a small amount goes a long way. After topping up the reservoir with plain water, always re-check pH as it will drift upward.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              TDS / EC: Measuring Nutrient Strength
            </h2>
            <p className="mb-4">
              TDS (Total Dissolved Solids, measured in ppm) or EC (Electrical Conductivity, measured in mS/cm) tells you how concentrated your nutrient solution is. A cheap TDS meter (₹200–500 online) is one of the most useful tools a tower grower can own.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Seedlings:</strong> 400–600 ppm</li>
              <li><strong className="text-[var(--color-ink)]">Vegetative growth:</strong> 800–1200 ppm</li>
              <li><strong className="text-[var(--color-ink)]">Fruiting/flowering:</strong> 1200–1600 ppm</li>
            </ul>
            <p className="mt-4">
              If TDS is too high (over-concentrated), dilute with pH-adjusted water. If too low, add more nutrients. Change the reservoir completely every 2–3 weeks to prevent salt buildup.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Common Deficiency Signs
            </h2>
            <ul className="list-disc list-inside space-y-3 ml-2">
              <li><strong className="text-[var(--color-ink)]">Yellowing lower leaves:</strong> Nitrogen deficiency — increase nutrient concentration or switch to a higher-N formula.</li>
              <li><strong className="text-[var(--color-ink)]">Purple stems or leaf undersides:</strong> Phosphorus deficiency or cold stress — check temperature and pH.</li>
              <li><strong className="text-[var(--color-ink)]">Yellow leaves with green veins:</strong> Iron deficiency due to high pH — bring pH down to 5.8–6.0.</li>
              <li><strong className="text-[var(--color-ink)]">Brown leaf tips:</strong> Nutrient burn from too-high concentration — dilute the solution.</li>
              <li><strong className="text-[var(--color-ink)]">Slow growth despite nutrients:</strong> Check pH first. Nutrient lockout at wrong pH is the most common cause of slow growth in aeroponics.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Maintenance Schedule
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Daily:</strong> Check reservoir level, top up with pH-adjusted water if low</li>
              <li><strong className="text-[var(--color-ink)]">Every 2–3 days:</strong> Check and adjust pH</li>
              <li><strong className="text-[var(--color-ink)]">Weekly:</strong> Check TDS/EC, adjust nutrient concentration if needed</li>
              <li><strong className="text-[var(--color-ink)]">Every 2–3 weeks:</strong> Full reservoir change — empty, rinse, and refill with fresh nutrient solution</li>
              <li><strong className="text-[var(--color-ink)]">Monthly:</strong> Clean pump filter and check nozzles for blockages</li>
            </ul>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
