"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProcurementDataTable } from "@/components/procurement/procurement-data-table"
import { CreatePeriodLockoutModal } from "@/components/accounting/create-period-lockout-modal"
import { PeriodLockoutViewDrawer } from "@/components/accounting/period-lockout-view-drawer"
import { fetchPeriods } from "@/lib/store/slices/cashbookSlice"
import { format } from "date-fns"
import type { AppDispatch, RootState } from "@/lib/store"

export function PeriodLockoutTab() {
  const dispatch = useDispatch<AppDispatch>()
  const periods = useSelector((state: RootState) => state.cashbook.periods)
  const periodsLoading = useSelector((state: RootState) => state.cashbook.periodsLoading)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [filters, setFilters] = useState({ 
    year: new Date().getFullYear(), 
    isLocked: undefined as boolean | undefined 
  })

  useEffect(() => {
    dispatch(fetchPeriods(filters))
  }, [dispatch, filters])

  const columns = [
    {
      key: "period",
      label: "Period",
      sortable: true,
    },
    {
      key: "isLocked",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? 'destructive' : 'default'}>
          {value ? 'Locked' : 'Unlocked'}
        </Badge>
      ),
    },
    {
      key: "lockedByUser",
      label: "Locked By",
      render: (value: any) => value ? `${value.firstName} ${value.lastName}` : "N/A",
    },
    {
      key: "lockedAt",
      label: "Locked At",
      render: (value: string) => value ? format(new Date(value), "yyyy-MM-dd HH:mm") : "N/A",
      sortable: true,
    },
    {
      key: "reason",
      label: "Reason",
    },
  ]

  return (
    <>
      <div className="flex gap-4 items-center mb-4">
        <Select
          value={filters.year.toString()}
          onValueChange={year => setFilters(f => ({ ...f, year: parseInt(year) }))}
        >
          <SelectTrigger className="w-48 rounded-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.isLocked === undefined ? "all" : filters.isLocked.toString()}
          onValueChange={status => setFilters(f => ({ ...f, isLocked: status === "all" ? undefined : status === "true" }))}
        >
          <SelectTrigger className="w-48 rounded-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Locked</SelectItem>
            <SelectItem value="false">Unlocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProcurementDataTable
        data={periods}
        columns={columns}
        title="Period Lockout"
        searchPlaceholder="Search periods..."
        onCreate={() => {
          setSelectedPeriod(null)
          setIsModalOpen(true)
        }}
        onView={(period) => {
          setSelectedPeriod(period)
          setIsDrawerOpen(true)
        }}
        onEdit={(period) => {
          setSelectedPeriod(period)
          setIsModalOpen(true)
        }}
        loading={periodsLoading}
        emptyMessage="No periods found."
      />

      <CreatePeriodLockoutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPeriod(null)
        }}
        period={selectedPeriod}
      />

      <PeriodLockoutViewDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedPeriod(null)
        }}
        period={selectedPeriod}
      />
    </>
  )
}
