"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Check, CreditCard, Smartphone, Banknote, Loader2, ShoppingCart } from "lucide-react"
import { Container } from "@/components/layout/container"
import { useCart } from "@/lib/cart-context"

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function Field({
  label,
  id,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label} {required && <span className="text-[var(--color-error)]" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className="h-12 w-full rounded-[8px] border border-[var(--color-border-strong)] bg-white px-4 font-body text-sm text-[var(--color-ink)] outline-none transition-colors duration-150 placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        {...props}
      />
    </div>
  )
}

/* ── Payment method option ───────────────────────────────────────────── */

type PaymentMethod = "upi" | "card" | "cod"

function PaymentOption({
  id,
  label,
  sublabel,
  icon: Icon,
  selected,
  onSelect,
}: {
  id: PaymentMethod
  label: string
  sublabel: string
  icon: React.ElementType
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-4 rounded-[10px] border px-4 py-3.5 text-left transition-all duration-150",
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]/40 ring-1 ring-[var(--color-primary)]"
          : "border-[var(--color-border-strong)] bg-white hover:border-[var(--color-ink)]/30",
      ].join(" ")}
    >
      <div className={[
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]",
        selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]",
      ].join(" ")}>
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-heading text-sm font-bold text-[var(--color-ink)]">{label}</p>
        <p className="font-body text-xs text-[var(--color-text-muted)]">{sublabel}</p>
      </div>
      <div className={[
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
        selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border-strong)]",
      ].join(" ")}>
        {selected && <Check size={10} strokeWidth={3} className="text-white" aria-hidden="true" />}
      </div>
    </button>
  )
}

/* ── Order summary sidebar ───────────────────────────────────────────── */

