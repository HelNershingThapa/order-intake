import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2" aria-busy>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* SectionCards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card text-card-foreground shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-8 w-28" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* DailyStatsAreaChart skeleton */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
          <div className="mt-6">
            <Skeleton className="h-[260px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
