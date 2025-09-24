import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* DataTable placeholder */}
      <div className="rounded-lg border">
        {/* Toolbar (search, filters, actions) */}
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="hidden h-9 w-40 sm:block" />
            <Skeleton className="hidden h-9 w-32 md:block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-5 gap-2 px-6 py-3 text-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 items-center gap-2 px-6 py-4"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-32" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
