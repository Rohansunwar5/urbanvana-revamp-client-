"use client"

import * as React from "react"
import Link from "next/link"
import { Leaf, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message ?? "Something went wrong")
        return
      }
      setSent(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-lg)]">
        {/* Logo */}
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-primary)]">
            <Leaf size={13} strokeWidth={1.5} className="text-white" />
          </span>
          <span className="font-heading text-[14px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
            Urbanvana
          </span>
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle size={40} className="mx-auto mb-4 text-[var(--color-primary)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Check your email
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.
            </p>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "full" }), "mt-6")}>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Reset password
            </h1>
            <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reset-email">Email address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  required
                />
                {error && <FieldError>{error}</FieldError>}
              </div>

              <Button type="submit" variant="primary" size="full" loading={loading}>
                Send Reset Link
              </Button>
            </form>

            <div className="mt-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <ArrowLeft size={12} />
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
