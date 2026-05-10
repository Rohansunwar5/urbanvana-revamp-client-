import dynamic from "next/dynamic"
import { HeroSection } from "@/components/sections/hero-section"
import { BestsellerStrip } from "@/components/sections/bestseller-strip"
import { CategorySection, type CategoryCardData } from "@/components/sections/category-grid"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Testimonials } from "@/components/sections/testimonials"
import { ProblemSolutionLazy } from "@/components/sections/problem-solution-lazy"
import connectDB from "@/lib/db"
import { ensureRedisConnected } from "@/lib/redis"
import productService from "@/lib/services/catalog/product.service"
import categoryService from "@/lib/services/catalog/category.service"
import type { CatalogProduct } from "@/lib/types/catalog"

// Heavy client components — code-split so they don't inflate initial JS bundle
const ProductCarousel = dynamic(() =>
  import("@/components/sections/product-carousel").then((m) => ({ default: m.ProductCarousel }))
)
const NewsletterBand = dynamic(() =>
  import("@/components/sections/newsletter-band").then((m) => ({ default: m.NewsletterBand }))
)

async function fetchHomeData(): Promise<{
  bestsellers: CatalogProduct[]
  featured: CatalogProduct[]
  categories: CategoryCardData[]
}> {
  try {
    await connectDB()
    ensureRedisConnected() // fire-and-forget — never block page render for Redis
    const [bestsellers, featured, rawCategories] = await Promise.all([
      productService.getBestsellers(),
      productService.getFeaturedProducts(),
      categoryService.listCategories(),
    ])
    const categories: CategoryCardData[] = (rawCategories as Array<{ slug: string; name: string; description?: string; image?: string }>).map(c => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
    }))
    return {
      bestsellers: bestsellers as unknown as CatalogProduct[],
      featured: featured as unknown as CatalogProduct[],
      categories,
    }
  } catch {
    return { bestsellers: [], featured: [], categories: [] }
  }
}

export default async function HomePage() {
  const { bestsellers, featured, categories } = await fetchHomeData()

  return (
    <>
      <HeroSection />
      <BestsellerStrip products={bestsellers} />
      <CategorySection categories={categories} />
      <ProductCarousel products={featured.length > 0 ? featured : bestsellers} />
      <ProblemSolutionLazy />
      {/* <HowItWorks /> */}
      <Testimonials />
      <NewsletterBand />
    </>
  )
}