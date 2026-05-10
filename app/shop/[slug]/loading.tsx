import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"

export default function ProductLoading() {
  return (
    <section className="bg-[var(--color-bg)] pt-8 md:pt-12">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16">
          {/* Image gallery skeleton */}
          <div>
            <Skeleton className="aspect-square w-full rounded-[12px]" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-[8px]" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="flex flex-col gap-5 pb-12">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-28 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
