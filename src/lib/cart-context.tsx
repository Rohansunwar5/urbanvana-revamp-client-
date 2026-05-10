"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { getImageUrl } from "@/lib/utils/image"

const SESSION_KEY = "uv_cart_sid"

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, id)
  return id
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window !== "undefined") {
    const sid = localStorage.getItem(SESSION_KEY)
    if (sid) headers["x-session-id"] = sid
  }
  return headers
}

/* ── Types ───────────────────────────────────────────────────────────── */

export type CartItem = {
  variantId: string
  productId: string
  name: string
  slug: string
  sku: string
  image: string
  attributeLabels: string[]
  price: number
  originalPrice: number
  currentPrice: number
  priceChanged: boolean
  qty: number
}

export type CartCoupon = { code: string; discountAmount: number }

type CartData = {
  items: CartItem[]
  coupon: CartCoupon | null
  subtotal: number
  total: number
  itemCount: number
  hasPriceChanges: boolean
}

const EMPTY_CART: CartData = {
  items: [],
  coupon: null,
  subtotal: 0,
  total: 0,
  itemCount: 0,
  hasPriceChanges: false,
}

type CartContextValue = CartData & {
  isOpen: boolean
  lastAddedVariantId: string | null
  loading: boolean
  syncing: boolean
  addItem: (variantId: string, qty?: number) => Promise<void>
  removeItem: (variantId: string) => Promise<void>
  setQty: (variantId: string, qty: number) => Promise<void>
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => Promise<void>
  openCart: () => void
  closeCart: () => void
  clearCart: () => Promise<void>
  /** Total items in cart (sum of quantities) */
  totalItems: number
}

const CartContext = createContext<CartContextValue | null>(null)

/* ── Response parser ─────────────────────────────────────────────────── */

type RawCartResponse = {
  items: Array<{
    variantId: string
    productId: string
    productName: string
    productSlug: string
    sku: string
    image: string
    attributeLabels: string[]
    priceSnapshot: number
    originalPriceSnapshot: number
    currentPrice: number
    priceChanged: boolean
    qty: number
  }>
  coupon: CartCoupon | null
  subtotal: number
  total: number
  itemCount: number
  hasPriceChanges: boolean
}

function parseCart(data: unknown): CartData {
  const d = data as RawCartResponse
  return {
    items: (d.items ?? []).map((i) => ({
      variantId: i.variantId,
      productId: i.productId,
      name: i.productName,
      slug: i.productSlug,
      sku: i.sku,
      image: getImageUrl(i.image),
      attributeLabels: i.attributeLabels ?? [],
      price: i.priceSnapshot,
      originalPrice: i.originalPriceSnapshot,
      currentPrice: i.currentPrice,
      priceChanged: i.priceChanged,
      qty: i.qty,
    })),
    coupon: d.coupon ?? null,
    subtotal: d.subtotal ?? 0,
    total: d.total ?? 0,
    itemCount: d.itemCount ?? 0,
    hasPriceChanges: d.hasPriceChanges ?? false,
  }
}

/* ── Provider ────────────────────────────────────────────────────────── */

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<CartData>(EMPTY_CART)
  const [isOpen, setIsOpen] = useState(false)
  const [lastAddedVariantId, setLastAddedVariantId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const prevUserIdRef = useRef<string | null | undefined>(undefined)
  const initializedRef = useRef(false)

  const fetchCart = useCallback(async () => {
    if (typeof window === "undefined") return
    getOrCreateSessionId()
    try {
      const res = await fetch("/api/cart", { headers: buildHeaders(), credentials: "include" })
      if (!res.ok) return
      const json = await res.json()
      setCart(parseCart(json.data))
    } catch {
      // network failure — keep previous state
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch once auth settles
  useEffect(() => {
    if (authLoading) return
    if (!initializedRef.current) {
      initializedRef.current = true
      fetchCart()
    }
  }, [authLoading, fetchCart])

  // Login / logout transitions
  useEffect(() => {
    if (authLoading || !initializedRef.current) return
    const prevId = prevUserIdRef.current
    const currId = user?._id ?? null
    if (prevId === undefined) {
      prevUserIdRef.current = currId
      return
    }
    if (prevId === currId) return
    prevUserIdRef.current = currId

    if (!prevId && currId) {
      // User just logged in — merge guest cart then reload
      setSyncing(true)
        ; (async () => {
          try {
            await fetch("/api/cart/merge", {
              method: "POST",
              headers: buildHeaders(),
              credentials: "include",
            })
            localStorage.removeItem(SESSION_KEY)
          } finally {
            await fetchCart()
            setSyncing(false)
          }
        })()
    } else if (prevId && !currId) {
      // User logged out — start a fresh guest session
      localStorage.removeItem(SESSION_KEY)
      setCart(EMPTY_CART)
      setLoading(false)
    }
  }, [user, authLoading, fetchCart])

  async function mutate(fn: () => Promise<Response>): Promise<void> {
    setSyncing(true)
    try {
      const res = await fn()
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(body.message ?? "Cart update failed")
      }
      const json = await res.json() as { data: unknown }
      if (json.data) setCart(parseCart(json.data))
    } finally {
      setSyncing(false)
    }
  }

  const addItem = useCallback(async (variantId: string, qty = 1) => {
    setIsOpen(true)
    setLastAddedVariantId(variantId)
    await mutate(() =>
      fetch("/api/cart/items", {
        method: "POST",
        headers: buildHeaders(),
        credentials: "include",
        body: JSON.stringify({ variantId, qty }),
      }),
    )
    setTimeout(() => setLastAddedVariantId(null), 2500)
  }, [])

  const removeItem = useCallback(async (variantId: string) => {
    await mutate(() =>
      fetch(`/api/cart/items/${variantId}`, {
        method: "DELETE",
        headers: buildHeaders(),
        credentials: "include",
      }),
    )
  }, [])

  const setQty = useCallback(async (variantId: string, qty: number) => {
    if (qty < 1) return
    await mutate(() =>
      fetch(`/api/cart/items/${variantId}`, {
        method: "PATCH",
        headers: buildHeaders(),
        credentials: "include",
        body: JSON.stringify({ qty }),
      }),
    )
  }, [])

  const clearCart = useCallback(async () => {
    setSyncing(true)
    try {
      await fetch("/api/cart", { method: "DELETE", headers: buildHeaders(), credentials: "include" })
      setCart(EMPTY_CART)
    } finally {
      setSyncing(false)
    }
  }, [])

  const applyCoupon = useCallback(async (code: string) => {
    await mutate(() =>
      fetch("/api/cart/coupon", {
        method: "POST",
        headers: buildHeaders(),
        credentials: "include",
        body: JSON.stringify({ code }),
      }),
    )
  }, [])

  const removeCoupon = useCallback(async () => {
    await mutate(() =>
      fetch("/api/cart/coupon", {
        method: "DELETE",
        headers: buildHeaders(),
        credentials: "include",
      }),
    )
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider
      value={{
        ...cart,
        isOpen,
        lastAddedVariantId,
        loading,
        syncing,
        totalItems: cart.itemCount,
        addItem,
        removeItem,
        setQty,
        applyCoupon,
        removeCoupon,
        openCart,
        closeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
