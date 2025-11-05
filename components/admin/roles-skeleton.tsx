import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function RolesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-3 px-1">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </nav>
      </div>

      {/* All Roles Tab Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="bg-white rounded-2xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DepartmentRolesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-3 px-1">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </nav>
      </div>

      {/* Department Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, deptIndex) => (
          <Card key={deptIndex} className="bg-white rounded-2xl overflow-hidden">
            <CardHeader className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="w-5 h-5" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
