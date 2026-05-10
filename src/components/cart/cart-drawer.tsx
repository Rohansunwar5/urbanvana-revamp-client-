"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2, Tag } from "lucide-react"
import { useCart, type CartItem } from "@/lib/cart-context"

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

/* ── Single cart item row ────────────────────────────────────────────── */

function CartRow({ item, isLastAdded }: { item: CartItem; isLastAdded: boolean }) {
  const { removeItem, setQty } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      className={[
        "relative flex gap-3 rounded-[12px] p-3 transition-colors duration-500",
        isLastAdded ? "bg-[var(--color-primary-light)]" : "bg-[var(--color-bg-subtle)]",
      ].join(" ")}
    >
      {/* Product image */}
      <Link
        href={`/shop/${item.slug}`}
        className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[8px] border border-black/8 bg-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        tabIndex={-1}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="72px"
          className="object-contain p-2"
          style={{ mixBlendMode: "multiply" }}
        />
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link
          href={`/shop/${item.slug}`}
          className="font-heading text-[11px] font-bold uppercase leading-snug tracking-widest text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors duration-150 line-clamp-2"
        >
          {item.name}
        </Link>

        {/* Variant labels */}
        {item.attributeLabels.length > 0 && (
          <p className="font-body text-[10px] text-[var(--color-text-muted)]">
            {item.attributeLabels.join(" · ")}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 tabular-nums">
          <p className="font-heading text-sm font-bold text-[var(--color-primary)]">
            ₹{formatINR(item.price)}
          </p>
          {item.priceChanged && (
            <span className="font-body text-[10px] text-[var(--color-error)]">
              price updated
            </span>
          )}
        </div>

        {/* Qty controls + remove */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center overflow-hidden rounded-[6px] border border-[var(--color-border-strong)]">
            <button
              onClick={() => setQty(item.variantId, item.qty - 1)}
              disabled={item.qty <= 1}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={11} strokeWidth={2} aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="flex h-7 w-7 items-center justify-center border-x border-[var(--color-border-strong)] font-heading text-xs font-bold tabular-nums text-[var(--color-ink)]"
            >
              {item.qty}
            </span>
            <button
              onClick={() => setQty(item.variantId, item.qty + 1)}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            >
              <Plus size={11} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.variantId)}
            aria-label={`Remove ${item.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-red-50 hover:text-[var(--color-error)]"
          >
            <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Empty state ─────────────────────────────────────────────────────── */

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
        <ShoppingCart size={28} strokeWidth={1.5} className="text-[var(--color-primary)]" aria-hidden="true" />
      </div>
      <div>
        <p className="font-heading text-base font-bold uppercase tracking-widest text-[var(--color-ink)]">
          Cart is empty
        </p>
        <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Add something fresh to get started.
        </p>
      </div>
      <button
        onClick={onClose}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)]"
      >
        Start Shopping
        <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ── Cart drawer ─────────────────────────────────────────────────────── */

function CouponInput() {
  const { applyCoupon } = useCart()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleApply() {
    const trimmed = code.trim()
    if (!trimmed) return
    setError(null)
    setLoading(true)
    try {
      await applyCoupon(trimmed)
      setCode("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid coupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      <div className="flex overflow-hidden rounded-[8px] border border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] transition-colors duration-150">
        <div className="flex items-center pl-3 text-[var(--color-text-muted)]">
          <Tag size={11} strokeWidth={2} aria-hidden="true" />
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null) }}
          onKeyDown={(e) => { if (e.key === "Enter") handleApply() }}
          placeholder="COUPON CODE"
          className="flex-1 bg-transparent px-2 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)]/50 outline-none"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="shrink-0 border-l border-[var(--color-border-strong)] bg-[var(--color-primary)] px-3 font-heading text-[10px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "…" : "Apply"}
        </button>
      </div>
      {error && (
        <p className="font-body text-[10px] text-[var(--color-error)]">{error}</p>
      )}
    </div>
  )
}

export function CartDrawer() {
  const { items, isOpen, lastAddedVariantId, totalItems, subtotal, total, coupon, removeCoupon, syncing, closeCart } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  /* track mobile breakpoint for slide direction */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  /* lock body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      closeRef.current?.focus()
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  /* close on Escape */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart()
    }
    if (isOpen) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, closeCart])

  const hasItems = items.length > 0
  const FREE_SHIPPING_THRESHOLD = 999
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const hasCoupon = coupon !== null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[var(--color-ink)]/50 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel — bottom sheet on mobile, right panel on sm+ */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.8 }}
            className="fixed bottom-0 right-0 z-[80] flex h-[67vh] w-full flex-col rounded-t-[20px] bg-white shadow-[var(--shadow-xl)] sm:top-0 sm:h-full sm:w-[420px] sm:rounded-none"
          >
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 sm:hidden" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
            </div>

            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-strong)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={18} strokeWidth={1.5} className="text-[var(--color-ink)]" aria-hidden="true" />
                <span className="font-heading text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
                  Cart
                </span>
                {totalItems > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 font-heading text-[10px] font-bold text-white tabular-nums">
                    {totalItems}
                  </span>
                )}
                {syncing && (
                  <span className="font-body text-[10px] text-[var(--color-text-muted)]">saving…</span>
                )}
              </div>
              <button
                ref={closeRef}
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            {/* ── Free shipping progress bar ── */}
            {hasItems && (
              <div className="border-b border-[var(--color-border-strong)] bg-[var(--color-primary-light)]/40 px-5 py-3">
                {remaining > 0 ? (
                  <p className="font-body text-xs text-[var(--color-text-muted)]">
                    Add{" "}
                    <span className="font-bold text-[var(--color-primary)]">
                      ₹{formatINR(remaining)}
                    </span>{" "}
                    more for free delivery
                  </p>
                ) : (
                  <p className="font-body text-xs font-medium text-[var(--color-primary)]">
                    🎉 You qualify for free delivery!
                  </p>
                )}
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-border-strong)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--color-primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            )}

            {/* ── Items list ── */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-border-strong) transparent" }}
            >
              {hasItems ? (
                <motion.ul className="flex flex-col gap-2" role="list">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <li key={item.variantId} role="listitem">
                        <CartRow item={item} isLastAdded={item.variantId === lastAddedVariantId} />
                      </li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              ) : (
                <EmptyCart onClose={closeCart} />
              )}
            </div>

            {/* ── Footer ── */}
            {hasItems && (
              <div className="border-t border-[var(--color-border-strong)] bg-white px-5 py-5">
                {/* Subtotal row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Subtotal
                  </span>
                  <span className="font-heading text-base font-bold tabular-nums text-[var(--color-ink)]">
                    ₹{formatINR(subtotal)}
                  </span>
                </div>

                {/* Coupon row */}
                {hasCoupon && coupon && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Tag size={11} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
                      <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold tabular-nums text-[var(--color-primary)]">
                        −₹{formatINR(coupon.discountAmount)}
                      </span>
                      <button
                        onClick={() => removeCoupon()}
                        aria-label="Remove coupon"
                        className="font-body text-[10px] text-[var(--color-text-muted)] underline hover:text-[var(--color-error)]"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Total row */}
                {hasCoupon && (
                  <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border-strong)] pt-2">
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                      Total
                    </span>
                    <span className="font-heading text-xl font-bold tabular-nums text-[var(--color-primary)]">
                      ₹{formatINR(total)}
                    </span>
                  </div>
                )}

                {!hasCoupon && (
                  <div className="mt-1">
                    <span className="font-heading text-xl font-bold tabular-nums text-[var(--color-ink)]">
                      ₹{formatINR(subtotal)}
                    </span>
                  </div>
                )}

                {/* Coupon input — only when no coupon applied */}
                {!hasCoupon && <CouponInput />}

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>

                {/* Continue shopping */}
                <button
                  onClick={closeCart}
                  className="mt-3 w-full text-center font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
