'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Package, ChevronRight, XCircle, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/models/order.model'

interface OrderItem {
  productName: string
  image: string
  qty: number
  priceAtPurchase: number
  attributeLabels: string[]
}

interface Order {
  orderId: string
  status: OrderStatus
  payment: { status: string; gateway: string }
  billing: { total: number; couponDiscount: number; shippingCharge: number }
  items: OrderItem[]
  createdAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Payment Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const fetchOrders = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?page=${p}&limit=10`, { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to fetch orders')
      setOrders(json.data.orders)
      setPagination(json.data.pagination)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders(page)
  }, [page, fetchOrders])

  const handleCancel = async (orderId: string) => {
    if (!confirm('Cancel this order?')) return
    setCancelling(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Could not cancel order')
      toast.success('Order cancelled')
      fetchOrders(page)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Package className="h-14 w-14 text-muted-foreground/40" />
        <div>
          <p className="text-base font-semibold text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Your order history will appear here.</p>
        </div>
        <Link
          href="/shop"
          className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-foreground">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const canCancel = ['pending', 'confirmed'].includes(order.status)
          const firstItem = order.items[0]
          const extraCount = order.items.length - 1

          return (
            <div
              key={order.orderId}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">#{order.orderId}</span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground',
                    )}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Items preview */}
              <div className="flex items-center gap-4 px-5 py-4">
                {firstItem.image && (
                  <div className="relative shrink-0">
                    <img
                      src={firstItem.image}
                      alt={firstItem.productName}
                      className="h-16 w-16 rounded-lg object-cover border border-border"
                    />
                    {firstItem.qty > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold">
                        {firstItem.qty}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{firstItem.productName}</p>
                  {firstItem.attributeLabels.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {firstItem.attributeLabels.join(' · ')}
                    </p>
                  )}
                  {extraCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">+{extraCount} more item{extraCount > 1 ? 's' : ''}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    ₹{order.billing.total.toLocaleString('en-IN')}
                  </p>
                  {order.payment.gateway === 'cod' && (
                    <p className="text-xs text-muted-foreground">COD</p>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
                {canCancel ? (
                  <button
                    onClick={() => handleCancel(order.orderId)}
                    disabled={cancelling === order.orderId}
                    className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                  >
                    {cancelling === order.orderId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Cancel Order
                  </button>
                ) : (
                  <span />
                )}
                <Link
                  href={`/orders/${order.orderId}`}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View Details
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
