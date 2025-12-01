"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, DollarSign, TrendingUp, Calendar, CheckCircle, AlertCircle, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { termSheetApi, TermSheetCreateRequest, TermSheetUpdateRequest } from "@/lib/api/term-sheet-api"

interface TermSheetModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  onSuccess?: () => void
}

export function TermSheetModal({ isOpen, onClose, applicationId, onSuccess }: TermSheetModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<TermSheetCreateRequest>({
    title: '',
    investmentAmount: 0,
    equityPercentage: 0,
    valuation: 0,
    keyTerms: '',
    conditions: '',
    timeline: ''
  })

  const [existingData, setExistingData] = useState<any>(null)
  const [hasExistingData, setHasExistingData] = useState(false)

  useEffect(() => {
    if (isOpen && applicationId) {
      loadExistingData()
      setSelectedFile(null)
    }
  }, [isOpen, applicationId])

  const loadExistingData = async () => {
    try {
      const response = await termSheetApi.getByApplicationId(applicationId)
      if (response.success) {
        setExistingData(response.data)
        setHasExistingData(true)
        setFormData({
          title: response.data.title,
          investmentAmount: parseFloat(response.data.investmentAmount) || 0,
          equityPercentage: parseFloat(response.data.equityPercentage) || 0,
          valuation: parseFloat(response.data.valuation) || 0,
          keyTerms: response.data.keyTerms || '',
          conditions: response.data.conditions || '',
          timeline: response.data.timeline || ''
        })
      }
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No term sheet data')) {
        setHasExistingData(false)
        setExistingData(null)
        setFormData({
          title: '',
          investmentAmount: 0,
          equityPercentage: 0,
          valuation: 0,
          keyTerms: '',
          conditions: '',
          timeline: ''
        })
      } else {
        console.error('Error loading existing data:', error)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        toast.error('Invalid file type', { description: 'Please select a PDF file' })
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large', { description: 'Maximum file size is 10MB' })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const submitData = {
        ...formData,
        document: selectedFile || undefined
      }

      if (hasExistingData) {
        await termSheetApi.update(applicationId, submitData)
        toast.success('Term sheet updated successfully')
      } else {
        await termSheetApi.create(applicationId, submitData)
        toast.success('Term sheet created successfully')
      }
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(`Failed to ${hasExistingData ? 'update' : 'create'} term sheet`, { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (existingData?.isFinal) return 'text-green-600'
    if (existingData?.isDraft) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getStatusIcon = () => {
    if (existingData?.isFinal) return <CheckCircle className="w-5 h-5" />
    if (existingData?.isDraft) return <AlertCircle className="w-5 h-5" />
    return <AlertCircle className="w-5 h-5" />
  }

  const getStatusText = () => {
    if (existingData?.isFinal) return 'Final'
    if (existingData?.isDraft) return 'Draft'
    return 'New'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <FileText className="w-5 h-5" />
            {hasExistingData ? 'Update Term Sheet' : 'Create Term Sheet'}
          </DialogTitle>
          <p className="text-gray-600">
            {hasExistingData ? 'Update investment terms and conditions' : 'Create investment terms and conditions'}
          </p>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* Term Sheet Header */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Term Sheet Details</h3>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getStatusIcon()}
                  <span className={getStatusColor()}>Status: {getStatusText()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Term Sheet Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter term sheet title..."
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Investment Amount ($) *</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentAmount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equityPercentage">Equity Percentage (%)</Label>
                    <Input
                      id="equityPercentage"
                      type="number"
                      step="0.1"
                      value={formData.equityPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, equityPercentage: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.0"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valuation">Valuation ($)</Label>
                    <Input
                      id="valuation"
                      type="number"
                      value={formData.valuation}
                      onChange={(e) => setFormData(prev => ({ ...prev, valuation: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyTerms">Key Terms</Label>
                  <Textarea
                    id="keyTerms"
                    value={formData.keyTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, keyTerms: e.target.value }))}
                    placeholder="Enter key terms..."
                    className="rounded-lg min-h-[100px]"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions</Label>
                  <Textarea
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                    placeholder="Enter conditions..."
                    className="rounded-lg min-h-[100px]"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Textarea
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="Enter timeline..."
                    className="rounded-lg"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Document Attachment</h3>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Term Sheet Document (PDF) {!hasExistingData && '*'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Document Info */}
                {hasExistingData && existingData.documentUrl && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {existingData.documentFileName || 'Current Document'}
                          </p>
                          {existingData.documentSize && (
                            <p className="text-xs text-blue-600">
                              {formatFileSize(existingData.documentSize)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(existingData.documentUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-normal">
                    {hasExistingData ? 'Replace Document (Optional)' : 'Upload Document *'}
                  </Label>
                  
                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF files only (Max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  * The document will be stored securely and made available to authorized parties
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Display (Read-only from existing data) */}
       
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.title || formData.investmentAmount <= 0 || (!hasExistingData && !selectedFile)} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full"
          >
            {loading ? 'Processing...' : `${hasExistingData ? 'Update' : 'Create'} Term Sheet`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}