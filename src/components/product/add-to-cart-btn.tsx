"use client"

import * as React from "react"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface AddToCartBtnProps {
  productId: string
  disabled?: boolean
  className?: string
  onAdd?: (productId: string) => Promise<void>
}

type BtnState = "idle" | "loading" | "success"

/* ── AddToCartBtn ────────────────────────────────────────────────────────
   brandtheme rules:
   - idle: primary green, ShoppingCart icon
   - loading: spinner, disabled, "Adding…" sr text
   - success: pale-green bg + primary text + Check icon, 1.8s then resets
   - active:scale-[0.98] press feedback consistent with Button
   - min-height 48px touch target
   - never blocks interaction longer than necessary
───────────────────────────────────────────────────────────────────────── */

const SUCCESS_DURATION = 1800

function AddToCartBtn({
  productId,
  disabled,
  className,
  onAdd,
}: AddToCartBtnProps) {
  const [state, setState] = React.useState<BtnState>("idle")
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const cart = useCart()

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleClick() {
    if (state !== "idle" || disabled) return

    setState("loading")
    try {
      if (onAdd) {
        await onAdd(productId)
      } else {
        await new Promise((r) => setTimeout(r, 500))
        cart.addItem(productId)
      }
      setState("success")
      timerRef.current = setTimeout(() => setState("idle"), SUCCESS_DURATION)
    } catch {
      setState("idle")
    }
  }

  const isLoading = state === "loading"
  const isSuccess = state === "success"
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={
        isLoading ? "Adding to cart" : isSuccess ? "Added to cart" : "Add to cart"
      }
      aria-live="polite"
      className={cn(
        /* base */
        "relative flex w-full items-center justify-center gap-2",
        "min-h-[48px] rounded-[10px] px-5",
        "font-body text-sm font-semibold leading-none",
        "transition-all duration-[150ms]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        "cursor-pointer select-none",
        /* idle / loading */
        !isSuccess && [
          "bg-[var(--color-primary)] text-white",
          "hover:bg-[var(--color-primary-dark)]",
          "active:scale-[0.98]",
          isDisabled && "opacity-60 cursor-not-allowed active:scale-100",
        ],
        /* success */
        isSuccess && [
          "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
          "cursor-default",
        ],
        className
      )}
    >
      {isLoading && (
        <Loader2
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 animate-spin"
        />
      )}
      {isSuccess && (
        <Check
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0"
        />
      )}
      {!isLoading && !isSuccess && (
        <ShoppingCart
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0"
        />
      )}

      <span>
        {isLoading ? "Adding…" : isSuccess ? "Added!" : "Add to Cart"}
      </span>
    </button>
  )
}

export { AddToCartBtn }
