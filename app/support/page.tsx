'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, HelpCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Container } from '@/components/layout/container';

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
];

const CATEGORIES = [
  'General',
  'Ordering & Shipping',
  'Product & Setup',
  'Warranty & Returns',
];

export default function SupportPage() {
  const [form, setForm] = useState({
    email: '',
    category: 'General',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Support User', // Required by backend schema
          email: form.email,
          iss: form.category,
          subject: form.subject,
          message: form.message,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit ticket');
      setSent(true);
      toast.success('Ticket submitted successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (question: string) => {
    setOpenFaq(openFaq === question ? null : question);
  };

  return (
    <div className="bg-[var(--color-bg)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-heading text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">
              Help & Support
            </h1>
            <p className="mt-4 font-body text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
              Find answers or get in touch with our team.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* FAQs */}
            <div className="space-y-10">
              {FAQS.map((section) => (
                <div key={section.category}>
                  <h2 className="mb-4 font-heading text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[var(--color-primary)]" />
                    {section.category}
                  </h2>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleFaq(item.question)}
                          className="flex w-full items-center justify-between p-4 text-left focus:outline-none focus:bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                        >
                          <span className="font-body font-semibold text-[var(--color-ink)]">
                            {item.question}
                          </span>
                          {openFaq === item.question ? (
                            <ChevronUp className="h-5 w-5 text-[var(--color-text-muted)]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[var(--color-text-muted)]" />
                          )}
                        </button>
                        {openFaq === item.question && (
                          <div className="px-4 pb-4 font-body text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 bg-[var(--color-bg-subtle)]/50">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:pl-8">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    Still need help?
                  </h2>
                  <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
                    Can't find what you're looking for? Submit a ticket and our support team will get back to you.
                  </p>
                </div>

                {sent ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-light)]/40 p-8 text-center shadow-[var(--shadow-sm)]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                      <ArrowRight className="h-8 w-8 text-[var(--color-primary)] rotate-[-45deg]" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                      Ticket Submitted!
                    </h3>
                    <p className="font-body text-sm text-[var(--color-text-muted)]">
                      We've received your request and will contact you at <strong>{form.email}</strong> shortly.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ email: '', category: 'General', subject: '', message: '' }) }}
                      className="mt-4 rounded-xl border border-[var(--color-border-strong)] px-6 py-2.5 text-sm font-medium hover:bg-white transition-colors shadow-sm"
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[var(--color-border-strong)] bg-white p-6 sm:p-8 shadow-[var(--shadow-sm)] space-y-5"
                  >
                    <FormField label="Email *">
                      <input
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        required
                        placeholder="you@example.com"
                        className="input-base"
                      />
                    </FormField>

                    <FormField label="Category">
                      <select
                        value={form.category}
                        onChange={set('category')}
                        className="input-base bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Subject *">
                      <input
                        value={form.subject}
                        onChange={set('subject')}
                        required
                        placeholder="Brief summary of your issue"
                        className="input-base"
                      />
                    </FormField>

                    <FormField label="Message *">
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        required
                        rows={6}
                        placeholder="Please provide details about your issue..."
                        className="input-base resize-none"
                      />
                    </FormField>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60 transition-colors shadow-sm mt-2"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}
