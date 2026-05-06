import type { Metadata } from "next"
import { Inter, Krub } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/lib/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"

/* Primary — Inter: clean geometric sans, headings + UI */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

/* Secondary — Krub: friendly rounded sans, body copy */
const krub = Krub({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-krub",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Urbanvana — Grow Fresh, Every Day",
    template: "%s | Urbanvana",
  },
  description:
    "Premium aeroponic towers, seeds, plants, and nutrients for growing fresh food at home. Zero soil. Pure results.",
  keywords: [
    "aeroponic tower",
    "indoor growing",
    "hydroponics",
    "grow at home",
    "seeds",
    "nutrients",
    "vertical garden",
  ],
  openGraph: {
    type: "website",
    siteName: "Urbanvana",
    title: "Urbanvana — Grow Fresh, Every Day",
    description:
      "Premium aeroponic towers, seeds, plants, and nutrients for growing fresh food at home.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urbanvana — Grow Fresh, Every Day",
    description:
      "Premium aeroponic towers, seeds, plants, and nutrients for growing fresh food at home.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        krub.variable,
      )}
    >
      <body className="flex min-h-dvh flex-col bg-[var(--color-bg)] font-[var(--font-body)] text-[var(--color-text-primary)]">
        <CartProvider>
          {/* Skip to main content — first focusable element */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />

          {/* Cart drawer — rendered at root so it overlays everything */}
          <CartDrawer />

          {/* Sonner toast portal — z-toast (100) */}
          <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "font-body text-sm rounded-[8px] shadow-[var(--shadow-lg)] border border-[var(--color-border)]",
              success: "bg-white text-[var(--color-text-primary)]",
              error:   "bg-white text-[var(--color-error)]",
            },
          }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
