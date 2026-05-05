"use client"

import * as React from "react"
import { Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"

/* ── NewsletterBand ──────────────────────────────────────────────────────
   brandtheme: bg primary (#059669) — bold CTA band.
   Single email field (low friction). Inline submit.
   Success: field replaced by confirmation message.
   Client Component — form state only.
───────────────────────────────────────────────────────────────────────── */

function NewsletterBand() {
  const [email, setEmail]       = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading]   = React.useState(false)
  const [error, setError]       = React.useState("")
  const inputId = React.useId()
  const errorId = React.useId()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      /* Stub — wire to Mailchimp / Resend in Step 8 */
      await new Promise((r) => setTimeout(r, 700))
      setSubmitted(true)
      toast.success("You're in! Welcome to the Urbanvana community.")
    } catch {
      setError("Something went wrong. Please try again.")
      toast.error("Subscription failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-label="Subscribe to Urbanvana newsletter"
      className="bg-[var(--color-primary)] py-20 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-white/70">
            Join the community
          </p>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Get Growing Tips, Deals & Recipes
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-white/80">
            Join 10,000+ home growers who get our weekly growing tips, exclusive
            discounts, and fresh recipes straight to their inbox.
          </p>

          {submitted ? (
            /* Success state */
            <div
              role="status"
              aria-live="polite"
              className="mt-10 flex flex-col items-center gap-3"
            >
              <CheckCircle size={40} strokeWidth={1.5} className="text-white" aria-hidden="true" />
              <p className="font-heading text-xl font-semibold text-white">
                You&apos;re subscribed!
              </p>
              <p className="font-body text-sm text-white/80">
                Check your inbox for a welcome gift.
              </p>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-10"
              aria-label="Email newsletter signup"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                {/* Email input */}
                <div className="relative flex-1">
                  <label htmlFor={inputId} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={inputId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    aria-describedby={error ? errorId : undefined}
                    aria-invalid={!!error}
                    disabled={loading}
                    className={cn(
                      "h-14 w-full rounded-[10px] border-0 bg-white px-5",
                      "font-body text-base text-[var(--color-text-primary)]",
                      "placeholder:text-[var(--color-text-muted)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                      "disabled:opacity-60",
                      "sm:rounded-r-none sm:rounded-l-[10px]",
                      error && "ring-2 ring-red-300"
                    )}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "flex h-14 items-center justify-center gap-2 px-7",
                    "rounded-[10px] bg-[var(--color-primary-dark)] text-white",
                    "font-body text-sm font-semibold",
                    "hover:bg-[var(--color-ink)] transition-colors duration-[150ms]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    "cursor-pointer",
                    "sm:rounded-l-none sm:rounded-r-[10px]"
                  )}
                  aria-label={loading ? "Subscribing…" : "Subscribe to newsletter"}
                >
                  <Send size={16} strokeWidth={1.5} aria-hidden="true" />
                  <span>{loading ? "Subscribing…" : "Subscribe"}</span>
                </button>
              </div>

              {/* Error */}
              {error && (
                <p
                  id={errorId}
                  role="alert"
                  aria-live="polite"
                  className="mt-3 font-body text-sm font-medium text-white"
                >
                  {error}
                </p>
              )}

              <p className="mt-4 font-body text-xs text-white/60">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}

export { NewsletterBand }
