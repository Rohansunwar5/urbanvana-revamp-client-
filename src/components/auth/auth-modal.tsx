"use client"

import * as React from "react"
import { toast } from "sonner"
import { Leaf, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, Label, FieldError } from "@/components/ui/input"

/* ── Types ───────────────────────────────────────────────────────────── */

type Tab = "login" | "signup"

type AuthModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: Tab
  onSuccess?: () => void
}

/* ── Auth Modal ──────────────────────────────────────────────────────── */

export function AuthModal({ open, onOpenChange, defaultTab = "login", onSuccess }: AuthModalProps) {
  const [tab, setTab] = React.useState<Tab>(defaultTab)
  const { refresh } = useAuth()

  React.useEffect(() => {
    if (open) setTab(defaultTab)
  }, [open, defaultTab])

  const handleSuccess = React.useCallback(async () => {
    await refresh()
    onSuccess?.()
    onOpenChange(false)
  }, [refresh, onOpenChange, onSuccess])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 pt-6 pb-5 border-b border-[var(--color-border)]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-primary)]">
            <Leaf size={13} strokeWidth={1.5} className="text-white" aria-hidden="true" />
          </span>
          <div>
            <DialogTitle className="text-base leading-tight">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              {tab === "login"
                ? "Sign in to your Urbanvana account"
                : "Start growing fresh food at home"}
            </DialogDescription>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--color-border)]">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-150",
                tab === t
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] -mb-px"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-6 py-5">
          {tab === "login" ? (
            <LoginForm onSuccess={handleSuccess} onSwitchTab={() => setTab("signup")} />
          ) : (
            <SignupForm onSuccess={handleSuccess} onSwitchTab={() => setTab("login")} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── Login Form ──────────────────────────────────────────────────────── */

function LoginForm({
  onSuccess,
  onSwitchTab,
}: {
  onSuccess: () => void
  onSwitchTab: () => void
}) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        const msg = json.message ?? "Login failed"
        if (json.errors?.length) {
          const fieldErrors: Record<string, string> = {}
          for (const err of json.errors) {
            if (err.field) fieldErrors[err.field] = err.message
          }
          setErrors(fieldErrors)
        } else {
          toast.error(msg)
        }
        return
      }
      toast.success("Welcome back!")
      onSuccess()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <a
            href="/forgot-password"
            className="font-body text-[11px] text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
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
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      <Button type="submit" variant="primary" size="full" loading={loading} className="mt-1">
        Sign In
      </Button>

      <p className="text-center font-body text-[12px] text-[var(--color-text-muted)]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Create one
        </button>
      </p>
    </form>
  )
}

/* ── Signup Form ─────────────────────────────────────────────────────── */

function SignupForm({
  onSuccess,
  onSwitchTab,
}: {
  onSuccess: () => void
  onSwitchTab: () => void
}) {
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [signedUp, setSignedUp] = React.useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.errors?.length) {
          const fieldErrors: Record<string, string> = {}
          for (const err of json.errors) {
            if (err.field) fieldErrors[err.field] = err.message
          }
          setErrors(fieldErrors)
          if (!Object.keys(fieldErrors).length) toast.error(json.message ?? "Signup failed")
        } else {
          toast.error(json.message ?? "Signup failed")
        }
        return
      }
      setSignedUp(true)
      await onSuccess()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (signedUp) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
          <Leaf size={22} className="text-[var(--color-primary)]" />
        </span>
        <p className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
          Account created!
        </p>
        <p className="font-body text-sm text-[var(--color-text-muted)]">
          Check your email to verify your address and unlock all features.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-firstname">
            First name <span className="text-[var(--color-error)]">*</span>
          </Label>
          <Input
            id="signup-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
            value={form.firstName}
            onChange={set("firstName")}
            aria-invalid={!!errors.firstName}
            required
          />
          {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-lastname">Last name</Label>
          <Input
            id="signup-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            value={form.lastName}
            onChange={set("lastName")}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">
          Email address <span className="text-[var(--color-error)]">*</span>
        </Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">
          Password <span className="text-[var(--color-error)]">*</span>
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            aria-invalid={!!errors.password}
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
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      <Button type="submit" variant="primary" size="full" loading={loading} className="mt-1">
        Create Account
      </Button>

      <p className="text-center font-body text-[12px] text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
