"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SignaturePad from "react-signature-canvas"

interface SignTermSheetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (signature: Blob) => Promise<void>
  loading?: boolean
}

export const SignTermSheetModal: React.FC<SignTermSheetModalProps> = ({ open, onOpenChange, onSubmit, loading }) => {
  const sigPadRef = useRef<SignaturePad>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleClear = () => {
    sigPadRef.current?.clear()
    setError(null)
  }

  const handleSubmit = async () => {
    if (!sigPadRef.current) {
      setError("Signature pad not ready. Please try again.")
      return
    }
    if (sigPadRef.current.isEmpty()) {
      setError("Please provide your signature.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const dataUrl = sigPadRef.current.toDataURL("image/png")
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      await onSubmit(blob)
      setSubmitting(false)
      onOpenChange(false)
    } catch (err) {
      console.error("Error processing signature:", err)
      setError("Failed to process signature. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Term Sheet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">Please sign below to confirm your acceptance of the term sheet.</p>
          <div className="border rounded-lg bg-muted p-2">
            <SignaturePad
              ref={sigPadRef}
              canvasProps={{
                width: 400,
                height: 150,
                className: "rounded bg-background",
              }}
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClear} disabled={submitting || loading}>
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            {submitting || loading ? "Signing..." : "Sign & Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
