"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign, Loader2 } from "lucide-react"
import { FundDisbursementSkeleton } from "@/components/ui/skeleton-loader"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FundDisbursementData } from "@/lib/api/fund-disbursement-api"
import type { ExtendedApplication } from '@/lib/api/applications-api'

interface FundDisbursementSectionProps {
  application: ExtendedApplication
  data: FundDisbursementData | null
  loading: boolean
  error: string | null
  approvingDisbursementId: string | null
  disbursingFundId: string | null
  transactionReference: string
  onSetApprovingId: (id: string | null) => void
  onSetDisbursingId: (id: string | null) => void
  onSetTransactionReference: (ref: string) => void
  onApproveDisbursement: (id: string) => Promise<void>
  onDisburseFund: () => Promise<void>
  onRefresh: () => Promise<void>
}

export function FundDisbursementSection({
  application,
  data,
  loading,
  error,
  approvingDisbursementId,
  disbursingFundId,
  transactionReference,
  onSetApprovingId,
  onSetDisbursingId,
  onSetTransactionReference,
  onApproveDisbursement,
  onDisburseFund,
  onRefresh
}: FundDisbursementSectionProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isDisbursing, setIsDisbursing] = useState(false)

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!approvingDisbursementId || isApproving) return
    
    setIsApproving(true)
    try {
      await onApproveDisbursement(approvingDisbursementId)
      // Success - dialog will close via onSetApprovingId in parent
    } catch (error) {
      // Error is handled in parent, just reset loading state
      setIsApproving(false)
    }
  }

  const handleDisburse = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isDisbursing) return
    
    setIsDisbursing(true)
    try {
      await onDisburseFund()
      // Success - dialog will close via onSetDisbursingId in parent
    } catch (error) {
      // Error is handled in parent, just reset loading state
      setIsDisbursing(false)
    }
  }

  if (loading) {
    return <FundDisbursementSkeleton />
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Error loading disbursement details: {error}
      </div>
    )
  }

  const disbursements = application.disbursements || []

  // Placeholder milestone grouping and progress
  const milestoneName = "Milestone 1: Initial Release";
  const milestoneProgress = Math.round(
    (disbursements.filter(d => d.status === 'COMPLETED').length / (disbursements.length || 1)) * 100
  );

  if (disbursements.length === 0 && !data) {
    return null
  }

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800'
  }

  const statusIcons = {
    PENDING: <CheckCircle className="w-4 h-4 text-amber-500" />,
    APPROVED: <CheckCircle className="w-4 h-4 text-blue-500" />,
    PROCESSING: <CheckCircle className="w-4 h-4 text-purple-500 animate-spin" />,
    COMPLETED: <CheckCircle className="w-4 h-4 text-green-500" />,
    FAILED: <CheckCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <>
      <div className="mt-4 space-y-3">
        {/* Milestone header and progress */}
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-800">{milestoneName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{milestoneProgress}% Complete</span>
          </div>
        </div>
        <h4 className="text-sm font-medium text-gray-700">Disbursements</h4>
        {disbursements.map((disbursement: any) => (
          <div key={disbursement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {statusIcons[disbursement.status]}
                <Badge className={statusColors[disbursement.status]}>
                  {disbursement.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${parseFloat(disbursement.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {disbursement.disbursementType}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Disbursement Date:</span>
                <span className="text-gray-900">
                  {new Date(disbursement.disbursementDate).toLocaleDateString()}
                </span>
              </div>

              {disbursement.transactionReference && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {disbursement.transactionReference}
                  </span>
                </div>
              )}

              {disbursement.notes && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Notes:</p>
                  <p className="text-xs text-gray-700 mt-1">{disbursement.notes}</p>
                </div>
              )}

              {disbursement.approvedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Approved:</span>
                  <span className="text-gray-900">
                    {new Date(disbursement.approvedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {disbursement.disbursedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Disbursed:</span>
                  <span className="text-gray-900">
                    {new Date(disbursement.disbursedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons based on status */}
            <div className="mt-3 flex gap-2">
              {disbursement.status === 'PENDING' && (
                <Button
                  size="sm"
                  onClick={() => onSetApprovingId(disbursement.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}

              {disbursement.status === 'APPROVED' && (
                <Button
                  size="sm"
                  onClick={() => onSetDisbursingId(disbursement.id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Mark as Disbursed
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Approve Disbursement Confirmation Dialog */}
      <AlertDialog 
        open={!!approvingDisbursementId} 
        onOpenChange={(open) => {
          // Only allow closing when not processing
          if (!open && !isApproving) {
            onSetApprovingId(null)
            setIsApproving(false)
          }
        }}
      >
        <AlertDialogContent onEscapeKeyDown={(e) => isApproving && e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Disbursement?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this disbursement? This action will mark the disbursement as approved and ready for processing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Disbursement
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disburse Fund Dialog */}
      <AlertDialog 
        open={!!disbursingFundId} 
        onOpenChange={(open) => {
          // Only allow closing when not processing
          if (!open && !isDisbursing) {
            onSetDisbursingId(null)
            onSetTransactionReference('')
            setIsDisbursing(false)
          }
        }}
      >
        <AlertDialogContent onEscapeKeyDown={(e) => isDisbursing && e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Disbursed</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the transaction reference to mark this disbursement as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-reference">Transaction Reference</Label>
              <Input
                id="transaction-reference"
                placeholder="e.g., BANK_TXN_123456789"
                value={transactionReference}
                onChange={(e) => onSetTransactionReference(e.target.value)}
                className="w-full"
                disabled={isDisbursing}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDisbursing}
              onClick={() => {
                if (!isDisbursing) {
                  onSetDisbursingId(null)
                  onSetTransactionReference('')
                }
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDisburse}
              disabled={!transactionReference.trim() || isDisbursing}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isDisbursing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Mark as Disbursed
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
