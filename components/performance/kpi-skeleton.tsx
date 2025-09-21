import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function KPISkeleton() {
  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPIManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      {/* KPIs Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <KPISkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
