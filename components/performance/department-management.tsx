"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addDepartment,
  updateDepartment,
  removeDepartment,
  setDepartments,
  setLoading,
  setError
} from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { DepartmentManagementSkeleton } from "./department-skeleton"
import { DepartmentForm } from "./department-form"
import { DepartmentViewDrawer } from "./department-view-drawer"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building,
  Search,
  Plus,
  RefreshCw,
  Eye
} from "lucide-react"
import { toast } from "sonner"

export function DepartmentManagement() {
  const dispatch = useAppDispatch()
  const { departments, loading, error } = useAppSelector((state) => state.performance)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [viewingDepartment, setViewingDepartment] = useState<any>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const itemsPerPage = 9

  // Load departments on component mount - prevent duplicate calls
  const loadDepartments = useCallback(async (forceReload = false) => {
    if ((hasLoaded || loading) && !forceReload) return
    
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const departments = await performanceAPI.getDepartments()
      dispatch(setDepartments(departments))
      setHasLoaded(true)
    } catch (error) {
      console.error('Failed to load departments:', error)
      dispatch(setError('Failed to load departments'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, hasLoaded, loading])

  useEffect(() => {
    loadDepartments()
  }, [loadDepartments])

  const filteredDepartments = departments.filter(dept => {
    const matchesBranch = selectedBranch === "all" || dept.branch === selectedBranch
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesBranch && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBranch, searchTerm])

  const handleViewDepartment = (department: any) => {
    setViewingDepartment(department)
    setIsViewDrawerOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateDepartment = async (departmentData: any) => {
    try {
      dispatch(setLoading(true))
      const department = await performanceAPI.createDepartment(departmentData)
      dispatch(addDepartment(department))
      toast.success("Department created successfully")
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error('Failed to create department:', error)
      toast.error(error.message || "Failed to create department")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleUpdateDepartment = async (id: string, updates: any) => {
    try {
      dispatch(setLoading(true))
      const department = await performanceAPI.updateDepartment(id, updates)
      dispatch(updateDepartment({ id, updates: department }))
      toast.success("Department updated successfully")
      setIsDialogOpen(false)
      setEditingDepartment(null)
    } catch (error: any) {
      console.error('Failed to update department:', error)
      toast.error(error.message || "Failed to update department")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    try {
      dispatch(setLoading(true))
      await performanceAPI.deleteDepartment(id)
      dispatch(removeDepartment(id))
      toast.success("Department deleted successfully")
    } catch (error: any) {
      console.error('Failed to delete department:', error)
      toast.error(error.message || "Failed to delete department")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'main': return 'bg-blue-100 text-blue-800'
      case 'main_office': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Department Management</h1>
          <p className="text-gray-600 font-normal">Create and manage departments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => loadDepartments(true)}
            disabled={loading}
            className="rounded-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl md:max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDepartment ? "Edit Department" : "Create New Department"}
                </DialogTitle>
              </DialogHeader>
              <DepartmentForm 
                department={editingDepartment}
                onSave={editingDepartment ? 
                  (updates) => handleUpdateDepartment(editingDepartment.id, updates) : 
                  handleCreateDepartment
                }
                onClose={() => {
                  setIsDialogOpen(false)
                  setEditingDepartment(null)
                }}
                isLoading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading State */}
      {loading && <DepartmentManagementSkeleton />}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <span className="text-red-700">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadDepartments(true)}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="main_office">Main Office</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {!loading && !error && filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedBranch !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first department."
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="rounded-full gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      )}

      {/* Departments Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDepartments.map((department) => (
            <Card key={department.id} className="bg-white border border-gray-200 rounded-2xl shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-normal">{department.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-9 h-9 p-0 gradient-primary text-white"
                      onClick={() => handleViewDepartment(department)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getBranchColor(department.branch)}>
                    {department.branch}
                  </Badge>
                  <Badge className={department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {department.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {department.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Users</span>
                    <span className="text-sm font-medium">{department._count?.users || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Goals</span>
                    <span className="text-sm font-medium">{department._count?.goals || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(department.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDepartments.length)} of {filteredDepartments.length} departments
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* View Drawer */}
      <DepartmentViewDrawer
        department={viewingDepartment}
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingDepartment(null)
        }}
      />
    </div>
  )
}
