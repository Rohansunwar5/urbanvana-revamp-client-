import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

const CATEGORY_SLUGS = ["towers", "bundles", "nutrients", "seeds"]

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ...CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  })),
  { url: `${SITE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/learn/how-aeroponics-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/learn/setup-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/learn/nutrient-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/learn/growing-tips`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${SITE_URL}/learn/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/support/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
  { url: `${SITE_URL}/support/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
]

async function getProductUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const connectDB = (await import("@/lib/db")).default
    await connectDB()
    const productService = (await import("@/lib/services/catalog/product.service")).default
    const result = await productService.listProducts({ limit: 500, page: 1 })
    return (result.products ?? []).map((p: { slug: string }) => ({
      url: `${SITE_URL}/shop/p/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    return []
  }
}

async function getBlogUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const { BLOG_ARTICLES } = await import("@/content/blog")
    return BLOG_ARTICLES.map((a) => ({
      url: `${SITE_URL}/learn/blog/${a.slug}`,
      lastModified: new Date(a.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productUrls, blogUrls] = await Promise.all([getProductUrls(), getBlogUrls()])
  return [...STATIC_ROUTES, ...productUrls, ...blogUrls]
}
