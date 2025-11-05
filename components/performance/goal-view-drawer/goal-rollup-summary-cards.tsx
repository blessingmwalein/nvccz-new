"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, Target } from "lucide-react"

interface RollupSummaryCardsProps {
  completedSubGoals: number
  inProgressSubGoals: number
  notStartedSubGoals: number
  totalSubGoals: number
}

export function RollupSummaryCards({
  completedSubGoals,
  inProgressSubGoals,
  notStartedSubGoals,
  totalSubGoals,
}: RollupSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
        <CardContent className="pt-3 pb-3">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1.5 text-emerald-600" />
            <p className="text-xl font-bold text-gray-900">
              {completedSubGoals}
            </p>
            <p className="text-[10px] text-gray-600 font-medium">Completed</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
        <CardContent className="pt-3 pb-3">
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto mb-1.5 text-blue-600" />
            <p className="text-xl font-bold text-gray-900">
              {inProgressSubGoals}
            </p>
            <p className="text-[10px] text-gray-600 font-medium">In Progress</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
        <CardContent className="pt-3 pb-3">
          <div className="text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-1.5 text-gray-500" />
            <p className="text-xl font-bold text-gray-900">
              {notStartedSubGoals}
            </p>
            <p className="text-[10px] text-gray-600 font-medium">Not Started</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
        <CardContent className="pt-3 pb-3">
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-1.5 text-purple-600" />
            <p className="text-xl font-bold text-gray-900">
              {totalSubGoals}
            </p>
            <p className="text-[10px] text-gray-600 font-medium">Total Sub-Goals</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
