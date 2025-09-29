"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  setKPIs,
  addKPI, 
  updateKPI, 
  removeKPI,
  setLoading,
  setCrudLoading,
  setError,
  setSelectedKPIType,
  setSelectedKPICategory,
  setSelectedKPIDepartment,
  setSelectedKPIStatus,
  setKPISearchTerm,
  resetKPIFilters,
  setDepartments
} from "@/lib/store/slices/performanceSlice"
import { kpiDataService } from "@/lib/api/kpi-data"
import { performanceAPI } from "@/lib/api/performance-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  CiCirclePlus, 
  CiRedo, 
  CiCircleCheck,
  CiViewList,
  CiEdit,
  CiTrash
} from "react-icons/ci"
import { KPI } from "@/lib/store/slices/performanceSlice"
import { KPICard } from "./kpi-card"
import { KPIForm } from "./kpi-form"
import { KPIViewDrawer } from "./kpi-view-drawer"
import { KPIConfirmDeleteModal } from "./kpi-confirm-delete-modal"
import { KPIManagementSkeleton } from "./kpi-skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function KPIManagement() {
  const dispatch = useAppDispatch()
  const {
    kpis,
    departments,
    loading,
    crudLoading,
    error,
    selectedKPIType,
    selectedKPICategory,
    selectedKPIDepartment,
    selectedKPIStatus,
    kpiSearchTerm
  } = useAppSelector((state) => state.performance)

  const [hasLoaded, setHasLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null)
  const [viewingKPI, setViewingKPI] = useState<KPI | null>(null)
  const [kpiToDelete, setKpiToDelete] = useState<KPI | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)

  const loadDepartments = useCallback(async () => {
    try {
      const departmentsData = await performanceAPI.getDepartments()
      dispatch(setDepartments(departmentsData))
    } catch (error: any) {
      console.error('Failed to load departments:', error)
    }
  }, [dispatch])

  const loadKPIs = useCallback(async (forceReload = false) => {
    if ((hasLoaded || loading) && !forceReload) return
    
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const filters: { 
        type?: string
        category?: string
        departmentId?: string
        isActive?: boolean
      } = {}
      
      if (selectedKPIType !== "all") {
        filters.type = selectedKPIType
      }
      if (selectedKPICategory !== "all") {
        filters.category = selectedKPICategory
      }
      if (selectedKPIDepartment !== "all") {
        filters.departmentId = selectedKPIDepartment
      }
      if (selectedKPIStatus !== "all") {
        filters.isActive = selectedKPIStatus === "active"
      }

      console.log('Loading KPIs with filters:', filters)
      const kpisData = await kpiDataService.getKPIs(filters)
      dispatch(setKPIs(kpisData))
      setHasLoaded(true)
    } catch (error: any) {
      console.error('Failed to load KPIs:', error)
      dispatch(setError(error.message || 'Failed to load KPIs'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, hasLoaded, loading, selectedKPIType, selectedKPICategory, selectedKPIDepartment, selectedKPIStatus])

  useEffect(() => {
    loadDepartments()
    loadKPIs()
  }, [loadDepartments, loadKPIs])

  // Reload KPIs when filters change
  useEffect(() => {
    if (hasLoaded) {
      console.log('KPI filter changed, reloading KPIs...')
      loadKPIs(true)
    }
  }, [selectedKPIType, selectedKPICategory, selectedKPIDepartment, selectedKPIStatus])

  const handleCreateKPI = () => {
    setEditingKPI(null)
    setIsDialogOpen(true)
  }

  const handleEditKPI = (kpi: KPI) => {
    setEditingKPI(kpi)
    setIsDialogOpen(true)
  }

  const handleViewKPI = (kpi: KPI) => {
    setViewingKPI(kpi)
    setIsViewDrawerOpen(true)
  }

  const handleDeleteKPI = (kpi: KPI) => {
    setKpiToDelete(kpi)
    setIsDeleteModalOpen(true)
  }

  const handleSubmitKPI = async (kpiData: any) => {
    try {
      dispatch(setCrudLoading(true))
      if (editingKPI) {
        const updatedKPI = await kpiDataService.updateKPI(editingKPI.id, kpiData)
        dispatch(updateKPI({ id: editingKPI.id, updates: updatedKPI }))
        toast.success("KPI updated successfully")
      } else {
        const newKPI = await kpiDataService.createKPI(kpiData)
        dispatch(addKPI(newKPI))
        toast.success("KPI created successfully")
      }
      setIsDialogOpen(false)
      setEditingKPI(null)
    } catch (error: any) {
      console.error('Failed to save KPI:', error)
      toast.error(error.message || "Failed to save KPI")
    } finally {
      dispatch(setCrudLoading(false))
    }
  }

  const handleConfirmDelete = async () => {
    if (!kpiToDelete) return
    
    console.log('Parent: Starting KPI delete operation for:', kpiToDelete.id)
    try {
      dispatch(setCrudLoading(true))
      console.log('Parent: CRUD loading set to true')
      await kpiDataService.deleteKPI(kpiToDelete.id)
      console.log('Parent: API call completed successfully')
      dispatch(removeKPI(kpiToDelete.id))
      toast.success("KPI deleted successfully")
      // Close modal only after successful deletion
      handleCloseDeleteModal()
    } catch (error: any) {
      console.error('Parent: Failed to delete KPI:', error)
      toast.error(error.message || "Failed to delete KPI")
      // Re-throw the error so the modal can handle it
      throw error
    } finally {
      dispatch(setCrudLoading(false))
      console.log('Parent: CRUD loading set to false')
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setKpiToDelete(null)
  }

  const handleRefresh = () => {
    loadKPIs(true)
  }

  const handleResetFilters = () => {
    dispatch(resetKPIFilters())
  }

  // Filter KPIs based on search term
  const filteredKPIs = kpis.filter((kpi) =>
    kpi.name.toLowerCase().includes(kpiSearchTerm.toLowerCase()) ||
    kpi.description?.toLowerCase().includes(kpiSearchTerm.toLowerCase()) ||
    kpi.category?.toLowerCase().includes(kpiSearchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedKPIs = filteredKPIs.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedKPIType, selectedKPICategory, selectedKPIDepartment, selectedKPIStatus, kpiSearchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getFilterCount = () => {
    let count = 0
    if (selectedKPIType !== "all") count++
    if (selectedKPICategory !== "all") count++
    if (selectedKPIDepartment !== "all") count++
    if (selectedKPIStatus !== "all") count++
    if (kpiSearchTerm) count++
    return count
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">KPI Management</h1>
          <p className="text-gray-600 font-normal">Create and manage key performance indicators</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300"
          >
            <CiRedo className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button 
            onClick={handleCreateKPI}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiCirclePlus className="w-4 h-4 mr-2" />
            Create KPI
              </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {getFilterCount() > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {getFilterCount()} filter{getFilterCount() !== 1 ? 's' : ''} applied
            </Badge>
            <Button
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
            <Input
              placeholder="Search KPIs..."
              value={kpiSearchTerm}
              onChange={(e) => dispatch(setKPISearchTerm(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <Select value={selectedKPIType} onValueChange={(value) => dispatch(setSelectedKPIType(value))}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Metric">Metric</SelectItem>
                <SelectItem value="Count">Count</SelectItem>
              </SelectContent>
            </Select>
        </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <Select value={selectedKPICategory} onValueChange={(value) => dispatch(setSelectedKPICategory(value))}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
            <Select value={selectedKPIDepartment} onValueChange={(value) => dispatch(setSelectedKPIDepartment(value))}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
            <Select value={selectedKPIStatus} onValueChange={(value) => dispatch(setSelectedKPIStatus(value))}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <p className="text-red-800 font-medium">Error loading KPIs</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* KPIs Grid */}
      {loading ? (
        <KPIManagementSkeleton />
      ) : filteredKPIs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedKPIs.map((kpi) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              onView={handleViewKPI}
              onEdit={handleEditKPI}
              onDelete={handleDeleteKPI}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <CiCircleCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No KPIs Found</h3>
          <p className="text-gray-600 mb-6">
            {kpiSearchTerm || selectedKPIType !== "all" || selectedKPICategory !== "all" || selectedKPIDepartment !== "all" || selectedKPIStatus !== "all"
              ? "No KPIs match your current filters. Try adjusting your search criteria."
              : "Get started by creating your first KPI to track performance metrics."}
          </p>
          <Button 
            onClick={handleCreateKPI}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiCirclePlus className="w-4 h-4 mr-2" />
            Create Your First KPI
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredKPIs.length)} of {filteredKPIs.length} KPIs
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

      {/* KPI Form Dialog */}
      <KPIForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingKPI(null)
        }}
        onSubmit={handleSubmitKPI}
        kpi={editingKPI}
        isLoading={crudLoading}
      />

      {/* KPI View Drawer */}
      <KPIViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingKPI(null)
        }}
        kpi={viewingKPI}
        onEdit={handleEditKPI}
        onDelete={handleDeleteKPI}
      />

      {/* Confirm Delete Modal */}
      <KPIConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete KPI"
        description="Are you sure you want to delete this KPI? This action will permanently remove the KPI and may affect associated performance goals."
        itemName={kpiToDelete?.name || ""}
        isLoading={crudLoading}
      />
    </div>
  )
}



