"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RichDataTable } from "./rich-data-table"
import { PayrollRunForm } from "./payroll-run-form"
import { PayrollRunDrawer } from "./payroll-run-drawer"
import { PayrollRun, payrollRunsApi } from "@/lib/api/payroll-api"
import { Play, Plus, Calendar, DollarSign, Users, FileText } from "lucide-react"
import { toast } from "sonner"

export function PayrollRunsTable() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingRun, setEditingRun] = useState<PayrollRun | null>(null)
  const [viewingRun, setViewingRun] = useState<PayrollRun | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Load payroll runs
  const loadPayrollRuns = async () => {
    try {
      setLoading(true)
      const response = await payrollRunsApi.getAll()
      if (response.success && response.data) {
        setPayrollRuns(response.data)
      } else {
        toast.error('Failed to load payroll runs')
      }
    } catch (error) {
      console.error('Error loading payroll runs:', error)
      toast.error('Failed to load payroll runs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayrollRuns()
  }, [])

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = payrollRuns

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(run =>
        run.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.payPeriod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(run => run.status === statusFilter)
    }

    return filtered
  }, [payrollRuns, searchTerm, statusFilter])

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>
      case 'PROCESSING':
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Processing</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Format currency amount
  const formatCurrency = (amount: string, currency?: { symbol: string } | null) => {
    const symbol = currency?.symbol || '$'
    const value = parseFloat(amount) || 0
    return `${symbol}${value.toLocaleString()}`
  }

  // Handle create
  const handleCreate = () => {
    setEditingRun(null)
    setIsFormOpen(true)
  }

  // Handle edit
  const handleEdit = (run: PayrollRun) => {
    setEditingRun(run)
    setIsFormOpen(true)
  }

  // Handle view
  const handleView = (run: PayrollRun) => {
    setViewingRun(run)
    setIsDrawerOpen(true)
  }

  // Handle delete
  const handleDelete = async (run: PayrollRun) => {
    if (window.confirm(`Are you sure you want to delete "${run.name}"?`)) {
      try {
        await payrollRunsApi.delete(run.id)
        toast.success('Payroll run deleted successfully')
        loadPayrollRuns()
      } catch (error) {
        console.error('Error deleting payroll run:', error)
        toast.error('Failed to delete payroll run')
      }
    }
  }

  // Handle process
  const handleProcess = async (run: PayrollRun) => {
    if (window.confirm(`Are you sure you want to process "${run.name}"? This will calculate all employee payrolls.`)) {
      try {
        await payrollRunsApi.process(run.id)
        toast.success('Payroll run processed successfully')
        loadPayrollRuns()
      } catch (error) {
        console.error('Error processing payroll run:', error)
        toast.error('Failed to process payroll run')
      }
    }
  }

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    try {
      if (editingRun) {
        await payrollRunsApi.update(editingRun.id, data)
        toast.success('Payroll run updated successfully')
      } else {
        await payrollRunsApi.create(data)
        toast.success('Payroll run created successfully')
      }
      setIsFormOpen(false)
      setEditingRun(null)
      loadPayrollRuns()
    } catch (error) {
      console.error('Error saving payroll run:', error)
      toast.error(editingRun ? 'Failed to update payroll run' : 'Failed to create payroll run')
      throw error
    }
  }

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingRun(null)
  }

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setViewingRun(null)
  }

  const columns = [
    {
      key: "name" as keyof PayrollRun,
      label: "Name",
      sortable: true,
      render: (value: string, row: PayrollRun) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.payPeriod}</div>
        </div>
      ),
    },
    {
      key: "status" as keyof PayrollRun,
      label: "Status",
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "startDate" as keyof PayrollRun,
      label: "Period",
      sortable: true,
      render: (value: string, row: PayrollRun) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(value).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
          <div className="text-gray-500">
            to {new Date(row.endDate).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
        </div>
      ),
    },
    {
      key: "totalGrossPay" as keyof PayrollRun,
      label: "Gross Pay",
      sortable: true,
      render: (value: string, row: PayrollRun) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: "totalNetPay" as keyof PayrollRun,
      label: "Net Pay",
      sortable: true,
      render: (value: string, row: PayrollRun) => (
        <span className="font-medium text-green-600">
          {formatCurrency(value, row.currency)}
        </span>
      ),
    },
    {
      key: "_count" as keyof PayrollRun,
      label: "Employees",
      sortable: false,
      render: (value: any) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {value?.employeePayrolls || 0}
        </div>
      ),
    },
    {
      key: "createdAt" as keyof PayrollRun,
      label: "Created",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </span>
      ),
    }
  ]

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "PROCESSING", label: "Processing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" }
  ]

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-gray-900 flex items-center gap-2">
            <Play className="w-6 h-6" />
            Payroll Runs
          </h1>
          <p className="text-gray-600 mt-1">
            Manage payroll runs and process employee payments
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="rounded-full gradient-primary text-white font-normal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Payroll Run
        </Button>
      </div>

      {/* Table */}
      <RichDataTable
        data={filteredData}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterBy="status"
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
        searchPlaceholder="Search payroll runs..."
        title=""
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customActions={(row: PayrollRun) => (
          <div className="flex items-center gap-1">
            {row.status === 'DRAFT' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleProcess(row)
                }}
                className="h-8 px-3 text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                Process
              </Button>
            )}
          </div>
        )}
      />

      {/* Form Modal */}
      <PayrollRunForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingRun={editingRun}
        loading={loading}
      />

      {/* View Drawer */}
      <PayrollRunDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        payrollRun={viewingRun}
        onEdit={handleEdit}
        onProcess={handleProcess}
      />
    </div>
  )
}
