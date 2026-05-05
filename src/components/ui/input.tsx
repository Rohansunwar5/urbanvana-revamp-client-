import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Input field — 48px touch-friendly, brand focus ring ── */
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout
        "h-12 w-full min-w-0 rounded-[8px]",
        // Typography — 16px prevents iOS auto-zoom
        "font-body text-base text-[var(--color-text-primary)]",
        // Surface
        "bg-[var(--color-primary-light)] px-4 py-3",
        // Border — transparent default, brand on focus
        "border border-transparent",
        "transition-[border-color,box-shadow] duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        // Focus — brand ring, no outline
        "outline-none",
        "focus:border-[var(--color-primary)]",
        "focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0",
        "focus-visible:border-[var(--color-primary)]",
        // Placeholder
        "placeholder:text-[var(--color-text-muted)] placeholder:font-normal",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Error state — apply aria-invalid
        "aria-invalid:border-[var(--color-error)]",
        "aria-invalid:ring-2 aria-invalid:ring-[var(--color-error)]/20",
        // File input
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent",
        "file:text-sm file:font-medium file:text-[var(--color-ink)]",
        className
      )}
      {...props}
    />
  )
}

/* ── Label — always visible above field, never placeholder-only ── */
function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label
      className={cn(
        "block font-body text-sm font-medium text-[var(--color-text-primary)]",
        "mb-1.5",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[var(--color-error)]" aria-label="required">
          *
        </span>
      )}
    </label>
  )
}

/* ── FieldError — below field with role=alert for screen readers ── */
function FieldError({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null
  return (
    <p
      role="alert"
      aria-live="polite"
      className={cn(
        "mt-1.5 flex items-center gap-1",
        "font-body text-sm text-[var(--color-error)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/* ── FieldHelper — persistent helper text below input ── */
function FieldHelper({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null
  return (
    <p
      className={cn(
        "mt-1.5 font-body text-sm text-[var(--color-text-muted)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export { Input, Label, FieldError, FieldHelper }
