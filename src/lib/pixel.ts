declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void
  }
}

function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("track", event, params)
}

// ── Standard events ───────────────────────────────────────────────────────

export function pixelViewContent(params: {
  content_ids: string[]
  content_name: string
  content_category?: string
  value: number
  currency: "INR"
}) {
  fbq("ViewContent", { content_type: "product", ...params })
}

export function pixelAddToCart(params: {
  content_ids: string[]
  content_name: string
  value: number
  currency: "INR"
  num_items: number
}) {
  fbq("AddToCart", { content_type: "product", ...params })
}

export function pixelAddToWishlist(params: {
  content_ids: string[]
  content_name?: string
  value?: number
  currency?: "INR"
}) {
  fbq("AddToWishlist", { content_type: "product", ...params })
}

export function pixelInitiateCheckout(params: {
  content_ids: string[]
  num_items: number
  value: number
  currency: "INR"
}) {
  fbq("InitiateCheckout", params)
}

export function pixelPurchase(params: {
  content_ids: string[]
  value: number
  currency: "INR"
  num_items: number
}) {
  fbq("Purchase", params)
}

export function pixelSearch(searchString: string) {
  fbq("Search", { search_string: searchString })
}
