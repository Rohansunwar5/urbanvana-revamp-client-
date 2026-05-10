'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { Camera, Loader2, Trash2 } from 'lucide-react'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isdCode: string
  bio: string
  location: string
  img?: { link: string; source: string }
}

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => setProfile(json.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          isdCode: profile.isdCode,
          phoneNumber: profile.phoneNumber,
          bio: profile.bio,
          location: profile.location,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Update failed')
      toast.success('Profile updated')
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB')
      return
    }
    setImgUploading(true)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await fetch('/api/auth/profile-image', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Upload failed')
      toast.success('Profile photo updated')
      setProfile((p) => p ? { ...p, img: json.data.img } : p)
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setImgUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleRequestDeletion = async () => {
    if (deleteInput !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }
    try {
      const res = await fetch('/api/auth/request-account-deletion', {
        method: 'POST',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Request failed')
      toast.success('Account deletion email sent. Check your inbox.')
      setShowDeleteConfirm(false)
      setDeleteInput('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed')
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const avatarUrl = profile.img?.link
  const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-foreground">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold select-none">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={imgUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            aria-label="Upload photo"
          >
            {imgUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <p className="font-semibold text-foreground">{profile.firstName} {profile.lastName}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WebP · max 5 MB</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First Name">
            <input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              required
              className="input-base"
            />
          </Field>
          <Field label="Last Name">
            <input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              required
              className="input-base"
            />
          </Field>
        </div>

        <Field label="Email">
          <input value={profile.email} readOnly className="input-base opacity-60 cursor-not-allowed" />
          <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed.</p>
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="ISD Code">
            <input
              value={profile.isdCode}
              onChange={(e) => setProfile({ ...profile, isdCode: e.target.value })}
              placeholder="+91"
              className="input-base"
            />
          </Field>
          <Field label="Phone" className="sm:col-span-2">
            <input
              value={profile.phoneNumber}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              placeholder="10-digit mobile number"
              className="input-base"
            />
          </Field>
        </div>

        <Field label="Location">
          <input
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            placeholder="City, Country"
            className="input-base"
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            placeholder="A short bio about yourself"
            className="input-base resize-none"
          />
        </Field>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-sm font-semibold text-destructive mb-1">Danger Zone</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Requesting account deletion will send a confirmation email. The process is irreversible.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Request Account Deletion
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-foreground">
              Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="input-base max-w-xs"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRequestDeletion}
                className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}
