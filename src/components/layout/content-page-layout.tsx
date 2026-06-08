import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { Container } from "./container"

interface Breadcrumb {
  name: string
  href: string
}

interface ContentPageLayoutProps {
  breadcrumbs: Breadcrumb[]
  eyebrow?: string
  title: string
  intro?: string
  children: React.ReactNode
  cta?: { label: string; href: string }
}

export function ContentPageLayout({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  children,
  cta,
}: ContentPageLayoutProps) {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#002304] py-16 md:py-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight size={10} strokeWidth={1.5} className="text-white/30" aria-hidden="true" />
                )}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {crumb.name}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {eyebrow && (
            <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#059669]">
              {eyebrow}
            </p>
          )}

          <h1
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            {title}
          </h1>

          {intro && (
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60">
              {intro}
            </p>
          )}
        </Container>
      </section>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="prose-content font-body text-[var(--color-text-muted)] leading-relaxed">
              {children}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      {cta && (
        <section className="border-t border-[var(--color-border-strong)] bg-white py-12">
          <Container>
            <div className="flex items-center justify-between gap-6">
              <p className="font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Ready to start growing?
              </p>
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#059669] px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#005528] hover:scale-105"
              >
                {cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Container>
        </section>
      )}
    </div>
  )
}
