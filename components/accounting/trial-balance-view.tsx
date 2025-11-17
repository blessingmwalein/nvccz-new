"use client"

import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  CalendarIcon, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Building2,
  Wallet,
  CreditCard,
  BarChart3,
  AlertCircle,
  Scale,
  Download,
  FileText,
  Loader2,
  Eye
} from "lucide-react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CiSearch, CiFilter, CiReceipt } from "react-icons/ci"
import { TransactionsDataTable } from "./transactions-data-table"
import { TransactionViewDrawer } from "./transaction-view-drawer"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { RootState, AppDispatch } from "@/lib/store/store"
import { fetchTrialBalance, fetchTrialBalanceSummary } from "@/lib/store/slices/accountingSlice"
import { exportTrialBalanceToCSV, exportTrialBalanceToPDF } from "@/lib/utils/export"

export function TrialBalanceView() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    trialBalance,
    trialBalanceSummary,
    trialBalanceLoading,
    trialBalanceSummaryLoading,
    trialBalanceError,
    trialBalanceSummaryError
  } = useSelector((state: RootState) => state.accounting)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAccountType, setFilterAccountType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // track which account rows are expanded to show transaction details
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set())
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false)

  useEffect(() => {
    loadTrialBalanceData()
  }, [selectedDate])

  const loadTrialBalanceData = async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd')
    try {
      await Promise.all([
        dispatch(fetchTrialBalance(dateString)),
        dispatch(fetchTrialBalanceSummary(dateString))
      ])
    } catch (error: any) {
      toast.error("Failed to load trial balance data", {
        description: error.message
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const toggleAccountExpand = (accountId: string) => {
    setExpandedAccounts(prev => {
      const next = new Set(prev)
      if (next.has(accountId)) {
        next.delete(accountId)
      } else {
        next.add(accountId)
      }
      return next
    })
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsTransactionDrawerOpen(true)
  }

  // Filter and search
  const filteredAccounts = trialBalance?.accounts.filter((account: any) => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.accountNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAccountType === 'all' || account.accountType.toLowerCase() === filterAccountType.toLowerCase()
    return matchesSearch && matchesFilter
  }) || []

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterAccountType])

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'current asset':
      case 'fixed asset':
        return 'bg-blue-100 text-blue-800'
      case 'current liability':
      case 'long-term liability':
        return 'bg-red-100 text-red-800'
      case 'revenue':
        return 'bg-green-100 text-green-800'
      case 'expense':
        return 'bg-orange-100 text-orange-800'
      case 'equity':
        return 'bg-purple-100 text-purple-800'
      case 'contra-asset':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportCSV = () => {
    if (!trialBalance) {
      toast.error("No trial balance data to export")
      return
    }
    
    try {
      exportTrialBalanceToCSV(trialBalance)
      toast.success("Trial balance exported to CSV successfully")
    } catch (error) {
      toast.error("Failed to export trial balance to CSV")
    }
  }

  const handleExportPDF = async () => {
    if (!trialBalance) {
      toast.error("No trial balance data to export")
      return
    }
    
    try {
      setGeneratingPDF(true)
      await exportTrialBalanceToPDF(trialBalance)
      toast.success("Trial balance PDF generated successfully")
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error("Failed to generate trial balance PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (trialBalanceError || trialBalanceSummaryError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Trial Balance</h3>
          <p className="text-gray-600 mb-4">{trialBalanceError || trialBalanceSummaryError}</p>
          <Button onClick={loadTrialBalanceData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Trial Balance</h2>
          <p className="text-gray-600">
            As of {format(selectedDate, 'MMMM d, yyyy')} - Currency: USD
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Export Buttons */}
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="rounded-full"
            disabled={!trialBalance}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button 
            onClick={handleExportPDF}
            variant="outline" 
            className="rounded-full"
            disabled={!trialBalance || generatingPDF}
          >
            {generatingPDF ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
          
          <Button 
            onClick={loadTrialBalanceData} 
            disabled={trialBalanceLoading || trialBalanceSummaryLoading}
            className="rounded-full"
          >
            <RefreshCw className={cn(
              "w-4 h-4 mr-2",
              (trialBalanceLoading || trialBalanceSummaryLoading) && "animate-spin"
            )} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {trialBalanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-white">
                    {trialBalanceSummary.totalAccounts}
                  </div>
                  <div className="text-white/80 text-sm">Total Accounts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-gray-900">
                    {formatCurrency(trialBalanceSummary.totalDebits)}
                  </div>
                  <div className="text-gray-600 text-sm">Total Debits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-white">
                    {formatCurrency(trialBalanceSummary.totalCredits)}
                  </div>
                  <div className="text-white/80 text-sm">Total Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  trialBalanceSummary.isBalanced 
                    ? "bg-green-500" 
                    : "bg-red-500"
                )}>
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-2xl font-normal",
                    trialBalanceSummary.isBalanced ? "text-green-600" : "text-red-600"
                  )}>
                    {trialBalanceSummary.isBalanced ? "Balanced" : "Unbalanced"}
                  </div>
                  <div className="text-gray-600 text-sm">Trial Balance Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trial Balance Cards Grid */}
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search accounts by name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterAccountType} onValueChange={setFilterAccountType}>
            <SelectTrigger className="w-full sm:w-56">
              <CiFilter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Account Types</SelectItem>
              <SelectItem value="current asset">Current Asset</SelectItem>
              <SelectItem value="fixed asset">Fixed Asset</SelectItem>
              <SelectItem value="current liability">Current Liability</SelectItem>
              <SelectItem value="long-term liability">Long-Term Liability</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="contra-asset">Contra-Asset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Accounts Grid */}
        {trialBalanceLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : paginatedAccounts.length > 0 ? (
          <>
            {/* Trial Balance Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Account No.</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Account Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Account Type</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Debit Balance</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Credit Balance</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAccounts.map((account: any) => {
                        const isExpanded = expandedAccounts.has(account.accountId)
                        const hasTransactions = account.transactions && account.transactions.length > 0

                        return (
                          <React.Fragment key={account.accountId}>
                            <tr 
                              className={cn(
                                "border-b hover:bg-gray-50 transition-colors",
                                hasTransactions && "cursor-pointer"
                              )}
                              onClick={() => hasTransactions && toggleAccountExpand(account.accountId)}
                            >
                              <td className="py-3 px-4">
                                <span className="font-mono text-sm text-blue-600 font-semibold">
                                  {account.accountNo}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-900">{account.accountName}</span>
                                  {hasTransactions && (
                                    <Badge variant="outline" className="text-xs">
                                      {account.transactions.length} txns
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={cn("text-xs", getAccountTypeColor(account.accountType))}>
                                  {account.accountType}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={cn(
                                  "font-mono text-sm",
                                  account.debitBalance > 0 ? "text-green-700 font-semibold" : "text-gray-400"
                                )}>
                                  {formatCurrency(account.debitBalance || 0)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={cn(
                                  "font-mono text-sm",
                                  account.creditBalance > 0 ? "text-red-700 font-semibold" : "text-gray-400"
                                )}>
                                  {formatCurrency(account.creditBalance || 0)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {hasTransactions && (
                                  <div className="flex items-center justify-center">
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-gray-600" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-gray-600" />
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                            {/* Expanded Transaction Row */}
                            {isExpanded && hasTransactions && (
                              <tr>
                                <td colSpan={6} className="p-0 bg-blue-50">
                                  <div className="px-4 py-4">
                                    <TransactionsDataTable
                                      transactions={account.transactions}
                                      onRowClick={handleTransactionClick}
                                      loading={false}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                    {/* Totals Row */}
                    {trialBalance && (
                      <tfoot>
                        <tr className="border-t-2 border-gray-300 bg-gray-100 font-bold">
                          <td colSpan={3} className="py-3 px-4 text-sm text-gray-900">
                            TOTALS
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono text-sm text-green-700">
                              {formatCurrency(trialBalance.totals?.totalDebits || 0)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono text-sm text-red-700">
                              {formatCurrency(trialBalance.totals?.totalCredits || 0)}
                            </span>
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <CiReceipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
            <p className="text-gray-600">
              {searchTerm || filterAccountType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No account data available for the selected date.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Transaction View Drawer */}
      <TransactionViewDrawer
        transaction={selectedTransaction}
        isOpen={isTransactionDrawerOpen}
        onClose={() => setIsTransactionDrawerOpen(false)}
      />
    </div>
  )
}
