import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ContentPageLayout } from "@/components/layout/content-page-layout"

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Delivery Information — Urbanvana",
  description:
    "Urbanvana shipping policy: delivery timelines, free shipping threshold, packaging, returns, and what to do if your order arrives damaged.",
  path: "/support/shipping",
})

export default function ShippingPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Support", href: "/support" },
        { name: "Shipping Info", href: "/support/shipping" },
      ]} />
      <ContentPageLayout
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Support", href: "/support" },
          { name: "Shipping Info", href: "/support/shipping" },
        ]}
        eyebrow="Delivery"
        title="Shipping & Delivery"
        intro="We ship across India. Here's everything you need to know about delivery timelines, packaging, and what happens if something goes wrong."
        cta={{ label: "Contact Support", href: "/contact" }}
      >
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Delivery Timelines
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Metro cities</strong> (Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune): 2–4 business days</li>
              <li><strong className="text-[var(--color-ink)]">Tier-2 cities:</strong> 4–6 business days</li>
              <li><strong className="text-[var(--color-ink)]">Other pin codes:</strong> 5–8 business days</li>
            </ul>
            <p className="mt-4">
              Orders placed before 12:00 PM IST on a business day are typically dispatched the same day. Orders placed after 12:00 PM or on weekends are dispatched the next business day. You will receive a tracking link via email and WhatsApp once your order is dispatched.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Shipping Charges
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Orders over ₹999:</strong> Free shipping</li>
              <li><strong className="text-[var(--color-ink)]">Orders under ₹999:</strong> Flat ₹99 shipping charge</li>
            </ul>
            <p className="mt-4">
              All towers and starter bundles exceed the ₹999 threshold and ship free. Seeds, nutrients, and accessories ordered individually may attract the ₹99 shipping charge — add them to a tower or bundle order to avoid this.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Packaging
            </h2>
            <p>
              Towers ship in custom-designed double-walled corrugated boxes with internal foam inserts that protect every component during transit. Seeds and nutrient products are sealed in moisture-proof packaging. We aim for minimal, recyclable packaging materials across all orders.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Damaged or Missing Items
            </h2>
            <p className="mb-4">
              If your order arrives damaged or with missing components, please contact us within 48 hours of delivery. Take photos or a short video of the damaged packaging and products — this helps us process your replacement quickly.
            </p>
            <p>
              We will either dispatch a replacement for the affected components or issue a full refund, depending on availability and your preference. Contact us via the support page, email, or WhatsApp with your order number and photos.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Returns & Refunds
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[var(--color-ink)]">Unused products:</strong> 7-day return window from delivery date. Products must be in original packaging, undamaged, and unused.</li>
              <li><strong className="text-[var(--color-ink)]">Manufacturing defects:</strong> 30-day replacement or refund from delivery date.</li>
              <li><strong className="text-[var(--color-ink)]">Seeds and nutrients:</strong> Non-returnable once opened, due to hygiene and safety regulations.</li>
              <li><strong className="text-[var(--color-ink)]">Refund processing:</strong> 5–7 business days after we receive the returned product. Refunds are issued to the original payment method.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
              Need Help?
            </h2>
            <p>
              For any shipping or delivery queries, contact us at <strong className="text-[var(--color-ink)]">+91 97127 79666</strong> (WhatsApp preferred) or email us. Include your order number in all communications for fastest resolution.
            </p>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}
