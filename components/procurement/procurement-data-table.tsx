"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CiSearch, 
  CiFilter, 
  CiEdit,
  CiTrash
} from "react-icons/ci"
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  MoreHorizontal,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

export interface ProcurementDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title: string
  searchPlaceholder?: string
  filterOptions?: { label: string; value: string }[]
  extraControls?: React.ReactNode
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onCreate?: () => void
  onBulkAction?: (selectedRows: T[], action: string) => void
  bulkActions?: { label: string; value: string; icon?: React.ReactNode }[]
  loading?: boolean
  pageSize?: number
  exportable?: boolean
  onExport?: (data: T[]) => void
  emptyMessage?: string
  showSearch?: boolean
  showFilters?: boolean
  showActions?: boolean
}

export function ProcurementDataTable<T extends { id: string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  filterOptions = [],
  extraControls,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onBulkAction,
  bulkActions = [],
  loading = false,
  pageSize = 10,
  exportable = true,
  onExport,
  emptyMessage = "No data available",
  showSearch = true,
  showFilters = true
  , showActions = true
}: ProcurementDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.key]
          const term = searchTerm.toLowerCase()
          if (value == null) return false
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value.toString().toLowerCase().includes(term)
          }
          if (typeof value === 'object') {
            try {
              const flattened = Object.values(value)
                .filter(v => v != null && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'))
                .map(v => v.toString().toLowerCase())
                .join(' ')
              return flattened.includes(term)
            } catch {
              return false
            }
          }
          return false
        })
      )
    }

    // Apply filter
    if (filterValue !== "all" && filterOptions.length > 0) {
      const filterOption = filterOptions.find(opt => opt.value === filterValue)
      if (filterOption) {
        filtered = filtered.filter(row => {
          return columns.some(column => {
            if (column.filterable) {
              const value = row[column.key]
              return value?.toString().toLowerCase().includes(filterValue.toLowerCase())
            }
            return false
          })
        })
      }
    }

    return filtered
  }, [data, searchTerm, filterValue, columns, filterOptions])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(row => row.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id])
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    const selectedData = data.filter(row => selectedRows.includes(row.id))
    onBulkAction?.(selectedData, action)
    setSelectedRows([])
  }

  const handleExport = () => {
    onExport?.(sortedData)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {onCreate && (
              <Button onClick={onCreate} className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            )}
            {exportable && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
            {extraControls}
          </div>
        </div>

        {/* Search and Filter Controls */}
        {(showSearch || showFilters) && (
          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative flex-1">
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {showFilters && filterOptions.length > 0 && (
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-48">
                  <CiFilter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedRows.length} item(s) selected
            </span>
            {bulkActions.map((action) => (
              <Button
                key={action.value}
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction(action.value)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {(bulkActions.length > 0 || onBulkAction) && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                    )}
                    {columns.map((column) => (
                      <TableHead
                        key={String(column.key)}
                        className={column.sortable ? "cursor-pointer hover:bg-gray-50" : ""}
                        style={{ width: column.width }}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {column.sortable && sortConfig?.key === column.key && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                    ))}
                    {(showActions && (onEdit || onDelete || onView)) && (
                      <TableHead className="w-20">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow key={row.id}>
                      {(bulkActions.length > 0 || onBulkAction) && (
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(row.id)}
                            onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render 
                            ? column.render(row[column.key], row)
                            : String(row[column.key] || '')
                          }
                        </TableCell>
                      ))}
                      {(showActions && (onEdit || onDelete || onView)) && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onView && (
                                <DropdownMenuItem onClick={() => onView(row)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                              )}
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(row)}>
                                  <CiEdit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem 
                                  onClick={() => onDelete(row)}
                                  className="text-red-600"
                                >
                                  <CiTrash className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
