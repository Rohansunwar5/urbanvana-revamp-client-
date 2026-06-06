# SEO Audit Remediation — Design

**Date:** 2026-06-06
**Author:** brainstorming session (Claude + user)
**Source:** `seo-audit_2026-06.pdf` (audit of live urbanvana.com, 04/06/2026)
**Codebase:** `urbanvana-revamp` (Next.js 16 App Router, React 19, Tailwind 4, MongoDB/Mongoose). Deployed on Vercel under the `urbanvana.com` domain — i.e. **this repo IS the live site.**

---

## 1. Context & key decisions

The audit was generated against the production site. Because this repo is what's deployed, the findings apply directly. However, auditing the actual code revealed that **several findings are already resolved in this build** and a few are partially done. The spec records the true state per finding so we don't redo finished work.

Confirmed decisions from brainstorming:

| Decision | Choice |
| --- | --- |
| Canonical host | `https://www.urbanvana.com` (www). Apex 301-redirects to www (Vercel domain config — out of code scope, noted for ops). |
| Content approach | Build all pages/routes/SEO scaffolding **and** write solid first-draft copy. User refines wording later. |
| Category URL structure | Categories take the clean slot: `/shop/towers`, `/shop/bundles`, `/shop/nutrients`, `/shop/seeds`. Products move to `/shop/p/[slug]`. 301 redirect `/shop/[slug]` → `/shop/p/[slug]`. |
| Site URL config | Single source of truth: `NEXT_PUBLIC_SITE_URL` env + `src/lib/site.ts` constant. |

### Audit findings — true state in this codebase

