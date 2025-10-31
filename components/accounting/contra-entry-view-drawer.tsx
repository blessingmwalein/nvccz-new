"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"

interface ContraEntryViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  contraConfig: any | null
}

export function ContraEntryViewDrawer({ isOpen, onClose, contraConfig }: ContraEntryViewDrawerProps) {
  if (!contraConfig) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Contra Entry Configuration Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Configuration Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Configuration Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entry Type</p>
                <Badge variant={contraConfig.entryType === 'RECEIPT' ? 'default' : 'secondary'}>
                  {contraConfig.entryType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={contraConfig.isEnabled ? 'default' : 'secondary'}>
                  {contraConfig.isEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>

            {contraConfig.glAccount && (
              <div>
                <p className="text-sm text-muted-foreground">GL Account</p>
                <p className="font-medium">
                  {contraConfig.glAccount.accountNo} - {contraConfig.glAccount.accountName}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Contra Type</p>
              <p className="font-medium">{contraConfig.contraType}</p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {contraConfig.createdBy && (
                <div>
                  <p className="text-muted-foreground">Created By</p>
                  <p className="font-medium">
                    {contraConfig.createdBy.firstName} {contraConfig.createdBy.lastName}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {format(new Date(contraConfig.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {format(new Date(contraConfig.updatedAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
