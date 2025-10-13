"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Check, Loader2 } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'default'
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      await onConfirm()
      onClose()
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Confirmation action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          confirmBtn: "bg-red-600 hover:bg-red-700 text-white"
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          iconBg: "bg-yellow-100", 
          confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white"
        }
      default:
        return {
          icon: <Check className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={isLoading ? (e) => e.preventDefault() : undefined}>
        <div className="text-center">
          <div className="mx-auto mb-4">
            <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto`}>
              {styles.icon}
            </div>
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              <X className="w-4 h-4 mr-2" />
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-full ${styles.confirmBtn}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {confirmText}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}