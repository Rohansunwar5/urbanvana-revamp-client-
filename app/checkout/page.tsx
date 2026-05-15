"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Check, Banknote, Loader2, ShoppingCart, Tag, X, CreditCard } from "lucide-react"
import { Container } from "@/components/layout/container"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function Field({
  label,
  id,
  required,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; required?: boolean; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label} {required && <span className="text-[var(--color-error)]" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className={[
          "h-12 w-full rounded-[8px] border bg-white px-4 font-body text-sm text-[var(--color-ink)] outline-none transition-colors duration-150",
          "placeholder:text-[var(--color-text-muted)]/50",
          "focus:ring-2 focus:ring-[var(--color-primary)]/20",
          error
            ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
            : "border-[var(--color-border-strong)] focus:border-[var(--color-primary)]",
        ].join(" ")}
        {...props}
      />
      {error && <p className="font-body text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  )
}

/* ── Payment method option ───────────────────────────────────────────── */

type PaymentMethod = "online" | "cod"

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

/* ── Coupon input (not a <form> — lives inside the main form) ──────── */

function CouponInput() {
  const { coupon, applyCoupon, removeCoupon, syncing } = useCart()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleApply() {
    if (!code.trim() || syncing) return
    setError("")
    try {
      await applyCoupon(code.trim().toUpperCase())
      setCode("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid coupon code")
    }
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-[8px] border border-[var(--color-primary)] bg-[var(--color-primary-light)]/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag size={14} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {coupon.code} — ₹{formatINR(coupon.discountAmount)} off
          </span>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label="Remove coupon"
          className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-error)]"
        >
          <X size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApply() } }}
          placeholder="Coupon code"
          className="h-11 w-full rounded-[8px] border border-[var(--color-border-strong)] bg-white px-4 font-body text-sm text-[var(--color-ink)] uppercase outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:uppercase placeholder:tracking-widest"
        />
        {error && <p className="mt-1 font-body text-xs text-[var(--color-error)]">{error}</p>}
      </div>
      <button
        type="button"
        onClick={handleApply}
        disabled={!code.trim() || syncing}
        className="h-11 rounded-[8px] border border-[var(--color-border-strong)] bg-white px-4 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  )
}

/* ── Order summary sidebar ───────────────────────────────────────────── */

function OrderSummary() {
  const { items, subtotal, total, coupon, applyCoupon, removeCoupon, syncing } = useCart()
  const hasCoupon = coupon !== null
  const shipping = (hasCoupon ? total : subtotal) >= 999 ? 0 : 99
  const grandTotal = (hasCoupon ? total : subtotal) + shipping

  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  async function handleApply() {
    if (!code.trim() || syncing) return
    setError("")
    try {
      await applyCoupon(code.trim().toUpperCase())
      setCode("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid coupon code")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Order Summary
      </h2>

      {/* Item list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-border-strong)] bg-white">
              <Image
                src={item.image}
                alt={item.name}
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
              {item.attributeLabels.length > 0 && (
                <p className="mt-0.5 font-body text-[10px] text-[var(--color-text-muted)]">
                  {item.attributeLabels.join(" · ")}
                </p>
              )}
            </div>
            <span className="font-heading text-sm font-bold tabular-nums text-[var(--color-ink)]">
              ₹{formatINR(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[var(--color-border-strong)]" />

      {/* Coupon section in order summary */}
      {hasCoupon && coupon ? (
        <div className="flex items-center justify-between rounded-[8px] border border-[var(--color-primary)] bg-[var(--color-primary-light)]/30 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Tag size={12} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
              {coupon.code}
            </span>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            aria-label="Remove coupon"
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-error)]"
          >
            <X size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApply() } }}
              placeholder="Coupon code"
              className="h-9 flex-1 rounded-[6px] border border-[var(--color-border-strong)] bg-white px-3 font-body text-xs text-[var(--color-ink)] uppercase outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={!code.trim() || syncing}
              className="h-9 rounded-[6px] bg-[var(--color-ink)] px-3 font-heading text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-primary)] disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          {error && <p className="font-body text-[10px] text-[var(--color-error)]">{error}</p>}
        </div>
      )}

      <div className="h-px bg-[var(--color-border-strong)]" />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-body text-sm">
          <span className="text-[var(--color-text-muted)]">Subtotal</span>
          <span className="tabular-nums text-[var(--color-ink)]">₹{formatINR(subtotal)}</span>
        </div>
        {hasCoupon && coupon && (
          <div className="flex justify-between font-body text-sm">
            <span className="flex items-center gap-1 text-[var(--color-primary)]">
              <Tag size={11} strokeWidth={2} aria-hidden="true" />
              {coupon.code}
            </span>
            <span className="tabular-nums text-[var(--color-primary)]">−₹{formatINR(coupon.discountAmount)}</span>
          </div>
        )}
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
          ₹{formatINR(grandTotal)}
        </span>
      </div>
    </div>
  )
}

/* ── Razorpay script loader ──────────────────────────────────────────── */

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as Record<string, unknown>).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/* ── Page ────────────────────────────────────────────────────────────── */

