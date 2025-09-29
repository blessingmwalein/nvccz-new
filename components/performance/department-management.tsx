"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addDepartment,
  updateDepartment,
  removeDepartment,
  setDepartments,
  setLoading,
  setCrudLoading,
  setError
} from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { DepartmentManagementSkeleton } from "./department-skeleton"
import { DepartmentForm } from "./department-form"
import { DepartmentViewDrawer } from "./department-view-drawer"
import { ConfirmDeleteModal } from "./confirm-delete-modal"
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
  X
} from "lucide-react"
import { 
  CiViewList,
  CiEdit,
  CiTrash,
  CiBank,
  CiRedo
} from "react-icons/ci"
import { toast } from "sonner"

export function DepartmentManagement() {
  const dispatch = useAppDispatch()
  const { departments, loading, crudLoading, error } = useAppSelector((state) => state.performance)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [viewingDepartment, setViewingDepartment] = useState<any>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const itemsPerPage = 9

  // Load departments on component mount - prevent duplicate calls
  const loadDepartments = useCallback(async (forceReload = false) => {
    if ((hasLoaded || loading) && !forceReload) return
    
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      
      // Use backend filtering
      const filters: { isActive?: boolean; branch?: string } = {}
      if (selectedBranch !== "all") {
        filters.branch = selectedBranch
      }
      if (selectedStatus !== "all") {
        filters.isActive = selectedStatus === "active"
      }
      
      console.log('Loading departments with filters:', filters)
      const departments = await performanceAPI.getDepartments(filters)
      dispatch(setDepartments(departments))
      setHasLoaded(true)
    } catch (error: any) {
      console.error('Failed to load departments:', error)
      dispatch(setError(error.message || 'Failed to load departments'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, hasLoaded, loading, selectedBranch, selectedStatus])

  useEffect(() => {
    loadDepartments()
  }, [loadDepartments])

  // Reload departments when filters change
  useEffect(() => {
    if (hasLoaded) {
      console.log('Filter changed, reloading departments...')
      loadDepartments(true)
    }
  }, [selectedBranch, selectedStatus])

  // Only apply client-side search filtering since branch and status are handled by backend
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBranch, selectedStatus, searchTerm])

  const handleViewDepartment = (department: any) => {
    setViewingDepartment(department)
    setIsViewDrawerOpen(true)
  }

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department)
    setIsDialogOpen(true)
  }

  const handleDeleteDepartment = (department: any) => {
    setDepartmentToDelete(department)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return
    
    console.log('Parent: Starting delete operation for department:', departmentToDelete.id)
    try {
      dispatch(setCrudLoading(true))
      console.log('Parent: CRUD loading set to true')
      await performanceAPI.deleteDepartment(departmentToDelete.id)
      console.log('Parent: API call completed successfully')
      dispatch(removeDepartment(departmentToDelete.id))
      toast.success("Department deleted successfully")
      // Close modal only after successful deletion
      handleCloseDeleteModal()
    } catch (error: any) {
      console.error('Parent: Failed to delete department:', error)
      toast.error(error.message || "Failed to delete department")
      // Re-throw the error so the modal can handle it
      throw error
    } finally {
      dispatch(setCrudLoading(false))
      console.log('Parent: CRUD loading set to false')
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDepartmentToDelete(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateDepartment = async (departmentData: any) => {
    try {
      dispatch(setCrudLoading(true))
      const department = await performanceAPI.createDepartment(departmentData)
      // Add new department to the top of the list
      dispatch(addDepartment(department))
      toast.success("Department created successfully")
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error('Failed to create department:', error)
      toast.error(error.message || "Failed to create department")
    } finally {
      dispatch(setCrudLoading(false))
    }
  }

  const handleUpdateDepartment = async (id: string, updates: any) => {
    try {
      dispatch(setCrudLoading(true))
      const department = await performanceAPI.updateDepartment(id, updates)
      dispatch(updateDepartment({ id, updates: department }))
      toast.success("Department updated successfully")
      setIsDialogOpen(false)
      setEditingDepartment(null)
    } catch (error: any) {
      console.error('Failed to update department:', error)
      toast.error(error.message || "Failed to update department")
    } finally {
      dispatch(setCrudLoading(false))
    }
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
            className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300"
          >
            <CiRedo className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
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
                isLoading={crudLoading}
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
      <div className="space-y-4">
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
              <SelectItem value="main_office">Main Office</SelectItem>
              <SelectItem value="main">Main</SelectItem>
              <SelectItem value="branch_1">Branch 1</SelectItem>
              <SelectItem value="branch_2">Branch 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Indicators */}
        {(selectedBranch !== "all" || selectedStatus !== "all" || searchTerm) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">
              {[
                selectedBranch !== "all" ? 1 : 0,
                selectedStatus !== "all" ? 1 : 0,
                searchTerm ? 1 : 0
              ].reduce((a, b) => a + b, 0)} filter{[
                selectedBranch !== "all" ? 1 : 0,
                selectedStatus !== "all" ? 1 : 0,
                searchTerm ? 1 : 0
              ].reduce((a, b) => a + b, 0) !== 1 ? 's' : ''} applied
            </span>
            
            {selectedBranch !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Branch: {selectedBranch.replace('_', ' ')}
                <button
                  onClick={() => setSelectedBranch("all")}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {selectedStatus !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus("all")}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBranch("all")
                setSelectedStatus("all")
                setSearchTerm("")
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && !error && filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CiBank className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedBranch !== "all" || selectedStatus !== "all"
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
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleViewDepartment(department)}
                      title="View Details"
                    >
                      <CiViewList className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleEditDepartment(department)}
                      title="Edit Department"
                    >
                      <CiEdit className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleDeleteDepartment(department)}
                      title="Delete Department"
                    >
                      <CiTrash className="w-5 h-5" />
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
        onEdit={handleEditDepartment}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action will permanently remove the department and all its associated data."
        itemName={departmentToDelete?.name || ""}
        isLoading={crudLoading}
      />
    </div>
  )
}
