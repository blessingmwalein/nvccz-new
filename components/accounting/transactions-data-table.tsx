"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Download, FileText, Search } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  date: string
  reference: string
  description: string
  debitAmount: number
  creditAmount: number
  source: string
  journalEntry?: {
    id: string
    referenceNumber: string
    description: string
    transactionDate: string
    status: string
    currencyId: string
  }
  sourceTransaction?: any
  journalEntryId?: string
  journalEntryStatus?: string
}

interface TransactionsDataTableProps {
  transactions: Transaction[]
  onRowClick?: (transaction: Transaction) => void
  loading?: boolean
  title?: string
}

export function TransactionsDataTable({
  transactions,
  onRowClick,
  loading = false,
  title = "Transactions"
}: TransactionsDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const filteredTransactions = transactions.filter(txn => {
    const searchLower = searchTerm.toLowerCase()
    return (
      txn.reference.toLowerCase().includes(searchLower) ||
      txn.description.toLowerCase().includes(searchLower) ||
      txn.source.toLowerCase().includes(searchLower)
    )
  })

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'CASHBOOK':
        return 'bg-blue-100 text-blue-800'
      case 'MANUAL_ENTRY':
        return 'bg-purple-100 text-purple-800'
      case 'INVOICE':
        return 'bg-green-100 text-green-800'
      case 'PAYMENT':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'VOIDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Source', 'Status']
      const rows = filteredTransactions.map(txn => [
        format(new Date(txn.date), 'yyyy-MM-dd'),
        txn.reference,
        txn.description,
        txn.debitAmount.toFixed(2),
        txn.creditAmount.toFixed(2),
        txn.source,
        txn.journalEntryStatus || 'N/A'
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${format(new Date(), 'yyyyMMdd')}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Transactions exported to CSV')
    } catch (error) {
      toast.error('Failed to export transactions')
    }
  }

  const handleExportPDF = () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: linear-gradient(to right, #3b82f6, #2563eb); color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .debit { color: #059669; font-weight: bold; }
            .credit { color: #dc2626; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${format(new Date(), 'PPP')}</p>
          <p>Total Transactions: ${filteredTransactions.length}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(txn => `
                <tr>
                  <td>${format(new Date(txn.date), 'PP')}</td>
                  <td>${txn.reference}</td>
                  <td>${txn.description}</td>
                  <td class="debit">${formatCurrency(txn.debitAmount)}</td>
                  <td class="credit">${formatCurrency(txn.creditAmount)}</td>
                  <td>${txn.source}</td>
                  <td>${txn.journalEntryStatus || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Report generated by Accounting System - ${format(new Date(), 'PPP p')}</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
      }
      toast.success('Opening PDF print preview')
    } catch (error) {
      toast.error('Failed to generate PDF')
    }
  }

  const totalDebits = filteredTransactions.reduce((sum, txn) => sum + txn.debitAmount, 0)
  const totalCredits = filteredTransactions.reduce((sum, txn) => sum + txn.creditAmount, 0)

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by reference, description, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-full"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="rounded-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Reference</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-right">Debit</TableHead>
              <TableHead className="font-semibold text-right">Credit</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No transactions found</p>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredTransactions.map((txn) => (
                  <TableRow
                    key={txn.id}
                    className={cn(
                      "cursor-pointer hover:bg-blue-50 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick && onRowClick(txn)}
                  >
                    <TableCell className="font-medium">
                      {format(new Date(txn.date), 'PP')}
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-mono text-sm">{txn.reference}</span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{txn.description}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-mono font-semibold",
                        txn.debitAmount > 0 ? "text-green-700" : "text-gray-400"
                      )}>
                        {txn.debitAmount > 0 ? formatCurrency(txn.debitAmount) : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-mono font-semibold",
                        txn.creditAmount > 0 ? "text-red-700" : "text-gray-400"
                      )}>
                        {txn.creditAmount > 0 ? formatCurrency(txn.creditAmount) : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSourceBadgeColor(txn.source)} variant="outline">
                        {txn.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {txn.journalEntryStatus && (
                        <Badge className={getStatusBadgeColor(txn.journalEntryStatus)} variant="outline">
                          {txn.journalEntryStatus}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell colSpan={3} className="text-right">Total:</TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-700 font-mono">{formatCurrency(totalDebits)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-700 font-mono">{formatCurrency(totalCredits)}</span>
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing <span className="font-semibold">{filteredTransactions.length}</span> of{' '}
          <span className="font-semibold">{transactions.length}</span> transactions
        </p>
        <p>
          Net: <span className={cn(
            "font-semibold font-mono",
            (totalDebits - totalCredits) >= 0 ? "text-green-700" : "text-red-700"
          )}>
            {formatCurrency(Math.abs(totalDebits - totalCredits))}
          </span>
        </p>
      </div>
    </div>
  )
}
