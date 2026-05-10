'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { cn } from '@/lib/utils'

interface WishlistBtnProps {
  productId: string
  className?: string
  iconClassName?: string
}

export function WishlistBtn({ productId, className, iconClassName }: WishlistBtnProps) {
  const { wishlisted, toggle } = useWishlist()
  const isWishlisted = wishlisted.has(productId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-150',
        isWishlisted
          ? 'text-rose-500 hover:text-rose-600 hover:scale-110'
          : 'text-[var(--color-text-muted)] hover:text-rose-400 hover:scale-110',
        className,
      )}
    >
      <Heart
        className={cn('h-4 w-4', isWishlisted && 'fill-current', iconClassName)}
        strokeWidth={isWishlisted ? 0 : 1.5}
      />
    </button>
  )
}
