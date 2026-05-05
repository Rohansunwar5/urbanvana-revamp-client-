import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Container ──────────────────────────────────────────────────────────────
   Single consistent max-width wrapper used by every section.
   Rule: never set fixed px widths inside — use this and let it constrain.
   max-w-screen-xl = 1280px, responsive horizontal padding per breakpoints.
───────────────────────────────────────────────────────────────────────────── */
function Container({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────────────────────
   Semantic <section> that enforces the vertical rhythm scale from brandtheme.
   Variants:
     default  → py-12 md:py-24  (standard sections)
     compact  → py-8  md:py-16  (tight sections like trust bar)
     hero     → pt-32 pb-24     (hero only)
     dark     → bg-[--color-bg-inverse] (footer, newsletter band)
     surface  → bg-[--color-bg-surface] (alternate sections)
───────────────────────────────────────────────────────────────────────────── */
interface SectionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "compact" | "hero" | "dark" | "surface"
  contained?: boolean
}

function Section({
  className,
  variant = "default",
  contained = true,
  children,
  ...props
}: SectionProps) {
  const variantClasses = {
    default: "py-12 md:py-24",
    compact: "py-8 md:py-16",
    hero:    "pt-32 pb-24",
    dark:    "py-12 md:py-24 bg-[var(--color-bg-inverse)]",
    surface: "py-12 md:py-24 bg-[var(--color-bg-surface)]",
  }

  return (
    <section
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}

export { Container, Section }
