type LoaderParams = { src: string; width: number; quality?: number }

// R2 public bucket URLs are served through Cloudflare's network directly.
// Routing them through the Next.js image optimization proxy causes ~7s timeouts
// on cold fetches. This loader serves R2 images straight from the edge,
// bypassing the proxy entirely.
export default function imageLoader({ src, width, quality }: LoaderParams): string {
  if (src.includes('.r2.dev') || src.startsWith('/')) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`
}
