'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'

function Spinner() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function LoginContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'
  const successRef = useRef(false)

  // Already logged in — skip straight to destination
  useEffect(() => {
    if (!loading && user) router.replace(next)
  }, [user, loading, router, next])

  const handleSuccess = () => {
    successRef.current = true
    router.replace(next)
  }

  const handleOpenChange = (open: boolean) => {
    // Dismissed without logging in → go home
    if (!open && !successRef.current) router.replace('/')
  }

  if (loading || user) return <Spinner />

  return (
    // Empty backdrop — the modal renders via the Dialog portal so it floats above everything
    <div className="min-h-[80vh]" aria-hidden="true">
      <AuthModal open={true} onOpenChange={handleOpenChange} onSuccess={handleSuccess} />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginContent />
    </Suspense>
  )
}
