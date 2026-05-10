import { ProductCardSkeleton } from "@/components/ui/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"

export default function ShopLoading() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar skeleton */}
        <aside className="w-full shrink-0 lg:w-64">
          <Skeleton className="mb-4 h-6 w-24" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="mb-3 h-10 w-full rounded-lg" />
          ))}
          <Skeleton className="mt-6 mb-4 h-6 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="mb-3 h-4 w-full" />
          ))}
        </aside>

        {/* Product grid skeleton */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
