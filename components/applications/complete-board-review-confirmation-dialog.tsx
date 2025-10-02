"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2, CheckCircle } from "lucide-react"
import { boardReviewApi } from "@/lib/api/board-review-api"
import { toast } from "sonner"

interface CompleteBoardReviewConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  onSuccess: () => void
}

export function CompleteBoardReviewConfirmationDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  onSuccess
}: CompleteBoardReviewConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    console.log('Starting board review completion...')
    setIsLoading(true)
    console.log('Loading state set to true')
    
    try {
      console.log('Calling API...')
      await boardReviewApi.complete(applicationId)
      console.log('API call successful')
      toast.success('Board review completed successfully')
      onSuccess() // This will reload the application data
      onClose()
    } catch (error: any) {
      console.log('API call failed:', error)
      toast.error('Failed to complete board review', { 
        description: error.message || 'Please try again.' 
      })
      setIsLoading(false) // Only reset loading on error, not on success
    }
  }

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if not loading
    if (!open && !isLoading) {
      onClose()
    }
  }

  console.log('Dialog render - isLoading:', isLoading, 'isOpen:', isOpen)

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            Complete Board Review
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to complete board review for <strong>{applicationName}</strong>? 
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Mark the board review as completed</li>
              <li>Move the application to the next stage</li>
              <li>Notify relevant team members</li>
              <li>Generate completion reports</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={() => !isLoading && onClose()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              if (!isLoading) {
                handleConfirm()
              }
            }}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Board Review
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
