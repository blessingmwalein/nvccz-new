"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"

interface EntryTypeViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  entryType: any | null
}

export function EntryTypeViewDrawer({ isOpen, onClose, entryType }: EntryTypeViewDrawerProps) {
  if (!entryType) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Entry Type Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{entryType.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={entryType.isActive ? 'default' : 'secondary'}>
                  {entryType.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {entryType.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{entryType.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction Type</p>
                <Badge variant={entryType.transactionType === 'RECEIPT' ? 'default' : 'secondary'}>
                  {entryType.transactionType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Counterparty Type</p>
                <p className="font-medium">{entryType.counterpartyType}</p>
              </div>
            </div>

            {entryType.glAccount && (
              <div>
                <p className="text-sm text-muted-foreground">Default GL Account</p>
                <p className="font-medium">
                  {entryType.glAccount.accountNo} - {entryType.glAccount.accountName}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Reference Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Reference Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              {entryType.referencePrefix && (
                <div>
                  <p className="text-sm text-muted-foreground">Reference Prefix</p>
                  <p className="font-medium">{entryType.referencePrefix}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Auto Generate Reference</p>
                <div className="flex items-center gap-2">
                  {entryType.autoGenerateReference ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span>{entryType.autoGenerateReference ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Accounting Rules */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Accounting Rules</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Debit/Credit Logic</p>
                <p className="font-medium">{entryType.debitCreditLogic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Default Debit/Credit</p>
                <Badge variant="outline">{entryType.defaultDebitCredit}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Requires Project Code</span>
                {entryType.requiresProjectCode ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requires Reference</span>
                {entryType.requiresReference ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {entryType.createdBy && (
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium">
                    {entryType.createdBy.firstName} {entryType.createdBy.lastName}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {format(new Date(entryType.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {format(new Date(entryType.updatedAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
