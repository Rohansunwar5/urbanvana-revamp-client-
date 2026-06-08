import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "Aeroponic Growing Tips — Expert Advice for Indian Home Growers",
  description:
    "Expert growing tips for your Urbanvana aeroponic tower. Learn pruning, harvesting, pest prevention, seasonal growing in India, and how to maximise yield from every port.",
  path: "/learn/growing-tips",
})

export default function GrowingTipsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "Growing Tips", href: "/learn/growing-tips" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
          { name: "Growing Tips", href: "/learn/growing-tips" },
        ]}
        eyebrow="Expert Advice"
        title="Growing Tips"
        intro="These are the tips that separate growers who harvest 500g per week from those who harvest 50g. Most of it comes down to consistency, observation, and not overcomplicating things."
        cta={{ label: "Shop Seeds & Plants", href: "/shop/seeds" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Harvesting: Cut-and-Come-Again
            </h2>
            <p className="mb-4">
              The most important technique for leafy greens is cut-and-come-again harvesting. Instead of pulling the whole plant, use clean scissors to cut outer leaves while leaving the inner growth point (the crown) intact. The plant will continue growing and producing new leaves for weeks or months.
            </p>
            <p>
              For lettuce and spinach: cut the outer 30–40% of leaves at a time. For herbs like coriander and basil: cut stems just above a leaf node, and the plant will branch and become bushier. Never cut more than half the plant at once — it needs leaves to photosynthesise and continue growing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Best Plants for Indian Climate
            </h2>
            <p className="mb-4">
              India's climate varies enormously by region and season, but aeroponic towers give you a controlled environment that reduces weather dependence. Here's what works year-round for most Indian households:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Year-round:</strong> Mint, tulsi, lettuce (with shade cloth in summer), methi, palak</li>
              <li><strong className="text-[var(--color-ink)]">Winter (Oct–Feb):</strong> Coriander, spinach, lettuce, peas, cherry tomatoes — your best growing season</li>
              <li><strong className="text-[var(--color-ink)]">Summer (Mar–Jun):</strong> Basil, chillies, curry leaves — heat-tolerant crops; avoid bolting-prone greens</li>
              <li><strong className="text-[var(--color-ink)]">Monsoon (Jul–Sep):</strong> Tower thrives indoors; outdoors requires protection from heavy rain splashing into reservoir</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Preventing Algae Growth
            </h2>
            <p className="mb-4">
              Algae is the most common problem in aeroponic systems. It's caused by light reaching the nutrient solution. Algae competes with plants for nutrients and can clog pump filters.
            </p>
            <p>
              Prevention is simple: keep the reservoir covered at all times and wrap any clear tubing with black tape or foil. If algae appears, do a full reservoir clean — empty, rinse with a dilute hydrogen peroxide solution (3%), dry, and refill. Avoid using bleach, which can damage pump seals.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Pest Management
            </h2>
            <p className="mb-4">
              Indoor tower growing is naturally lower risk for pests than soil gardening. The most common visitors are fungus gnats (attracted to damp growing media) and spider mites (in hot, dry conditions).
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Fungus gnats:</strong> Let the surface of net pots dry between misting cycles. Yellow sticky traps near the tower catch adults.</li>
              <li><strong className="text-[var(--color-ink)]">Spider mites:</strong> Increase humidity around the tower; spray leaves with a dilute neem oil solution (5ml per litre) every 5–7 days.</li>
              <li><strong className="text-[var(--color-ink)]">General prevention:</strong> Good air circulation is the best pest deterrent — a small fan near the tower reduces humidity and strengthens stems.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Maximising Yield Per Port
            </h2>
            <p className="mb-4">
              Every port on the tower is a yield opportunity. Here's how to make the most of each one:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Space taller plants (tomatoes, chillies) at the top of the tower where light is best.</li>
              <li>Place compact, shade-tolerant plants (mint, spinach) in lower ports.</li>
              <li>Rotate crops — after a full lettuce harvest, swap in a quick-maturing radish or microgreen crop before replanting lettuce.</li>
              <li>Keep a germination tray going at all times so new seedlings are always ready when you harvest a port.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Consistency Is Everything
            </h2>
            <p>
              The single biggest predictor of tower success is consistency. Check your tower daily — it takes 2 minutes. Top up the reservoir when it drops. Keep pH in range. Harvest regularly so plants keep producing. Growers who treat the tower as a set-and-forget system get mediocre results. Growers who check daily and harvest every 2–3 days get extraordinary results.
            </p>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
