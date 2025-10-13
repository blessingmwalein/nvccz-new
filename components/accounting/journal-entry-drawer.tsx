"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  FileText, 
  User, 
  DollarSign, 
  Calculator,
  Edit,
  Trash2,
  Copy,
  Download
} from "lucide-react"
import { toast } from "sonner"
import { accountingApi } from "@/lib/api/accounting-api"
import { JournalEntry } from "@/lib/store/slices/accountingSlice"

interface JournalEntryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  journalEntryId?: string
  onJournalEntryUpdated?: () => void
}

export function JournalEntryDrawer({
  open,
  onOpenChange,
  journalEntryId,
  onJournalEntryUpdated
}: JournalEntryDrawerProps) {
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && journalEntryId) {
      loadJournalEntry()
    }
  }, [open, journalEntryId])

  const loadJournalEntry = async () => {
    if (!journalEntryId) return

    try {
      setLoading(true)
      const response = await accountingApi.journalEntries.getJournalEntryById(journalEntryId)
      if (response.success && response.data) {
        setJournalEntry(response.data)
      } else {
        toast.error('Failed to load journal entry')
      }
    } catch (error: any) {
      toast.error('Error loading journal entry', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    toast.info('Edit functionality coming soon')
  }

  const handleDelete = async () => {
    if (!journalEntry || !confirm(`Are you sure you want to delete journal entry ${journalEntry.referenceNumber}?`)) {
      return
    }

    try {
      await accountingApi.journalEntries.deleteJournalEntry(journalEntry.id)
      toast.success('Journal entry deleted successfully')
      onJournalEntryUpdated?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Failed to delete journal entry', { description: error.message })
    }
  }

  const handleDuplicate = () => {
    toast.info('Duplicate functionality coming soon')
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTotalDebits = () => {
    if (!journalEntry) return 0
    return journalEntry.lines.reduce((sum, line) => sum + (line.debitAmount || 0), 0)
  }

  const getTotalCredits = () => {
    if (!journalEntry) return 0
    return journalEntry.lines.reduce((sum, line) => sum + (line.creditAmount || 0), 0)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {journalEntry ? `Journal Entry: ${journalEntry.referenceNumber}` : 'Loading...'}
              </SheetTitle>
              <SheetDescription>
                View journal entry details and transaction lines
              </SheetDescription>
            </div>
            {journalEntry && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDuplicate}>
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="w-3 h-3 mr-1 text-red-500" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading journal entry...</span>
          </div>
        ) : journalEntry ? (
          <div className="space-y-6 mt-6">
            {/* Header Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium">{formatDate(journalEntry.journalDate)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Reference</div>
                      <div className="font-medium">{journalEntry.referenceNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-500">Entry Type</div>
                      <Badge variant={journalEntry.isManualEntry ? "default" : "secondary"}>
                        {journalEntry.isManualEntry ? "Manual Entry" : "Auto Generated"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="font-medium">{formatCurrency(getTotalDebits())}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{journalEntry.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Journal Lines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {journalEntry.lines.map((line, index) => (
                    <div key={line.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {line.account?.accountNumber} - {line.account?.accountName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {line.account?.accountType}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {line.debitAmount ? (
                          <div>
                            <div className="text-sm text-gray-500">Debit</div>
                            <div className="font-semibold text-green-600">
                              {formatCurrency(line.debitAmount)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-500">Credit</div>
                            <div className="font-semibold text-red-600">
                              {formatCurrency(line.creditAmount || 0)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Totals:</span>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Debits</div>
                        <div className="font-bold text-green-600">
                          {formatCurrency(getTotalDebits())}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Credits</div>
                        <div className="font-bold text-red-600">
                          {formatCurrency(getTotalCredits())}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mt-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium">Entry is balanced</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Created At</div>
                    <div className="font-medium">{formatDate(journalEntry.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Last Updated</div>
                    <div className="font-medium">{formatDate(journalEntry.updatedAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Entry ID</div>
                    <div className="font-mono text-xs">{journalEntry.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Exchange Rate</div>
                    <div className="font-medium">{journalEntry.exchangeRate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Journal entry not found
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}