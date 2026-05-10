"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type State = "verifying" | "success" | "error"

export default function VerifyEmailPage() {
  const params = useParams<{ code: string }>()
  const [state, setState] = React.useState<State>("verifying")
  const called = React.useRef(false)

  React.useEffect(() => {
    if (called.current) return
    called.current = true

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify-email/${params.code}`, {
          method: "PATCH",
        })
        setState(res.ok ? "success" : "error")
      } catch {
        setState("error")
      }
    }

    verify()
  }, [params.code])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-lg)]">
        {/* Logo */}
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-primary)]">
            <Leaf size={13} strokeWidth={1.5} className="text-white" />
          </span>
          <span className="font-heading text-[14px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
            Urbanvana
          </span>
        </Link>

        {state === "verifying" && (
          <>
            <Loader2 size={40} className="mx-auto mb-4 animate-spin text-[var(--color-primary)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Verifying your email…
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              Please wait a moment.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle size={40} className="mx-auto mb-4 text-[var(--color-primary)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Email verified!
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              Your email address has been confirmed. You now have full access to your account.
            </p>
            <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "full" }), "mt-6")}>
              Back to Home
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle size={40} className="mx-auto mb-4 text-[var(--color-error)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Invalid or expired link
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              This verification link is no longer valid. Sign in to request a new one.
            </p>
            <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "full" }), "mt-6")}>
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
