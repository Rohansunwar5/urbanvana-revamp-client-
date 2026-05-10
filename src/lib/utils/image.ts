/**
 * Resolve a product image path to a full URL.
 * - If the path is already a full URL (http/https), return as-is.
 * - Otherwise prepend NEXT_PUBLIC_CDN_URL.
 * - Falls back to a safe placeholder if empty.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '/placeholder-product.png'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const cdn = process.env.NEXT_PUBLIC_CDN_URL
  return cdn ? `${cdn.replace(/\/$/, '')}/${path}` : `/${path}`
}

/** Pick the first image from an images array, resolved to full URL */
export function getFirstImage(images: string[] | undefined): string {
  return getImageUrl(images?.[0])
}
