import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Tag } from "lucide-react"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { Container } from "@/components/layout/container"
import { BLOG_ARTICLES } from "@/content/blog"

export const metadata: Metadata = pageMetadata({
  title: "Aeroponic Growing Blog — Tips, Guides & Science",
  description:
    "Articles on aeroponic growing, hydroponic nutrients, crop guides, and urban farming in India. Learn how to grow fresher food faster at home.",
  path: "/learn/blog",
})

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "Blog", href: "/learn/blog" },
      ]} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#002304] py-16 md:py-24">
        <Container>
          <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#059669]">
            Learning Centre
          </p>
          <h1
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Growing Blog
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60">
            Guides, science, and practical advice for aeroponic growing in Indian homes.
          </p>
        </Container>
      </section>

      {/* ── Article grid ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg)] py-16 md:py-24">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-[var(--color-border-strong)] bg-white p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                    {article.category}
                  </span>
                </div>

                <h2 className="mb-3 font-heading text-base font-bold leading-snug text-[var(--color-ink)] group-hover:text-[#059669] transition-colors duration-300">
                  {article.title}
                </h2>

                <p className="mb-6 flex-1 font-body text-sm leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-body text-xs text-[var(--color-text-muted)]">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {article.readingTime} read
                  </span>
                  <span className="flex items-center gap-1 font-heading text-[10px] font-bold uppercase tracking-widest text-[#059669] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Read
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
