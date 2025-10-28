"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Banknote, Eye, TrendingUp, TrendingDown, Scale, Building2, AlertTriangle, FileText, BarChart3, CheckCircle, BookOpen } from "lucide-react"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "@/lib/utils"
import type { RootState, AppDispatch } from "@/lib/store/store"
import {
  fetchCashbookBanks,
  fetchCashbookEntries,
  setSelectedCashbookBank,
  fetchCashbookBankPosition,
  fetchCashbookCashFlowReport,
  fetchCashbookBalanceCheck
} from "@/lib/store/slices/accountingSlice"
import { CreateCashbookReceiptModal } from "@/components/accounting/create-cashbook-receipt-modal"
import { CreateCashbookPaymentModal } from "@/components/accounting/create-cashbook-payment-modal"
import { CashbookEntryViewDrawer } from "@/components/accounting/cashbook-entry-view-drawer"
import { AccountingLayout } from "@/components/layout/accounting-layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker" // Assuming shadcn DatePicker is available
import { CashbookDataTable } from "@/components/accounting/CashbookDataTable"
import { Card, CardContent } from "@/components/ui/card"
import { ProcessCashbookModal } from "@/components/accounting/process-cashbook"
import { cashbookApi } from "@/lib/api/cashbook-api"
import { Skeleton } from "@/components/ui/skeleton"  // Add import for skeleton
import { CreateCashbookTransferModal } from "@/components/accounting/create-cashbook-transfer-modal"  // Add import for new modal
import { ProcurementDataTable } from "@/components/procurement/procurement-data-table"
import { CashbookBatchViewDrawer } from "@/components/accounting/cashbook-batch-view-drawer"
import { CashbookTransferViewDrawer } from "@/components/accounting/cashbook-transfer-view-drawer"  // Add import for new drawer

function getWeekRange() {
  const now = new Date()
  return {
    startDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  }
}


// Add formatCurrency helper function
const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount)
}

// Define tabs
const mainTabs = [
  { id: 'single', label: 'Single Entries', icon: FileText, gradient: 'from-blue-500 to-blue-600' },
  { id: 'batch', label: 'Batch', icon: BarChart3, gradient: 'from-green-500 to-green-600' },
  { id: 'transfers', label: 'Cashbook Transfers', icon: TrendingUp, gradient: 'from-purple-500 to-purple-600' },  // Add new tab
]

