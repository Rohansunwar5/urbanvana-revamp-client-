import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Customer Support",
  description:
    "Get help with your Urbanvana aeroponic tower. Browse FAQs, shipping information, and contact our support team.",
  path: "/support",
})

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
