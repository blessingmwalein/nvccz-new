"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { 
  Building,
  Users,
  Calendar,
  Target,
  Edit,
  X
} from "lucide-react"
import { 
  CiBank,
  CiUser,
  CiCalendar,
  CiCircleCheck,
  CiSquareRemove,
  CiViewList
} from "react-icons/ci"

interface DepartmentViewDrawerProps {
  department: any
  isOpen: boolean
  onClose: () => void
  onEdit?: (department: any) => void
}

type TabType = "overview" | "goals" | "users"

const tabs = [
  {
    id: "overview" as TabType,
    label: "Overview",
    icon: Building
  },
  {
    id: "goals" as TabType,
    label: "Goals",
    icon: Target
  },
  {
    id: "users" as TabType,
    label: "Users",
    icon: Users
  }
]

export function DepartmentViewDrawer({ department, isOpen, onClose, onEdit }: DepartmentViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  if (!department) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'main_office': return 'bg-green-100 text-green-800'
      case 'main': return 'bg-blue-100 text-blue-800'
      case 'branch_1': return 'bg-purple-100 text-purple-800'
      case 'branch_2': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(department)
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[35vw] min-w-[800px] max-w-[1200px] overflow-y-auto p-5 [&>button[aria-label='Close']]:hidden [&>button[class*='ring-offset-background']]:hidden [&>button[class*='absolute']]:hidden [&>button[class*='top-4']]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-normal flex items-center gap-2">
              <Building className="w-6 h-6" />
              Department Details
            </SheetTitle>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEdit}
                  className="rounded-full h-10 w-10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="rounded-full h-10 w-10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Department Header */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {department.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={getBranchColor(department.branch)}>
                      {department.branch.replace('_', ' ')}
                    </Badge>
                    <Badge className={department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {department.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
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
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <Building className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-normal text-gray-500">Description</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {department.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-normal text-gray-500">Branch</label>
                        <p className="text-sm text-gray-900 mt-1">{department.branch.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-normal text-gray-500">Status</label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            department.isActive 
                              ? 'bg-gradient-to-br from-green-500 to-green-600' 
                              : 'bg-gradient-to-br from-red-500 to-red-600'
                          }`}>
                            {department.isActive ? (
                              <CiCircleCheck className="w-4 h-4 text-white" />
                            ) : (
                              <CiSquareRemove className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <Badge className={department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {department.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" />
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <CiUser className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-semibold text-blue-600">{department._count?.users || 0}</div>
                      <div className="text-sm text-gray-600">Users</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <CiCircleCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-semibold text-green-600">{department._count?.goals || 0}</div>
                      <div className="text-sm text-gray-600">Goals</div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <CiCalendar className="w-5 h-5" />
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-normal text-gray-500">Created</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(department.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-normal text-gray-500">Updated</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(department.updatedAt)}</p>
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
                    <Target className="w-5 h-5" />
                    Department Goals ({department._count?.goals || 0})
                  </h3>
                  <div className="space-y-3">
                    {department.goals && department.goals.length > 0 ? (
                      <>
                        {department.goals.map((goal: any, index: number) => (
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
                        <p className="text-gray-600">This department doesn't have any associated goals yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-normal text-gray-900 flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" />
                    Department Users ({department._count?.users || 0})
                  </h3>
                  <div className="space-y-3">
                    {department.users && department.users.length > 0 ? (
                      <>
                        {department.users.map((user: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                {user.role || 'User'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            View All Users
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                        <p className="text-gray-600">This department doesn't have any users assigned yet.</p>
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
