"use client"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Download, AlertTriangle, Clock, User, FileText, List, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ProcurementDataTable, Column } from "@/components/procurement/procurement-data-table"
import { toast } from "sonner"
import { useSelector, useDispatch } from "react-redux"
import { fetchBankTransactionMatches, clearBankTransactionMatchesError } from "@/lib/store/slices/accountingSlice"
import { BankTransactionMatchesModal } from "./bank-transaction-matches-modal"

const tabs = [
    { id: "info", label: "Info", icon: FileText },
    { id: "transactions", label: "Bank Transactions", icon: List },
    { id: "unmatched", label: "Unmatched Transactions", icon: AlertTriangle }
]

export function BankReconciliationViewDrawer({ isOpen, onClose, reconciliation }: { isOpen: boolean, onClose: () => void, reconciliation: any }) {
    const dispatch = useDispatch()
    const { bankTransactionMatches, bankTransactionMatchesLoading } = useSelector((state: any) => state.accounting)
    const [activeTab, setActiveTab] = useState("info")
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
    const [matchesModalOpen, setMatchesModalOpen] = useState(false)

    if (!reconciliation) return null

    // Columns for bank transactions
    const transactionColumns: Column<any>[] = [
        {
            key: 'description',
            label: 'Description',
            render: (value, row) => (
                <div>
                    <span className="font-medium">{value}</span>
                    <div className="text-xs text-gray-500">{row.reference}</div>
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (value) => <span className="font-bold text-green-600">{value}</span>
        },
        {
            key: 'transactionDate',
            label: 'Date',
            render: (value) => <span>{format(new Date(value), 'MMM dd, yyyy')}</span>
        },
        {
            key: 'isMatched',
            label: 'Matched',
            render: (value) => value ? <Badge className="bg-green-100 text-green-800">Matched</Badge> : <Badge className="bg-yellow-100 text-yellow-800">Unmatched</Badge>
        },
        {
            key: 'confidenceScore',
            label: 'Confidence',
            render: (value) => value ? `${value}%` : '—'
        }
    ]

    // Columns for unmatched transactions
    const unmatchedColumns: Column<any>[] = [
        {
            key: 'description',
            label: 'Description',
            render: (value, row) => (
                <div>
                    <span className="font-medium">{value}</span>
                    <div className="text-xs text-gray-500">{row.reference}</div>
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (value) => <span className="font-bold text-red-600">{value}</span>
        },
        {
            key: 'transactionDate',
            label: 'Date',
            render: (value) => <span>{format(new Date(value), 'MMM dd, yyyy')}</span>
        },
        {
            key: 'confidenceScore',
            label: 'Confidence',
            render: (value) => value ? `${value}%` : '—'
        }
    ]

    // Handler for clicking a transaction row
    const handleTransactionClick = (transaction: any) => {
        setSelectedTransaction(transaction)
        setMatchesModalOpen(true)
        dispatch(fetchBankTransactionMatches(transaction.id))
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Download className="w-6 h-6" />
                            <span className="truncate max-w-[220px]" title={reconciliation.fileName}>{reconciliation.fileName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={cn(
                                reconciliation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    reconciliation.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                            )}>
                                {reconciliation.status}
                            </Badge>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                {/* Action Buttons - Top Right */}
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-sm"
                        size="sm"
                        onClick={() => toast.info("Download not implemented")}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Statement
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full shadow-sm"
                        size="sm"
                        onClick={() => toast.info("Delete not implemented")}
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                </div>

                {/* Tab Navigation */}
                <div className="mt-6">
                    <div className="flex space-x-1 border-b">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm transition-all",
                                        isActive
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6 space-y-6">
                    {activeTab === "info" && (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Reconciliation Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-gray-900">File Name</h4>
                                        <p className="font-mono text-blue-600 truncate max-w-[220px]" title={reconciliation.fileName}>{reconciliation.fileName}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Created By</h4>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                                                    {reconciliation.createdBy.firstName.charAt(0)}{reconciliation.createdBy.lastName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{reconciliation.createdBy.firstName} {reconciliation.createdBy.lastName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Status</h4>
                                        <Badge>{reconciliation.status}</Badge>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Created At</h4>
                                        <p>{format(new Date(reconciliation.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Total Transactions</h4>
                                        <p>{reconciliation.totalTransactions}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Matched</h4>
                                        <p>{reconciliation.matchedCount}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Unmatched</h4>
                                        <p>{reconciliation.unmatchedCount}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900">Accuracy</h4>
                                        <p>{reconciliation.overallAccuracy ? `${reconciliation.overallAccuracy}%` : '—'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "transactions" && (
                        <ProcurementDataTable
                            data={reconciliation.bankTransactions || []}
                            columns={transactionColumns}
                            title="Bank Transactions"
                            loading={false}
                            showSearch={true}
                            showFilters={false}
                            emptyMessage="No transactions found."
                            onView={handleTransactionClick}
                        />
                    )}

                    {activeTab === "unmatched" && (
                        <ProcurementDataTable
                            data={(reconciliation.bankTransactions || []).filter((t: any) => !t.isMatched)}
                            columns={unmatchedColumns}
                            title="Unmatched Transactions"
                            loading={false}
                            showSearch={true}
                            showFilters={false}
                            emptyMessage="No unmatched transactions found."
                        />
                    )}
                </div>

                {/* Matches Modal */}
                <BankTransactionMatchesModal
                    open={matchesModalOpen}
                    onClose={() => {
                        setMatchesModalOpen(false)
                        setSelectedTransaction(null)
                        dispatch(clearBankTransactionMatchesError())
                    }}
                    transaction={selectedTransaction}
                    matches={bankTransactionMatches}
                    loading={bankTransactionMatchesLoading}
                    reconciliationId={reconciliation?.id || ""} // <-- Pass reconciliationId here
                />
            </SheetContent>
        </Sheet>
    )
}
