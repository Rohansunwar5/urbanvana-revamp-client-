"use client"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
import { PRODUCTS, type Product } from "@/lib/products"

/* ── Types ───────────────────────────────────────────────────────────── */

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  imageAlt: string
  qty: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  lastAddedId: string | null
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "CLEAR" }

/* ── Reducer ─────────────────────────────────────────────────────────── */

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const p = action.product
      const existing = state.items.find((i) => i.id === p.id)
      const items = existing
        ? state.items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [
            ...state.items,
            { id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, imageAlt: p.imageAlt, qty: 1 },
          ]
      return { items, isOpen: true, lastAddedId: p.id }
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case "SET_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i,
        ),
      }
    case "OPEN":
      return { ...state, isOpen: true }
    case "CLOSE":
      return { ...state, isOpen: false, lastAddedId: null }
    case "CLEAR":
      return { ...state, items: [], lastAddedId: null }
    default:
      return state
  }
}

/* ── Context ─────────────────────────────────────────────────────────── */

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  lastAddedId: string | null
  totalItems: number
  subtotal: number
  addItem: (productId: string) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    lastAddedId: null,
  })

  const addItem = useCallback((productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (product) dispatch({ type: "ADD", product })
  }, [])

  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), [])
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }), [])
  const openCart = useCallback(() => dispatch({ type: "OPEN" }), [])
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), [])
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), [])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ ...state, totalItems, subtotal, addItem, removeItem, setQty, openCart, closeCart, clearCart }}
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
