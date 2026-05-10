'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Mail, Phone, MapPin } from 'lucide-react'
import { Container } from '@/components/layout/container'

const ISSUE_TYPES = [
  'General Inquiry',
  'Order Support',
  'Product Question',
  'Shipping & Delivery',
  'Returns & Refunds',
  'Feedback',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    isdCode: '+91',
    phoneNumber: '',
    iss: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

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
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to send message')
      setSent(true)
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--color-bg)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl font-black tracking-tight text-[var(--color-ink)] md:text-4xl">
              Get in Touch
            </h1>
            <p className="mt-3 font-body text-base text-[var(--color-text-muted)] max-w-md mx-auto">
              Have a question or need help? Fill in the form and our team will respond within 24 hours.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Info sidebar */}
            <div className="flex flex-col gap-6">
              <InfoCard
                icon={Mail}
                title="Email"
                lines={['support@urbanvana.in']}
              />
              <InfoCard
                icon={Phone}
                title="Phone"
                lines={['+91 98765 43210', 'Mon–Sat, 9 am – 6 pm']}
              />
              <InfoCard
                icon={MapPin}
                title="Address"
                lines={['Urbanvana HQ', 'Bengaluru, Karnataka', 'India']}
              />
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-light)]/40 px-8 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                    <Mail className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <p className="font-heading text-lg font-bold text-[var(--color-ink)]">
                    Message received!
                  </p>
                  <p className="font-body text-sm text-[var(--color-text-muted)]">
                    We&apos;ll get back to you at <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ fullName: '', email: '', isdCode: '+91', phoneNumber: '', iss: '', subject: '', message: '' }) }}
                    className="mt-2 rounded-xl border border-[var(--color-border-strong)] px-5 py-2 text-sm font-medium hover:bg-white transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-[var(--color-border-strong)] bg-white p-7 shadow-[var(--shadow-sm)] space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Full Name *">
                      <input value={form.fullName} onChange={set('fullName')} required placeholder="Jane Doe" className="input-base" />
                    </FormField>
                    <FormField label="Email *">
                      <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" className="input-base" />
                    </FormField>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <FormField label="ISD Code">
                      <input value={form.isdCode} onChange={set('isdCode')} placeholder="+91" className="input-base" />
                    </FormField>
                    <FormField label="Phone" className="sm:col-span-2">
                      <input value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="10-digit number" className="input-base" />
                    </FormField>
                  </div>

                  <FormField label="Inquiry Type *">
                    <select value={form.iss} onChange={set('iss')} required className="input-base bg-white">
                      <option value="" disabled>Select a topic…</option>
                      {ISSUE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Subject *">
                    <input value={form.subject} onChange={set('subject')} required placeholder="Brief description of your query" className="input-base" />
                  </FormField>

                  <FormField label="Message *">
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      required
                      rows={5}
                      placeholder="Tell us more…"
                      className="input-base resize-none"
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 font-heading text-sm font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60 transition-colors"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: React.ElementType
  title: string
  lines: string[]
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[var(--color-border-strong)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
        <Icon className="h-5 w-5 text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] mb-1">{title}</p>
        {lines.map((l) => (
          <p key={l} className="font-body text-sm text-[var(--color-text-muted)]">{l}</p>
        ))}
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}
