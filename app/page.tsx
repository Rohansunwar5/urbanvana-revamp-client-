import { HeroSection } from "@/components/sections/hero-section"
import { TrustBar } from "@/components/sections/trust-bar"
import { ProblemSolution } from "@/components/sections/problem-solution"
import { CategorySection } from "@/components/sections/category-grid"
import { BestsellerStrip } from "@/components/sections/bestseller-strip"
import { ProductCarousel } from "@/components/sections/product-carousel"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Testimonials } from "@/components/sections/testimonials"
import { NewsletterBand } from "@/components/sections/newsletter-band"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BestsellerStrip />
      <CategorySection />
      <ProductCarousel />
      <ProblemSolution />
      <HowItWorks />
      <Testimonials />
      <NewsletterBand />
    </>
  )
}
