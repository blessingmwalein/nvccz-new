import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function FinancialStatementsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80 mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-48 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-2xl p-4 bg-white shadow-sm">
                  <Skeleton className="aspect-[4/3] rounded-xl mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
