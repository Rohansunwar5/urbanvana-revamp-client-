'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
  BookOpen, Leaf, Droplets, Sprout, ExternalLink,
  ArrowRight, Sparkles, GraduationCap, Clock, Users,
} from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { Container } from '@/components/layout/container'

const LEARNING_TOPICS = [
  {
    title: 'How Aeroponics Works',
    description: 'Discover the science behind growing plants with mist and air instead of soil.',
    icon: Leaf,
    href: '/learn/how-aeroponics-works',
  },
  {
    title: 'Setup Guide',
    description: 'Step-by-step instructions to assemble and start your Urbanvana tower.',
    icon: BookOpen,
    href: '/learn/setup-guide',
  },
  {
    title: 'Nutrient Guide',
    description: 'Learn how to balance pH, TDS, and mix the perfect nutrient solution.',
    icon: Droplets,
    href: '/learn/nutrients',
  },
  {
    title: 'Growing Tips',
    description: 'Expert advice on planting, pruning, and harvesting your fresh produce.',
    icon: Sprout,
    href: '/learn/growing-tips',
  },
]

const STATS = [
  { icon: BookOpen, value: '12+', label: 'Guides' },
  { icon: Clock, value: '5 min', label: 'Average read' },
  { icon: Users, value: '12K+', label: 'Growers learning' },
  { icon: GraduationCap, value: '100%', label: 'Free resources' },
]

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LearnPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-[80dvh] flex items-center bg-[#002304]">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

        <Container className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Free Learning Resources
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl leading-[0.95]"
            >
              Master&nbsp;
              <span className="text-[#059669]">Soil-Free</span>
              <br />
              Growing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-body text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              From your first setup to harvest mastery — explore guides, manuals, and
              expert tips to grow fresh food at home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://docs.google.com/document/d/1gdnnk70u0nAD6HyeFnQjX0XQvktqXiDzYHZCDJDFago/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#059669] px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#005528] hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                View Learning Manual
                <ExternalLink className="w-4 h-4 opacity-70 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                Shop Towers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Stats Strip ──────────────────────────────────── */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border)]">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-2 bg-white py-10 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
                    <stat.icon className="w-5 h-5 text-[#059669]" />
                  </div>
                  <p className="font-heading text-3xl font-black text-[var(--color-ink)] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="font-body text-sm text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Topics Grid ───────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[var(--color-bg)]">
        <Container>
          <FadeIn>
            <div className="mb-16 text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 mb-6 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                <GraduationCap className="w-3.5 h-3.5 text-[#059669]" />
                Curriculum
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-[var(--color-ink)]">
                Everything you need
              </h2>
              <p className="mt-4 font-body text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
                Carefully curated guides to take you from zero to hero grower.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2">
            {LEARNING_TOPICS.map((topic, i) => (
              <FadeIn key={topic.title} delay={i * 0.12}>
                <Link href={topic.href} className="group block">
                  <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 transition-all duration-500 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1">
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)] group-hover:scale-110 transition-transform duration-300">
                      <topic.icon className="w-7 h-7 text-[#059669]" />
                    </div>

                    <h3 className="mb-3 font-heading text-2xl font-bold text-[var(--color-ink)] group-hover:text-[#059669] transition-colors duration-300">
                      {topic.title}
                    </h3>
                    <p className="font-body text-[var(--color-text-muted)] leading-relaxed">
                      {topic.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.15em] text-[#059669] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      Start Learning
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#002304]">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.05]">
                Ready to start{' '}
                <span className="text-[#059669]">growing</span>
                ?
              </h2>
              <p className="mt-6 font-body text-lg text-white/60 max-w-xl mx-auto">
                Join 12,000+ Indian growers. No soil, no garden — just fresh food every day.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shop/towers"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-[#002304] transition-all duration-300 hover:scale-105"
                >
                  Browse Towers
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:text-white"
                >
                  Get Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  )
}
