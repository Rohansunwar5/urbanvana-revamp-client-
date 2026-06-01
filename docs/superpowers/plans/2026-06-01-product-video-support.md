# Product & Variant Video Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `videos: string[]` to product and variant models, a video upload API endpoint, admin UI to upload videos, and inline video playback in the PDP image gallery.

**Architecture:** Additive `videos: string[]` field on both Mongoose models mirrors the existing `images: string[]` pattern. A new `/api/admin/upload/video` route validates MIME type and size before passing to the existing `uploadToR2` utility. The PDP `PDPImageGallery` component merges images and videos into a unified `mediaItems` array and renders the appropriate element based on type.

**Tech Stack:** Next.js 15 (App Router), Mongoose, Zod, TypeScript, Cloudflare R2 (S3), React Hook Form, Tailwind CSS, Lucide icons

---

## File Map

| File | Change |
|------|--------|
| `urbanvana-revamp/src/lib/models/product.model.ts` | Add `videos` field to schema + `IProduct` interface |
| `urbanvana-revamp/src/lib/models/productVariant.model.ts` | Add `videos` field to schema + `IProductVariant` interface |
| `urbanvana-revamp/src/lib/validators/catalog.schema.ts` | Add `videos` to product and variant Zod schemas |
| `urbanvana-revamp/src/lib/types/catalog.ts` | Add `videos?: string[]` to `ProductDetail` and `ProductVariant` types |
| `urbanvana-revamp/app/api/admin/upload/video/route.ts` | **Create** — new upload endpoint for videos |
| `urbanvana-admin/services/admin-catalog.api.ts` | Add `videos?: string[]` to `ProductDetail` and `ProductVariant` interfaces |
| `urbanvana-admin/components/admin/VideoUploader.tsx` | **Create** — mirrors `ImageUploader` with video-specific logic |
| `urbanvana-admin/components/admin/products/ProductForm.tsx` | Accept `videos`/`onVideosChange` props, render `VideoUploader` |
| `urbanvana-admin/app/(shell)/products/[slug]/page.tsx` | Add `videos` state, pass to form, include in save payload |
| `urbanvana-admin/app/(shell)/products/new/page.tsx` | Add `videos` state, pass to form, include in create payload |
| `urbanvana-admin/components/admin/products/VariantsPanel.tsx` | Add `VideoUploader` per variant row |
| `urbanvana-revamp/src/components/product/pdp-interactive.tsx` | Update `PDPImageGallery` to accept `videos` and render unified gallery |
| `urbanvana-revamp/app/shop/[slug]/page.tsx` | Pass `product.videos` and variant videos to `PDPImageGallery` |

---

## Task 1: Add `videos` field to Mongoose models

**Files:**
- Modify: `urbanvana-revamp/src/lib/models/product.model.ts`
- Modify: `urbanvana-revamp/src/lib/models/productVariant.model.ts`

- [ ] **Step 1: Add `videos` to the product Mongoose schema and `IProduct` interface**

In `urbanvana-revamp/src/lib/models/product.model.ts`, after the `images` field (line 20), add:

```typescript
    videos: { type: [String], default: [] },
```

And in the `IProduct` interface (after `images: string[]`, line 54), add:

```typescript
  videos: string[];
```

The schema block becomes:
```typescript
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
```

The interface block becomes:
```typescript
  images: string[];
  videos: string[];
```

- [ ] **Step 2: Add `videos` to the productVariant Mongoose schema and `IProductVariant` interface**

In `urbanvana-revamp/src/lib/models/productVariant.model.ts`, after the `images` field (line 23), add:

```typescript
    videos: { type: [String], default: [] },
```

And in the `IProductVariant` interface (after `images: string[]`, line 57), add:

```typescript
  videos: string[];
```

- [ ] **Step 3: Commit**

```bash
cd c:\urbanvana\urbanvana-revamp
git add src/lib/models/product.model.ts src/lib/models/productVariant.model.ts
git commit -m "feat: add videos[] field to product and variant mongoose models"
```

---

## Task 2: Add `videos` to Zod validators and TypeScript types

**Files:**
- Modify: `urbanvana-revamp/src/lib/validators/catalog.schema.ts`
- Modify: `urbanvana-revamp/src/lib/types/catalog.ts`

- [ ] **Step 1: Add `videos` to product Zod schemas**

In `urbanvana-revamp/src/lib/validators/catalog.schema.ts`:

In `createProductSchema` (after `images: z.array(z.string()).optional(),` line 59), add:
```typescript
  videos: z.array(z.string()).optional(),
```

In `updateProductSchema` (after `images: z.array(z.string()).optional(),` line 76), add:
```typescript
  videos: z.array(z.string()).optional(),
```

- [ ] **Step 2: Add `videos` to variant Zod schemas**

In `createVariantSchema` (after `images: z.array(z.string()).optional(),` line 93), add:
```typescript
  videos: z.array(z.string()).optional(),
```

In `updateVariantSchema` (after `images: z.array(z.string()).optional(),` line 114), add:
```typescript
  videos: z.array(z.string()).optional(),
```

- [ ] **Step 3: Add `videos` to frontend TypeScript types**

In `urbanvana-revamp/src/lib/types/catalog.ts`:

In `ProductVariant` type (after `images?: string[]`, line 48), add:
```typescript
  videos?: string[]
```

In `ProductDetail` type (after `images: string[]`, line 62), add:
```typescript
  videos?: string[]
```

- [ ] **Step 4: Commit**

```bash
cd c:\urbanvana\urbanvana-revamp
git add src/lib/validators/catalog.schema.ts src/lib/types/catalog.ts
git commit -m "feat: add videos[] to zod validators and catalog TypeScript types"
```

---

## Task 3: Create the video upload API route

**Files:**
- Create: `urbanvana-revamp/app/api/admin/upload/video/route.ts`

- [ ] **Step 1: Create the upload route file**

Create `urbanvana-revamp/app/api/admin/upload/video/route.ts` with this content:

```typescript
import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import uploadService from '@/lib/services/upload.service';

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/av1',
]);

const MAX_VIDEO_BYTES = 10 * 1024 * 1024; // 10 MB

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) throw new BadRequestError('No file uploaded');

  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    throw new BadRequestError('Unsupported video format. Allowed: MP4, WebM, MOV, AV1');
  }

  if (file.size > MAX_VIDEO_BYTES) {
    throw new BadRequestError('Video exceeds 10 MB limit');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = formData.get('folder') as string | null ?? 'products-videos';
  const url = await uploadService.upload(buffer, file.type, folder);
  return ok({ url }, 'Video uploaded');
});
```

- [ ] **Step 2: Verify the route builds correctly**

```bash
cd c:\urbanvana\urbanvana-revamp
npx tsc --noEmit
```

Expected: no errors related to the new file.

- [ ] **Step 3: Commit**

```bash
cd c:\urbanvana\urbanvana-revamp
git add app/api/admin/upload/video/route.ts
git commit -m "feat: add POST /api/admin/upload/video endpoint with 10MB and MIME validation"
```

---

## Task 4: Update admin TypeScript types for `videos`

**Files:**
- Modify: `urbanvana-admin/services/admin-catalog.api.ts`

- [ ] **Step 1: Add `videos` to `ProductDetail` and `ProductVariant` interfaces in the admin service**

In `urbanvana-admin/services/admin-catalog.api.ts`:

In the `ProductDetail` interface (after `images: string[]`, line 65), add:
```typescript
  videos?: string[]
```

In the `ProductVariant` interface (after `images: string[]`, line 81), add:
```typescript
  videos?: string[]
```

- [ ] **Step 2: Commit**

```bash
cd c:\urbanvana\urbanvana-admin
git add services/admin-catalog.api.ts
git commit -m "feat: add videos[] to admin ProductDetail and ProductVariant types"
```

---

## Task 5: Create the `VideoUploader` admin component

**Files:**
- Create: `urbanvana-admin/components/admin/VideoUploader.tsx`

- [ ] **Step 1: Create the component**

Create `urbanvana-admin/components/admin/VideoUploader.tsx`:

```tsx
'use client'

import { useState, useRef } from 'react'
import { Upload, X, Video } from 'lucide-react'
import adminApi from '@/lib/admin-api'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ACCEPTED = 'video/mp4,video/webm,video/quicktime,video/av1'

interface Props {
  videos: string[]
  onChange: (videos: string[]) => void
  folder?: string
  maxVideos?: number
  label?: string
}

export default function VideoUploader({
  videos,
  onChange,
  folder = 'admin-uploads',
  maxVideos = 2,
  label = 'Videos',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (file.size > MAX_SIZE_BYTES) {
      setError('File exceeds 10 MB limit.')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await adminApi.post<{ data: { url: string } }>(
        '/api/admin/upload/video',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      onChange([...videos, res.data.data.url])
    } catch {
      setError('Upload failed. Check file type and size.')
    } finally {
      setUploading(false)
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const remaining = maxVideos - videos.length
    Array.from(files).slice(0, remaining).forEach((f) => upload(f))
  }

  const remove = (idx: number) => {
    onChange(videos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      {label && <p className="mb-2 text-xs font-medium text-gray-600">{label}</p>}

      <div className="flex flex-wrap gap-2">
        {videos.map((src, i) => (
          <div
            key={i}
            className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200 group bg-gray-50"
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={src}
              muted
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {videos.length < maxVideos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 text-gray-300 hover:border-[#3b5844] hover:text-[#3b5844] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#3b5844]" />
            ) : (
              <>
                <Upload size={16} />
                <span className="text-[10px]">Upload</span>
              </>
            )}
          </button>
        )}

        {videos.length === 0 && !uploading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Video size={14} />
            No videos yet
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple={maxVideos > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:\urbanvana\urbanvana-admin
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd c:\urbanvana\urbanvana-admin
git add components/admin/VideoUploader.tsx
git commit -m "feat: add VideoUploader admin component with 10MB client-side validation"
```

---

## Task 6: Wire `VideoUploader` into `ProductForm`

**Files:**
- Modify: `urbanvana-admin/components/admin/products/ProductForm.tsx`

- [ ] **Step 1: Update `ProductForm` Props interface to accept `videos` and `onVideosChange`**

In `urbanvana-admin/components/admin/products/ProductForm.tsx`:

Add import at top:
```tsx
import VideoUploader from '@/components/admin/VideoUploader'
```

Update the `Props` interface (currently ends at line 51) to add two new fields:
```tsx
interface Props {
  product?: ProductDetail
  categories: Category[]
  submitting: boolean
  images: string[]
  onImagesChange: (imgs: string[]) => void
  videos: string[]
  onVideosChange: (vids: string[]) => void
  onSubmit: (values: ProductFormValues) => void
  submitLabel?: string
  defaultValues?: Partial<ProductFormValues>
}
```

Update the function signature to destructure the new props:
```tsx
export default function ProductForm({
  product,
  categories,
  submitting,
  images,
  onImagesChange,
  videos,
  onVideosChange,
  onSubmit,
  submitLabel = 'Save',
  defaultValues,
}: Props) {
```

- [ ] **Step 2: Add `VideoUploader` to the form JSX, directly after the `ImageUploader`**

Replace the existing `<ImageUploader ... />` block (lines 101–107) with:

```tsx
      {/* Images */}
      <ImageUploader
        images={images}
        onChange={onImagesChange}
        folder="products"
        maxImages={8}
        label="Product Images"
      />

      {/* Videos */}
      <VideoUploader
        videos={videos}
        onChange={onVideosChange}
        folder="products-videos"
        maxVideos={2}
        label="Product Videos"
      />
```

- [ ] **Step 3: Commit**

```bash
cd c:\urbanvana\urbanvana-admin
git add components/admin/products/ProductForm.tsx
git commit -m "feat: add VideoUploader to ProductForm below ImageUploader"
```

---

## Task 7: Add `videos` state to product pages and include in API payload

**Files:**
- Modify: `urbanvana-admin/app/(shell)/products/[slug]/page.tsx`
- Modify: `urbanvana-admin/app/(shell)/products/new/page.tsx`

- [ ] **Step 1: Update the product edit page (`[slug]/page.tsx`)**

Add `videos` state declaration after the `images` state (line 25):
```tsx
  const [videos, setVideos] = useState<string[]>([])
```

In the `useEffect` where product data is loaded, after `setImages(...)` (line 41), add:
```tsx
        setVideos((p.videos ?? []).filter(Boolean))
```

In `handleSave`, add `videos` to the update payload after `images,` (line 62):
```tsx
        images,
        videos,
```

In the `<ProductForm>` JSX (around line 174), add the two new props:
```tsx
          <ProductForm
            product={product}
            categories={categories}
            submitting={submitting}
            images={images}
            onImagesChange={setImages}
            videos={videos}
            onVideosChange={setVideos}
            onSubmit={handleSave}
            submitLabel="Save Changes"
          />
```

- [ ] **Step 2: Update the new product page (`new/page.tsx`)**

Add `videos` state after `images` state (line 13):
```tsx
  const [videos, setVideos] = useState<string[]>([])
```

In `handleSubmit`, add `videos` to the create payload after `images,` (line 34):
```tsx
        images,
        videos,
```

In the `<ProductForm>` JSX (around line 71), add the two new props:
```tsx
        <ProductForm
          defaultValues={{ isActive: true, isFeatured: false }}
          categories={categories}
          submitting={submitting}
          images={images}
          onImagesChange={setImages}
          videos={videos}
          onVideosChange={setVideos}
          onSubmit={handleSubmit}
          submitLabel="Create Product"
        />
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd c:\urbanvana\urbanvana-admin
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd c:\urbanvana\urbanvana-admin
git add "app/(shell)/products/[slug]/page.tsx" "app/(shell)/products/new/page.tsx"
git commit -m "feat: add videos state and payload to product create/edit pages"
```

---

## Task 8: Add `VideoUploader` to `VariantsPanel`

**Files:**
- Modify: `urbanvana-admin/components/admin/products/VariantsPanel.tsx`

- [ ] **Step 1: Add `VideoUploader` import**

At the top of `VariantsPanel.tsx`, after the `ImageUploader` import, add:
```tsx
import VideoUploader from '@/components/admin/VideoUploader'
```

- [ ] **Step 2: Locate the variant row where `ImageUploader` is rendered**

Search for `ImageUploader` inside `VariantsPanel.tsx`. It is used inside the expanded variant row. Find the section that renders variant images (it passes `folder="variants"` and `maxImages={4}`).

After that `<ImageUploader>` block, add:

```tsx
<VideoUploader
  videos={variantVideos[v._id] ?? []}
  onChange={async (vids) => {
    setVariantVideos((prev) => ({ ...prev, [v._id]: vids }))
    try {
      await adminVariantsApi.update(v._id, { videos: vids })
    } catch {
      // revert on failure
      setVariantVideos((prev) => ({ ...prev, [v._id]: v.videos ?? [] }))
    }
  }}
  folder="variants-videos"
  maxVideos={1}
  label="Variant Video"
/>
```

- [ ] **Step 3: Add `variantVideos` state**

Near the top of the `VariantsPanel` component function, add state to track per-variant video arrays:

```tsx
const [variantVideos, setVariantVideos] = useState<Record<string, string[]>>(
  () => Object.fromEntries(variants.map((v) => [v._id, v.videos ?? []]))
)
```

Also add a `useEffect` to sync when `variants` prop changes:

```tsx
useEffect(() => {
  setVariantVideos(Object.fromEntries(variants.map((v) => [v._id, v.videos ?? []])))
}, [variants])
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd c:\urbanvana\urbanvana-admin
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd c:\urbanvana\urbanvana-admin
git add components/admin/products/VariantsPanel.tsx
git commit -m "feat: add VideoUploader per variant row in VariantsPanel"
```

---

## Task 9: Update `PDPImageGallery` to support videos

**Files:**
- Modify: `urbanvana-revamp/src/components/product/pdp-interactive.tsx`

- [ ] **Step 1: Add `useRef` to existing imports and update `PDPImageGallery` signature**

The file already imports `useState` and `useEffect` from React (line 4). Add `useRef`:

```tsx
import { useState, useEffect, useRef } from "react"
```

Change the `PDPImageGallery` function signature from:
```tsx
export function PDPImageGallery({ images, name }: { images: string[]; name: string }) {
```
to:
```tsx
export function PDPImageGallery({
  images,
  videos = [],
  name,
}: {
  images: string[]
  videos?: string[]
  name: string
}) {
```

- [ ] **Step 2: Build the unified `mediaItems` array and add `videoRef`**

Replace the existing `const [active, setActive] = useState(0)` line with:

```tsx
  type MediaItem = { type: 'image' | 'video'; url: string }
  const mediaItems: MediaItem[] = [
    ...images.map((url) => ({ type: 'image' as const, url })),
    ...videos.map((url) => ({ type: 'video' as const, url })),
  ]
  const [active, setActive] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSelect = (i: number) => {
    if (mediaItems[active]?.type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setActive(i)
  }

  const activeItem = mediaItems[active] ?? mediaItems[0]
```

- [ ] **Step 3: Update the main display area to render video or image**

Replace the inner content of the main display `<div>` (the block that renders `<Image>` with `fill`, currently lines 25–38) with:

```tsx
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative h-full w-full">
            {activeItem?.type === 'video' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                ref={videoRef}
                key={activeItem.url}
                src={activeItem.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <Image
                src={getImageUrl(activeItem?.url ?? '')}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-contain transition-opacity duration-200"
                style={{ mixBlendMode: "multiply" }}
                priority
              />
            )}
          </div>
        </div>
```

- [ ] **Step 4: Update the thumbnail strip to use `mediaItems` and render video thumbnails**

Replace the existing thumbnail section (lines 41–67) with:

```tsx
      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              aria-label={`View ${item.type} ${i + 1}`}
              className={[
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border transition-all duration-150",
                active === i
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-1"
                  : "border-[var(--color-border-strong)] opacity-60 hover:opacity-100",
              ].join(" ")}
              style={{ backgroundColor: "#ffffff" }}
            >
              {item.type === 'video' ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={item.url}
                  muted
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={getImageUrl(item.url)}
                  alt={`${name} view ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                  style={{ mixBlendMode: "multiply" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd c:\urbanvana\urbanvana-revamp
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd c:\urbanvana\urbanvana-revamp
git add src/components/product/pdp-interactive.tsx
git commit -m "feat: update PDPImageGallery to render videos inline in unified media gallery"
```

---

## Task 10: Pass videos to `PDPImageGallery` from the PDP page

**Files:**
- Modify: `urbanvana-revamp/app/shop/[slug]/page.tsx`

- [ ] **Step 1: Determine active variant videos and pass to gallery**

In `urbanvana-revamp/app/shop/[slug]/page.tsx`, after the `primaryVariant` line (line 143), add:

```tsx
  /* Videos: active variant videos take precedence, fall back to product videos */
  const displayVideos: string[] =
    (primaryVariant?.videos?.length ? primaryVariant.videos : product.videos) ?? []
```

- [ ] **Step 2: Pass `videos` to `PDPImageGallery`**

Find the `<PDPImageGallery>` usage (line 225):
```tsx
              <PDPImageGallery images={product.images} name={product.name} />
```

Replace with:
```tsx
              <PDPImageGallery
                images={product.images}
                videos={displayVideos}
                name={product.name}
              />
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd c:\urbanvana\urbanvana-revamp
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd c:\urbanvana\urbanvana-revamp
git add app/shop/[slug]/page.tsx
git commit -m "feat: pass product and variant videos to PDPImageGallery on PDP"
```

---

## Task 11: End-to-end smoke test

- [ ] **Step 1: Start the revamp dev server**

```bash
cd c:\urbanvana\urbanvana-revamp
npm run dev
```

Expected: server starts on http://localhost:3000 with no build errors.

- [ ] **Step 2: Start the admin dev server**

```bash
cd c:\urbanvana\urbanvana-admin
npm run dev
```

Expected: admin starts (typically on http://localhost:3001) with no build errors.

- [ ] **Step 3: Upload a product video in admin**

1. Open the admin at http://localhost:3001
2. Navigate to any existing product (or create a new one)
3. On the Info tab, you should see "Product Videos" section below "Product Images"
4. Upload a small MP4 file under 10MB
5. Expected: video thumbnail appears in the uploader, no error shown
6. Click "Save Changes"
7. Expected: save succeeds, video persists on reload

- [ ] **Step 4: Verify video renders on PDP**

1. Open the storefront PDP for the same product at http://localhost:3000/shop/[slug]
2. Expected: the video thumbnail appears at the end of the thumbnail strip
3. Click the video thumbnail
4. Expected: the main area switches to a `<video>` element with controls and plays the video
5. Click an image thumbnail
6. Expected: the video pauses, main area shows the image

- [ ] **Step 5: Test 10MB limit rejection in admin**

1. In the admin VideoUploader, attempt to upload a file over 10MB
2. Expected: error message "File exceeds 10 MB limit." appears without any network request

- [ ] **Step 6: Test unsupported format rejection**

1. Rename a `.txt` file to `.mp4` and try to upload it (or use an actual unsupported format)
2. Expected: the file input's `accept` attribute filters it out in the browser; if bypassed, the server returns a 400 with "Unsupported video format"

- [ ] **Step 7: Test variant video upload**

1. In the admin, open a product and switch to the Variants tab
2. Expand any variant row
3. Expected: "Variant Video" section appears with a VideoUploader (max 1)
4. Upload a video — expected: it saves automatically to the variant
