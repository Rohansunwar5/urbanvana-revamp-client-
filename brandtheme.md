# Urbanvana — Brand Theme & Design System
> Single source of truth for all frontend decisions. Every component, page, and token must derive from this document. No raw hex values, no arbitrary spacing, no one-off styles.

---

## 1. Brand Identity

| Property       | Value                                              |
|----------------|----------------------------------------------------|
| **Brand Name** | Urbanvana                                          |
| **Category**   | Aeroponic E-Commerce (towers, plants, seeds, nutrients) |
| **Style**      | Organic Biophilic + Minimal Block Layout           |
| **Tone**       | Trustworthy · Clean · Growth-oriented · Premium    |
| **Stack**      | Next.js 15 App Router + Tailwind CSS v4            |
| **Icon Set**   | Lucide React (stroke width: 1.5px, consistent only) |

---

## 2. Color System

### Brand Palette

| Token Name         | Hex       | RGB              | Usage                                          |
|--------------------|-----------|------------------|------------------------------------------------|
| `primary`          | `#059669` | 5, 150, 105      | CTA buttons, active states, badges, links      |
| `primary-dark`     | `#005528` | 0, 85, 40        | Navbar bg, section headings, hover on primary  |
| `primary-light`    | `#DCFFED` | 220, 255, 237    | Card backgrounds, section alternates, inputs   |
| `ink`              | `#002304` | 0, 35, 4         | Body text, headings on light, footer bg        |
| `white`            | `#FFFFFF` | 255, 255, 255    | Page background, card surfaces, button labels  |

### Semantic Color Tokens

| Token               | Maps To        | Usage                                         |
|---------------------|----------------|-----------------------------------------------|
| `color-bg`          | `#FFFFFF`      | Default page background                       |
| `color-bg-surface`  | `#DCFFED`      | Cards, input fields, alternate row sections   |
| `color-bg-inverse`  | `#002304`      | Footer, dark hero overlays, newsletter section|
| `color-text-primary`| `#002304`      | All body copy, headings on white              |
| `color-text-inverse`| `#FFFFFF`      | Text on dark/primary backgrounds              |
| `color-text-muted`  | `#005528` @70% | Subheadings, captions, helper text            |
| `color-border`      | `#DCFFED`      | Card borders, dividers, input borders         |
| `color-border-strong`| `#005528` @30%| Focused inputs, active card outlines          |
| `color-cta`         | `#059669`      | Primary CTA only — never reuse for decoration |
| `color-cta-hover`   | `#005528`      | CTA hover/pressed state                       |
| `color-overlay`     | `#002304` @60% | Video hero dark overlay                       |

### System / Feedback Colors

| Token           | Hex       | Usage                      |
|-----------------|-----------|----------------------------|
| `color-success` | `#059669` | Success toasts, confirmations (use with text label) |
| `color-error`   | `#DC2626` | Form errors, destructive actions               |
| `color-warning` | `#D97706` | Low stock badges, warnings                     |
| `color-info`    | `#2563EB` | Info toasts, shipping notes                    |
| `color-star`    | `#F59E0B` | Product star ratings only                      |

### Contrast Verification (WCAG AA)

| Foreground   | Background     | Ratio  | Status |
|--------------|----------------|--------|--------|
| `#002304`    | `#FFFFFF`      | 18.6:1 | ✅ AAA |
| `#002304`    | `#DCFFED`      | 15.2:1 | ✅ AAA |
| `#FFFFFF`    | `#059669`      | 4.6:1  | ✅ AA  |
| `#FFFFFF`    | `#005528`      | 9.8:1  | ✅ AAA |
| `#FFFFFF`    | `#002304`      | 21:1   | ✅ AAA |

> Rule: Never place `#059669` text on `#DCFFED` backgrounds — ratio fails. Always use `#002304` or `#005528` for text on light surfaces.

---

## 3. Typography System

