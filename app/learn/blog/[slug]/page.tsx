import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Clock, ArrowLeft, Tag } from "lucide-react"
import { pageMetadata } from "@/lib/seo"
import { BreadcrumbJsonLd, ArticleJsonLd, FaqJsonLd } from "@/components/seo/json-ld"
import { Container } from "@/components/layout/container"
import { BLOG_ARTICLES } from "@/content/blog"

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (!article) return {}
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/learn/blog/${article.slug}`,
  })
}

function renderBody(body: string) {
  const paragraphs = body.split("\n\n")
  return paragraphs.map((para, i) => {
    if (para.startsWith("**") && para.endsWith("**") && para.split("\n").length === 1) {
      return (
        <h2 key={i} className="mt-10 mb-4 font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
          {para.replace(/\*\*/g, "")}
        </h2>
      )
    }
    if (para.startsWith("- ") || para.startsWith("* ")) {
      const items = para.split("\n").filter((l) => l.startsWith("- ") || l.startsWith("* "))
      return (
        <ul key={i} className="my-4 list-disc list-inside space-y-2 ml-2">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[var(--color-ink)]'>$1</strong>") }} />
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="my-4 font-body text-base leading-relaxed text-[var(--color-text-muted)]"
        dangerouslySetInnerHTML={{ __html: para.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[var(--color-ink)]'>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>") }}
      />
    )
  })
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  const related = BLOG_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", href: "/" },
        { name: "Learn", href: "/learn" },
        { name: "Blog", href: "/learn/blog" },
        { name: article.title, href: `/learn/blog/${article.slug}` },
      ]} />
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={`/learn/blog/${article.slug}`}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
      />
      {article.faq && <FaqJsonLd items={article.faq} />}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#002304] py-16 md:py-20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5">
            {[
              { name: "Home", href: "/" },
              { name: "Learn", href: "/learn" },
              { name: "Blog", href: "/learn/blog" },
            ].map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={10} strokeWidth={1.5} className="text-white/30" aria-hidden="true" />}
                <Link href={crumb.href} className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors">
                  {crumb.name}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-white/60">
              <Tag className="w-2.5 h-2.5" aria-hidden="true" />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-white/40">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {article.readingTime} read
            </span>
            <span className="font-body text-xs text-white/40">
              {new Date(article.datePublished).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1
            className="font-heading font-black leading-tight tracking-tight text-white max-w-3xl"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            {article.title}
          </h1>

          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60">
            {article.description}
          </p>
        </Container>
      </section>

      {/* ── Article body ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg)] py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <article className="prose-content">
              {renderBody(article.body)}
            </article>

            {/* Back link */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border-strong)]">
              <Link
                href="/learn/blog"
                className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[#059669] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Blog
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Related articles ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-[var(--color-border-strong)] bg-white py-16">
          <Container>
            <p className="mb-8 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              More from the Blog
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/learn/blog/${a.slug}`}
                  className="group rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] p-5 transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                >
                  <p className="mb-2 font-heading text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {a.category}
                  </p>
                  <h3 className="font-heading text-sm font-bold leading-snug text-[var(--color-ink)] group-hover:text-[#059669] transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 font-body text-xs text-[var(--color-text-muted)]">
                    {a.readingTime} read
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
