"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart } from "lucide-react"

interface GoalProgressOverviewProps {
  totalTargetValue: string
  totalCurrentValue: string
  overallProgressPercentage: string
  unitSymbol?: string
  formatCurrency: (value: any, symbol?: string) => string
}

export function GoalProgressOverview({
  totalTargetValue,
  totalCurrentValue,
  overallProgressPercentage,
  unitSymbol = '$',
  formatCurrency,
}: GoalProgressOverviewProps) {
  // Handle NaN or invalid values
  const parseProgress = (value: string): number => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  const progressValue = parseProgress(overallProgressPercentage)

  return (
    <Card className="border border-gray-200 rounded-lg">
      <CardContent className="pt-6">
        <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
          <BarChart className="w-5 h-5" />
          Progress Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-normal text-gray-500">Total Target Value</label>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(totalTargetValue, unitSymbol)}
            </p>
          </div>
          <div>
            <label className="text-sm font-normal text-gray-500">Total Current Value</label>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {formatCurrency(totalCurrentValue, unitSymbol)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-normal text-gray-500 mb-2 block">Overall Progress</label>
          <Progress 
            value={progressValue} 
            className="h-3"
          />
          <p className="text-sm text-right mt-1 font-semibold">
            {progressValue.toFixed(2)}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