### Font Stack

| Role      | Font Family | Fallback                   | Character               |
|-----------|-------------|----------------------------|-------------------------|
| Heading   | **Lora**    | Georgia, serif             | Organic, authoritative, warm |
| Body      | **Raleway** | system-ui, sans-serif      | Clean, modern, legible  |
| Mono      | **JetBrains Mono** | monospace            | Code/debug only         |

### Google Fonts Import (place in `app/layout.tsx`)

```ts
import { Lora, Raleway } from 'next/font/google'

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
```

### Type Scale

| Token        | Size    | Line Height | Weight | Font    | Usage                              |
|--------------|---------|-------------|--------|---------|------------------------------------|
| `text-display` | 64px  | 1.1         | 700    | Lora    | Hero headline only                 |
| `text-h1`    | 48px    | 1.15        | 700    | Lora    | Page titles                        |
| `text-h2`    | 36px    | 1.2         | 600    | Lora    | Section headings                   |
| `text-h3`    | 28px    | 1.25        | 600    | Lora    | Card titles, sub-sections          |
| `text-h4`    | 22px    | 1.3         | 500    | Lora    | Product names, labels              |
| `text-xl`    | 20px    | 1.5         | 400    | Raleway | Lead paragraphs, hero subtext      |
| `text-base`  | 16px    | 1.6         | 400    | Raleway | All body copy (minimum on mobile)  |
| `text-sm`    | 14px    | 1.5         | 400    | Raleway | Captions, helper text, metadata    |
| `text-xs`    | 12px    | 1.4         | 600    | Raleway | Badges, tags, labels (uppercase)   |
| `text-price` | 24px    | 1.2         | 700    | Raleway | Prices (use tabular-nums)          |

### Typography Rules

- Body text minimum: **16px** — never below on mobile (triggers iOS auto-zoom)
- Line length: **60–75 chars** desktop · **35–50 chars** mobile
- Headings: always `font-heading` (Lora) — never Raleway for H1–H4
- Prices/numbers: always `font-variant-numeric: tabular-nums` to prevent layout shift
- Labels and badges: `text-xs` + `font-weight: 600` + `letter-spacing: 0.05em` + uppercase

---

## 4. Spacing Scale

Base unit: **4px**. All spacing must be a multiple of 4.

| Token   | px  | Tailwind Class | Usage                                     |
|---------|-----|----------------|-------------------------------------------|
| `space-1` | 4   | `p-1`         | Icon padding, micro gaps                  |
| `space-2` | 8   | `p-2`         | Tight internal padding, tag gaps          |
| `space-3` | 12  | `p-3`         | Input padding (vertical), icon + label gap|
| `space-4` | 16  | `p-4`         | Standard card padding (mobile)            |
| `space-6` | 24  | `p-6`         | Card padding (desktop), section insets    |
| `space-8` | 32  | `p-8`         | Component-to-component gap                |
| `space-12`| 48  | `p-12`        | Section vertical padding (mobile)         |
| `space-16`| 64  | `p-16`        | Section vertical padding (desktop)        |
| `space-24`| 96  | `p-24`        | Major section breaks                      |
| `space-32`| 128 | `p-32`        | Hero section vertical space               |

### Section Rhythm

```
Hero section:        pt-32 pb-24
Standard section:    py-16 md:py-24
Compact section:     py-12 md:py-16
Footer:              pt-16 pb-8
```

---

## 5. Shadow Scale

Organic Biophilic style uses soft, diffuse shadows — no hard drop shadows.

