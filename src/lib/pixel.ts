declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function dl(): unknown[] {
  if (typeof window === "undefined") return []
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

function clearEcommerce() {
  dl().push({ ecommerce: null })
}

function generateEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function sendToServer(eventName: string, data: Record<string, unknown>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, ...data }),
  }).catch(() => {})
}

// ── Standard events ───────────────────────────────────────────────────────────

export function pixelViewContent(params: {
  content_ids: string[]
  content_name: string
  content_category?: string
  value: number
  currency: "INR"
}) {
  if (typeof window === "undefined") return
  const eventId = generateEventId("view_item")
  clearEcommerce()
  dl().push({
    event: "view_item",
    meta_event_id: eventId,
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.content_ids.map((id) => ({
        item_id: id,
        item_name: params.content_name,
        item_category: params.content_category,
        price: params.value,
        quantity: 1,
      })),
    },
  })
}

export function pixelAddToCart(params: {
  content_ids: string[]
  content_name: string
  value: number
  currency: "INR"
  num_items: number
}) {
  if (typeof window === "undefined") return
  const eventId = generateEventId("add_to_cart")
  clearEcommerce()
  dl().push({
    event: "add_to_cart",
    meta_event_id: eventId,
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.content_ids.map((id) => ({
        item_id: id,
        item_name: params.content_name,
        price: params.num_items > 0 ? params.value / params.num_items : params.value,
        quantity: params.num_items,
      })),
    },
  })
  sendToServer("AddToCart", {
    eventId,
    value: params.value,
    currency: params.currency,
    contentIds: params.content_ids,
    contentName: params.content_name,
    contentType: "product",
  })
}

export function pixelAddToWishlist(params: {
  content_ids: string[]
  content_name?: string
  value?: number
  currency?: "INR"
}) {
  if (typeof window === "undefined") return
  dl().push({
    event: "add_to_wishlist",
    ecommerce: {
      currency: params.currency ?? "INR",
      value: params.value ?? 0,
      items: params.content_ids.map((id) => ({
        item_id: id,
        item_name: params.content_name ?? id,
        price: params.value ?? 0,
        quantity: 1,
      })),
    },
  })
}

export function pixelInitiateCheckout(params: {
  content_ids: string[]
  num_items: number
  value: number
  currency: "INR"
}) {
  if (typeof window === "undefined") return
  const eventId = generateEventId("begin_checkout")
  clearEcommerce()
  dl().push({
    event: "begin_checkout",
    meta_event_id: eventId,
    ecommerce: {
      currency: params.currency,
      value: params.value,
      items: params.content_ids.map((id) => ({
        item_id: id,
        item_name: id,
        price: params.num_items > 0 ? params.value / params.num_items : params.value,
        quantity: 1,
      })),
    },
  })
  sendToServer("InitiateCheckout", {
    eventId,
    value: params.value,
    currency: params.currency,
    contentIds: params.content_ids,
    numItems: params.num_items,
  })
}

export function pixelPurchase(params: {
  content_ids: string[]
  value: number
  currency: "INR"
  num_items: number
  orderId?: string
  userEmail?: string
  userPhone?: string
  userFirstName?: string
  userLastName?: string
  userZip?: string
}) {
  if (typeof window === "undefined") return
  const eventId = generateEventId(`purchase_${params.orderId ?? "unknown"}`)
  clearEcommerce()
  dl().push({
    event: "purchase",
    meta_event_id: eventId,
    enhanced_conversion_data: {
      email: params.userEmail,
    },
    ecommerce: {
      transaction_id: params.orderId,
      currency: params.currency,
      value: params.value,
      items: params.content_ids.map((id) => ({
        item_id: id,
        item_name: id,
        price: params.num_items > 0 ? params.value / params.num_items : params.value,
        quantity: 1,
      })),
    },
  })
  sendToServer("Purchase", {
    eventId,
    orderId: params.orderId,
    value: params.value,
    currency: params.currency,
    contentIds: params.content_ids,
    numItems: params.num_items,
    contentType: "product",
    userEmail: params.userEmail,
    userPhone: params.userPhone,
    userFirstName: params.userFirstName,
    userLastName: params.userLastName,
    userZip: params.userZip,
  })
}

export function pixelSearch(searchString: string) {
  if (typeof window === "undefined") return
  dl().push({
    event: "search",
    search_term: searchString,
  })
}
