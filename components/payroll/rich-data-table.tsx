"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  MoreHorizontal 
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

export interface RichDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title: string
  searchPlaceholder?: string
  filterOptions?: { label: string; value: string }[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onView?: (row: T) => void
  onBulkAction?: (selectedRows: T[], action: string) => void
  bulkActions?: { label: string; value: string; icon?: React.ReactNode }[]
  loading?: boolean
  pageSize?: number
  exportable?: boolean
  onExport?: (data: T[]) => void
}

export function RichDataTable<T extends { id: string }>({
  data,
  columns,
  title,
  searchPlaceholder = "Search...",
  filterOptions = [],
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  bulkActions = [],
  loading = false,
  pageSize = 10,
  exportable = true,
  onExport
}: RichDataTableProps<T>) {
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
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply filter
    if (filterValue !== "all") {
      // Find the column that has filterable: true and matches the filter value
      const filterableColumn = columns.find(col => col.filterable)
      if (filterableColumn) {
        filtered = filtered.filter(row => {
          const value = row[filterableColumn.key]
          return value && value.toString() === filterValue
        })
      }
    }

    return filtered
  }, [data, searchTerm, filterValue, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

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
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  // Handle row selection
  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map(row => row.id))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    const selectedRowsData = data.filter(row => selectedRows.includes(row.id))
    onBulkAction?.(selectedRowsData, action)
    setSelectedRows([])
  }

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData)
    } else {
      // Default CSV export
      const csvContent = [
        columns.map(col => col.label).join(','),
        ...sortedData.map(row => 
          columns.map(col => {
            const value = row[col.key]
            return typeof value === 'string' ? `"${value}"` : value
          }).join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) return null
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  if (loading) {
    return (
      <Card className="rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            {title}
            {selectedRows.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedRows.length} selected
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
          {filterOptions.length > 0 && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-48 rounded-full">
                <CiFilter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedRows.length} items selected
            </span>
            <div className="flex gap-2">
              {bulkActions.map(action => (
                <Button
                  key={action.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction(action.value)}
                  className="rounded-full"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columns.map(column => (
                  <TableHead
                    key={String(column.key)}
                    className={`${column.width || ''} ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  {columns.map(column => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || '-')
                      }
                    </TableCell>
                  ))}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
