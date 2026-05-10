"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu, X, ShoppingCart, Search, ChevronDown,
  LogOut, Package, User,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"

/* ── Nav definitions ─────────────────────────────────────────────────── */

type NavCategory = { label: string; href: string; desc: string }

const STATIC_NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Learn",        href: "/learn" },
  { label: "About",        href: "/about" },
]

function useNavCategories() {
  const [categories, setCategories] = React.useState<NavCategory[]>([])

  React.useEffect(() => {
    fetch("/api/catalog/categories")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (!json?.data) return
        const cats = (json.data as Array<{ slug: string; name: string; description?: string }>)
          .map((c) => ({ label: c.name, href: `/shop?category=${c.slug}`, desc: c.description ?? "" }))
        setCategories(cats)
      })
      .catch(() => {})
  }, [])

  return categories
}

/* ── User Avatar ─────────────────────────────────────────────────────── */

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-heading text-[11px] font-bold text-white transition-colors duration-150 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 w-[200px] origin-top-right overflow-hidden rounded-[12px] border border-white/10 bg-[#003d1e] shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            {/* User info */}
            <div className="border-b border-white/[0.08] px-4 py-3">
              <p className="font-heading text-[12px] font-bold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="font-body text-[11px] text-white/50 truncate mt-0.5">
                {user?.email}
              </p>
              {!user?.verified && (
                <span className="mt-1.5 inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 font-body text-[10px] text-amber-400">
                  Email unverified
                </span>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors duration-150 hover:bg-white/8 hover:text-white"
              >
                <User size={13} strokeWidth={1.5} aria-hidden="true" />
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors duration-150 hover:bg-white/8 hover:text-white"
              >
                <Package size={13} strokeWidth={1.5} aria-hidden="true" />
                My Orders
              </Link>
            </div>

            <div className="border-t border-white/[0.08] py-1.5">
              <button
                onClick={async () => { setOpen(false); await logout() }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white/50 transition-colors duration-150 hover:bg-white/8 hover:text-white/80"
              >
                <LogOut size={13} strokeWidth={1.5} aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────────── */

function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled]     = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [shopOpen, setShopOpen]     = React.useState(false)
  const [authOpen, setAuthOpen]     = React.useState(false)
  const dropdownRef                 = React.useRef<HTMLLIElement>(null)
  const { totalItems, openCart }    = useCart()
  const { user, loading, logout }   = useAuth()
  const router                      = useRouter()
  const navCategories               = useNavCategories()

  /* Open auth modal from anywhere via custom event (e.g. wishlist button) */
  React.useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener('urbanvana:open-auth', handler)
    return () => window.removeEventListener('urbanvana:open-auth', handler)
  }, [])

  /* Transparent only on homepage while at the very top */
  const isHome        = pathname === "/"
  const isTransparent = isHome && !scrolled

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    setDrawerOpen(false)
    setShopOpen(false)
  }, [pathname])

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  /* Close dropdown when clicking outside */
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false)
      }
    }
    if (shopOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [shopOpen])

  return (
    <>
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-[40] w-full",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "px-4 pt-3 md:px-8 md:pt-4" : "px-0 pt-0"
        )}
      >
        {/* Floating pill */}
        <div
          className={cn(
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "border",
            !isTransparent
              ? "bg-[#005528] backdrop-blur-xl border-white/[0.1] shadow-[0_8px_40px_rgba(0,35,4,0.4)]"
              : scrolled
                ? "rounded-[16px] bg-[#005528]/95 backdrop-blur-xl border-white/[0.1] shadow-[0_8px_40px_rgba(0,35,4,0.4)]"
                : "bg-transparent border-transparent",
            scrolled ? "rounded-[16px]" : "rounded-none",
          )}
        >

        <Container>
          <nav
            aria-label="Main navigation"
            className={cn(
              "flex items-center justify-between transition-all duration-500",
              scrolled ? "h-[56px] md:h-[60px]" : "h-[68px] md:h-[72px]"
            )}
          >
            {/* ── Logo ─────────────────────────────────────────────── */}
            <Link
              href="/"
              aria-label="Urbanvana — go to homepage"
              className="flex items-center rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Image
                src="/logo.png"
                alt="Urbanvana"
                width={140}
                height={52}
                className="h-10 w-auto"
                style={{ mixBlendMode: "screen" }}
                priority
              />
            </Link>

            {/* ── Desktop nav ──────────────────────────────────────── */}
            <ul role="list" className="hidden items-center gap-0 md:flex">
              {/* Shop dropdown */}
              <li ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShopOpen((o) => !o)}
                  aria-expanded={shopOpen}
                  aria-haspopup="true"
                  className="group relative flex items-center gap-1 px-4 py-2 focus-visible:outline-none"
                >
                  <span className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 transition-colors duration-200 group-hover:text-white">
                    Shop
                  </span>
                  <ChevronDown
                    size={11}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={cn(
                      "text-white/50 transition-all duration-200 group-hover:text-white",
                      shopOpen && "rotate-180"
                    )}
                  />
                  <span className="absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-white/40 transition-transform duration-200 group-hover:scale-x-100" aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
                      className="absolute left-0 top-full mt-3 min-w-[240px] origin-top-left"
                    >
                      <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#003d1e] shadow-[0_24px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                        {/* "All Products" always shown */}
                        <Link
                          href="/shop"
                          role="menuitem"
                          onClick={() => setShopOpen(false)}
                          className={cn(
                            "group/item flex items-center gap-3 px-5 py-3 transition-colors duration-150",
                            "hover:bg-white/8 focus-visible:outline-none focus-visible:bg-white/8",
                            navCategories.length > 0 && "border-b border-white/[0.06]"
                          )}
                        >
                          <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity duration-150 group-hover/item:opacity-100" aria-hidden="true" />
                          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/90 transition-colors duration-150 group-hover/item:text-white">
                            All Products
                          </p>
                        </Link>
                        {navCategories.map((cat, i) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            role="menuitem"
                            onClick={() => setShopOpen(false)}
                            className={cn(
                              "group/item flex items-center gap-3 px-5 py-3 transition-colors duration-150",
                              "hover:bg-white/8 focus-visible:outline-none focus-visible:bg-white/8",
                              i < navCategories.length - 1 && "border-b border-white/[0.06]"
                            )}
                          >
                            <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity duration-150 group-hover/item:opacity-100" aria-hidden="true" />
                            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/90 transition-colors duration-150 group-hover/item:text-white">
                              {cat.label}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Other nav links */}
              {STATIC_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative flex px-4 py-2 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "font-heading text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200",
                        pathname === link.href ? "text-white" : "text-white/70 group-hover:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        "absolute inset-x-4 bottom-0 h-px bg-white/40 transition-transform duration-200 origin-left",
                        pathname === link.href ? "scale-x-100 bg-[var(--color-primary)]" : "scale-x-0 group-hover:scale-x-100"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Desktop right actions ─────────────────────────────── */}
            <div className="hidden items-center gap-1 md:flex">
              {/* Search */}
              <button
                onClick={() => router.push('/search')}
                aria-label="Search products"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <Search size={17} strokeWidth={1.5} aria-hidden="true" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-[8px] text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <ShoppingCart size={17} strokeWidth={1.5} aria-hidden="true" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 16, stiffness: 300 }}
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 font-body text-[9px] font-bold leading-none text-white tabular-nums"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth — sign in button or user avatar */}
              {!loading && (
                <>
                  {user ? (
                    <div className="ml-1">
                      <UserMenu />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="ml-1 flex h-8 items-center rounded-full border border-white/20 bg-white/10 px-4 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      Sign In
                    </button>
                  )}
                </>
              )}

              {/* Shop Now CTA */}
              <Link
                href="/shop"
                className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Shop Now
              </Link>
            </div>

            {/* ── Mobile right ──────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 md:hidden">
              <button
                onClick={openCart}
                aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-[8px] text-white/70 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <ShoppingCart size={18} strokeWidth={1.5} aria-hidden="true" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge-mob"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 16, stiffness: 300 }}
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 font-body text-[9px] font-bold leading-none text-white tabular-nums"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav-drawer"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] text-white/70 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </nav>
        </Container>
        </div>{/* end floating pill */}
      </header>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Spacer — only on non-home pages to push content below fixed nav */}
      {!isHome && <div className="h-[68px] md:h-[72px]" aria-hidden="true" />}

      {/* ── Mobile backdrop ───────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="mob-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="presentation"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[50] bg-[#002304]/70 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <motion.aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        initial={false}
        animate={{ x: drawerOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.8 }}
        className="fixed inset-y-0 right-0 z-[60] flex w-[300px] max-w-[90vw] flex-col bg-[#002304] shadow-[var(--shadow-xl)]"
      >
        {/* Drawer header */}
        <div className="flex h-[68px] items-center justify-between border-b border-white/[0.08] px-5">
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            <Image
              src="/logo.png"
              alt="Urbanvana"
              width={110}
              height={40}
              className="h-8 w-auto"
              style={{ mixBlendMode: "screen" }}
            />
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* Links */}
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto py-6">
          {/* Shop sub-links */}
          <p className="px-5 pb-2 font-heading text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
            Shop
          </p>
          <ul role="list" className="mb-4">
            <li>
              <Link
                href="/shop"
                className="flex items-center justify-between px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
              >
                All Products
              </Link>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="flex items-center justify-between px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-5 h-px bg-white/[0.08]" />

          {/* Other links */}
          <ul role="list" className="mt-4">
            {STATIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center px-5 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-150 focus-visible:outline-none focus-visible:text-white",
                    pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-5 mt-4 h-px bg-white/[0.08]" />

          {/* Mobile auth */}
          <div className="mt-4 px-5">
            {user ? (
              <div className="flex flex-col gap-1">
                <p className="font-heading text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 mb-1">
                  Account
                </p>
                <Link
                  href="/account"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 hover:text-white"
                >
                  <User size={13} strokeWidth={1.5} /> My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 hover:text-white"
                >
                  <Package size={13} strokeWidth={1.5} /> My Orders
                </Link>
                <button
                  onClick={async () => { setDrawerOpen(false); await logout() }}
                  className="flex items-center gap-2 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white/80"
                >
                  <LogOut size={13} strokeWidth={1.5} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setDrawerOpen(false); setAuthOpen(true) }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-150 hover:bg-white/20"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="border-t border-white/[0.08] p-5">
          <Link
            href="/shop"
            onClick={() => setDrawerOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-150 active:scale-[0.95] hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002304]"
          >
            Shop Now
          </Link>
        </div>
      </motion.aside>
    </>
  )
}

export { Navbar }
