# Product & Variant Video Support — Design Spec

**Date:** 2026-06-01  
**Status:** Approved  
**Scope:** `urbanvana-revamp` (API + PDP) and `urbanvana-admin` (upload UI)

---

## Overview

Enable admins to upload videos for products and variants. Videos are displayed inline in the PDP image gallery alongside existing product images.

---

## Approach

Additive `videos: string[]` field on both product and variant models — mirrors the existing `images: string[]` pattern. Non-breaking; all existing image logic unchanged.

---

## Section 1 — Data Model Changes

### Product model
**File:** `src/lib/models/product.model.ts`
- Add `videos: { type: [String], default: [] }` field to Mongoose schema

### ProductVariant model
**File:** `src/lib/models/productVariant.model.ts`
- Add `videos: { type: [String], default: [] }` field to Mongoose schema

### Zod validators
**File:** `src/lib/validators/catalog.schema.ts`
- Add `videos?: z.array(z.string()).optional()` to `createProductSchema` and `updateProductSchema`
- Add `videos?: z.array(z.string()).optional()` to `createVariantSchema` and `updateVariantSchema`

### TypeScript types
**File:** `src/lib/types/catalog.ts`
- Add `videos?: string[]` to `ProductDetail` interface
- Add `videos?: string[]` to `ProductVariant` interface

---

## Section 2 — Upload API & Storage

### New route
**File:** `app/api/admin/upload/video/route.ts`
- `POST /api/admin/upload/video`
- Requires admin authentication
- Accepts `multipart/form-data` with `file` field
- Validates allowed MIME types: `video/mp4`, `video/webm`, `video/quicktime`, `video/av1`
- Validates max file size: **10MB**
- Calls existing `uploadToR2()` utility — no changes to upload service or R2 utility needed
- Folder conventions: `"products-videos"` for product videos, `"variants-videos"` for variant videos
- Returns `{ url: string }`

---

## Section 3 — Admin Panel Changes (`urbanvana-admin`)

### New `VideoUploader` component
**File:** `components/admin/VideoUploader.tsx`

Props:
```typescript
interface Props {
  videos: string[]
  onChange: (videos: string[]) => void
  folder?: string       // default: 'admin-uploads'
  maxVideos?: number    // default: 2
  label?: string
}
```

Behaviour:
- File input restricted to `video/mp4,video/webm,video/quicktime,video/av1`
- Client-side size check: reject > 10MB with error message before upload
- POSTs to `/api/admin/upload/video`
- Displays uploaded videos as small `<video>` thumbnail previews (muted, no controls) with remove buttons
- Mirrors `ImageUploader` structure

### Product pages
**Files:** `app/(shell)/products/[slug]/page.tsx` and `app/(shell)/products/new/page.tsx`
- Add `videos: string[]` state alongside existing `images` state
- Pass `videos` and `onVideosChange` to `ProductForm`
- Include `videos` in create/update API payload

### ProductForm component
**File:** `components/admin/products/ProductForm.tsx`
- Add `VideoUploader` section below existing `ImageUploader`
- Label: "Product Videos", max 2 videos, folder `"products-videos"`

### VariantsPanel component
**File:** `components/admin/products/VariantsPanel.tsx`
- Add `VideoUploader` per variant row
- Label: "Variant Videos", max 1 video per variant, folder `"variants-videos"`
- Save via existing `adminVariantsApi.update(id, { videos: variantVideos })`

---

## Section 4 — PDP Gallery Changes (`urbanvana-revamp`)

### `PDPImageGallery` component
**File:** `src/components/product/pdp-interactive.tsx`

Changes:
- Accept `videos?: string[]` prop alongside existing `images: string[]`
- Build unified `mediaItems` array: images first, then videos, each tagged `{ type: 'image' | 'video', url: string }`
- **Thumbnail strip:**
  - Image thumbnails: unchanged
  - Video thumbnails: small `<video>` with `muted` and `preload="metadata"` (first frame as poster)
- **Main display:**
  - Active image item: existing `<Image>` component unchanged
  - Active video item: `<video controls autoPlay muted loop playsInline>`
- When switching away from a video, pause and reset it to prevent audio bleed

### PDP page
**File:** `app/shop/[slug]/page.tsx`
- Pass `product.videos` to `PDPImageGallery` alongside `product.images`
- Active variant videos take precedence over product videos (same fallback pattern as images)

---

## Constraints

| Constraint | Value |
|------------|-------|
| Max file size | 10MB |
| Allowed formats | MP4, WebM, MOV (QuickTime), AV1 |
| Max videos per product | 2 |
| Max videos per variant | 1 |
| Storage | Cloudflare R2 (existing bucket) |

---

## Out of Scope

- Video transcoding or format conversion
- Video streaming (HLS/DASH)
- Video ordering relative to images (videos always appear after images in gallery)
- Public video upload (admin only)
