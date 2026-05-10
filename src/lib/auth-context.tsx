"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

/* ── Types ───────────────────────────────────────────────────────────── */

export type AuthUser = {
  _id: string
  firstName: string
  lastName: string
  email: string
  verified: boolean
  img?: { link: string; source: string }
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  /** Re-fetch the profile (call after login/signup from the modal) */
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

/* ── Context ─────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/profile", { credentials: "include" })
      if (!res.ok) {
        setUser(null)
        return
      }
      const json = await res.json()
      setUser(json.data as AuthUser)
    } catch {
      setUser(null)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setUser(null)
  }, [])

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false))
  }, [fetchProfile])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
