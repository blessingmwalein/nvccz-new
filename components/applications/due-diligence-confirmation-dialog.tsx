"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2, Play } from "lucide-react"
import { dueDiligenceApi } from "@/lib/api/due-diligence-api"
import { toast } from "sonner"

interface DueDiligenceConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  onSuccess: () => void
}

export function DueDiligenceConfirmationDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  onSuccess
}: DueDiligenceConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    console.log('Starting due diligence initiation...')
    setIsLoading(true)
    console.log('Loading state set to true')
    
    try {
      console.log('Calling API...')
      await dueDiligenceApi.initiate(applicationId)
      console.log('API call successful')
      toast.success('Due diligence initiated successfully')
      onSuccess() // This will reload the application data
      onClose()
    } catch (error: any) {
      console.log('API call failed:', error)
      toast.error('Failed to initiate due diligence', { 
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <Play className="w-4 h-4 text-amber-500" />
            </div>
            Initiate Due Diligence
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to initiate due diligence for <strong>{applicationName}</strong>? 
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Move the application to the due diligence stage</li>
              <li>Create a due diligence record for tracking</li>
              <li>Notify relevant team members</li>
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
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Initiate Due Diligence
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
