"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Banknote, Eye, TrendingUp, TrendingDown, Scale, Building2, AlertTriangle, FileText, BarChart3, CheckCircle } from "lucide-react"
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

function getWeekRange() {
  const now = new Date()
  return {
    startDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  }
}

// Add formatCurrency helper function
const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(0)
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount)
}

// Define tabs
const mainTabs = [
  { id: 'entries', label: 'Entries', icon: FileText, gradient: 'from-blue-500 to-blue-600' },
  { id: 'cashflow', label: 'Cash Flow', icon: BarChart3, gradient: 'from-green-500 to-green-600' },
  { id: 'balancecheck', label: 'Balance Check', icon: CheckCircle, gradient: 'from-purple-500 to-purple-600' },
]

export default function CashbookPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'entries' | 'cashflow' | 'balancecheck'>('entries')

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

  // Separate date states for each tab
  const [entriesStartDate, setEntriesStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [entriesEndDate, setEntriesEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))
  const [cashflowStartDate, setCashflowStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [cashflowEndDate, setCashflowEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))
  const [balancecheckStartDate, setBalancecheckStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  const [balancecheckEndDate, setBalancecheckEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))

  // Remove shared startDate, endDate, and filters state
  // const [startDate, setStartDate] = useState<Date | undefined>(new Date(getWeekRange().startDate))
  // const [endDate, setEndDate] = useState<Date | undefined>(new Date(getWeekRange().endDate))
  // const [filters, setFilters] = useState(() => {
  //   const { startDate, endDate } = getWeekRange()
  //   return { type: "", status: "", startDate, endDate }
  // })

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
    if (selectedCashbookBank) {
      if (activeTab === 'entries') {
        dispatch(fetchCashbookEntries({
          bankId: selectedCashbookBank.id,
          ...filters,
        }))
        dispatch(fetchCashbookBankPosition(selectedCashbookBank.id))
      } else if (activeTab === 'cashflow') {
        dispatch(fetchCashbookCashFlowReport({
          bankId: selectedCashbookBank.id,
          startDate: cashflowStartDate ? format(cashflowStartDate, "yyyy-MM-dd") : "",
          endDate: cashflowEndDate ? format(cashflowEndDate, "yyyy-MM-dd") : "",
        }))
      } else if (activeTab === 'balancecheck') {
        dispatch(fetchCashbookBalanceCheck({
          bankId: selectedCashbookBank.id,
          startDate: balancecheckStartDate ? format(balancecheckStartDate, "yyyy-MM-dd") : "",
          endDate: balancecheckEndDate ? format(balancecheckEndDate, "yyyy-MM-dd") : "",
        }))
      }
    }
  }, [dispatch, selectedCashbookBank, activeTab, filters, cashflowStartDate, cashflowEndDate, balancecheckStartDate, balancecheckEndDate])

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

  return (
    <AccountingLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal">Cashbook Management</h1>
            <p className="text-muted-foreground">Manage receipts and payments for your bank accounts</p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Bank selector with extended label when selected */}
            <div className="relative w-80">
              <Select
                value={selectedCashbookBank?.name ?? ""}
                onValueChange={bankName => {
                  const bank = cashbookBanks.find(b => b.name === bankName)
                  if (bank) dispatch(setSelectedCashbookBank(bank))
                }}
              >
                <SelectTrigger className="w-full rounded-full truncate">
                  <SelectValue placeholder="Select bank account..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-64 overflow-y-auto">
                  {cashbookBanks.length > 0 ? (
                    cashbookBanks.map((bank: any) => (
                      <SelectItem key={bank.id} value={bank.name}>
                        <div className="flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-semibold truncate">{bank.name}</div>
                            <div className="text-xs text-gray-500">{bank.accountNumber}</div>
                          </div>
                          <Badge className="ml-auto">{bank.currency.code}</Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">No banks found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
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
                  onClick={() => setActiveTab(tab.id as 'entries'|'cashflow'|'balancecheck')}
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
        {activeTab === 'entries' && (
          <>
            {/* Bank Position Stats Cards */}
            {selectedCashbookBank && cashbookBankPosition && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-white">
                          {formatCurrency(cashbookBankPosition.openingBalance, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-white/80 text-sm">Opening Balance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-gray-900">
                          {formatCurrency(cashbookBankPosition.totalReceipts, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-gray-600 text-sm">Total Receipts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-white">
                          {formatCurrency(cashbookBankPosition.totalPayments, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-white/80 text-sm">Total Payments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <Scale className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-gray-900">
                          {formatCurrency(cashbookBankPosition.closingBalance, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-gray-600 text-sm">Closing Balance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-white">
                          {cashbookBankPosition.unreconciledCount}
                        </div>
                        <div className="text-white/80 text-sm">Unreconciled</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
            {selectedCashbookBank ? (
              <CashbookDataTable
                entries={entriesWithBalance}
                loading={cashbookEntriesLoading}
                onAddReceipt={() => setIsReceiptModalOpen(true)}
                onAddPayment={() => setIsPaymentModalOpen(true)}
                onViewEntry={(entry) => {
                  setSelectedEntry(entry)
                  setIsViewDrawerOpen(true)
                }}
                onExport={() => exportToCSV(entriesWithBalance, 'cashbook-entries.csv')}
              />
            ) : (
              <div className="">
                <CardContent className="p-8 text-center">
                  <Banknote className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a Bank Account</h3>
                  <p className="text-gray-500">Choose a bank account to view and manage your cashbook entries.</p>
                </CardContent>
              </div>
            )}
          </>
        )}

        {activeTab === 'cashflow' && (
          <>
            {/* Cash Flow Summary Stats Cards */}
            {selectedCashbookBank && cashbookCashFlowReport && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-gray-900">
                          {formatCurrency(cashbookCashFlowReport.summary.totalReceipts, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-gray-600 text-sm">Total Receipts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-white">
                          {formatCurrency(cashbookCashFlowReport.summary.totalPayments, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-white/80 text-sm">Total Payments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                  <CardContent className="p-4 h-[48px] flex items-center">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <Scale className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-normal text-gray-900">
                          {formatCurrency(cashbookCashFlowReport.summary.netCashFlow, selectedCashbookBank.currency.code)}
                        </div>
                        <div className="text-gray-600 text-sm">Net Cash Flow</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 items-center mt-2">
              {/* Date range pickers */}
              <div className="flex items-center gap-2">
                <DatePicker
                  value={cashflowStartDate}
                  onChange={setCashflowStartDate}
                  className="rounded-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  value={cashflowEndDate}
                  onChange={setCashflowEndDate}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Cash Flow Table (Read-Only) */}
            {selectedCashbookBank ? (
              <CashbookDataTable
                entries={calculateBalance(cashbookCashFlowReport?.entries || [])}
                loading={cashbookCashFlowReportLoading}
                onViewEntry={(entry) => {
                  setSelectedEntry(entry)
                  setIsViewDrawerOpen(true)
                }}
                onExport={() => exportToCSV(cashbookCashFlowReport?.entries || [], 'cashbook-cashflow.csv')}
                readOnly={true}
              />
            ) : (
              <div >
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a Bank Account</h3>
                  <p className="text-gray-500">Choose a bank account to view your cash flow report.</p>
                </CardContent>
              </div>
            )}
          </>
        )}

        {activeTab === 'balancecheck' && (
          <>
            {/* Balance Check Report Layout */}
            {selectedCashbookBank && cashbookBalanceCheckReport && (
              <div className="space-y-8">
                {/* Report Header */}
                <div className="border-b-2 border-gray-300 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Balance Check Report</h2>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Bank:</strong> {cashbookBalanceCheckReport.bank.name} ({cashbookBalanceCheckReport.bank.accountNumber})
                    </div>
                    <div>
                      <strong>Currency:</strong> {cashbookBalanceCheckReport.bank.currency}
                    </div>
                    <div>
                      <strong>Period:</strong> {format(new Date(cashbookBalanceCheckReport.period.startDate), "yyyy-MM-dd")} to {format(new Date(cashbookBalanceCheckReport.period.endDate), "yyyy-MM-dd")}
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Metric</th>
                        <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Cashbook</th>
                        <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Bank Reconciliation</th>
                        <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Total Receipts</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.cashbook.totalReceipts)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.bankReconciliation.totalReceipts)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-red-600">{formatCurrency(cashbookBalanceCheckReport.differences.receiptDifference)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Total Payments</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.cashbook.totalPayments)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.bankReconciliation.totalPayments)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-red-600">{formatCurrency(cashbookBalanceCheckReport.differences.paymentDifference)}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Net Balance</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.cashbook.netBalance)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(cashbookBalanceCheckReport.bankReconciliation.netBalance)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-red-600">{formatCurrency(cashbookBalanceCheckReport.differences.netDifference)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Entry/Reconciliation Count</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{cashbookBalanceCheckReport.cashbook.entryCount}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{cashbookBalanceCheckReport.bankReconciliation.reconciliationCount}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Unreconciled/Unmatched</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{cashbookBalanceCheckReport.cashbook.unreconciledCount}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{cashbookBalanceCheckReport.bankReconciliation.unmatchedTransactions}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Overall Status */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Status</h3>
                  <div className="flex items-center gap-4">
                    <Badge variant={cashbookBalanceCheckReport.differences.isBalanced ? "default" : "destructive"} className="text-sm px-3 py-1">
                      {cashbookBalanceCheckReport.differences.isBalanced ? "Balanced" : "Not Balanced"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {cashbookBalanceCheckReport.status.hasUnreconciledEntries && "Unreconciled entries present. "}
                      {cashbookBalanceCheckReport.status.hasUnmatchedTransactions && "Unmatched transactions found. "}
                      {cashbookBalanceCheckReport.status.needsAttention && "Attention required."}
                    </span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommendations</h3>
                  <p className="text-sm text-gray-700 mb-2">{cashbookBalanceCheckReport.summary.message}</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {cashbookBalanceCheckReport.summary.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(!selectedCashbookBank || cashbookBalanceCheckReportLoading) && (
              <Card className="max-w-md mx-auto border border-gray-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    {cashbookBalanceCheckReportLoading ? "Loading Balance Check Report..." : "Select a Bank Account"}
                  </h3>
                  <p className="text-gray-500">
                    {cashbookBalanceCheckReportLoading ? "Please wait while we prepare your report." : "Choose a bank account to view your balance check."}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Modals */}
        <CreateCashbookReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          bank={selectedCashbookBank}
          onSuccess={() => {
            setIsReceiptModalOpen(false)
            if (selectedCashbookBank) {
              dispatch(fetchCashbookEntries({
                bankId: selectedCashbookBank.id,
                ...filters,
              }))
            }
          }}
        />
        <CreateCashbookPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bank={selectedCashbookBank}
          onSuccess={() => {
            setIsPaymentModalOpen(false)
            if (selectedCashbookBank) {
              dispatch(fetchCashbookEntries({
                bankId: selectedCashbookBank.id,
                ...filters,
              }))
            }
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
      </div>
    </AccountingLayout>
  )
}
