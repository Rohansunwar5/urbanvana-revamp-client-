"use client"

import * as React from "react"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface AddToCartBtnProps {
  variantId: string
  qty?: number
  disabled?: boolean
  className?: string
}

type BtnState = "idle" | "loading" | "success"

const SUCCESS_DURATION = 1800

function AddToCartBtn({ variantId, qty = 1, disabled, className }: AddToCartBtnProps) {
  const [state, setState] = React.useState<BtnState>("idle")
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const { addItem } = useCart()

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleClick() {
    if (state !== "idle" || disabled || !variantId) return
    setState("loading")
    try {
      await addItem(variantId, qty)
      setState("success")
      timerRef.current = setTimeout(() => setState("idle"), SUCCESS_DURATION)
    } catch (err) {
      setState("idle")
      toast.error(err instanceof Error ? err.message : "Could not add to cart")
    }
  }

  const isLoading = state === "loading"
  const isSuccess = state === "success"
  const isDisabled = disabled || isLoading || !variantId

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={isLoading ? "Adding to cart" : isSuccess ? "Added to cart" : "Add to cart"}
      aria-live="polite"
      className={cn(
        "relative flex w-full items-center justify-center gap-2",
        "min-h-[48px] rounded-full px-5",
        "font-body text-sm font-semibold leading-none",
        "transition-all duration-[150ms]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        "cursor-pointer select-none",
        !isSuccess && [
          "bg-[var(--color-primary)] text-white",
          "hover:bg-[var(--color-primary-dark)]",
          "active:scale-[0.95]",
          isDisabled && "opacity-60 cursor-not-allowed active:scale-100",
        ],
        isSuccess && [
          "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
          "cursor-default",
        ],
        className
      )}
    >
      {isLoading && <Loader2 size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0 animate-spin" />}
      {isSuccess && <Check size={16} strokeWidth={2} aria-hidden="true" className="shrink-0" />}
      {!isLoading && !isSuccess && <ShoppingCart size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />}
      <span>{isLoading ? "Adding…" : isSuccess ? "Added!" : "Add to Cart"}</span>
    </button>
  )
}

export { AddToCartBtn }