| # | Finding | Audit says | Actual in repo | Action |
| --- | --- | --- | --- | --- |
| 1 | robots.txt | 404 | No `app/robots.ts` | **Build** |
| 2 | XML sitemap | 404, dead footer link | No `app/sitemap.ts`; footer already links `/sitemap.xml` | **Build** |
| 3 | Canonical tags | Missing sitewide | No `metadataBase`, no `alternates.canonical` anywhere | **Build** |
| 4 | Category URL params | `?category=` | Confirmed: shop page + footer use `?category=` | **Build** (restructure) |
| 5 | "How it works" not indexable | anchor only | No `/how-it-works` route | **Build** |
| 6 | Missing og:image homepage | missing | Root metadata has OG title/desc but **no og:image** | **Build** |
| 7 | JS console errors | 1–2 per page | Unverified in code; needs runtime check | **Investigate** |
| 8 | No hreflang | missing | Confirmed missing | **Build** |
| 9 | Duplicate title/meta on /learn | copy of homepage | `/learn` has NO metadata export → inherits root default (so yes, effectively duplicate) | **Build** (add metadata) |
| 10 | Product titles too short | "City Tower 40" | `generateMetadata` sets `title: product.name` → template appends `| Urbanvana`, but no benefit descriptor | **Improve** |
| 11 | Footer links collapse to one URL | 5 Learn → /learn, Support → /support | Confirmed in `footer.tsx` | **Build** (real pages + fix links) |
| 12 | ALL CAPS headings in HTML | uppercase in HTML | Mixed — many headings use `uppercase` CSS already; some literal. Audit-low priority | **Audit & fix literals** |
| 13 | Footer `<h3>` nav labels | h3 | Confirmed: footer column headings are `<h3>` | **Fix** → `<p>` |
| 14 | No breadcrumbs | missing | Product page HAS breadcrumb (visual) but **no BreadcrumbList schema**; category pages new | **Build schema + category crumbs** |
| 15 | Empty anchor tags (logo/social) | empty | **Already fixed** — footer logo + socials have `aria-label`. Verify navbar logo too. | **Verify only** |
| 16 | Thin content | shop 192, learn 250, product 405 | Confirmed thin | **Build copy** |
| 17 | No blog | none | No blog route | **Build** |
| 18 | Gmail contact email | gmail | Confirmed `urbanvana.co@gmail.com` (footer ×2) | **Switch** (pending user's branded address) |
| 19 | No homepage schema | none | No Organization/WebSite JSON-LD on homepage | **Build** |

> **Open item for user:** #18 needs the real branded address (`hello@` vs `support@`). Until provided, we leave the gmail and flag it. #7 requires running the app to capture console errors.

> **Link reconciliation:** `/learn` page links to `/learn/nutrients` but footer/audit say `/learn/nutrient-guide`. We standardise on **`/learn/nutrient-guide`** (audit's canonical) and update the learn page link.

---

## 2. Architecture

### 2.1 Foundation layer (new)

**`src/lib/site.ts`** — single source of truth:
```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urbanvana.com"
export const SITE_NAME = "Urbanvana"
export const DEFAULT_OG_IMAGE = "/og/og-default.jpg" // 1200×630, added to /public/og/
```

**Root layout (`app/layout.tsx`)** gains:
- `metadataBase: new URL(SITE_URL)` — makes every relative canonical/OG URL resolve absolute.
- `alternates: { canonical: "/" }` (homepage self-canonical; per-page routes override).
- `openGraph.images` + `twitter.images` → default OG image (#6).
- `alternates.languages: { "en-IN": "/" }` for hreflang (#8) — applied per-page via a helper.

Because Next.js merges metadata, **per-page `alternates.canonical` set to the page's own path** gives self-referencing canonicals (#3) site-wide with minimal code. A small helper `pageMetadata({ path, title, description, ... })` in `src/lib/seo.ts` centralises canonical + hreflang + OG so every page is one call.

### 2.2 robots & sitemap (new, native Next.js)

**`app/robots.ts`** → emits:
```
User-agent: *
Allow: /
Disallow: /account /checkout /api /login /verify-email /reset-password /forgot-password
Sitemap: https://www.urbanvana.com/sitemap.xml
Host: https://www.urbanvana.com
```
(Disallow private/transactional routes — better than the audit's blanket `Allow: /`.)

**`app/sitemap.ts`** → async, returns:
- Static high-value routes (home, /shop, category pages, /learn + sub-pages, /support + sub-pages, /how-it-works, /contact, blog index + articles, legal pages).
- Dynamic product URLs (`/shop/p/[slug]`) enumerated from DB via the existing catalog service/repository (read-only call; reuse `productService`). Falls back to static-only if DB unavailable so the build never breaks.
- Dynamic category URLs from the categories API/service.
- `lastModified`, sensible `changeFrequency`/`priority`.

### 2.3 Category URL restructure (#4)

```
app/shop/
  page.tsx                 # "/shop" — all products (existing, keep)
  layout.tsx               # existing
  [category]/page.tsx      # NEW: /shop/towers etc. — server component, own metadata/H1/copy
  p/[slug]/page.tsx        # MOVED from app/shop/[slug]/page.tsx — product detail
```
- `app/shop/[slug]/` is **moved** to `app/shop/p/[slug]/` (content unchanged except internal links + canonical + breadcrumb schema added).
- 301 redirect in `next.config.ts`: `/shop/:slug` → `/shop/p/:slug`. **Ordering matters:** Next.js `redirects()` run in middleware *before* routing, so an old product link `/shop/city-tower-40` is 301'd to `/shop/p/city-tower-40` and never reaches the `[category]` route. The redirect source excludes the literal `p` segment and the four known category slugs (`towers|bundles|nutrients|seeds`) via a regex/`has` guard so `/shop/towers` and `/shop/p/...` are NOT redirected. The `[category]` route additionally validates its param against known categories and calls `notFound()` for anything else (defence in depth — covers any category-shaped path that slips through).
- **Category route** is a server component: fetches the category + its products (reusing catalog service), renders an H1, 400–600 words of category copy (drafted), the product grid, BreadcrumbList schema, self-canonical.
- The existing client-side `/shop` filter still works; its category pills now **navigate** to `/shop/<slug>` rather than mutating `?category=`. `?category=` is kept working as a soft redirect to the clean URL for any old inbound links.
- Update all link sources: `footer.tsx` (Shop column), `navbar.tsx`, product breadcrumb (`?category=` → `/shop/<slug>`), learn page CTA (`/shop/towers` already correct).

### 2.4 Content pages (#5, #9, #11, #16, #17)

New routes, each a server component using `pageMetadata()` + BreadcrumbList schema + drafted copy (600–800 words for pillar pages):

```
app/how-it-works/page.tsx
app/learn/page.tsx                      # add metadata export (#9)
app/learn/how-aeroponics-works/page.tsx
app/learn/setup-guide/page.tsx
app/learn/nutrient-guide/page.tsx       # standardised slug
app/learn/growing-tips/page.tsx
app/support/page.tsx                     # add metadata
app/support/faq/page.tsx                 # + FAQPage schema
app/support/shipping/page.tsx
app/learn/blog/page.tsx                  # blog index
app/learn/blog/[slug]/page.tsx           # article template
```

**Blog content model:** To ship 8–12 articles as drafted copy without a CMS dependency, articles live as **structured TS/MDX data** in `src/content/blog/` (one module per article: frontmatter + body). The `[slug]` route reads from this registry. This keeps the blog buildable, type-safe, and sitemap-enumerable now; a future CMS swap only changes the data source. Article topics from audit #17: aeroponic tower India, how aeroponics works, grow food at home India, best plants for aeroponic tower, hydroponic vs aeroponic, how to grow lettuce in aeroponic tower, setup at home, etc.

> A shared `LearnArticleLayout` / `SupportPageLayout` component keeps these pages consistent and small (each page = metadata + content data; layout owns structure). Reuses existing `Container` + brand tokens.

### 2.5 Homepage structured data (#19)

`app/page.tsx` (or root layout) emits Organization + WebSite JSON-LD (with `potentialAction` SearchAction → `/search?q=` for the sitelinks search box). Implemented as a small `<JsonLd>` server component in `src/components/seo/json-ld.tsx`, reused by product, category, breadcrumb, FAQ, and org schemas.

### 2.6 Polish (#10, #13, #18, #12, #7, #15)

- #10 product title: `generateMetadata` → `title: ` + benefit descriptor. Add an optional `seoTitle`/`tagline` field usage; fallback `"{name} — Aeroponic {category} | Urbanvana"`. Template suffix already adds brand, so set `title: "{name} — {benefit}"`.
- #13: footer column `<h3>` → `<p className="footer-heading">` (style unchanged).
- #18: replace `urbanvana.co@gmail.com` → branded address (pending user input; placeholder constant `CONTACT_EMAIL` in `site.ts`).
- #12: grep headings written as literal CAPS in HTML; convert to title case + rely on existing `uppercase` utility. Low priority.
- #15: verify navbar logo has `aria-label`/alt (footer already done).
- #7: run `next dev`, open home/shop/learn, capture console errors, fix root causes. Deferred to a verification pass (needs runtime).

---

## 3. Components & boundaries

| Unit | Responsibility | Depends on |
| --- | --- | --- |
| `src/lib/site.ts` | Site constants (URL, name, email, OG default) | env |
| `src/lib/seo.ts` | `pageMetadata()` helper → canonical + hreflang + OG merge | site.ts, next Metadata |
| `src/components/seo/json-ld.tsx` | `<JsonLd>` renderer + schema builders (org, website, breadcrumb, faq) | site.ts |
| `app/robots.ts` | robots.txt | site.ts |
| `app/sitemap.ts` | sitemap (static + dynamic from DB) | site.ts, catalog service |
| `app/shop/[category]/page.tsx` | category PLP + copy + schema | catalog service, seo helpers |
| `app/shop/p/[slug]/page.tsx` | product PDP (moved) + canonical + breadcrumb schema | catalog service, seo helpers |
| `src/content/blog/*` | article data registry | — |
| `LearnArticleLayout` / content pages | educational pages + schema | seo helpers, Container |

Each content page is reduced to *data + one layout call*, keeping files small and reviewable.

## 4. Data flow

- **Sitemap/category/product**: route → existing catalog service → repository → Mongo (read-only). No new DB writes. Sitemap wraps DB calls in try/catch with static fallback.
- **Metadata**: per-route `generateMetadata`/`metadata` → `pageMetadata()` → merged with root `metadataBase` → absolute canonical + hreflang + OG.

## 5. Error handling

- Sitemap DB failure → log + return static routes only (build resilient).
- Category route: unknown slug → `notFound()` (404), which also lets `/shop/p/...` redirect work cleanly.
- Product redirect handled at `next.config.ts` level (no runtime cost).
- Missing OG image asset → still valid metadata (image is additive).

## 6. Testing / verification

- `next build` succeeds (catches metadata/route errors).
- Manual fetch: `/robots.txt`, `/sitemap.xml` return 200 with correct host.
- Each new route renders 200; old `/shop/<product>` 301s to `/shop/p/<product>`.
- View-source spot check: canonical present + absolute + self-referencing; og:image present; hreflang en-IN present; JSON-LD validates (Rich Results test mentally / structure check).
- `eslint` + `tsc` clean (repo enforces lint+build pre-commit per codingPattenAndRule.md).
- #7: runtime console-error capture during `next dev`.

## 7. Sequencing (phased, each phase independently shippable)

1. **Phase 0 — Foundation:** site.ts, seo.ts, JsonLd, metadataBase + default OG + homepage schema. (#3 base, #6, #19)
2. **Phase 1 — robots + sitemap + hreflang + product title.** (#1, #2, #8, #10)
3. **Phase 2 — Category URL restructure + redirects + link updates + breadcrumb schema.** (#4, #14)
4. **Phase 3 — Content pages + blog + footer link fixes + /learn metadata.** (#5, #9, #11, #16, #17)
5. **Phase 4 — Polish:** footer h3→p, branded email, CAPS audit, navbar aria check, JS console errors. (#13, #18, #12, #15, #7)

## 8. Out of scope / ops notes

- Apex→www 301 redirect = Vercel domain settings (not code).
- Submitting sitemap to Google Search Console = manual ops step post-deploy.
- `.in` domain consideration (#8 long-term) = business decision, not implemented.
- Real branded email mailbox provisioning (#18) = ops; code just references the constant.
- Branch off `main` before implementing (currently on `main`).

## 9. Open questions for user

1. Branded contact email to use for #18? (`hello@urbanvana.com` / `support@urbanvana.com` / other)
2. Should the blog live at `/learn/blog` (keeps learning content unified — recommended) or top-level `/blog`?
3. OG default image — use an existing product lifestyle asset from `/public`, or is a new 1200×630 image being provided?
