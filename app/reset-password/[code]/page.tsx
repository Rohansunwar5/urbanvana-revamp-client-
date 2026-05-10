"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/input"

type ValidState = "checking" | "valid" | "invalid"

export default function ResetPasswordPage() {
  const params = useParams<{ code: string }>()
  const router = useRouter()
  const [validState, setValidState] = React.useState<ValidState>("checking")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState("")
  const called = React.useRef(false)

  /* Verify the code is still valid on mount */
  React.useEffect(() => {
    if (called.current) return
    called.current = true

    fetch(`/api/auth/reset-password/${params.code}`)
      .then((r) => setValidState(r.ok ? "valid" : "invalid"))
      .catch(() => setValidState("invalid"))
  }, [params.code])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/reset-password/${params.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message ?? "Failed to reset password")
        return
      }
      setDone(true)
      toast.success("Password reset! Please sign in.")
      setTimeout(() => router.push("/"), 2000)
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

        {validState === "checking" && (
          <div className="text-center py-4">
            <Loader2 size={36} className="mx-auto mb-3 animate-spin text-[var(--color-primary)]" />
            <p className="font-body text-sm text-[var(--color-text-muted)]">Verifying link…</p>
          </div>
        )}

        {validState === "invalid" && (
          <div className="text-center">
            <XCircle size={40} className="mx-auto mb-4 text-[var(--color-error)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Link expired
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              This reset link is no longer valid. Request a new one.
            </p>
            <Link
              href="/forgot-password"
              className={cn(buttonVariants({ variant: "primary", size: "full" }), "mt-6")}
            >
              Request New Link
            </Link>
          </div>
        )}

        {validState === "valid" && done && (
          <div className="text-center">
            <CheckCircle size={40} className="mx-auto mb-4 text-[var(--color-primary)]" />
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Password updated!
            </h1>
            <p className="mt-2 font-body text-sm text-[var(--color-text-muted)]">
              Redirecting you to the home page…
            </p>
          </div>
        )}

        {validState === "valid" && !done && (
          <>
            <h1 className="font-heading text-xl font-semibold text-[var(--color-text-primary)]">
              Set new password
            </h1>
            <p className="mt-1 font-body text-sm text-[var(--color-text-muted)]">
              Choose a strong password with at least 8 characters.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!error}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] focus-visible:outline-none"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {error && <FieldError>{error}</FieldError>}
              </div>

              <Button type="submit" variant="primary" size="full" loading={loading}>
                Update Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