type CheckoutResult =
  | { paymentMethod: "cod"; orderId: string }
  | { paymentMethod: "online"; orderId: string; razorpayOrderId: string; razorpayKeyId: string; amountInPaise: number }

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, total, subtotal, coupon, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online")
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const isGuest = !user

  /* Redirect if cart is empty */
  if (items.length === 0) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setApiError("")
    setSubmitting(true)

    const form = e.currentTarget
    const fd = new FormData(form)

    const body = {
      paymentMethod: paymentMethod === "cod" ? "cod" : "online",
      customerEmail: (fd.get("email") as string) ?? user?.email ?? "",
      shippingAddress: {
        fullName: `${fd.get("firstName") ?? ""} ${fd.get("lastName") ?? ""}`.trim(),
        phone: (fd.get("phone") as string) ?? "",
        line1: (fd.get("address") as string) ?? "",
        line2: (fd.get("address2") as string) ?? "",
        city: (fd.get("city") as string) ?? "",
        state: (fd.get("state") as string) ?? "",
        pincode: (fd.get("pincode") as string) ?? "",
        country: "India",
      },
      ...(isGuest && {
        guestInfo: {
          name: `${fd.get("firstName") ?? ""} ${fd.get("lastName") ?? ""}`.trim(),
          email: (fd.get("email") as string) ?? "",
          phone: (fd.get("phone") as string) ?? "",
        },
      }),
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })

      const json = await res.json() as { data: CheckoutResult; message?: string }

      if (!res.ok) {
        setApiError((json as { message?: string }).message ?? "Order placement failed. Please try again.")
        setSubmitting(false)
        return
      }

      const result = json.data

      if (result.paymentMethod === "cod") {
        await clearCart()
        router.push(`/orders/${result.orderId}`)
        return
      }

      const razorpayReady = await loadRazorpay()
      if (!razorpayReady) {
        setApiError("Payment gateway failed to load. Please refresh and try again.")
        setSubmitting(false)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: result.razorpayKeyId,
        amount: result.amountInPaise,
        currency: "INR",
        name: "Urbanvana",
        description: `Order ${result.orderId}`,
        order_id: result.razorpayOrderId,
        prefill: {
          name: body.shippingAddress.fullName,
          email: body.customerEmail,
          contact: body.shippingAddress.phone,
        },
        theme: { color: "#059669" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch(`/api/orders/${result.orderId}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            if (!verifyRes.ok) throw new Error("Verification failed")
            await clearCart()
            router.push(`/orders/${result.orderId}`)
          } catch {
            setApiError("Payment received but verification failed. Your order is saved — please contact support.")
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setApiError("Payment was cancelled. Please try again.")
            setSubmitting(false)
          },
        },
      })

      rzp.open()
    } catch {
      setApiError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  const cartTotal = coupon ? total : subtotal
  const shipping = cartTotal >= 999 ? 0 : 99

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
                <Field label="Last Name" id="last-name" name="lastName" placeholder="Mehta" required autoComplete="family-name" />
                <div className="sm:col-span-2">
                  <Field
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email ?? ""}
                    placeholder="priya@example.com"
                    required
                    autoComplete="email"
                    readOnly={!!user}
                  />
                </div>
                <Field label="Phone" id="phone" name="phone" type="tel" placeholder="9876543210" required autoComplete="tel" />
                <div className="sm:col-span-2">
                  <Field label="Address Line 1" id="address" name="address" placeholder="123 MG Road, Apartment 4B" required autoComplete="street-address" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address Line 2" id="address2" name="address2" placeholder="Landmark (optional)" autoComplete="address-line2" />
                </div>
                <Field label="City" id="city" name="city" placeholder="Bangalore" required autoComplete="address-level2" />
                <Field label="Pincode" id="pincode" name="pincode" type="text" inputMode="numeric" pattern="[0-9]{6}" placeholder="560001" required autoComplete="postal-code" />
                <div className="sm:col-span-2">
                  <Field label="State" id="state" name="state" placeholder="Karnataka" required autoComplete="address-level1" />
                </div>
              </div>
            </div>

            {/* Coupon — not a <form>, uses type="button" to avoid nesting */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6 md:p-8">
              <h2 className="mb-4 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Coupon Code
              </h2>
              <CouponInput />
            </div>

            {/* Payment method */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6 md:p-8">
              <h2 className="mb-6 font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Payment Method
              </h2>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Select payment method">
                <PaymentOption
                  id="online"
                  label="Pay Online"
                  sublabel="UPI, Cards, Netbanking & more via Razorpay"
                  icon={CreditCard}
                  selected={paymentMethod === "online"}
                  onSelect={() => setPaymentMethod("online")}
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
            </div>

            {/* API error */}
            {apiError && (
              <div className="rounded-[10px] border border-[var(--color-error)]/30 bg-red-50 px-4 py-3">
                <p className="font-body text-sm text-[var(--color-error)]">{apiError}</p>
              </div>
            )}

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
                  {paymentMethod === "cod" ? "Placing Order…" : "Opening Payment…"}
                </>
              ) : (
                <>
                  {paymentMethod === "cod" ? "Place Order" : `Pay ₹${formatINR(cartTotal + shipping)}`}
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
