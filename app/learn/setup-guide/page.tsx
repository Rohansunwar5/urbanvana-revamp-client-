import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "Urbanvana Tower Setup Guide — Step by Step",
  description:
    "Step-by-step setup guide for your Urbanvana aeroponic tower. From unboxing to first harvest in under 30 minutes. Includes water, nutrients, pH, and planting instructions.",
  path: "/learn/setup-guide",
})

export default function SetupGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "Setup Guide", href: "/learn/setup-guide" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
          { name: "Setup Guide", href: "/learn/setup-guide" },
        ]}
        eyebrow="Getting Started"
        title="Tower Setup Guide"
        intro="Your Urbanvana tower ships fully assembled. First setup takes under 30 minutes. Follow this guide and you'll have seeds planted and the pump running before you finish your morning chai."
        cta={{ label: "Shop Seeds & Plants", href: "/shop/seeds" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              What's in the Box
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Urbanvana tower body (pre-assembled)</li>
              <li>Reservoir base with lid</li>
              <li>Submersible pump + timer</li>
              <li>Growing ports (net pots included)</li>
              <li>Starter pack of Urbanvana nutrients (grow formula)</li>
              <li>pH test kit + pH adjustment solution</li>
              <li>Seedling starter plugs (rockwool or coco coir)</li>
              <li>Quick-start card</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 1 — Choose Your Location
            </h2>
            <p className="mb-4">
              Your tower needs 6–8 hours of light per day. A south or west-facing balcony works best in India. If growing indoors, position the tower within 30cm of a grow light (not included — standard LED grow lights available online work well).
            </p>
            <p>
              Keep the tower away from direct high-noon sun in peak Indian summer (April–June) — this can overheat the reservoir. Morning or evening sun is ideal. The tower should sit on a flat, stable surface that can handle a full reservoir (approximately 15–20 kg when full).
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 2 — Mix Your Nutrient Solution
            </h2>
            <p className="mb-4">
              Fill the reservoir with clean water — filtered or RO water is ideal. Most Indian tap water works but check pH first (see Step 3). Add Urbanvana Grow nutrients at the recommended dosage on the bottle (typically 5ml Part A + 5ml Part B per litre of water for seedlings).
            </p>
            <p>
              Stir gently. The solution should be a light amber colour. Do not increase the dosage beyond recommendations — more nutrients do not mean faster growth and can damage roots.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 3 — Check and Adjust pH
            </h2>
            <p className="mb-4">
              pH is critical. Aeroponic plants absorb nutrients best between pH 5.5 and 6.5. Use the included test kit to check your solution. Most Indian municipal water is slightly alkaline (pH 7–8), so you'll typically need to add a small amount of pH Down solution.
            </p>
            <p>
              Add pH Down drop by drop, stir, and re-test. It's easy to overshoot — go slowly. Once you're in the 5.8–6.2 range, you're ready to go. Check pH every 3–4 days and after top-ups.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 4 — Germinate Your Seeds
            </h2>
            <p className="mb-4">
              Place seeds in the starter plugs — one seed per plug for large seeds (lettuce, tomato), 2–3 seeds for small seeds (herbs). Soak plugs in plain water for 5 minutes before use.
            </p>
            <p>
              Keep plugs moist and in a warm, dark location for 2–5 days until seeds sprout. A kitchen cupboard or any dark warm spot works. Once sprouts appear and are 1–2cm tall, they're ready to go into the tower.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 5 — Plant in the Tower
            </h2>
            <p>
              Insert each sprouted plug into a net pot and place the net pot in a growing port on the tower. Make sure the plug sits securely with roots pointing downward into the tower cavity. Fill all ports you want to use — it's fine to leave some empty if you're starting small.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Step 6 — Start the Pump
            </h2>
            <p className="mb-4">
              Submerge the pump in the reservoir and connect to the timer. Set the timer to run for 5 minutes every 15 minutes — this is the default schedule that works for most plants and India's climate. Plug in and confirm water is flowing through the tower and returning to the reservoir.
            </p>
            <p>
              That's it. Your tower is running. Check it daily for the first week to ensure roots are getting misted and the reservoir level is maintained (top up with plain pH-adjusted water when it drops below half).
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Expected Timeline
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Days 1–5:</strong> Germination in starter plugs</li>
              <li><strong className="text-[var(--color-ink)]">Days 5–7:</strong> Plant into tower, roots begin to establish</li>
              <li><strong className="text-[var(--color-ink)]">Days 7–14:</strong> Rapid vegetative growth, leaves visible and expanding daily</li>
              <li><strong className="text-[var(--color-ink)]">Days 18–25:</strong> First harvest (lettuce, spinach, herbs)</li>
              <li><strong className="text-[var(--color-ink)]">Ongoing:</strong> Cut-and-come-again harvesting — plants regrow after each cut</li>
            </ul>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
