'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence, useInView } from 'motion/react'
import {
  Loader2, HelpCircle, ArrowRight, ChevronDown,
  MessageCircle, Mail, Phone, Search, Sparkles, Send,
} from 'lucide-react'
import { Container } from '@/components/layout/container'

const FAQS = [
  {
    category: 'Ordering & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Orders typically ship within 2–3 business days. Delivery takes 4–7 business days depending on your location. Metro cities usually receive orders faster.',
      },
      {
        question: 'Is shipping free?',
        answer: 'Yes, shipping is free on orders above ₹1,999 within India. Orders below this threshold incur a small shipping fee based on your zone.',
      },
      {
        question: 'Do you ship outside India?',
        answer: 'Currently we ship within India only. International shipping is planned for a future release.',
      },
    ],
  },
  {
    category: 'Product & Setup',
    items: [
      {
        question: 'How long does assembly take?',
        answer: 'Most towers can be assembled in 20–30 minutes using the included quick-start guide. No tools required.',
      },
      {
        question: 'Do I need special water?',
        answer: 'Regular tap water works. If your water is very hard, we recommend a basic TDS check. Our nutrient guide includes water preparation tips.',
      },
      {
        question: 'Can I use the tower indoors?',
        answer: 'Yes! All towers work indoors near a sunny window. The CityTower XL 60 has an optional full-spectrum LED light kit for year-round indoor growing.',
      },
    ],
  },
  {
    category: 'Warranty & Returns',
    items: [
      {
        question: 'What does the warranty cover?',
        answer: 'Urbanvana towers include a limited warranty: 2 years on tower structure and 6 months on electronics (pump, timer). See our Warranty Policy for full details.',
      },
      {
        question: 'What is your return policy?',
        answer: 'Returns are accepted within 15 days for unused items in original condition. Defective or damaged items are eligible for replacement or refund per our policy.',
      },
      {
        question: 'How do I request a return?',
        answer: "Contact our support team via the form below or email. We'll provide an RMA number and return instructions within 1 business day.",
      },
    ],
  },
  {
    category: 'Plants & Growing',
    items: [
      {
        question: 'What can I grow?',
        answer: 'Lettuces, herbs (basil, mint, cilantro), leafy greens (kale, spinach), strawberries, and small vegetables like chillies and cherry tomatoes.',
      },
      {
        question: 'How long until first harvest?',
        answer: 'Leafy greens: 3–4 weeks. Herbs: 4–6 weeks. Fruiting plants: 8–12 weeks. You\'ll see sprouts within 5–7 days.',
      },
      {
        question: 'Do I need to change the water?',
        answer: 'We recommend changing the reservoir water every 2 weeks and cleaning the pump monthly. The nutrient solution should be refreshed with each water change.',
      },
    ],
  },
]

