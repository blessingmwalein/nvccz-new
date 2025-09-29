"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CiViewList, 
  CiEdit, 
  CiTrash
} from "react-icons/ci"
import { KPI } from "@/lib/store/slices/performanceSlice"

interface KPICardProps {
  kpi: KPI
  onView: (kpi: KPI) => void
  onEdit: (kpi: KPI) => void
  onDelete: (kpi: KPI) => void
}

export function KPICard({ kpi, onView, onEdit, onDelete }: KPICardProps) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'sales': return 'bg-green-100 text-green-800'
      case 'financial': return 'bg-blue-100 text-blue-800'
      case 'operational': return 'bg-purple-100 text-purple-800'
      case 'investment': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency?: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800'
      case 'weekly': return 'bg-orange-100 text-orange-800'
      case 'monthly': return 'bg-teal-100 text-teal-800'
      case 'quarterly': return 'bg-indigo-100 text-indigo-800'
      case 'yearly': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-normal">{kpi.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => onView(kpi)}
              title="View Details"
            >
              <CiViewList className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => onEdit(kpi)}
              title="Edit KPI"
            >
              <CiEdit className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => onDelete(kpi)}
              title="Delete KPI"
            >
              <CiTrash className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getCategoryColor(kpi.unitCategory || '')}>
            {kpi.unitCategory || 'N/A'}
          </Badge>
          <Badge className={getFrequencyColor(kpi.unitPosition)}>
            {kpi.unitPosition || 'N/A'}
          </Badge>
          <Badge className={kpi.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {kpi.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Type</span>
            <span className="text-sm font-medium">{kpi.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Created</span>
            <span className="text-sm text-gray-900">
              {new Date(kpi.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Weight Value Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weight Value</span>
            <span className="text-sm font-bold text-gray-900">{(parseFloat(kpi.weightValue) * 100).toFixed(0)}%</span>
          </div>
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${parseFloat(kpi.weightValue) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}