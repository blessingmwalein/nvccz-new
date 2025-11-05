"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building } from "lucide-react"

interface DepartmentBreakdownItem {
  id: string
  title: string
  department: string
  stage: string
  targetValue: string
  currentValue: string
  progressPercentage: string
  individualGoals?: Array<{
    id: string
    title: string
    progressPercentage: string
  }>
}

interface GoalDepartmentBreakdownProps {
  departments: DepartmentBreakdownItem[]
  unitSymbol?: string
  formatCurrency: (value: any, symbol?: string) => string
  getStatusColor: (status: string) => string
}

export function GoalDepartmentBreakdown({
  departments,
  unitSymbol,
  formatCurrency,
  getStatusColor,
}: GoalDepartmentBreakdownProps) {
  const parseProgress = (value: string): number => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  return (
    <Card className="border border-gray-200 rounded-lg">
      <CardContent className="pt-6">
        <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
          <Building className="w-5 h-5" />
          Department Breakdown ({departments.length})
        </h3>
        <div className="space-y-3">
          {departments.map((dept) => (
            <div key={dept.id} className="p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{dept.title}</h4>
                  <Badge variant="outline" className="mt-1">{dept.department}</Badge>
                </div>
                <Badge className={getStatusColor(dept.stage)}>{dept.stage.replace('_', ' ')}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-gray-500">Target</p>
                  <p className="font-semibold">{formatCurrency(dept.targetValue, unitSymbol)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Current</p>
                  <p className="font-semibold text-blue-600">{formatCurrency(dept.currentValue, unitSymbol)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Progress</p>
                  <p className="font-semibold">{parseProgress(dept.progressPercentage).toFixed(1)}%</p>
                </div>
              </div>
              {dept.individualGoals && dept.individualGoals.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Individual Goals ({dept.individualGoals.length})</p>
                  <div className="space-y-2">
                    {dept.individualGoals.map((indGoal) => (
                      <div key={indGoal.id} className="flex items-center justify-between text-xs bg-white p-2 rounded">
                        <span className="truncate">{indGoal.title}</span>
                        <Badge variant="outline" className="text-xs">{parseProgress(indGoal.progressPercentage).toFixed(0)}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