export default function CashbookPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'transfers'>('single')  // Update type
  const [isProcessCashbookOpen, setIsProcessCashbookOpen] = useState(false)
  const [singleSubTab, setSingleSubTab] = useState<'receipts' | 'payments'>('receipts')
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)  // Add state for transfer modal

  // Select correct state for banks and entries
  const cashbookBanks = useSelector((state: RootState) => state.accounting.cashbookBanks)
  const cashbookBanksLoading = useSelector((state: RootState) => state.accounting.cashbookBanksLoading)
  const selectedCashbookBank = useSelector((state: RootState) => state.accounting.selectedCashbookBank)
  const cashbookEntries = useSelector((state: RootState) => state.accounting.cashbookEntries)
  const cashbookEntriesLoading = useSelector((state: RootState) => state.accounting.cashbookEntriesLoading)
  const cashbookBankPosition = useSelector((state: RootState) => state.accounting.cashbookBankPosition)
  const cashbookBankPositionLoading = useSelector((state: RootState) => state.accounting.cashbookBankPositionLoading)
  const cashbookCashFlowReport = useSelector((state: RootState) => state.accounting.cashbookCashFlowReport)
  const cashbookCashFlowReportLoading = useSelector((state: RootState) => state.accounting.cashbookCashFlowReportLoading)
  const cashbookBalanceCheckReport = useSelector((state: RootState) => state.accounting.cashbookBalanceCheckReport)
  const cashbookBalanceCheckReportLoading = useSelector((state: RootState) => state.accounting.cashbookBalanceCheckReportLoading)

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [batches, setBatches] = useState<any[]>([])
  const [batchesLoading, setBatchesLoading] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [isBatchDrawerOpen, setIsBatchDrawerOpen] = useState(false)
  const [transfers, setTransfers] = useState<any[]>([])  // Add state for transfers data
  const [transfersLoading, setTransfersLoading] = useState(false)  // Add loading state
  const [transferFilters, setTransferFilters] = useState(() => {  // Add filters for transfers
    const { startDate, endDate } = getWeekRange()
    return { fromBankId: "", toBankId: "", dateFrom: startDate, dateTo: endDate, page: 1, limit: 50 }
  })
  const [selectedTransfer, setSelectedTransfer] = useState(null)  // Add state for selected transfer
  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false)  // Add state for transfer drawer

  // Separate date states for each tab
  const [entriesStartDate, setEntriesStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [entriesEndDate, setEntriesEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))
  const [cashflowStartDate, setCashflowStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [cashflowEndDate, setCashflowEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))
  const [balancecheckStartDate, setBalancecheckStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [balancecheckEndDate, setBalancecheckEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))

  // Keep filters for entries tab (includes type and status)
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate } = getWeekRange()
    return { type: "", status: "", startDate, endDate }
  })

  // Sync entries dates with filters
  useEffect(() => {
    setFilters(f => ({
      ...f,
      startDate: entriesStartDate ? format(entriesStartDate, "yyyy-MM-dd") : "",
      endDate: entriesEndDate ? format(entriesEndDate, "yyyy-MM-dd") : ""
    }))
  }, [entriesStartDate, entriesEndDate])

  useEffect(() => {
    dispatch(fetchCashbookBanks())
  }, [dispatch])

  useEffect(() => {
    if (activeTab === 'single') {
      dispatch(fetchCashbookEntries({
        ...filters,
      }))
    } else if (activeTab === 'batch') {
      const fetchBatches = async () => {
        setBatchesLoading(true)
        try {
          const res = await cashbookApi.getCashbookBatches()
          if (res.success) {
            setBatches(res.data?.batches)
          }
        } catch (error) {
          console.error("Failed to fetch batches", error)
        } finally {
          setBatchesLoading(false)
        }
      }
      fetchBatches()
    } else if (activeTab === 'transfers') {
      const fetchTransfers = async () => {
        setTransfersLoading(true)
        try {
          const res = await cashbookApi.getCashbookTransfers(transferFilters)
          if (res.success) {
            setTransfers(res.data?.transfers || res.message || [])
          }
        } catch (error) {
          console.error("Failed to fetch transfers", error)
        } finally {
          setTransfersLoading(false)
        }
      }
      fetchTransfers()
    }
  }, [dispatch, activeTab, filters, transferFilters])

  // Function to export table to CSV (simple Excel-like export)
  const exportToCSV = (data: any[], filename: string) => {
    const headers = ["Date", "Description", "Reference", "Receipts (Dr)", "Payments (Cr)", "Balance", "Status"]
    const rows = data.map(entry => [
      format(new Date(entry.transactionDate || entry.date), "yyyy-MM-dd"),
      entry.description,
      entry.reference,
      entry.type === "RECEIPT" ? Number(entry.amount).toLocaleString() : "",
      entry.type === "PAYMENT" ? Number(entry.amount).toLocaleString() : "",
      "", // Balance will be calculated below
      entry.status
    ])
    // Calculate running balance
    let balance = 0
    rows.forEach(row => {
      if (row[3]) balance += parseFloat(row[3].replace(/,/g, ''))
      if (row[4]) balance -= parseFloat(row[4].replace(/,/g, ''))
      row[5] = balance.toLocaleString()
    })
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate running balance for display
  const calculateBalance = (entries: any[]) => {
    let balance = 0
    return entries.map(entry => {
      if (entry.type === "RECEIPT") balance += Number(entry.amount)
      if (entry.type === "PAYMENT") balance -= Number(entry.amount)
      return { ...entry, balance }
    })
  }

  const entriesWithBalance = calculateBalance(cashbookEntries)

  const filteredEntries = entriesWithBalance.filter(entry => {
    if (singleSubTab === 'receipts') return entry.type === 'RECEIPT'
    if (singleSubTab === 'payments') return entry.type === 'PAYMENT'
    return true
  })

  const batchColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === 'POSTED' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: string) => format(new Date(value), "yyyy-MM-dd"),
      sortable: true,
    },
  ]

  const transferColumns = [
    {
      key: "transferDate",
      label: "Transfer Date",
      render: (value: string) => format(new Date(value), "yyyy-MM-dd"),
      sortable: true,
    },
    {
      key: "fromBank",
      label: "From Bank",
      render: (value: any) => value?.name || "N/A",
      sortable: true,
    },
    {
      key: "toBank",
      label: "To Bank",
      render: (value: any) => value?.name || "N/A",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => formatCurrency(value),
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "reference",
      label: "Reference",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === 'COMPLETED' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
  ]

  const batchFilterOptions = [
    { key: "status", label: "Status", options: ["PENDING", "POSTED", "DRAFT"] },
  ]

  const transferFilterOptions = [
    { key: "fromBankId", label: "From Bank", options: cashbookBanks.map(b => ({ value: b.id, label: b.name })) },
    { key: "toBankId", label: "To Bank", options: cashbookBanks.map(b => ({ value: b.id, label: b.name })) },
  ]

  const handleViewBatch = (batch: any) => {
    setSelectedBatch(batch)
    setIsBatchDrawerOpen(true)
  }

  const handleViewTransfer = (transfer: any) => {
    setSelectedTransfer(transfer)
    setIsTransferDrawerOpen(true)
  }

  const handleBatchUpdate = (updatedBatch: any) => {
    setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b))
  }

  const handleTransferUpdate = (updatedTransfer: any) => {
    setTransfers(prev => prev.map(t => t.id === updatedTransfer.id ? updatedTransfer : t))
  }

  return (
    <AccountingLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal">Cashbook Management</h1>
            <p className="text-muted-foreground">Manage receipts and payments for your cashbook</p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => setIsProcessCashbookOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Process Cashbook
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto border-b px-6">
          <div className="flex space-x-1 min-w-max">
            {mainTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'single' | 'batch' | 'transfers')}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 text-lg font-medium rounded-t-lg border-b-2 transition-all duration-200",
                    isActive ? "text-blue-600 border-blue-600" : "text-gray-600 border-transparent hover:text-gray-900"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-200", tab.gradient)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'single' && (
          <>
            {/* Sub-tabs for Receipts and Payments */}
            <div className="flex border-b bg-muted/30">
              <button
                onClick={() => setSingleSubTab("receipts")}
                className={cn(
                  "flex-1 py-3 text-center font-semibold transition-all duration-200",
                  singleSubTab === "receipts"
                    ? "bg-blue-50 text-blue-900 border-b-2 border-blue-500 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                Receipts
              </button>
              <button
                onClick={() => setSingleSubTab("payments")}
                className={cn(
                  "flex-1 py-3 text-center font-semibold transition-all duration-200",
                  singleSubTab === "payments"
                    ? "bg-amber-50 text-amber-900 border-b-2 border-amber-500 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                Payments
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center mt-2">
              <Select
                value={filters.type || "all"}
                onValueChange={type => setFilters(f => ({ ...f, type: type === "all" ? "" : type }))}
              >
                <SelectTrigger className="w-40 rounded-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RECEIPT">Receipts</SelectItem>
                  <SelectItem value="PAYMENT">Payments</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status || "all"}
                onValueChange={status => setFilters(f => ({ ...f, status: status === "all" ? "" : status }))}
              >
                <SelectTrigger className="w-40 rounded-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="POSTED">Posted</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
              {/* Date range pickers */}
              <div className="flex items-center gap-2">
                <DatePicker
                  value={entriesStartDate}
                  onChange={setEntriesStartDate}
                  className="rounded-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  value={entriesEndDate}
                  onChange={setEntriesEndDate}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Cashbook Table */}
            <CashbookDataTable
              entries={filteredEntries}
              loading={cashbookEntriesLoading}
              onAddReceipt={() => setIsReceiptModalOpen(true)}
              onAddPayment={() => setIsPaymentModalOpen(true)}
              onViewEntry={(entry) => {
                setSelectedEntry(entry)
                setIsViewDrawerOpen(true)
              }}
              onExport={() => exportToCSV(filteredEntries, 'cashbook-entries.csv')}
            />
          </>
        )}

        {activeTab === 'batch' && (
          <>
            {/* Batch Table */}
            <ProcurementDataTable
              data={batches}
              columns={batchColumns}
              title="Batch Entries"
              searchPlaceholder="Search batches..."
              filterOptions={batchFilterOptions}
              onView={handleViewBatch}
              loading={batchesLoading}
              onExport={() => exportToCSV(batches, 'batches.csv')}
              emptyMessage="No batches found."
            />
          </>
        )}

        {activeTab === 'transfers' && (
          <>
            {/* Filters */}
            <div className="flex gap-4 items-center mt-2 flex-wrap">
              <Select
                value={transferFilters.fromBankId || ""}
                onValueChange={fromBankId => setTransferFilters(f => ({ ...f, fromBankId }))}
              >
                <SelectTrigger className="w-48 rounded-full truncate">
                  <SelectValue placeholder="From Bank" />
                </SelectTrigger>
                <SelectContent>
                  {cashbookBanksLoading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    cashbookBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select
                value={transferFilters.toBankId || ""}
                onValueChange={toBankId => setTransferFilters(f => ({ ...f, toBankId }))}
              >
                <SelectTrigger className="w-48 rounded-full truncate">
                  <SelectValue placeholder="To Bank" />
                </SelectTrigger>
                <SelectContent>
                  {cashbookBanksLoading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    cashbookBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <DatePicker
                value={transferFilters.dateFrom ? new Date(transferFilters.dateFrom) : undefined}
                onChange={(date) => setTransferFilters(f => ({ ...f, dateFrom: date ? format(date, "yyyy-MM-dd") : "" }))}
                className="w-48 rounded-full"
              />
              <DatePicker
                value={transferFilters.dateTo ? new Date(transferFilters.dateTo) : undefined}
                onChange={(date) => setTransferFilters(f => ({ ...f, dateTo: date ? format(date, "yyyy-MM-dd") : "" }))}
                className="w-48 rounded-full"
              />
              <Button
                onClick={() => setIsTransferModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Transfer
              </Button>
            </div>

            {/* Transfers Table */}
            <ProcurementDataTable
              data={transfers}
              columns={transferColumns}
              title="Cashbook Transfers"
              searchPlaceholder="Search transfers..."
              filterOptions={transferFilterOptions}
              onView={handleViewTransfer}
              loading={transfersLoading}
              onExport={() => exportToCSV(transfers, 'transfers.csv')}
              emptyMessage="No transfers found."
            />
          </>
        )}

        {/* Modals */}
        <CreateCashbookReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          bank={selectedCashbookBank}
          onSuccess={() => {
            setIsReceiptModalOpen(false)
            dispatch(fetchCashbookEntries({
              ...filters,
            }))
          }}
        />
        <CreateCashbookPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bank={selectedCashbookBank}
          onSuccess={() => {
            setIsPaymentModalOpen(false)
            dispatch(fetchCashbookEntries({
              ...filters,
            }))
          }}
        />

        {/* Entry View Drawer */}
        <CashbookEntryViewDrawer
          isOpen={isViewDrawerOpen}
          onClose={() => {
            setIsViewDrawerOpen(false)
            setSelectedEntry(null)
          }}
          entry={selectedEntry}
        />

        <ProcessCashbookModal
          isOpen={isProcessCashbookOpen}
          onClose={() => setIsProcessCashbookOpen(false)}
          banks={cashbookBanks}
          selectedBank={selectedCashbookBank}
          onBankChange={(bank) => dispatch(setSelectedCashbookBank(bank))}
        />

        {/* Batch View Drawer */}
        <CashbookBatchViewDrawer
          isOpen={isBatchDrawerOpen}
          onClose={() => {
            setIsBatchDrawerOpen(false)
            setSelectedBatch(null)
          }}
          batch={selectedBatch}
          onBatchUpdate={handleBatchUpdate}
        />

        {/* Transfer Modal */}
        <CreateCashbookTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          banks={cashbookBanks}
          onSuccess={() => {
            setIsTransferModalOpen(false)
            // Refetch transfers
            const fetchTransfers = async () => {
              setTransfersLoading(true)
              try {
                const res = await cashbookApi.getCashbookTransfers(transferFilters)
                if (res.success) {
                  setTransfers(res.data?.transfers || res.message || [])
                }
              } catch (error) {
                console.error("Failed to fetch transfers", error)
              } finally {
                setTransfersLoading(false)
              }
            }
            fetchTransfers()
          }}
        />

        {/* Transfer Drawer */}
        <CashbookTransferViewDrawer
          isOpen={isTransferDrawerOpen}
          onClose={() => {
            setIsTransferDrawerOpen(false)
            setSelectedTransfer(null)
          }}
          transfer={selectedTransfer}
          onTransferUpdate={handleTransferUpdate}
        />
      </div>
    </AccountingLayout>
  )
}
