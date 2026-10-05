import { Skeleton } from "@/components/ui/skeleton"

export const ReviewSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-2">
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
)