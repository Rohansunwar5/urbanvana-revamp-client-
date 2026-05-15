import Link from "next/link"
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Truck,
  Award,
  Share2,
} from "lucide-react"
import { Container } from "@/components/layout/container"

/* ── Trust signals bar ──────────────────────────────────────────────────── */
const TRUST_SIGNALS = [
  { icon: Truck,       label: "Free shipping over ₹999"    },
  { icon: RefreshCw,   label: "30-day easy returns"         },
  { icon: ShieldCheck, label: "100% secure checkout"        },
  { icon: Award,       label: "Non-toxic certified nutrients"},
]

/* ── Footer link columns ─────────────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "Aeroponic Towers",  href: "/shop/towers"   },
      { label: "Seeds & Plants",    href: "/shop/seeds"    },
      { label: "Nutrients",         href: "/shop/nutrients"},
      { label: "Starter Bundles",   href: "/shop/bundles"  },
      { label: "All Products",      href: "/shop"          },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "How Aeroponics Works", href: "/learn/how-aeroponics-works" },
      { label: "Setup Guide",          href: "/learn/setup-guide"          },
      { label: "Growing Tips",         href: "/learn/growing-tips"         },
      { label: "Nutrient Guide",       href: "/learn/nutrients"            },
      { label: "Blog",                 href: "/learn"                      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",       href: "/about"   },
      { label: "Our Story",      href: "/about#story" },
      { label: "Sustainability", href: "/about#sustainability" },
      { label: "Careers",        href: "/careers" },
      { label: "Press",          href: "/press"   },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help & Support",   href: "/support"         },
      { label: "Order Tracking",   href: "/account/orders"  },
      { label: "Shipping Policy",  href: "/shipping"        },
      { label: "Return Policy",    href: "/returns"         },
      { label: "Contact Us",       href: "/contact"         },
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
            className="grid grid-cols-2 gap-4 py-8 md:grid-cols-4"
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
                  className="shrink-0 text-[var(--color-primary)]"
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
                <Leaf
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-[var(--color-primary)]"
                />
                <span className="font-heading text-xl font-bold text-white">
                  Urbanvana
                </span>
              </Link>

              <p className="mt-4 max-w-[240px] font-body text-sm leading-relaxed text-white/60">
                Grow fresh food at home with our aeroponic tower systems.
                Zero soil, pure results — every single day.
              </p>

              {/* Contact */}
              <address className="mt-6 not-italic space-y-2">
                <a
                  href="mailto:hello@urbanvana.in"
                  className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[4px]"
                >
                  <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
                  hello@urbanvana.in
                </a>
                <a
                  href="tel:+918000000000"
                  className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[4px]"
                >
                  <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
                  +91 80000 00000
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
                  { href: "https://instagram.com/urbanvana", icon: Share2, label: "Instagram" },
                  { href: "https://facebook.com/urbanvana",  icon: Share2, label: "Facebook"  },
                  { href: "https://youtube.com/@urbanvana",  icon: Share2, label: "YouTube"   },
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
                    <li key={link.href}>
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
