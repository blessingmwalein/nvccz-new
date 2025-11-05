"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchAllRoles, fetchDepartmentsWithRoles } from "@/lib/store/slices/adminSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, ChevronDown, ChevronUp, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { RolesSkeleton, DepartmentRolesSkeleton } from "./roles-skeleton"

export function RolesView() {
  const dispatch = useAppDispatch()
  const { roles, departmentsWithRoles, rolesLoading } = useAppSelector(state => state.admin)
  const [activeTab, setActiveTab] = useState<"all" | "departments">("all")
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAllRoles()).unwrap(),
          dispatch(fetchDepartmentsWithRoles()).unwrap()
        ])
      } catch (error: any) {
        toast.error("Failed to load roles")
      }
    }
    loadData()
  }, [dispatch])

  const toggleDepartment = (dept: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dept)) {
        newSet.delete(dept)
      } else {
        newSet.add(dept)
      }
      return newSet
    })
  }

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-gray-100 text-gray-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-red-100 text-red-800"
    ]
    return colors[level] || colors[0]
  }

  if (rolesLoading) {
    return activeTab === "all" ? <RolesSkeleton /> : <DepartmentRolesSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-600 font-normal">View system roles and their organizational hierarchy</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer border-b-2",
              activeTab === "all"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 hover:text-gray-700 border-transparent"
            )}
          >
            <Shield className="w-4 h-4" />
            <span>All Roles</span>
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={cn(
              "relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer border-b-2",
              activeTab === "departments"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 hover:text-gray-700 border-transparent"
            )}
          >
            <Building2 className="w-4 h-4" />
            <span>By Department</span>
          </button>
        </nav>
      </div>

      {/* All Roles Tab */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.code} className="bg-white rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{role.name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{role.code}</p>
                  </div>
                  <Badge className={getLevelColor(role.level)}>
                    Level {role.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span>{role.department}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* By Department Tab */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          {departmentsWithRoles.map((dept) => {
            const isExpanded = expandedDepartments.has(dept.department)
            return (
              <Card key={dept.departmentCode} className="bg-white rounded-2xl overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleDepartment(dept.department)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{dept.department}</CardTitle>
                        <p className="text-sm text-gray-500">{dept.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {dept.roles.length} roles
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {[...dept.roles]
                        .sort((a, b) => b.level - a.level)
                        .map((role, index) => (
                          <div 
                            key={role.code}
                            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            {/* Hierarchy Indicator */}
                            <div className="flex flex-col items-center">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                                role.level === 5 ? "bg-red-500" :
                                role.level === 4 ? "bg-orange-500" :
                                role.level === 3 ? "bg-yellow-500" :
                                role.level === 2 ? "bg-green-500" :
                                "bg-blue-500"
                              )}>
                                {role.level}
                              </div>
                              {index < dept.roles.length - 1 && (
                                <div className="w-0.5 h-8 bg-gray-200" />
                              )}
                            </div>

                            {/* Role Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                  <p className="text-xs text-gray-500 font-mono mt-1">{role.code}</p>
                                </div>
                                <Badge className={getLevelColor(role.level)}>
                                  Level {role.level}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
