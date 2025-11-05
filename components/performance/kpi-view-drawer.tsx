"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CiCircleCheck,
  CiCalendar,
  CiSquareRemove,
  CiEdit,
  CiTrash,
  CiCircleCheck as CiTarget,
  CiCircleCheck as CiChart,
  CiViewList as CiList
} from "react-icons/ci"
import { 
  User, 
  Target, 
  List,
  Edit,
  X,
  TrendingUp, 
  Building2, 
  DollarSign,
  Calendar,
  Hash,
  FileText,
  BarChart3
} from "lucide-react"
import { KPI } from "@/lib/store/slices/performanceSlice"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { format } from "date-fns"

interface KPIViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  kpi: KPI | null
  onEdit: (kpi: KPI) => void
  onDelete: (kpi: KPI) => void
}

type TabType = "kpi" | "goals"

const tabs = [
  {
    id: "kpi" as TabType,
    label: "KPI Details",
    icon: Target
  },
  {
    id: "goals" as TabType,
    label: "Goals",
    icon: List
  }
]

export function KPIViewDrawer({ isOpen, onClose, kpi, onEdit, onDelete }: KPIViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("kpi")

  if (!kpi) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

   const getAccountTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Asset': 'bg-green-100 text-green-800',
      'Liability': 'bg-red-100 text-red-800',
      'Equity': 'bg-purple-100 text-purple-800',
      'Revenue': 'bg-blue-100 text-blue-800',
      'Expense': 'bg-orange-100 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Percentage': return 'bg-cyan-100 text-cyan-800'
      case 'Metric': return 'bg-indigo-100 text-indigo-800'
      case 'Count': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800'
      case 'weekly': return 'bg-orange-100 text-orange-800'
      case 'monthly': return 'bg-teal-100 text-teal-800'
      case 'quarterly': return 'bg-indigo-100 text-indigo-800'
      case 'yearly': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const weightValue = parseFloat(kpi.weightValue) * 100

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span>KPI View</span>
            </SheetTitle>
            {/* Custom Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-10 w-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mr-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getTypeColor(kpi.type)}>{kpi.type}</Badge>
            {kpi.isActive ? (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">Inactive</Badge>
            )}
            {kpi.hardcodedDetails?.isFinancial && (
              <Badge className="bg-indigo-100 text-indigo-800">Financial</Badge>
            )}
          </div>

          {/* KPI Header */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium">
                  <Target className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {kpi.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(kpi.type)}>
                      {kpi.type}
                    </Badge>
                    <Badge className={kpi.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {kpi.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weight Value Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Weight Value</span>
                <span className="text-sm font-bold text-gray-900">{weightValue.toFixed(0)}%</span>
              </div>
              <div className="relative">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${weightValue}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  
                  {/* Active tab underline */}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                      layoutId="activeTab"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* KPI Details Tab */}
            {activeTab === "kpi" && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-normal text-gray-500">Name</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{kpi.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Type</label>
                      <div className="mt-1">
                        <Badge className={getTypeColor(kpi.type)}>
                          {kpi.type}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Unit</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{kpi.unit || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Weight Value</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{weightValue.toFixed(0)}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Status</label>
                      <div className="mt-1">
                        <Badge className={kpi.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {kpi.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit Information */}
                {kpi.hasUnit && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                      <User className="w-5 h-5" />
                      Unit Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-normal text-gray-500">Has Unit</label>
                        <p className="text-sm font-medium text-gray-900 mt-1">{kpi.hasUnit ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-normal text-gray-500">Unit Category</label>
                        <p className="text-sm font-medium text-gray-900 mt-1">{kpi.unitCategory || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-normal text-gray-500">Unit Symbol</label>
                        <p className="text-sm font-medium text-gray-900 mt-1">{kpi.unitSymbol || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-normal text-gray-500">Unit Position</label>
                        <p className="text-sm font-medium text-gray-900 mt-1">{kpi.unitPosition || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hardcoded Details */}
                {kpi.hardcodedDetails && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5" />
                      Financial Details
                    </h3>
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Description</span>
                        <p className="text-sm text-gray-900 mt-1">{kpi.hardcodedDetails.description}</p>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Account Type</span>
                        <Badge className={getAccountTypeColor(kpi.hardcodedDetails.accountType)}>
                          {kpi.hardcodedDetails.accountType}
                        </Badge>
                      </div>
                      
                      {kpi.hardcodedDetails.accountNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Account Number</span>
                          <span className="text-sm font-medium font-mono">{kpi.hardcodedDetails.accountNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Journal Entry Type</span>
                        <Badge variant="outline" className="text-xs">
                          {kpi.hardcodedDetails.journalEntryType}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Code</span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-200 px-2 py-1 rounded">
                          {kpi.hardcodedDetails.code}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5" />
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-normal text-gray-500">Created</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(kpi.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Updated</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(kpi.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === "goals" && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <List className="w-5 h-5" />
                    Performance Goals ({kpi._count?.performanceGoals || 0})
                  </h3>
                  <div className="space-y-3">
                    {kpi.performanceGoals && kpi.performanceGoals.length > 0 ? (
                      <>
                        {kpi.performanceGoals.map((goal, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{goal.title}</span>
                              <Badge className={
                                goal.status === 'active' ? 'bg-green-100 text-green-800' :
                                goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                goal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {goal.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Stage: {goal.stage}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            View More Goals
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                          <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Found</h3>
                        <p className="text-gray-600">This KPI doesn't have any associated performance goals yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}