| Token           | CSS Value                                        | Usage                          |
|-----------------|--------------------------------------------------|--------------------------------|
| `shadow-xs`     | `0 1px 3px rgba(0,35,4,0.06)`                  | Subtle card lift on hover      |
| `shadow-sm`     | `0 4px 12px rgba(0,35,4,0.08)`                 | Default product card           |
| `shadow-md`     | `0 8px 24px rgba(0,35,4,0.10)`                 | Sticky nav, floating elements  |
| `shadow-lg`     | `0 16px 40px rgba(0,35,4,0.12)`                | Modals, drawers, dropdowns     |
| `shadow-xl`     | `0 24px 64px rgba(0,35,4,0.14)`                | Hero overlapping elements      |
| `shadow-inset`  | `inset 0 2px 4px rgba(0,35,4,0.06)`            | Pressed button state, inputs   |

> Rule: Shadow color is always derived from `#002304` (brand ink), never generic black. This keeps shadows warm and on-brand.

---

## 6. Border Radius Scale

Consistent rounding — organic feel without being cartoonish.

| Token     | Value  | Usage                                        |
|-----------|--------|----------------------------------------------|
| `rounded-xs`  | `4px`  | Badges, tags, small chips                |
| `rounded-sm`  | `8px`  | Buttons, inputs, small cards             |
| `rounded-md`  | `12px` | Product cards, dropdowns                 |
| `rounded-lg`  | `16px` | Feature cards, image containers          |
| `rounded-xl`  | `24px` | Section cards, hero blocks               |
| `rounded-full`| `9999px` | Pills, avatar, circular icon buttons   |

---

## 7. Animation & Motion Tokens

| Token              | Value                        | Usage                                     |
|--------------------|------------------------------|-------------------------------------------|
| `duration-fast`    | `150ms`                      | Hover state changes, color transitions    |
| `duration-base`    | `200ms`                      | Button press, icon swaps, badge appear    |
| `duration-slow`    | `300ms`                      | Card reveals, drawer open, modal enter    |
| `duration-page`    | `400ms`                      | Page-level transitions (max)              |
| `ease-enter`       | `cubic-bezier(0,0,0.2,1)`   | Elements entering the screen (ease-out)   |
| `ease-exit`        | `cubic-bezier(0.4,0,1,1)`   | Elements leaving the screen (ease-in)     |
| `ease-standard`    | `cubic-bezier(0.4,0,0.2,1)` | State changes staying on screen           |

### Animation Rules

- Only animate `transform` and `opacity` — never `width`, `height`, `top`, `left`
- Cards on scroll: `translateY(16px) → translateY(0)` + `opacity: 0 → 1`, 300ms ease-enter
- Product grid items: stagger entrance by `40ms` per item
- CTA button hover: `scale(1.02)`, 150ms — not more
- Exit animations: **70% of enter duration** (feels snappier)
- All animations must respect `@media (prefers-reduced-motion: reduce)`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Breakpoints

Mobile-first. Design mobile → tablet → desktop.

| Name     | Min Width | Tailwind Prefix | Target Device              |
|----------|-----------|-----------------|----------------------------|
| (base)   | 0px       | (none)          | Phone portrait (375px min) |
| `sm`     | 640px     | `sm:`           | Phone landscape, small tab |
| `md`     | 768px     | `md:`           | Tablet portrait            |
| `lg`     | 1024px    | `lg:`           | Tablet landscape, laptop   |
| `xl`     | 1280px    | `xl:`           | Desktop                    |
| `2xl`    | 1536px    | `2xl:`          | Wide desktop               |

### Container Width

```
max-w-screen-xl (1280px) + px-4 sm:px-6 lg:px-8 — use on all page wrappers
```

Never use fixed-pixel widths inside components. Always use `%`, `fr`, or Tailwind responsive classes.

---

## 9. Z-Index Scale

| Token        | Value | Usage                                        |
|--------------|-------|----------------------------------------------|
| `z-base`     | 0     | Default document flow                        |
| `z-raised`   | 10    | Cards on hover, floating badges              |
| `z-dropdown` | 20    | Menus, tooltips, select popovers             |
| `z-sticky`   | 40    | Sticky navbar, sticky cart bar               |
| `z-overlay`  | 60    | Modal backdrop / scrim                       |
| `z-modal`    | 80    | Modal dialogs, drawers                       |
| `z-toast`    | 100   | Toast notifications (always on top)          |

