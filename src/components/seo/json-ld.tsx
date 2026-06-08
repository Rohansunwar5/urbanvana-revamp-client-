import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site"

/* ── Generic renderer ──────────────────────────────────────────────────── */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/* ── Organization + WebSite (homepage) ─────────────────────────────────── */
export function OrganizationJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: CONTACT_PHONE,
          email: CONTACT_EMAIL,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: "English",
        },
        sameAs: [
          "https://www.instagram.com/urbanvana.co",
          "https://www.linkedin.com/company/urbanvana.co",
          "https://facebook.com/urbanvana",
          "https://youtube.com/@urbanvana",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }
  return <JsonLd data={org} />
}

/* ── BreadcrumbList ─────────────────────────────────────────────────────── */
interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }
  return <JsonLd data={data} />
}

/* ── FAQPage ────────────────────────────────────────────────────────────── */
interface FaqItem {
  question: string
  answer: string
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
  return <JsonLd data={data} />
}

/* ── Article ────────────────────────────────────────────────────────────── */
export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/hero-section.png`,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
  }
  return <JsonLd data={data} />
}
