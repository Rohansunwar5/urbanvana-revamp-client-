'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Address {
  _id: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country?: string
  isDefault: boolean
}

type AddressForm = Omit<Address, '_id' | 'isDefault'>

const EMPTY_FORM: AddressForm = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/addresses', { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setAddresses(json.data)
    } catch {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const openAdd = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditId(addr._id)
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country ?? 'India',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = editId ? `/api/user/addresses/${editId}` : '/api/user/addresses'
      const method = editId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to save address')
      toast.success(editId ? 'Address updated' : 'Address added')
      closeForm()
      fetchAddresses()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save address')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      toast.success('Address deleted')
      setAddresses((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id)
    try {
      const res = await fetch(`/api/user/addresses/${id}/default`, {
        method: 'PATCH',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      toast.success('Default address updated')
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === id })),
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to set default')
    } finally {
      setSettingDefaultId(null)
    }
  }

  const field = (key: keyof AddressForm) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Addresses</h1>
        {addresses.length < 5 && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-semibold text-foreground">No saved addresses</p>
            <p className="mt-1 text-sm text-muted-foreground">Add an address for faster checkout.</p>
          </div>
          <button
            onClick={openAdd}
            className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>
      )}

      {/* Address cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={cn(
              'relative rounded-2xl border bg-card p-5 shadow-sm',
              addr.isDefault ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border',
            )}
          >
            {addr.isDefault && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Star className="h-3 w-3 fill-primary" />
                Default
              </span>
            )}
            <p className="font-semibold text-sm text-foreground pr-16">{addr.fullName}</p>
            <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
            </p>
            <p className="text-sm text-muted-foreground">
              {addr.city}, {addr.state} – {addr.pincode}
            </p>
            {addr.country && (
              <p className="text-sm text-muted-foreground">{addr.country}</p>
            )}

            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
              <button
                onClick={() => openEdit(addr)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  disabled={settingDefaultId === addr._id}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {settingDefaultId === addr._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Star className="h-3.5 w-3.5" />
                  )}
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr._id)}
                disabled={deletingId === addr._id}
                className="ml-auto flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline disabled:opacity-50"
              >
                {deletingId === addr._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {editId ? 'Edit Address' : 'New Address'}
            </h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <input {...field('fullName')} required placeholder="Recipient name" className="input-base" />
              </FormField>
              <FormField label="Phone">
                <input {...field('phone')} required placeholder="10-digit mobile" className="input-base" />
              </FormField>
            </div>

            <FormField label="Address Line 1">
              <input {...field('line1')} required placeholder="Street, building, flat" className="input-base" />
            </FormField>

            <FormField label="Address Line 2 (optional)">
              <input {...field('line2')} placeholder="Landmark, area" className="input-base" />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="City">
                <input {...field('city')} required placeholder="City" className="input-base" />
              </FormField>
              <FormField label="State">
                <input {...field('state')} required placeholder="State" className="input-base" />
              </FormField>
              <FormField label="Pincode">
                <input {...field('pincode')} required placeholder="6-digit PIN" maxLength={6} className="input-base" />
              </FormField>
            </div>

            <FormField label="Country">
              <input {...field('country')} placeholder="India" className="input-base" />
            </FormField>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editId ? 'Save Changes' : 'Add Address'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length >= 5 && !showForm && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Maximum 5 addresses allowed. Delete one to add another.
        </p>
      )}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}
