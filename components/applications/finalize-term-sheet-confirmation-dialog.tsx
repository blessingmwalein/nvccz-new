"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2, CheckCircle } from "lucide-react"
import { termSheetApi } from "@/lib/api/term-sheet-api"
import { toast } from "sonner"

interface FinalizeTermSheetConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  onSuccess: () => void
}

export function FinalizeTermSheetConfirmationDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  onSuccess
}: FinalizeTermSheetConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    console.log('Starting term sheet finalization...')
    setIsLoading(true)
    console.log('Loading state set to true')
    
    try {
      console.log('Calling API...')
      await termSheetApi.finalize(applicationId)
      console.log('API call successful')
      toast.success('Term sheet finalized successfully')
      onSuccess() // This will reload the application data
      onClose()
    } catch (error: any) {
      console.log('API call failed:', error)
      toast.error('Failed to finalize term sheet', { 
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
            Finalize Term Sheet
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to finalize the term sheet for <strong>{applicationName}</strong>? 
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Mark the term sheet as finalized</li>
              <li>Move the application to the next stage</li>
              <li>Notify relevant team members</li>
              <li>Generate final term sheet documents</li>
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
                Finalizing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalize Term Sheet
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
