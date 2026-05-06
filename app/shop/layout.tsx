import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse aeroponic towers, starter bundles, nutrients, and accessories. Free shipping on orders over ₹999.",
  openGraph: {
    title: "Shop All Products | Urbanvana",
    description:
      "Browse aeroponic towers, starter bundles, nutrients, and accessories.",
    type: "website",
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
