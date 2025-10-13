"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AccountingSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Tab Navigation Skeleton */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              {/* Tab skeleton items */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-3 rounded-t-lg"
                >
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Active tab description skeleton */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-4 w-80" />
          </div>
          
          {/* Data table skeleton */}
          <div className="space-y-4">
            {/* Table header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            {/* Table skeleton */}
            <div className="border rounded-lg">
              {/* Table header */}
              <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-20" />
                ))}
              </div>
              
              {/* Table rows */}
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-6 gap-4 p-4 border-b">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <div key={colIndex} className="flex items-center">
                      {colIndex === 0 && (
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded-full" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      )}
                      {colIndex === 1 && <Skeleton className="h-4 w-24" />}
                      {colIndex === 2 && <Skeleton className="w-8 h-8 rounded-full" />}
                      {colIndex === 3 && <Skeleton className="h-6 w-16 rounded-full" />}
                      {colIndex === 4 && <Skeleton className="h-6 w-16 rounded-full" />}
                      {colIndex === 5 && <Skeleton className="h-4 w-20" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}