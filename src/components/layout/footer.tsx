import Image from "next/image"
import Link from "next/link"
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Award,
  Share2,
} from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── Inline SVG icon components for branded social icons ─────────────────── */
function InstagramIcon({ size, ...props }: { size?: number; [key: string]: unknown }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size ?? 16} height={size ?? 16} {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedinIcon({ size, ...props }: { size?: number; [key: string]: unknown }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size ?? 16} height={size ?? 16} {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/* ── Trust signals bar ──────────────────────────────────────────────────── */
const TRUST_SIGNALS = [
  { icon: Truck,       label: "Free shipping over ₹999"    },
  { icon: ShieldCheck, label: "100% secure checkout"        },
  { icon: Award,       label: "Non GMO"                     },
  { icon: Phone,       label: "Call assistance"             },
]

/* ── Footer link columns ─────────────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "Aeroponic Towers",  href: "/shop?category=towers" },
      { label: "Seeds & Plants",    href: "/shop?category=seeds"  },
      { label: "Nutrients",         href: "/shop?category=nutrients" },
      { label: "Starter Bundles",   href: "/shop?category=bundles" },
      { label: "All Products",      href: "/shop"                 },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "How Aeroponics Works", href: "/learn" },
      { label: "Setup Guide",          href: "/learn" },
      { label: "Growing Tips",         href: "/learn" },
      { label: "Nutrient Guide",       href: "/learn" },
      { label: "Learning Center",      href: "/learn" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help & FAQ",      href: "/support" },
      { label: "Shipping Info",   href: "/support" },
      { label: "Contact Us",      href: "/support" },
    ],
  },
]

/* ── Footer ───────────────────────────────────────────────────────────────
   brandtheme:
   - bg: #002304 (ink / color-bg-inverse)
   - text: white
   - 4-col desktop → 2-col tablet → 1-col mobile
   - trust bar above footer columns
   - legal bar at bottom
────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="bg-[var(--color-bg-inverse)] text-white"
    >
      {/* ── Trust signals bar ── */}
      <div className="border-b border-white/10">
        <Container>
          <ul
            role="list"
            className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-4 lg:grid-cols-4"
            aria-label="Why shop with Urbanvana"
          >
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3"
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-white/80"
                />
                <span className="font-body text-sm font-medium text-white/80">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* ── Main footer body ── */}
      <Container>
        <div className="pt-16 pb-8">

          {/* ── Brand column + link columns ── */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">

            {/* Brand column — takes 2 cols on lg */}
            <div className="col-span-2 lg:col-span-1">
              <Link
                href="/"
                aria-label="Urbanvana homepage"
                className="inline-flex items-center gap-2 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Image
                  src="/logo.webp"
                  alt="Urbanvana"
                  width={140}
                  height={52}
                  className="h-10 w-auto"
                  style={{ mixBlendMode: "screen" }}
                />
              </Link>

              <p className="mt-4 max-w-[240px] font-body text-sm leading-relaxed text-white/60">
                Grow fresh food at home with our aeroponic tower systems.
                Zero soil, pure results — every single day.
              </p>

              {/* Contact */}
              <address className="mt-6 not-italic space-y-2">
                <a
                  href="mailto:urbanvana.co@gmail.com"
                  className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[4px]"
                >
                  <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
                  urbanvana.co@gmail.com
                </a>
                <a
                  href="tel:+919712779666"
                  className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[4px]"
                >
                  <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
                  +91 97127 79666
                </a>
                <span className="flex items-start gap-2 font-body text-sm text-white/60">
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  Bangalore, India
                </span>
              </address>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { href: "https://www.instagram.com/urbanvana.co?igsh=dGl1NXY1cms1MGVz", icon: InstagramIcon, label: "Instagram" },
                  { href: "https://www.linkedin.com/company/urbanvana.co", icon: LinkedinIcon, label: "LinkedIn" },
                  { href: "https://facebook.com/urbanvana",  icon: Share2,         label: "Facebook"  },
                  { href: "https://youtube.com/@urbanvana",  icon: Share2,         label: "YouTube"   },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Urbanvana on ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-white/40">
                  {col.heading}
                </h3>
                <ul role="list" className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-sm text-white/60 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[2px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Legal bar ── */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="font-body text-xs text-white/40">
              © {currentYear} Urbanvana. All rights reserved.
            </p>
            <nav aria-label="Legal links">
              <ul
                role="list"
                className="flex flex-wrap items-center gap-4"
              >
                {[
                  { label: "Privacy Policy",    href: "/privacy"  },
                  { label: "Terms of Service",  href: "/terms"    },
                  { label: "Cookie Policy",     href: "/cookies"  },
                  { label: "Sitemap",           href: "/sitemap.xml" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-xs text-white/40 hover:text-white/70 transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[2px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>
      </Container>
    </footer>
  )
}

export { Footer }
