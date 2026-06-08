import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "FAQ — Urbanvana Aeroponic Tower Help",
  description:
    "Answers to the most common questions about Urbanvana aeroponic towers — setup, nutrients, plants, delivery, returns, and troubleshooting.",
  path: "/support/faq",
})

const FAQS = [
  {
    question: "How quickly will I get my first harvest?",
    answer: "Most leafy greens and herbs are ready to harvest 21–25 days after planting, assuming seeds germinate in 3–5 days and are transferred to the tower at the seedling stage. Cherry tomatoes typically take 6–8 weeks from transplant to first fruit.",
  },
  {
    question: "Do I need any experience to use the Urbanvana tower?",
    answer: "No prior gardening or hydroponic experience is needed. The tower ships fully assembled, and our step-by-step setup guide walks you through everything — from mixing nutrients to planting your first seeds. Most customers are up and running within an hour of unboxing.",
  },
  {
    question: "What plants can I grow in the tower?",
    answer: "Leafy greens (lettuce, spinach, arugula), Indian herbs (coriander, methi, palak, tulsi, curry leaves), culinary herbs (basil, mint, chives), cherry tomatoes, strawberries, chillies, and microgreens all perform excellently. Root vegetables like carrots and potatoes are not suitable for aeroponic towers.",
  },
  {
    question: "How much electricity does the tower use?",
    answer: "The Urbanvana tower pump draws approximately 10–20W and runs on a cycle timer (typically 5 minutes on, 15 minutes off), so actual power consumption is under 5W on average. Monthly electricity cost is negligible — less than ₹30–50 at average Indian electricity rates.",
  },
  {
    question: "How often do I need to change the nutrient solution?",
    answer: "We recommend a full reservoir change every 2–3 weeks. Between changes, top up with fresh pH-adjusted water as the level drops (plants drink water faster than they absorb nutrients, so plain water is the right top-up). Check pH every 2–3 days.",
  },
  {
    question: "Can the tower be used outdoors in India?",
    answer: "Yes, on a balcony or terrace. Position it to receive 6–8 hours of indirect or morning/evening sunlight. In peak summer (April–June), avoid direct midday sun which can overheat the reservoir. During monsoon, protect the reservoir from heavy rain diluting your nutrient solution.",
  },
  {
    question: "What if my plants aren't growing well?",
    answer: "The most common causes are pH out of range (check first — target 5.5–6.5), insufficient light, or pump not running consistently. If leaves are yellowing, it's usually a nutrient or pH issue. If growth is slow despite green leaves, check light levels and ensure the pump timer is working correctly.",
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship to all major cities and most pin codes across India. Delivery typically takes 3–7 business days depending on your location. Free shipping is available on orders over ₹999.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unused, undamaged products in original packaging. For products with manufacturing defects, we offer replacement or full refund within 30 days of delivery. Contact us at our support page or email to initiate a return.",
  },
  {
    question: "Are the nutrients and seeds non-GMO?",
    answer: "Yes. All Urbanvana seeds are non-GMO and untreated. Our nutrients are food-grade formulations — the same quality used by commercial vertical farms. All products are safe for growing food that you and your family will eat.",
  },
]

export default function FAQPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Support", href: "/support" },
        { name: "FAQ", href: "/support/faq" },
      ]} />
      <FaqJsonLd items={FAQS} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Support", href: "/support" },
          { name: "Help & FAQ", href: "/support/faq" },
        ]}
        eyebrow="Help Centre"
        title="Frequently Asked Questions"
        intro="Everything you need to know about Urbanvana towers, growing, delivery, and returns — answered clearly."
        cta={{ label: "Contact Support", href: "/contact" }}
      >
        <div className="space-y-8">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-[var(--color-border-strong)] pb-8 last:border-0">
              <h2 className="mb-3 font-heading text-lg font-bold text-[var(--color-ink)]">
                {faq.question}
              </h2>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </ContentPageLayout>
    </>
  )
}
