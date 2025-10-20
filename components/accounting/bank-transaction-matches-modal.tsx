"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, FileText, List } from "lucide-react"
import { format } from "date-fns"
import { ProcurementDataTable, Column } from "@/components/procurement/procurement-data-table"

export function BankTransactionMatchesModal({
  open,
  onClose,
  transaction,
  matches,
  loading
}: {
  open: boolean,
  onClose: () => void,
  transaction: any,
  matches: any[],
  loading: boolean
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // Journal entry columns
  const journalColumns: Column<any>[] = [
    {
      key: 'referenceNumber',
      label: 'Reference',
      render: (value) => <span className="font-mono">{value}</span>
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span>{value}</span>
    },
    {
      key: 'journalDate',
      label: 'Date',
      render: (value) => <span>{format(new Date(value), 'MMM dd, yyyy')}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={value === "POSTED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
          {value}
        </Badge>
      )
    },
    {
      key: 'totalDebit',
      label: 'Debit',
      render: (value) => <span className="text-red-600 font-bold">{value}</span>
    },
    {
      key: 'totalCredit',
      label: 'Credit',
      render: (value) => <span className="text-green-600 font-bold">{value}</span>
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Bank Transaction Matches
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        {transaction && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-mono">{transaction.description}</span>
                <Badge className={transaction.isMatched ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {transaction.isMatched ? "Matched" : "Unmatched"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold ml-2">{transaction.amount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2">{format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reference:</span>
                  <span className="ml-2">{transaction.reference}</span>
                </div>
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2">{transaction.confidenceScore ? `${transaction.confidenceScore}%` : "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <div className="text-center py-8">Loading matches...</div>
        ) : (
          <div>
            {matches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No matches found.</div>
            ) : (
              matches.map((match: any, idx: number) => (
                <Card key={match.id || idx} className="mb-4">
                  <CardHeader
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpanded(expanded === match.id ? null : match.id)}
                  >
                    <div className="flex items-center gap-2">
                      <List className="w-5 h-5" />
                      <span className="font-semibold">Match #{idx + 1}</span>
                      <Badge className={match.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {match.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expanded === match.id ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CardHeader>
                  {expanded === match.id && (
                    <CardContent>
                      <div className="mb-2">
                        <span className="text-gray-600">Journal Entry:</span>
                        <span className="ml-2 font-mono">{match.referenceNumber}</span>
                      </div>
                      <ProcurementDataTable
                        data={match.journalEntryLines || []}
                        columns={[
                          {
                            key: 'chartOfAccount',
                            label: 'Account',
                            render: (value, row) => value ? `${value.accountNo} - ${value.accountName}` : ''
                          },
                          {
                            key: 'description',
                            label: 'Description',
                            render: (value) => <span>{value}</span>
                          },
                          {
                            key: 'debitAmount',
                            label: 'Debit',
                            render: (value) => <span className="text-red-600 font-bold">{value}</span>
                          },
                          {
                            key: 'creditAmount',
                            label: 'Credit',
                            render: (value) => <span className="text-green-600 font-bold">{value}</span>
                          }
                        ]}
                        title="Journal Entry Lines"
                        loading={false}
                        showSearch={false}
                        showFilters={false}
                        emptyMessage="No journal entry lines."
                      />
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
