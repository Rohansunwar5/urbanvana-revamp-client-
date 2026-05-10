import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-[var(--color-bg-subtle)]">
        <Container>
          <div className="flex flex-col gap-6 py-20">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-16 w-3/4 max-w-xl" />
            <Skeleton className="h-16 w-2/3 max-w-lg" />
            <Skeleton className="h-5 w-96 max-w-full" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-36 rounded-full" />
              <Skeleton className="h-12 w-28 rounded-full" />
            </div>
          </div>
        </Container>
      </section>

      {/* Bestsellers skeleton */}
      <section className="bg-[var(--color-bg)] py-16">
        <Container>
          <Skeleton className="mb-8 h-8 w-56" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full rounded-[12px]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Category grid skeleton */}
      <section className="bg-[var(--color-bg-subtle)] py-16">
        <Container>
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-[12px]" />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
