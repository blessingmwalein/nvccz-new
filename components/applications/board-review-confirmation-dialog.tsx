"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2, Users } from "lucide-react"
import { boardReviewApi } from "@/lib/api/board-review-api"
import { toast } from "sonner"

interface BoardReviewConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  onSuccess: () => void
}

export function BoardReviewConfirmationDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  onSuccess
}: BoardReviewConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    console.log('Starting board review initiation...')
    setIsLoading(true)
    console.log('Loading state set to true')
    
    try {
      console.log('Calling API...')
      await boardReviewApi.create(applicationId, {
        investmentApproved: false,
        investmentRejected: false,
        conditionalApproval: false,
        recommendationReport: '',
        decisionReason: '',
        nextSteps: '',
        overallScore: 0,
        finalComments: ''
      })
      console.log('API call successful')
      toast.success('Board review initiated successfully')
      onSuccess() // This will reload the application data
      onClose()
    } catch (error: any) {
      console.log('API call failed:', error)
      toast.error('Failed to initiate board review', { 
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            Initiate Board Review
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to initiate board review for <strong>{applicationName}</strong>? 
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Move the application to the board review stage</li>
              <li>Create a board review record for tracking</li>
              <li>Notify board members for review</li>
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
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Initiate Board Review
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
