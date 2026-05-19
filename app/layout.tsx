import type { Metadata } from "next"
import { Inter, Krub } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/lib/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { AuthProvider } from "@/lib/auth-context"
import { WishlistProvider } from "@/lib/wishlist-context"

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
      data-scroll-behavior="smooth"
      className={cn(
        "h-full antialiased",
        inter.variable,
        krub.variable,
      )}
    >
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1660011611684181');fbq('track','PageView');`}
      </Script>
      <body className="flex min-h-dvh flex-col bg-[var(--color-bg)] font-[var(--font-body)] text-[var(--color-text-primary)]">
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1660011611684181&ev=PageView&noscript=1" alt="" />
        </noscript>
        <AuthProvider>
        <WishlistProvider>
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
        </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
