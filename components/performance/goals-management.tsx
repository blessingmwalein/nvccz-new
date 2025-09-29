"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addGoal, 
  updateGoal, 
  removeGoal,
  setSelectedPriority,
  setSelectedStatus,
  setSearchTerm,
  setSelectedGoalType,
  setSelectedGoalCategory,
  setSelectedGoalDepartment,
  setSelectedGoalAssignedTo,
  setDepartments,
  setLoading,
  setCrudLoading,
  setError
} from "@/lib/store/slices/performanceSlice"
import { goalsDataService, Goal } from "@/lib/api/goals-data"
import { performanceAPI } from "@/lib/api/performance-data"
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  CiEdit, 
  CiTrash, 
  CiSearch,
  CiCalendar,
  CiDollar,
  CiFlag1 as CiFlag,
  CiCirclePlus as CiPlus,
  CiCircleCheck as CiTarget,
  CiCircleCheck,
  CiRedo,
  CiViewList
} from "react-icons/ci"
import { toast } from "sonner"
import { GoalFormModal } from "./goal-form-modal"
import { GoalViewDrawer } from "./goal-view-drawer"
import { GoalConfirmDeleteModal } from "./goal-confirm-delete-modal"

export function GoalsManagement() {
  const dispatch = useAppDispatch()
  const { 
    departments, 
    selectedPriority, 
    selectedStatus, 
    searchTerm,
    selectedGoalType,
    selectedGoalCategory,
    selectedGoalDepartment,
    selectedGoalAssignedTo,
    loading,
    crudLoading,
    error
  } = useAppSelector((state) => state.performance)
  
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [goals, setGoals] = useState<Goal[]>([])

  const loadDepartments = useCallback(async () => {
    try {
      const departmentsData = await performanceAPI.getDepartments()
      dispatch(setDepartments(departmentsData))
    } catch (error: any) {
      console.error('Failed to load departments:', error)
    }
  }, [dispatch])

  const loadGoals = useCallback(async (forceReload = false) => {
    if ((hasLoaded || loading) && !forceReload) return
    
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const filters: any = {}
      
      if (selectedGoalType !== "all") {
        filters.type = selectedGoalType
      }
      if (selectedGoalCategory !== "all") {
        filters.category = selectedGoalCategory
      }
      if (selectedGoalDepartment !== "all") {
        filters.departmentId = selectedGoalDepartment
      }
      if (selectedGoalAssignedTo !== "all") {
        filters.assignedToId = selectedGoalAssignedTo
      }
      if (selectedPriority !== "all") {
        filters.priority = selectedPriority
      }
      if (selectedStatus !== "all") {
        filters.status = selectedStatus
      }

      console.log('Loading goals with filters:', filters)
      const response = await goalsDataService.getGoals(filters)
      setGoals(response.goals)
      setHasLoaded(true)
    } catch (error: any) {
      console.error('Failed to load goals:', error)
      dispatch(setError(error.message || 'Failed to load goals'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, hasLoaded, loading, selectedGoalType, selectedGoalCategory, selectedGoalDepartment, selectedGoalAssignedTo, selectedPriority, selectedStatus])

  useEffect(() => {
    loadDepartments()
    loadGoals()
  }, [loadDepartments, loadGoals])

  // Reload goals when filters change
  useEffect(() => {
    if (hasLoaded) {
      console.log('Goal filter changed, reloading goals...')
      loadGoals(true)
    }
  }, [selectedGoalType, selectedGoalCategory, selectedGoalDepartment, selectedGoalAssignedTo, selectedPriority, selectedStatus])

  const handleCreateGoal = () => {
    setEditingGoal(null)
    setIsDialogOpen(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsDialogOpen(true)
  }

  const handleViewGoal = (goal: Goal) => {
    setViewingGoal(goal)
    setIsViewDrawerOpen(true)
  }

  const handleDeleteGoal = (goal: Goal) => {
    setGoalToDelete(goal)
    setIsDeleteModalOpen(true)
  }

  const handleSubmitGoal = async (goalData: any) => {
    try {
      dispatch(setCrudLoading(true))
      if (editingGoal) {
        const updatedGoal = await goalsDataService.updateGoal(editingGoal.id, goalData)
        toast.success("Goal updated successfully")
      } else {
        const newGoal = await goalsDataService.createGoal(goalData)
        toast.success("Goal created successfully")
      }
      setIsDialogOpen(false)
      setEditingGoal(null)
      loadGoals(true)
    } catch (error: any) {
      console.error('Failed to save goal:', error)
      toast.error(error.message || "Failed to save goal")
    } finally {
      dispatch(setCrudLoading(false))
    }
  }

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return
    
    try {
      dispatch(setCrudLoading(true))
      await goalsDataService.deleteGoal(goalToDelete.id)
      toast.success("Goal deleted successfully")
      handleCloseDeleteModal()
      loadGoals(true)
    } catch (error: any) {
      console.error('Failed to delete goal:', error)
      toast.error(error.message || "Failed to delete goal")
      throw error
    } finally {
      dispatch(setCrudLoading(false))
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setGoalToDelete(null)
  }

  const handleRefresh = () => {
    loadGoals(true)
  }

  const handleResetFilters = () => {
    dispatch(setSelectedGoalType("all"))
    dispatch(setSelectedGoalCategory("all"))
    dispatch(setSelectedGoalDepartment("all"))
    dispatch(setSelectedGoalAssignedTo("all"))
    dispatch(setSelectedPriority("all"))
    dispatch(setSelectedStatus("all"))
    dispatch(setSearchTerm(""))
  }

  // Filter goals based on search term
  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGoals = filteredGoals.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedGoalType, selectedGoalCategory, selectedGoalDepartment, selectedGoalAssignedTo, selectedPriority, selectedStatus, searchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getFilterCount = () => {
    let count = 0
    if (selectedGoalType !== "all") count++
    if (selectedGoalCategory !== "all") count++
    if (selectedGoalDepartment !== "all") count++
    if (selectedGoalAssignedTo !== "all") count++
    if (selectedPriority !== "all") count++
    if (selectedStatus !== "all") count++
    if (searchTerm) count++
    return count
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'not_started': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Goals Management</h1>
          <p className="text-gray-600 font-normal">Create and track performance goals</p>
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
            onClick={handleCreateGoal}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiPlus className="w-4 h-4 mr-2" />
            Create Goal
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
          <Select value={selectedGoalType} onValueChange={(value) => dispatch(setSelectedGoalType(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
          <Select value={selectedGoalCategory} onValueChange={(value) => dispatch(setSelectedGoalCategory(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
          <Select value={selectedGoalDepartment} onValueChange={(value) => dispatch(setSelectedGoalDepartment(value))}>
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

        {/* Priority Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
          <Select value={selectedPriority} onValueChange={(value) => dispatch(setSelectedPriority(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <Select value={selectedStatus} onValueChange={(value) => dispatch(setSelectedStatus(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <p className="text-red-800 font-medium">Error loading goals</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white border border-gray-200 rounded-2xl shadow-none">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredGoals.length > 0 ? (
        <div className="space-y-4">
          {paginatedGoals.map((goal) => (
            <Card key={goal.id} className="bg-white border border-gray-200 rounded-2xl shadow-none hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-normal">{goal.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleViewGoal(goal)}
                      title="View Details"
                    >
                      <CiViewList className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleEditGoal(goal)}
                      title="Edit Goal"
                    >
                      <CiEdit className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleDeleteGoal(goal)}
                      title="Delete Goal"
                    >
                      <CiTrash className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(goal.priority)}>
                    {goal.priority}
                  </Badge>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {goal.type}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {goal.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiEdit className="w-4 h-4" />
                      <span>Description</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{goal.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiTarget className="w-4 h-4" />
                      <span>Department</span>
                    </div>
                    <p className="text-sm font-medium">
                      {goal.department?.name || 'Unknown Department'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCalendar className="w-4 h-4" />
                      <span>Created</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(goal.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCalendar className="w-4 h-4" />
                      <span>Start Date</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(goal.startDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCalendar className="w-4 h-4" />
                      <span>End Date</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(goal.endDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCircleCheck className="w-4 h-4" />
                      <span>Assigned To</span>
                    </div>
                    <p className="text-sm font-medium">
                      {goal.assignedTo ? `${goal.assignedTo.firstName} ${goal.assignedTo.lastName}` : 'Unassigned'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCircleCheck className="w-4 h-4" />
                      <span>Created By</span>
                    </div>
                    <p className="text-sm font-medium">
                      {goal.createdBy ? `${goal.createdBy.firstName} ${goal.createdBy.lastName}` : 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiTarget className="w-4 h-4" />
                      <span>Stage</span>
                    </div>
                    <p className="text-sm font-medium capitalize">
                      {goal.stage}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{goal.percentValueAchieved || 0}%</span>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getProgressColor(parseFloat(goal.percentValueAchieved || '0'))}`}
                        style={{ width: `${goal.percentValueAchieved || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Value Information */}
                {(goal.monetaryValue || goal.percentValue) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {goal.monetaryValue && (
                      <div className="flex items-center gap-2 text-sm">
                        <CiDollar className="w-4 h-4 text-green-600" />
                        <span>Target: ${parseFloat(goal.monetaryValue || '0').toLocaleString()}</span>
                      </div>
                    )}
                    {goal.percentValue && (
                      <div className="flex items-center gap-2 text-sm">
                        <CiTarget className="w-4 h-4 text-blue-600" />
                        <span>Target: {goal.percentValue}%</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <CiFlag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedGoalType !== "all" || selectedGoalCategory !== "all" || selectedGoalDepartment !== "all" || selectedPriority !== "all" || selectedStatus !== "all"
              ? "No goals match your current filters. Try adjusting your search criteria."
              : "Get started by creating your first goal to track performance objectives."}
          </p>
          <Button 
            onClick={handleCreateGoal}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiPlus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredGoals.length)} of {filteredGoals.length} goals
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

      {/* Goal Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
          </DialogHeader>
          <GoalFormModal 
            goal={editingGoal}
            departments={departments}
            onSave={handleSubmitGoal}
            onClose={() => {
              setIsDialogOpen(false)
              setEditingGoal(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Goal View Drawer */}
      <GoalViewDrawer
        goal={viewingGoal}
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingGoal(null)
        }}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
      />

      {/* Confirm Delete Modal */}
      <GoalConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action will permanently remove the goal and may affect associated performance tracking."
        itemName={goalToDelete?.title || ""}
        isLoading={crudLoading}
      />
    </div>
  )
}

// Goal Modal Component
