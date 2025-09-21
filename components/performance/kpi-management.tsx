"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addKPI, 
  updateKPI, 
  removeKPI,
  setSelectedCategory,
  setSearchTerm,
  setKPIs,
  setLoading,
  setError
} from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { KPIManagementSkeleton } from "./kpi-skeleton"
import { KPIForm } from "./kpi-form"
import { KPIViewModal } from "./kpi-view-modal"
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Target,
  Edit,
  Trash2,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye
} from "lucide-react"
import { toast } from "sonner"

export function KPIManagement() {
  const dispatch = useAppDispatch()
  const { kpis, selectedCategory, searchTerm, loading, error } = useAppSelector((state) => state.performance)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKPI, setEditingKPI] = useState<any>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [viewingKPI, setViewingKPI] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Load KPIs on component mount - prevent duplicate calls
  const loadKPIs = useCallback(async (forceReload = false) => {
    if ((hasLoaded || loading) && !forceReload) return
    
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const fetchedKPIs = await performanceAPI.getKPIs()
      dispatch(setKPIs(fetchedKPIs))
      setHasLoaded(true)
    } catch (error) {
      console.error('Failed to load KPIs:', error)
      dispatch(setError('Failed to load KPIs'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, hasLoaded, loading])

  useEffect(() => {
    loadKPIs()
  }, [loadKPIs])

  const filteredKPIs = kpis.filter(kpi => {
    const matchesCategory = selectedCategory === "all" || kpi.category === selectedCategory
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (kpi.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    return matchesCategory && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedKPIs = filteredKPIs.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  const handleViewKPI = (kpi: any) => {
    setViewingKPI(kpi)
    setIsViewModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateKPI = async (kpiData: any) => {
    try {
      dispatch(setLoading(true))
      const newKPI = await performanceAPI.createKPI(kpiData)
      dispatch(addKPI(newKPI))
      toast.success("KPI created successfully")
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error('Failed to create KPI:', error)
      toast.error(error.message || "Failed to create KPI")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleUpdateKPI = async (id: string, updates: any) => {
    try {
      dispatch(setLoading(true))
      const updatedKPI = await performanceAPI.updateKPI(id, updates)
      dispatch(updateKPI({ id, updates: updatedKPI }))
      toast.success("KPI updated successfully")
      setIsDialogOpen(false)
      setEditingKPI(null)
    } catch (error: any) {
      console.error('Failed to update KPI:', error)
      toast.error(error.message || "Failed to update KPI")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleDeleteKPI = async (id: string) => {
    try {
      dispatch(setLoading(true))
      await performanceAPI.deleteKPI(id)
      dispatch(removeKPI(id))
      toast.success("KPI deleted successfully")
    } catch (error: any) {
      console.error('Failed to delete KPI:', error)
      toast.error(error.message || "Failed to delete KPI")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-100 text-blue-800'
      case 'financial': return 'bg-green-100 text-green-800'
      case 'operational': return 'bg-orange-100 text-orange-800'
      case 'investment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800'
      case 'weekly': return 'bg-orange-100 text-orange-800'
      case 'monthly': return 'bg-blue-100 text-blue-800'
      case 'quarterly': return 'bg-green-100 text-green-800'
      case 'yearly': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            variant="outline"
            onClick={() => loadKPIs(true)}
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
                Add KPI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl md:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingKPI ? "Edit KPI" : "Create New KPI"}
              </DialogTitle>
            </DialogHeader>
            <KPIForm 
              kpi={editingKPI}
              onSave={editingKPI ? 
                (updates) => handleUpdateKPI(editingKPI.id, updates) : 
                handleCreateKPI
              }
              onClose={() => {
                setIsDialogOpen(false)
                setEditingKPI(null)
              }}
              isLoading={loading}
            />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={(value) => dispatch(setSelectedCategory(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && <KPIManagementSkeleton />}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <span className="text-red-700">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadKPIs(true)}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedKPIs.map((kpi) => (
          <Card key={kpi.id} className="bg-white border border-gray-200 rounded-2xl shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-normal">{kpi.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-9 h-9 p-0 gradient-primary text-white"
                    onClick={() => handleViewKPI(kpi)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(kpi.category || "sales")}>
                  {kpi.category || "sales"}
                </Badge>
                <Badge className={getFrequencyColor(kpi.frequency || "monthly")}>
                  {kpi.frequency || "monthly"}
                </Badge>
                <Badge variant={kpi.isActive ? "default" : "secondary"}>
                  {kpi.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{kpi.description || "No description available"}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Type: {kpi.type}</span>
                  <span>Unit: {kpi.unit}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Weight: {kpi.weightValue}%</span>
                  <span>Goals: {kpi._count?.performanceGoals || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {kpi.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {kpi.unitPosition === "prefix" ? `${kpi.unitSymbol || ""}${kpi.unit || ""}` : `${kpi.unit || ""}${kpi.unitSymbol || ""}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredKPIs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No KPIs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first KPI"
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="rounded-full gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add KPI
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

      {/* View Modal */}
      <KPIViewModal
        kpi={viewingKPI}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingKPI(null)
        }}
      />
    </div>
  )
}

