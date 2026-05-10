'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/lib/auth-context'

type WishlistContextValue = {
  wishlisted: Set<string>
  toggle: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue>({
  wishlisted: new Set(),
  toggle: () => {},
})

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())
  const prevUserId = useRef<string | null>(null)

  useEffect(() => {
    const currentId = user?._id ?? null
    if (currentId === prevUserId.current) return
    prevUserId.current = currentId

    if (!currentId) {
      setWishlisted(new Set())
      return
    }

    fetch('/api/user/wishlist', { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        const ids: string[] = (json.data?.products ?? []).map((p: { _id: string }) => p._id)
        setWishlisted(new Set(ids))
      })
      .catch(() => {})
  }, [user])

  const toggle = useCallback(
    (productId: string) => {
      if (!user) {
        window.dispatchEvent(new CustomEvent('urbanvana:open-auth'))
        return
      }

      const isWishlisted = wishlisted.has(productId)

      // Optimistic update
      setWishlisted((prev) => {
        const next = new Set(prev)
        if (isWishlisted) next.delete(productId)
        else next.add(productId)
        return next
      })

      const url = isWishlisted
        ? `/api/user/wishlist/${productId}`
        : '/api/user/wishlist'
      const method = isWishlisted ? 'DELETE' : 'POST'
      const body = isWishlisted ? undefined : JSON.stringify({ productId })

      fetch(url, {
        method,
        credentials: 'include',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      }).catch(() => {
        // Revert on error
        setWishlisted((prev) => {
          const next = new Set(prev)
          if (isWishlisted) next.add(productId)
          else next.delete(productId)
          return next
        })
      })
    },
    [user, wishlisted],
  )

  return (
    <WishlistContext.Provider value={{ wishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