const CATEGORIES = [
  'All',
  'Ordering & Shipping',
  'Product & Setup',
  'Warranty & Returns',
  'Plants & Growing',
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
  const isInView = useInView(ref, { once: true, margin: '-60px' })

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

export default function SupportPage() {
  const [form, setForm] = useState({
    email: '',
    category: 'General',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Support User',
          email: form.email,
          iss: form.category,
          subject: form.subject,
          message: form.message,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to submit ticket')
      setSent(true)
      toast.success('Ticket submitted successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  const toggleFaq = (question: string) => {
    setOpenFaq(openFaq === question ? null : question)
  }

  const filteredFaqs = FAQS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        (activeCategory === 'All' || section.category === activeCategory) &&
        (searchQuery === '' ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter((section) => section.items.length > 0)

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[60dvh] flex items-center bg-[#002304]">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

        <Container className="relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-sm">
                <MessageCircle className="w-3.5 h-3.5 text-[#059669]" />
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  We&apos;re here to help
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]"
            >
              Help &{' '}
              <span className="text-[#059669]">
                Support
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-body text-lg text-white/60 max-w-xl mx-auto"
            >
              Find answers in our FAQ or reach out directly — we&apos;ll get back to you within 24 hours.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-lg mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-4 font-body text-sm text-white placeholder:text-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/50 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </Container>

      </section>

      {/* ── Main Content ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[var(--color-bg)]">
        <Container>
          <div className="grid gap-16 lg:grid-cols-5">
            {/* FAQ Column */}
            <div className="lg:col-span-3">
              <FadeIn>
                <h2 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-[var(--color-ink)] mb-2">
                  Frequently asked questions
                </h2>
                <p className="font-body text-[var(--color-text-muted)] mb-8">
                  Everything you need to know about Urbanvana.
                </p>
              </FadeIn>

              {/* Category tabs */}
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative rounded-full px-4 py-2 font-heading text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                        activeCategory === cat
                          ? 'bg-[#059669] text-white shadow-[0_4px_16px_rgba(5,150,105,0.3)]'
                          : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[#059669]/50 hover:text-[#059669]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </FadeIn>

              {/* FAQ Accordion */}
              <div className="space-y-8">
                {filteredFaqs.map((section, si) => (
                  <FadeIn key={section.category} delay={si * 0.08}>
                    <div>
                      <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.15em] text-[#059669] flex items-center gap-2">
                        <span className="h-px flex-1 bg-[var(--color-border)]" />
                        {section.category}
                        <span className="h-px flex-1 bg-[var(--color-border)]" />
                      </h3>
                      <div className="space-y-3">
                        {section.items.map((item, ii) => {
                          const isOpen = openFaq === item.question
                          return (
                            <motion.div
                              key={item.question}
                              layout
                              className={`rounded-2xl border transition-all duration-300 ${
                                isOpen
                                  ? 'border-[#059669]/30 bg-white shadow-[var(--shadow-md)]'
                                  : 'border-[var(--color-border)] bg-white hover:shadow-[var(--shadow-sm)]'
                              }`}
                            >
                              <button
                                onClick={() => toggleFaq(item.question)}
                                className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none"
                              >
                                <span className={`font-body font-semibold transition-colors duration-200 ${
                                  isOpen ? 'text-[#059669]' : 'text-[var(--color-ink)]'
                                }`}>
                                  {item.question}
                                </span>
                                <motion.div
                                  animate={{ rotate: isOpen ? 180 : 0 }}
                                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                                    isOpen ? 'bg-[#059669] text-white' : 'bg-[var(--color-primary-light)] text-[#059669]'
                                  }`}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </motion.div>
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-5 pt-0 border-t border-[var(--color-border)]">
                                      <div className="mt-4 font-body text-sm text-[var(--color-text-muted)] leading-relaxed">
                                        {item.answer}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </FadeIn>
                ))}

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-16">
                    <HelpCircle className="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-4" />
                    <p className="font-body text-[var(--color-text-muted)]">
                      No results found. Try a different search or contact us directly.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2 lg:pl-8">
              <FadeIn delay={0.2}>
                <div className="sticky top-28">
                  {/* Quick contact cards */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <a
                      href="mailto:urbanvana.co@gmail.com"
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5 text-center transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)] group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-5 h-5 text-[#059669]" />
                      </div>
                      <span className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                        Email
                      </span>
                    </a>
                    <a
                      href="tel:+919712779666"
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5 text-center transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)] group-hover:scale-110 transition-transform duration-300">
                        <Phone className="w-5 h-5 text-[#059669]" />
                      </div>
                      <span className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                        Call
                      </span>
                    </a>
                  </div>

                  {/* Form card */}
                  <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-8 shadow-[var(--shadow-sm)]">
                      <div className="mb-6">
                        <h3 className="font-heading text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-[#059669]" />
                          Still need help?
                        </h3>
                        <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
                          Can&apos;t find what you&apos;re looking for? We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>

                      {sent ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-4 py-8 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#059669]/10"
                          >
                            <Send className="w-8 h-8 text-[#059669] rotate-[-12deg]" />
                          </motion.div>
                          <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                            Ticket Submitted!
                          </h3>
                          <p className="font-body text-sm text-[var(--color-text-muted)] max-w-xs">
                            We&apos;ve received your request and will contact you at{' '}
                            <strong className="text-[var(--color-ink)]">{form.email}</strong> shortly.
                          </p>
                          <button
                            onClick={() => {
                              setSent(false)
                              setForm({ email: '', category: 'General', subject: '', message: '' })
                            }}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-strong)] px-6 py-3 font-heading text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)] transition-all"
                          >
                            Submit Another Ticket
                          </button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              Email <span className="text-[#059669]">*</span>
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={set('email')}
                              required
                              placeholder="you@example.com"
                              className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              Category
                            </label>
                            <select
                              value={form.category}
                              onChange={set('category')}
                              className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 font-body text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
                            >
                              {['General', 'Ordering & Shipping', 'Product & Setup', 'Warranty & Returns', 'Plants & Growing'].map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              Subject <span className="text-[#059669]">*</span>
                            </label>
                            <input
                              value={form.subject}
                              onChange={set('subject')}
                              required
                              placeholder="Brief summary of your issue"
                              className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              Message <span className="text-[#059669]">*</span>
                            </label>
                            <textarea
                              value={form.message}
                              onChange={set('message')}
                              required
                              rows={5}
                              placeholder="Please provide details about your issue..."
                              className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-4 py-3 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full overflow-hidden rounded-xl bg-[#059669] py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#005528] disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Submit Ticket
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
