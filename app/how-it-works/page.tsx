import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "How Aeroponics Works — Urbanvana Tower System",
  description:
    "Learn how Urbanvana aeroponic towers grow plants 3× faster without soil. Discover the science of mist-based growing and why it produces fresher, healthier food at home.",
  path: "/how-it-works",
})

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "How It Works", href: "/how-it-works" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "How It Works", href: "/how-it-works" },
        ]}
        eyebrow="The Science"
        title="How It Works"
        intro="Aeroponics is the most efficient plant-growing method ever developed. Here's the science behind why Urbanvana towers produce harvests 3× faster than soil — and why that matters for what you eat every day."
        cta={{ label: "Shop Towers", href: "/shop/towers" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              What is Aeroponics?
            </h2>
            <p className="mb-4">
              Aeroponics a method of growing plants where roots are suspended in air inside a sealed chamber, and a fine nutrient-rich mist is sprayed onto them at regular intervals. Unlike hydroponics where roots sit in water or soil growing, aeroponic roots are always surrounded by oxygen-rich air. This constant oxygenation triggers faster nutrient absorption and dramatically accelerates plant growth.
            </p>
            <p>
              NASA pioneered aeroponic research in the 1990s to develop space-efficient food production for long-duration missions. The results were extraordinary: plants grew up to 70% faster than in soil with 95% less water. Today, Urbanvana has adapted this technology into a practical home system that anyone in India can use on a balcony, terrace, or kitchen counter.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              The Urbanvana Tower: How It Works
            </h2>
            <p className="mb-4">
              The Urbanvana City Tower uses a vertical growing system with individual growing ports arranged in a spiral pattern around a central tower. Here's the cycle:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li><strong className="text-[var(--color-ink)]">Nutrient solution is mixed</strong> in the reservoir at the base — water, Urbanvana grow nutrients, and a pH buffer.</li>
              <li><strong className="text-[var(--color-ink)]">The pump activates</strong> every few minutes, pushing the solution up through the central column to the top of the tower.</li>
              <li><strong className="text-[var(--color-ink)]">Mist nozzles spray roots</strong> with a fine, oxygen-rich droplet that coats every root hair with nutrients and water.</li>
              <li><strong className="text-[var(--color-ink)]">Excess solution drains</strong> back down into the reservoir — zero waste, completely recirculating.</li>
              <li><strong className="text-[var(--color-ink)]">Plants absorb nutrients instantly</strong> — because there's no soil barrier, roots take up what they need immediately and redirect energy to leaf and stem growth.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Why Faster than Soil?
            </h2>
            <p className="mb-4">
              In soil, plants spend a significant portion of their energy growing roots outward to find nutrients and water. In the Urbanvana tower, nutrients and water are delivered directly to the root zone every few minutes. Plants redirect that root-searching energy entirely into above-ground growth — leaves, stems, and produce.
            </p>
            <p>
              The result: lettuce that takes 60 days in soil is typically ready in 21 days in the tower. Herbs that take 6–8 weeks can be harvested in 3–4 weeks. You're not growing faster with chemicals or shortcuts — you're removing the constraint that slows conventional growing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Water Usage: 95% Less than Soil
            </h2>
            <p>
              The Urbanvana tower recirculates every drop of water. Unlike watering a pot or garden bed — where most water runs off or evaporates — the tower's closed system means almost nothing is lost. A single City Tower 40 uses approximately 5–8 litres of water per week for 40 plants. An equivalent soil garden would require 40–60 litres for the same number of plants. In a water-scarce country like India, this is more than a convenience — it's responsible growing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              What Can You Grow?
            </h2>
            <p className="mb-4">
              The Urbanvana tower grows best with leafy greens, herbs, and compact fruiting plants. Our most popular crops for Indian households include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Salad greens: lettuce, spinach, arugula, bok choy</li>
              <li>Indian herbs: coriander (dhaniya), methi, palak, tulsi, curry leaves</li>
              <li>Culinary herbs: basil, mint, chives, parsley</li>
              <li>Compact fruiting plants: cherry tomatoes, strawberries, chillies</li>
              <li>Microgreens: sunflower, radish, pea shoots, mustard</li>
            </ul>
            <p className="mt-4">
              Root vegetables like carrots or potatoes are not suitable for aeroponic towers — the tower is optimised for plants that grow upward, not downward.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Is the Produce Safe to Eat?
            </h2>
            <p>
              Yes — and it's typically cleaner than what you buy in a market. Aeroponically grown produce has no soil contact, which eliminates most soil-borne pathogens. There are no pesticides because the closed indoor environment keeps pests away. The nutrient solution is food-grade and washed from the roots with clean water as you harvest. The result is produce with a longer shelf life, better texture, and higher nutritional density than field-grown equivalents.
            </p>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