function OrderSummary() {
  const { items, subtotal } = useCart()
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Order Summary
      </h2>

      {/* Item list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-border-strong)] bg-white">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="56px"
                className="object-contain p-1.5"
                style={{ mixBlendMode: "multiply" }}
              />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-ink)] font-body text-[10px] font-bold text-white">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[10px] font-bold uppercase leading-snug tracking-widest text-[var(--color-ink)] line-clamp-2">
                {item.name}
              </p>
            </div>
            <span className="font-heading text-sm font-bold tabular-nums text-[var(--color-ink)]">
              ₹{formatINR(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[var(--color-border-strong)]" />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-body text-sm">
          <span className="text-[var(--color-text-muted)]">Subtotal</span>
          <span className="tabular-nums text-[var(--color-ink)]">₹{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between font-body text-sm">
          <span className="text-[var(--color-text-muted)]">Shipping</span>
          <span className={shipping === 0 ? "font-medium text-[var(--color-primary)]" : "tabular-nums text-[var(--color-ink)]"}>
            {shipping === 0 ? "Free" : `₹${formatINR(shipping)}`}
          </span>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border-strong)]" />

      <div className="flex justify-between">
        <span className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
          Total
        </span>
        <span className="font-heading text-xl font-bold tabular-nums text-[var(--color-primary)]">
          ₹{formatINR(total)}
        </span>
      </div>

      {shipping > 0 && (
        <p className="font-body text-xs text-[var(--color-text-muted)]">
          Add ₹{formatINR(999 - subtotal)} more to qualify for free delivery.
        </p>
      )}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  /* Redirect if cart is empty */
  if (items.length === 0 && !success) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
          <ShoppingCart size={36} strokeWidth={1.5} className="text-[var(--color-primary)]" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading text-lg font-bold uppercase tracking-widest text-[var(--color-ink)]">
            Your cart is empty
          </p>
          <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
            Add some products before checking out.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)]"
        >
          Browse Products
        </Link>
      </section>
    )
  }

  /* Success state */
  if (success) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]">
          <Check size={36} strokeWidth={2.5} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
            Order placed!
          </p>
          <p className="mt-2 font-body text-base text-[var(--color-text-muted)]">
            Thanks for your order. You&apos;ll receive a confirmation email shortly.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)]"
        >
          Continue Shopping
        </Link>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    /* Simulate order placement */
    await new Promise((r) => setTimeout(r, 1800))
    clearCart()
    setSuccess(true)
    setSubmitting(false)
  }

  return (
    <section className="bg-[var(--color-bg-subtle)] py-10 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5">
          <Link href="/" className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Home</Link>
          <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
          <Link href="/shop" className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Shop</Link>
          <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
          <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">Checkout</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16">
          {/* ── Left: Form ────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

            {/* Shipping details */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6 md:p-8">
              <h2 className="mb-6 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Shipping Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" id="first-name" name="firstName" placeholder="Priya" required autoComplete="given-name" />
                <Field label="Last Name"  id="last-name"  name="lastName"  placeholder="Mehta" required autoComplete="family-name" />
                <div className="sm:col-span-2">
                  <Field label="Email" id="email" name="email" type="email" placeholder="priya@example.com" required autoComplete="email" />
                </div>
                <Field label="Phone" id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required autoComplete="tel" />
                <div className="sm:col-span-2">
                  <Field label="Address" id="address" name="address" placeholder="123 MG Road, Apartment 4B" required autoComplete="street-address" />
                </div>
                <Field label="City"    id="city"    name="city"    placeholder="Bangalore" required autoComplete="address-level2" />
                <Field label="Pincode" id="pincode" name="pincode" type="text" inputMode="numeric" pattern="[0-9]{6}" placeholder="560001" required autoComplete="postal-code" />
                <div className="sm:col-span-2">
                  <Field label="State" id="state" name="state" placeholder="Karnataka" required autoComplete="address-level1" />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6 md:p-8">
              <h2 className="mb-6 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Payment Method
              </h2>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Select payment method">
                <PaymentOption
                  id="upi"
                  label="UPI"
                  sublabel="Pay via GPay, PhonePe, Paytm & more"
                  icon={Smartphone}
                  selected={paymentMethod === "upi"}
                  onSelect={() => setPaymentMethod("upi")}
                />
                <PaymentOption
                  id="card"
                  label="Debit / Credit Card"
                  sublabel="Visa, Mastercard, RuPay accepted"
                  icon={CreditCard}
                  selected={paymentMethod === "card"}
                  onSelect={() => setPaymentMethod("card")}
                />
                <PaymentOption
                  id="cod"
                  label="Cash on Delivery"
                  sublabel="Pay when your order arrives"
                  icon={Banknote}
                  selected={paymentMethod === "cod"}
                  onSelect={() => setPaymentMethod("cod")}
                />
              </div>

              {/* UPI ID field */}
              {paymentMethod === "upi" && (
                <div className="mt-4">
                  <Field label="UPI ID" id="upi-id" name="upiId" placeholder="yourname@upi" autoComplete="off" />
                </div>
              )}

              {/* Card fields */}
              {paymentMethod === "card" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Card Number" id="card-number" name="cardNumber" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
                  </div>
                  <Field label="Expiry" id="expiry" name="expiry" placeholder="MM / YY" autoComplete="cc-exp" />
                  <Field label="CVV"    id="cvv"    name="cvv"    inputMode="numeric" placeholder="•••" autoComplete="cc-csc" />
                  <div className="sm:col-span-2">
                    <Field label="Name on Card" id="card-name" name="cardName" placeholder="PRIYA MEHTA" autoComplete="cc-name" />
                  </div>
                </div>
              )}
            </div>

            {/* Place order */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--color-primary)] px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-live="polite"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />
                  Placing Order…
                </>
              ) : (
                <>
                  Place Order
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </>
              )}
            </button>

            <p className="text-center font-body text-xs text-[var(--color-text-muted)]">
              By placing your order you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[var(--color-primary)]">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">Privacy Policy</Link>.
            </p>
          </form>

          {/* ── Right: Order summary ───────────────────────────────────── */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6">
              <OrderSummary />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
