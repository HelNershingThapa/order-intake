import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-lg space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="rounded-lg border p-6 space-y-4">
          {/* form fields */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          {/* map */}
          <Skeleton className="h-64 w-full rounded-md" />
          {/* submit */}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
