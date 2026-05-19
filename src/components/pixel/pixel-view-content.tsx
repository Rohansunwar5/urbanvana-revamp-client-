"use client"

import { useEffect } from "react"
import { pixelViewContent } from "@/lib/pixel"

export function PixelViewContent({
  productId,
  name,
  category,
  price,
}: {
  productId: string
  name: string
  category?: string
  price: number
}) {
  useEffect(() => {
    pixelViewContent({
      content_ids: [productId],
      content_name: name,
      content_category: category,
      value: price,
      currency: "INR",
    })
    // Fire once per product page mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  return null
}
