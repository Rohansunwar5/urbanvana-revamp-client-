/* ── Catalog API types — mirrors what the service layer returns ──────── */

export type BadgeVariant = 'primary' | 'accent'

export type ProductBadge = {
  label: string
  variant: BadgeVariant
}

/** Shape returned by listProducts, getFeaturedProducts, getBestsellers */
export type CatalogProduct = {
  _id: string
  name: string
  slug: string
  description: string
  images: string[]
  badge: ProductBadge | null
  rating: number
  totalReviews: number
  /** ObjectId string — use categories list to resolve name */
  category: string
  isFeatured: boolean
  minPrice: number
  originalMinPrice: number
  /** _id of the cheapest active in-stock variant — used to add directly to cart from listing pages */
  defaultVariantId?: string
  /** Attribute value labels of the default variant e.g. ["100ml", "Tropical"] */
  defaultVariantLabels?: string[]
}

export type ProductVariantAttribute = {
  attributeId: string
  attributeName: string
  attributeSlug: string
  valueId: string
  valueLabel: string
  valueSlug: string
}

export type ProductVariant = {
  _id: string
  productId: string
  sku: string
  price: number
  originalPrice?: number
  stock: number
  attributes: ProductVariantAttribute[]
  images?: string[]
  isActive: boolean
}

export type ProductDetail = {
  _id: string
  name: string
  slug: string
  description: string
  details: string
  materials: string
  shipping: string
  /** May be populated to { _id, name, slug } or remain as ObjectId string */
  category: { _id: string; name: string; slug: string } | string
  images: string[]
  badge: ProductBadge | null
  rating: number
  totalReviews: number
  isFeatured: boolean
}

export type ProductDetailResponse = {
  product: ProductDetail
  variants: ProductVariant[]
}

export type ApiCategory = {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  displayOrder: number
}

export type Review = {
  _id: string
  productId: string
  userId: string
  rating: number
  title: string
  body?: string
  createdAt: string
}

export type Pagination = {
  total: number
  page: number
  limit: number
  pages: number
}

export type PaginatedProducts = {
  products: CatalogProduct[]
  pagination: Pagination
}

export type PaginatedReviews = {
  reviews: Review[]
  pagination: Pagination
}

/** Shape of a cart item as returned by the cart API */
export type ApiCartItem = {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  sku: string
  image: string
  attributeLabels: string[]
  priceSnapshot: number
  originalPriceSnapshot: number
  currentPrice: number
  priceChanged: boolean
  qty: number
}
