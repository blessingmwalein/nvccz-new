"use client"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Upload as UploadIcon } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"

export function BankReconciliationUploadModal({
  open,
  onClose,
  onUpload,
  uploadFile,
  setUploadFile,
  loading
}: {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  uploadFile: File | null
  setUploadFile: (file: File | null) => void
  loading: boolean
}) {
  const [localLoading, setLocalLoading] = useState(false)

  const handleUpload = async () => {
    if (!uploadFile) return
    setLocalLoading(true)
    try {
      await onUpload(uploadFile)
      toast.success("Bank statement uploaded successfully")
      setLocalLoading(false)
      onClose()
      setUploadFile(null)
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.error ||
        err?.response?.data?.message ||
        "Failed to upload file"
      toast.error(msg)
      setLocalLoading(false)
      // Do not close modal on error
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Upload Bank Statement</h2>
        <div className="mb-4">
          <label
            htmlFor="bank-statement-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 cursor-pointer hover:bg-blue-50 transition"
          >
            <UploadIcon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-blue-700 font-medium">
              {uploadFile ? uploadFile.name : "Select file to upload"}
            </span>
            <span className="text-xs text-gray-500 mt-1">Accepted: .csv, .xls, .xlsx</span>
            <input
              id="bank-statement-upload"
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={e => setUploadFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!localLoading && !loading) {
                onClose()
              }
            }}
            className="rounded-full"
            disabled={localLoading || loading}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              asChild
              variant="secondary"
              className="rounded-full"
            >
              <a
                href="/transactions.csv"
                download
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </a>
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center"
              onClick={handleUpload}
              disabled={localLoading || loading || !uploadFile}
            >
              {(localLoading || loading) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UploadIcon className="w-4 h-4 mr-2" />
              )}
              {(localLoading || loading) ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
