"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — touch-friendly 48px height, brand font, fast transition
  [
    "relative inline-flex items-center justify-center gap-2",
    "min-h-[48px] px-6 py-3 rounded-[8px]",
    "font-body text-base font-semibold whitespace-nowrap",
    "cursor-pointer select-none",
    "transition-[background-color,box-shadow,transform,opacity]",
    "duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // ── Primary — the ONE CTA per view ──
        primary: [
          "bg-[var(--color-primary)] text-white",
          "hover:bg-[var(--color-primary-dark)]",
          "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        ],
        // ── Secondary — bordered outline ──
        secondary: [
          "bg-transparent text-[var(--color-primary)]",
          "border border-[var(--color-primary)]",
          "hover:bg-[var(--color-primary-light)]",
        ],
        // ── Ghost — tertiary actions ──
        ghost: [
          "bg-transparent text-[var(--color-ink)]",
          "border border-[var(--color-border)]",
          "hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)]",
        ],
        // ── Inverse — on dark sections (footer, hero) ──
        inverse: [
          "bg-white text-[var(--color-ink)]",
          "hover:bg-[var(--color-primary-light)]",
          "shadow-[var(--shadow-sm)]",
        ],
        // ── Destructive — delete / remove ──
        destructive: [
          "bg-[var(--color-error)] text-white",
          "hover:bg-red-700",
          "shadow-[var(--shadow-sm)]",
        ],
      },
      size: {
        default: "min-h-[48px] px-6 py-3 text-base",
        sm:      "min-h-[40px] px-4 py-2 text-sm rounded-[8px]",
        lg:      "min-h-[56px] px-8 py-4 text-lg",
        icon:    "min-h-[48px] min-w-[48px] px-0 py-0",
        full:    "min-h-[48px] w-full px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin"
            size={18}
            aria-hidden="true"
          />
        )}
        <span className={cn(loading && loadingText ? "" : "")}>
          {loading && loadingText ? loadingText : children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