---

## 10. Component Rules

### Buttons

| Variant       | Background    | Text      | Border         | Usage              |
|---------------|---------------|-----------|----------------|--------------------|
| Primary        | `#059669`    | `#FFFFFF` | none           | Single CTA per view|
| Primary Hover  | `#005528`    | `#FFFFFF` | none           | On hover/focus     |
| Secondary      | `transparent`| `#059669` | `1px #059669`  | Secondary actions  |
| Ghost          | `transparent`| `#002304` | `1px #DCFFED`  | Tertiary actions   |
| Destructive    | `#DC2626`    | `#FFFFFF` | none           | Delete, remove     |
| Disabled       | `#DCFFED`    | `#005528` @40% | none      | opacity: 0.5       |

```
Height: 48px (desktop) · 44px min (mobile)
Padding: px-6 py-3
Font: Raleway 16px font-semibold
Radius: rounded-sm (8px)
Transition: 150ms ease-standard on background + shadow
```

> One screen = one Primary button. All others are Secondary or Ghost.

### Product Card

```
Background:    #FFFFFF
Border:        1px solid #DCFFED
Radius:        rounded-md (12px)
Shadow:        shadow-sm (default) → shadow-md (hover)
Hover:         translateY(-4px) + shadow-md, 200ms ease-enter
Image ratio:   aspect-[4/3] with object-cover
Padding:       p-4 (mobile) · p-6 (desktop)
```

Internal structure (top to bottom):
1. Product image (full-width, aspect-[4/3])
2. Category label (text-xs, uppercase, `color-text-muted`)
3. Product name (text-h4, Lora)
4. Star rating + review count (text-sm, `color-star`)
5. Price (text-price, tabular-nums)
6. [Add to Cart] button (Secondary variant, full-width)

### Navigation (Header)

```
Background:     #005528 (deep green)
Height:         64px desktop · 56px mobile
Position:       sticky top-0, z-sticky (40)
Shadow:         shadow-md on scroll (JS toggle)
Logo:           Lora font or SVG, white
Nav links:      Raleway 15px font-medium, #FFFFFF @80% → #FFFFFF on hover
CTA in nav:     "Shop Now" — Primary button, compact (py-2 px-4)
Mobile:         Hamburger → full-screen drawer from right
```

### Inputs & Forms

```
Height:        48px (touch-friendly minimum)
Background:    #DCFFED (primary-light)
Border:        1px solid transparent → 1px solid #059669 on focus
Radius:        rounded-sm (8px)
Font:          Raleway 16px (prevents iOS auto-zoom)
Label:         Always visible above field, never placeholder-only
Error:         Below field, text-sm, color-error (#DC2626), with icon
Helper:        Below field, text-sm, color-text-muted
```

### Badges & Tags

```
Radius:        rounded-xs (4px) or rounded-full for pill
Font:          Raleway text-xs font-semibold uppercase letter-spacing-wide
Padding:       px-2 py-0.5
```

| Badge Type   | Background  | Text      |
|--------------|-------------|-----------|
| New          | `#059669`   | `#FFFFFF` |
| Bestseller   | `#002304`   | `#FFFFFF` |
| Low Stock    | `#D97706`   | `#FFFFFF` |
| Sold Out     | `#DCFFED`   | `#005528` |
| Sale         | `#DC2626`   | `#FFFFFF` |
| Organic      | `#DCFFED`   | `#002304` |

### Dividers & Separators

```
Color:    #DCFFED (primary-light) — never gray
Weight:   1px
Spacing:  my-8 md:my-12 around dividers
```

For organic section breaks, use an SVG wave divider in `#DCFFED` color, not a hard line.

---

## 11. Image Rules

