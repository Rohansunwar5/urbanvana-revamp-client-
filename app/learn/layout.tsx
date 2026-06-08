import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Growing Guides & Tutorials",
  description:
    "Free guides on how aeroponics works, tower setup, nutrients, and growing tips. Learn everything you need to grow fresh food at home.",
  path: "/learn",
})

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
