"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Clock, XCircle, Package, Truck, MapPin, ChevronRight, Loader2, RefreshCw, Banknote } from "lucide-react"
import { Container } from "@/components/layout/container"
import { useAuth } from "@/lib/auth-context"
import { getImageUrl } from "@/lib/utils/image"

/* ── Types ───────────────────────────────────────────────────────────── */

type OrderItem = {
  variantId: string
  productId: string
  sku: string
  productName: string
  productSlug: string
  attributeLabels: string[]
  image: string
  qty: number
  priceAtPurchase: number
  originalPriceAtPurchase: number
}

type ShippingAddress = {
  fullName: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  country: string
}

type Order = {
  orderId: string
  status: string
  customerEmail: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billing: {
    subtotal: number
    couponCode: string | null
    couponDiscount: number
    shippingCharge: number
    shippingTax: number
    total: number
  }
  payment: {
    gateway: string
    razorpayOrderId: string | null
    status: string
    method: string | null
  }
  createdAt: string
  trackingInfo?: { courier: string | null; trackingId: string | null; trackingUrl: string | null } | null
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })
}

/* ── Status badge ────────────────────────────────────────────────────── */

function StatusBadge({ paymentStatus, orderStatus, gateway }: { paymentStatus: string; orderStatus: string; gateway: string }) {
  const isCod = gateway === "cod"
  const isPaid = paymentStatus === "paid"
  const isFailed = paymentStatus === "failed"
  const isPending = paymentStatus === "pending"

  if (isFailed) return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle size={40} strokeWidth={1.5} className="text-[var(--color-error)]" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">Payment Failed</h1>
        <p className="mt-2 font-body text-base text-[var(--color-text-muted)]">
          Your payment could not be processed. Please retry or choose a different payment method.
        </p>
      </div>
    </div>
  )

  if (isPending && !isCod) return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
        <Clock size={40} strokeWidth={1.5} className="text-yellow-600" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">Payment Pending</h1>
        <p className="mt-2 font-body text-base text-[var(--color-text-muted)]">
          We&apos;re waiting for payment confirmation. This usually takes a few seconds.
        </p>
      </div>
    </div>
  )

  if (isCod) return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
        <Banknote size={40} strokeWidth={1.5} className="text-[var(--color-primary)]" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">Order Placed!</h1>
        <p className="mt-2 font-body text-base text-[var(--color-text-muted)]">
          Cash on delivery order confirmed. Pay when your order arrives.
        </p>
      </div>
    </div>
  )

  if (isPaid || orderStatus === "confirmed" || orderStatus === "processing") return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]">
        <CheckCircle size={40} strokeWidth={1.5} className="text-white" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
          Order Confirmed!
        </h1>
        <p className="mt-2 font-body text-base text-[var(--color-text-muted)]">
          Payment received. You&apos;ll get an email when your order ships.
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-subtle)]">
        <Package size={40} strokeWidth={1.5} className="text-[var(--color-ink)]" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[var(--color-ink)]">
          Order {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
        </h1>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const orderId = params.orderId as string
  const guestEmail = searchParams.get("email")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchOrder = useCallback(async () => {
    const url = guestEmail
      ? `/api/orders/${orderId}?email=${encodeURIComponent(guestEmail)}`
      : `/api/orders/${orderId}`

    try {
      const res = await fetch(url, { credentials: "include" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        if (res.status === 401) {
          if (!guestEmail) {
            router.push(`/orders/${orderId}?email=`)
          }
          setError("Enter your email to view this order.")
        } else {
          setError(body.message ?? "Order not found.")
        }
        return
      }
      const json = await res.json() as { data: Order }
      setOrder(json.data)
    } catch {
      setError("Failed to load order. Please refresh.")
    } finally {
      setLoading(false)
    }
  }, [orderId, guestEmail, router])

  useEffect(() => {
    if (authLoading) return
    fetchOrder()
  }, [authLoading, fetchOrder])

  // Guest email prompt
  const [emailInput, setEmailInput] = useState("")
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailInput.trim()) return
    router.push(`/orders/${orderId}?email=${encodeURIComponent(emailInput.trim())}`)
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" aria-hidden="true" />
      </div>
    )
  }

  if (error === "Enter your email to view this order.") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-subtle)]">
          <Package size={28} strokeWidth={1.5} className="text-[var(--color-ink)]" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-black uppercase tracking-tight text-[var(--color-ink)]">
            Enter your email
          </h1>
          <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
            We&apos;ll use this to look up your order.
          </p>
        </div>
        <form onSubmit={handleEmailSubmit} className="flex w-full max-w-sm flex-col gap-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-12 w-full rounded-[8px] border border-[var(--color-border-strong)] bg-white px-4 font-body text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-[var(--color-primary)] font-heading text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-primary-dark)]"
          >
            View Order
          </button>
        </form>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-heading text-lg font-bold text-[var(--color-ink)]">{error || "Order not found."}</p>
        <Link href="/shop" className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] underline">
          Continue Shopping
        </Link>
      </section>
    )
  }

  const isFailed = order.payment.status === "failed"
  const canRetry = isFailed && !!user && order.payment.razorpayOrderId

  return (
    <section className="bg-[var(--color-bg-subtle)] py-10 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5">
          <Link href="/" className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Home</Link>
          <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--color-text-muted)]/50" aria-hidden="true" />
          <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]">Order {order.orderId}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* ── Left ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Status hero */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white px-6">
              <StatusBadge
                paymentStatus={order.payment.status}
                orderStatus={order.status}
                gateway={order.payment.gateway}
              />
              <div className="border-t border-[var(--color-border-strong)] py-4 text-center">
                <p className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Order ID: <span className="text-[var(--color-ink)]">{order.orderId}</span>
                </p>
                <p className="mt-1 font-body text-xs text-[var(--color-text-muted)]">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Retry payment */}
            {canRetry && (
              <RetryPayment orderId={order.orderId} />
            )}

            {/* Tracking */}
            {order.trackingInfo?.trackingId && (
              <div className="flex items-start gap-4 rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6">
                <Truck size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                <div>
                  <p className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                    Tracking
                  </p>
                  <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
                    {order.trackingInfo.courier} · {order.trackingInfo.trackingId}
                  </p>
                  {order.trackingInfo.trackingUrl && (
                    <a
                      href={order.trackingInfo.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] underline"
                    >
                      Track Package →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6">
              <h2 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Your Items
              </h2>
              <div className="flex flex-col gap-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-border-strong)] bg-white">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-ink)] font-body text-[10px] font-bold text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-[11px] font-bold uppercase leading-snug tracking-widest text-[var(--color-ink)]">
                        {item.productName}
                      </p>
                      {item.attributeLabels.length > 0 && (
                        <p className="mt-0.5 font-body text-xs text-[var(--color-text-muted)]">
                          {item.attributeLabels.join(" · ")}
                        </p>
                      )}
                      <p className="mt-0.5 font-body text-xs text-[var(--color-text-muted)]">SKU: {item.sku}</p>
                    </div>
                    <span className="shrink-0 font-heading text-sm font-bold tabular-nums text-[var(--color-ink)]">
                      ₹{formatINR(item.priceAtPurchase * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="flex items-start gap-4 rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6">
              <MapPin size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Delivering to
                </h2>
                <div className="mt-2 font-body text-sm leading-relaxed text-[var(--color-text-muted)]">
                  <p className="font-medium text-[var(--color-ink)]">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                  <p className="mt-1">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Billing ────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="rounded-[16px] border border-[var(--color-border-strong)] bg-white p-6">
              <h2 className="mb-5 font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Payment Summary
              </h2>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[var(--color-text-muted)]">Subtotal</span>
                  <span className="tabular-nums">₹{formatINR(order.billing.subtotal)}</span>
                </div>
                {order.billing.couponCode && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-[var(--color-primary)]">Coupon ({order.billing.couponCode})</span>
                    <span className="tabular-nums text-[var(--color-primary)]">−₹{formatINR(order.billing.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[var(--color-text-muted)]">Shipping</span>
                  <span className={order.billing.shippingCharge === 0 ? "font-medium text-[var(--color-primary)]" : "tabular-nums"}>
                    {order.billing.shippingCharge === 0 ? "Free" : `₹${formatINR(order.billing.shippingCharge)}`}
                  </span>
                </div>
                {order.billing.shippingTax > 0 && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-[var(--color-text-muted)]">Shipping tax</span>
                    <span className="tabular-nums">₹{formatINR(order.billing.shippingTax)}</span>
                  </div>
                )}
              </div>

              <div className="my-4 h-px bg-[var(--color-border-strong)]" />

              <div className="flex justify-between">
                <span className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">Total</span>
                <span className="font-heading text-xl font-bold tabular-nums text-[var(--color-primary)]">
                  ₹{formatINR(order.billing.total)}
                </span>
              </div>

              <div className="mt-4 rounded-[8px] bg-[var(--color-bg-subtle)] px-4 py-3">
                <p className="font-body text-xs text-[var(--color-text-muted)]">
                  Payment:{" "}
                  <span className="font-medium capitalize text-[var(--color-ink)]">
                    {order.payment.gateway === "cod" ? "Cash on Delivery" : order.payment.method ?? "Online"}
                  </span>
                </p>
                <p className="mt-0.5 font-body text-xs text-[var(--color-text-muted)]">
                  Status:{" "}
                  <span className={[
                    "font-medium capitalize",
                    order.payment.status === "paid" ? "text-[var(--color-primary)]" : "",
                    order.payment.status === "failed" ? "text-[var(--color-error)]" : "",
                    order.payment.status === "pending" ? "text-yellow-600" : "",
                  ].join(" ")}>
                    {order.payment.status}
                  </span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/shop"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-primary-dark)]"
                >
                  Continue Shopping
                </Link>
                {user && (
                  <Link
                    href="/account/orders"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:border-[var(--color-ink)]"
                  >
                    View All Orders
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ── Retry payment widget ────────────────────────────────────────────── */

function RetryPayment({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if ((window as unknown as Record<string, unknown>).Razorpay) { setLoaded(true); return }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)
  }, [])

  async function handleRetry() {
    setRetrying(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/retry-payment`, {
        method: "POST",
        credentials: "include",
      })
      const json = await res.json() as {
        data: { razorpayOrderId: string; amountInPaise: number; amount: number }
        message?: string
      }
      if (!res.ok) { alert(json.message ?? "Retry failed"); return }
      const { razorpayOrderId, amountInPaise } = json.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "Urbanvana",
        order_id: razorpayOrderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await fetch(`/api/orders/${orderId}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          router.refresh()
        },
        modal: { ondismiss: () => setRetrying(false) },
        theme: { color: "#4B7A2B" },
      })
      rzp.open()
    } catch {
      setRetrying(false)
    }
  }

  return (
    <div className="rounded-[16px] border border-[var(--color-error)]/30 bg-red-50 p-6">
      <p className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-error)]">
        Payment Failed
      </p>
      <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
        Your order is saved. Retry payment to confirm it.
      </p>
      <button
        onClick={handleRetry}
        disabled={retrying || !loaded}
        className="mt-4 flex items-center gap-2 rounded-full bg-[var(--color-error)] px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-60"
      >
        {retrying ? <Loader2 size={14} strokeWidth={1.5} className="animate-spin" aria-hidden="true" /> : <RefreshCw size={14} strokeWidth={1.5} aria-hidden="true" />}
        Retry Payment
      </button>
    </div>
  )
}
