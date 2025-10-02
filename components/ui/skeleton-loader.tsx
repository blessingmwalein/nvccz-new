import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className={`card-shadow ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
            <CardHeader className="pb-2">
              <Skeleton className={`h-4 w-32 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className={`h-8 w-16 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                <div className="flex items-center gap-1">
                  <Skeleton className={`h-3 w-3 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                  <Skeleton className={`h-3 w-20 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className={`card-shadow ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className={`w-10 h-10 rounded-full ${index % 2 === 0 ? 'bg-white/20' : 'bg-gray-200'}`} />
                <Skeleton className={`h-4 w-24 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className={`h-8 w-8 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                  <Skeleton className={`h-5 w-12 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                </div>
                <Skeleton className={`h-3 w-full ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
                <Skeleton className={`h-3 w-24 ${index % 2 === 0 ? 'bg-white/20' : ''}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Skeleton */}
        <Card className="card-shadow bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="w-64 h-64 rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart Skeleton */}
        <Card className="card-shadow bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Pipeline Skeleton */}
      <Card className="card-shadow bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ApplicationsPipelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-3 h-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}