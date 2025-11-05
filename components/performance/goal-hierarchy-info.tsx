"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CiFlag1 as CiFlag } from "react-icons/ci"

interface GoalHierarchyInfoProps {
  tasks: any[]
}

export function GoalHierarchyInfo({ tasks }: GoalHierarchyInfoProps) {
  const hasGoalLinkedTasks = tasks.some((t) => t.goalId)

  if (!hasGoalLinkedTasks) return null

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CiFlag className="w-5 h-5 text-blue-600" />
          Goal Hierarchy Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="font-medium">Company Goal</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="font-medium">Department Goal</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-medium">Individual Goal</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="font-medium">Tasks</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Tasks are linked to individual goals, which roll up to department goals, and ultimately to company goals.
        </p>
      </CardContent>
    </Card>
  )
}
