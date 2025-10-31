"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Lock, Unlock } from "lucide-react"

interface PeriodLockoutViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  period: any | null
}

export function PeriodLockoutViewDrawer({ isOpen, onClose, period }: PeriodLockoutViewDrawerProps) {
  if (!period) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Period Lockout Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Period Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Period Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium text-lg">{period.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={period.isLocked ? 'destructive' : 'default'}>
                  {period.isLocked ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 mr-1" />
                      Unlocked
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {period.reason && (
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{period.reason}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Lock Information */}
          {period.isLocked && period.lockedByUser && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Lock Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Locked By</p>
                    <p className="font-medium">
                      {period.lockedByUser.firstName} {period.lockedByUser.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{period.lockedByUser.email}</p>
                  </div>
                  {period.lockedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Locked At</p>
                      <p className="font-medium">
                        {format(new Date(period.lockedAt), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {format(new Date(period.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {format(new Date(period.updatedAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>

          {/* Impact Warning */}
          {period.isLocked && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Period Locked</h4>
              <p className="text-sm text-amber-800">
                This period is currently locked. No transactions can be created, edited, or deleted for this period. 
                To allow transactions, unlock this period.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
