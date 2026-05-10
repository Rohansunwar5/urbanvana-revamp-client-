'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Heart, Loader2, Trash2, ShoppingBag } from 'lucide-react'

interface WishlistProduct {
  _id: string
  name: string
  slug: string
  images: { link: string; alt?: string }[]
  badge?: string[]
  rating?: number
  totalReviews?: number
  minPrice: number
  originalMinPrice: number
}

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/wishlist', { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setProducts(json.data.products ?? [])
    } catch {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      const res = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Heart className="h-14 w-14 text-muted-foreground/40" />
        <div>
          <p className="text-base font-semibold text-foreground">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save products you love and find them here.
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-foreground">
        Wishlist
        <span className="ml-2 text-sm font-normal text-muted-foreground">({products.length})</span>
      </h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = product.images?.[0]
          const hasDiscount =
            product.originalMinPrice > product.minPrice
          const discountPct = hasDiscount
            ? Math.round(((product.originalMinPrice - product.minPrice) / product.originalMinPrice) * 100)
            : 0

          return (
            <div
              key={product._id}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden aspect-square bg-muted">
                {image ? (
                  <img
                    src={image.link}
                    alt={image.alt ?? product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                {hasDiscount && (
                  <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                    -{discountPct}%
                  </span>
                )}
              </Link>

              {/* Remove button */}
              <button
                onClick={() => handleRemove(product._id)}
                disabled={removingId === product._id}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                aria-label="Remove from wishlist"
              >
                {removingId === product._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>

              {/* Info */}
              <div className="p-4">
                <Link href={`/shop/${product.slug}`} className="hover:underline">
                  <p className="line-clamp-2 text-sm font-medium text-foreground leading-snug">
                    {product.name}
                  </p>
                </Link>

                {product.rating !== undefined && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span>{product.rating.toFixed(1)}</span>
                    {product.totalReviews !== undefined && (
                      <span>({product.totalReviews})</span>
                    )}
                  </div>
                )}

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-foreground">
                    ₹{product.minPrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalMinPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <Link
                  href={`/shop/${product.slug}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View Product
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
