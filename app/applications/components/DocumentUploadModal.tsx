"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, documentType: string) => void
  editingIndex?: number | null
}

const DocumentUploadModal = ({ isOpen, onClose, onUpload, editingIndex }: DocumentUploadModalProps) => {
  const [selectedType, setSelectedType] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)

  const documentTypes = [
    { value: "BUSINESS_PLAN", label: "Business Plan", required: true },
    { value: "PROOF_OF_CONCEPT", label: "Proof of Concept", required: true },
    { value: "MARKET_RESEARCH", label: "Market Research", required: true },
    { value: "PROJECTED_CASH_FLOWS", label: "Projected Cash Flows", required: true },
    { value: "HISTORICAL_FINANCIALS", label: "Historical Financials", required: false }
  ]

  const handleFileUpload = (file: File) => {
    if (selectedType) {
      onUpload(file, selectedType)
      onClose()
      setSelectedType("")
    } else {
      toast.error("Please select a document type first")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      handleFileUpload(file)
      // Reset the input
      e.target.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFileUpload(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {editingIndex !== null ? "Replace Document" : "Upload Document"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.label}
                      {type.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {editingIndex !== null ? "Drop your new file here" : "Drop your file here"}
            </p>
            <p className="text-gray-500 mb-4">or click to browse</p>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                {editingIndex !== null ? "Choose New File" : "Choose File"}
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentUploadModal
