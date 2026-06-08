import type { Metadata } from "next"
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from "./site"

interface PageMetadataOptions {
  title: string
  description?: string
  path: string
  image?: string
  noIndex?: boolean
}

export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "en-IN": url },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