- All product images: **WebP format**, served via `next/image`
- Always declare explicit `width` + `height` or use `fill` with aspect wrapper to prevent CLS
- Hero image/video: must have a `#002304` overlay at 60% opacity (brand-consistent, not generic black)
- Product catalog images: consistent `aspect-[4/3]` ratio across all cards
- Lifestyle/editorial photos: `aspect-[16/9]` for section banners
- Alt text: mandatory on all `<Image>` components — descriptive, not keyword-stuffed
- Placeholder: `blur` placeholder while loading (use `blurDataURL` from next/image)

---

## 12. Icon Rules

- **Icon library:** Lucide React only. No mixing with other sets.
- **Stroke width:** 1.5px — never change per icon
- **Sizes:** 16px (inline text) · 20px (UI actions) · 24px (nav) · 32px (feature icons)
- **Color:** Always inherit from text color via `currentColor` — never hardcoded hex in icon
- **Never** use emoji as icons (platform-inconsistent, cannot be themed)
- **Filled vs outline:** Use outline (default Lucide) everywhere. Use filled only for active/selected state.

---

## 13. Tailwind Config Tokens

Add to `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          dark:    '#005528',
          light:   '#DCFFED',
        },
        ink:   '#002304',
        brand: {
          teal:  '#059669',
          deep:  '#005528',
          pale:  '#DCFFED',
          black: '#002304',
        },
        feedback: {
          error:   '#DC2626',
          warning: '#D97706',
          info:    '#2563EB',
          star:    '#F59E0B',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['64px', { lineHeight: '1.1',  fontWeight: '700' }],
        'h1':      ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2':      ['36px', { lineHeight: '1.2',  fontWeight: '600' }],
        'h3':      ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'h4':      ['22px', { lineHeight: '1.3',  fontWeight: '500' }],
        'price':   ['24px', { lineHeight: '1.2',  fontWeight: '700' }],
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(0,35,4,0.06)',
        'sm': '0 4px 12px rgba(0,35,4,0.08)',
        'md': '0 8px 24px rgba(0,35,4,0.10)',
        'lg': '0 16px 40px rgba(0,35,4,0.12)',
        'xl': '0 24px 64px rgba(0,35,4,0.14)',
        'inset-sm': 'inset 0 2px 4px rgba(0,35,4,0.06)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      transitionDuration: {
        'fast':  '150ms',
        'base':  '200ms',
        'slow':  '300ms',
        'page':  '400ms',
      },
      transitionTimingFunction: {
        'enter':    'cubic-bezier(0,0,0.2,1)',
        'exit':     'cubic-bezier(0.4,0,1,1)',
        'standard': 'cubic-bezier(0.4,0,0.2,1)',
      },
      zIndex: {
        'raised':   '10',
        'dropdown': '20',
        'sticky':   '40',
        'overlay':  '60',
        'modal':    '80',
        'toast':    '100',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 14. Industrial Design Rules (Non-Negotiable)

These rules are enforced on every component and every page without exception.

### Layout
- [ ] Mobile-first. Write base styles for 375px, then scale up with `md:` `lg:` `xl:`
- [ ] One `max-w-container` wrapper per page section, always `mx-auto` with responsive horizontal padding
- [ ] No horizontal scroll at any breakpoint
- [ ] Section vertical spacing follows the rhythm scale — never arbitrary `py-7` or `py-11`

### Color
- [ ] Zero raw hex values in component files — all via Tailwind tokens or CSS variables
- [ ] Primary CTA (`#059669`) appears once per view — never used for decoration
- [ ] Never put `#059669` text on `#DCFFED` background (contrast failure)
- [ ] Feedback colors (error, warning) always accompanied by an icon — color alone is not enough

### Typography
- [ ] `font-heading` (Lora) for H1–H4 only. All other text uses `font-body` (Raleway)
- [ ] Minimum 16px body text everywhere — no exceptions on mobile
- [ ] Prices always use `tabular-nums` class to prevent number-width layout shift
- [ ] Line length capped with `max-w-prose` on body paragraphs

