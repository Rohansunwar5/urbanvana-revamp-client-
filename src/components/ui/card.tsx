import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Card — 12px radius, ink-tinted shadow, pale green surface ── */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden rounded-[12px]",
        "bg-[var(--color-card)] text-[var(--color-card-foreground)]",
        "border border-[var(--color-border)]",
        "shadow-[var(--shadow-sm)]",
        "transition-[box-shadow,transform] duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  )
}

/* ── CardHoverable — product card with lift on hover ── */
function CardHoverable({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "hover:-translate-y-1 hover:shadow-[var(--shadow-md)] cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-heading text-[var(--font-size-h4)] font-semibold leading-tight",
        "text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "font-body text-sm text-[var(--color-text-muted)] leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 p-6 pt-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHoverable,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