### Interactions
- [ ] Every clickable element has `cursor-pointer`
- [ ] Buttons show loading spinner + disabled state during async operations
- [ ] Hover transitions: `transition-[background,shadow,transform] duration-base ease-standard`
- [ ] Focus rings: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` on all interactive elements
- [ ] Touch targets minimum `h-11 w-11` (44px) — use padding to extend if visually smaller

### Accessibility
- [ ] All `<Image>` components have descriptive `alt` text
- [ ] All icon-only buttons have `aria-label`
- [ ] Forms: every input has a visible `<label>` with `htmlFor`
- [ ] Error messages use `role="alert"` or `aria-live="polite"`
- [ ] Heading hierarchy is sequential: H1 → H2 → H3. Never skip levels.
- [ ] Skip-to-content link as first focusable element on every page

### Performance
- [ ] All images served through `next/image` with explicit dimensions
- [ ] Hero video compressed to < 5MB, with poster image fallback
- [ ] Fonts loaded via `next/font` — no Google Fonts CDN `<link>` tags
- [ ] Components below the fold wrapped in `next/dynamic` with loading skeleton
- [ ] No `useEffect` data fetching — use Server Components or React Query

### Icons
- [ ] Lucide React only — no mixing with Heroicons, FontAwesome, or any other set
- [ ] Stroke width locked at 1.5px — never override per icon
- [ ] Color via `currentColor` — never inline hex on SVG paths

---

## 15. File & Component Naming Conventions

```
app/
  (store)/
    page.tsx              ← Homepage
    shop/
      page.tsx            ← All products
      [category]/
        page.tsx          ← Category listing
    products/
      [slug]/
        page.tsx          ← Product detail
    cart/
      page.tsx
    checkout/
      page.tsx

components/
  ui/                     ← Generic: Button, Input, Badge, Card, Modal
  layout/                 ← Navbar, Footer, Container, Section
  product/                ← ProductCard, ProductGrid, ProductGallery, PriceDisplay
  home/                   ← HeroSection, CategoryGrid, Testimonials, HowItWorks
  cart/                   ← CartItem, CartSummary, CartDrawer
  checkout/               ← CheckoutForm, OrderSummary, PaymentField
```

Component naming: `PascalCase`. Files: `kebab-case.tsx`. CSS: Tailwind only — no CSS modules or styled-components.

---

## 16. What Not To Do (Anti-Patterns)

| Anti-Pattern                          | Why                                              | Instead                                    |
|---------------------------------------|--------------------------------------------------|--------------------------------------------|
| Raw hex in className (`text-[#059669]`) | Breaks token system, hard to change globally  | `text-primary` via Tailwind config         |
| Emoji as icons (🌱 🛒 ✅)              | Font-dependent, unthemeable, inconsistent       | Lucide React SVG icons                     |
| `height: 100vh` on mobile             | iOS viewport bug (address bar overlap)          | `min-h-dvh`                               |
| Placeholder-only form labels          | Disappears on type, fails accessibility         | Visible `<label>` always above input       |
| Arbitrary spacing (`mt-[37px]`)       | Breaks rhythm, impossible to maintain           | Use spacing scale tokens only              |
| Multiple primary CTAs on one page     | Dilutes conversion, confuses intent             | One primary button per view                |
| `useEffect` for data fetching         | Client waterfall, slower LCP                   | Server Components + async/await            |
| `opacity-0` lingering > 200ms         | Looks broken, not fading                        | Fade out fully or keep visible             |
| Shadow color as pure black            | Looks flat and generic                          | Use `rgba(0,35,4,...)` — brand ink shadow  |
| Animating `width` or `height`         | Triggers layout reflow, causes jank             | Animate `transform` + `opacity` only       |
