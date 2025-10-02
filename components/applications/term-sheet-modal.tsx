"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, DollarSign, TrendingUp, Calendar, CheckCircle, AlertCircle } from "lucide-react"
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
  const [formData, setFormData] = useState<TermSheetCreateRequest>({
    title: '',
    investmentAmount: 0,
    equityPercentage: 0,
    valuation: 0,
    keyTerms: '',
    conditions: '',
    timeline: '',
    documentUrl: '',
    documentFileName: '',
    documentSize: 0
  })

  const [existingData, setExistingData] = useState<any>(null)
  const [hasExistingData, setHasExistingData] = useState(false)

  useEffect(() => {
    if (isOpen && applicationId) {
      loadExistingData()
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
          keyTerms: response.data.keyTerms,
          conditions: response.data.conditions,
          timeline: response.data.timeline,
          documentUrl: response.data.documentUrl || '',
          documentFileName: response.data.documentFileName || '',
          documentSize: response.data.documentSize || 0
        })
      }
    } catch (error: any) {
      // If it's a 404 or similar "not found" error, it means no term sheet exists yet
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No term sheet data')) {
        setHasExistingData(false)
        setExistingData(null)
        // Reset form to default values for new term sheet
        setFormData({
          title: '',
          investmentAmount: 0,
          equityPercentage: 0,
          valuation: 0,
          keyTerms: '',
          conditions: '',
          timeline: '',
          documentUrl: '',
          documentFileName: '',
          documentSize: 0
        })
      } else {
        console.error('Error loading existing data:', error)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (hasExistingData) {
        // Update existing term sheet
        const updateData: TermSheetUpdateRequest = {
          title: formData.title,
          investmentAmount: formData.investmentAmount,
          equityPercentage: formData.equityPercentage,
          valuation: formData.valuation,
          keyTerms: formData.keyTerms,
          conditions: formData.conditions,
          timeline: formData.timeline,
          documentUrl: formData.documentUrl,
          documentFileName: formData.documentFileName,
          documentSize: formData.documentSize
        }
        await termSheetApi.update(applicationId, updateData)
        toast.success('Term sheet updated successfully')
      } else {
        // Create new term sheet
        await termSheetApi.create(applicationId, formData)
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
                  <Label htmlFor="title">Term Sheet Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter term sheet title..."
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Details */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Investment Details</h3>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Investment Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      value={formData.investmentAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, investmentAmount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equityPercentage">Equity Percentage (%)</Label>
                    <Input
                      id="equityPercentage"
                      type="number"
                      step="0.1"
                      value={formData.equityPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, equityPercentage: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valuation">Company Valuation ($)</Label>
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
              </CardContent>
            </Card>
          </div>

          {/* Key Terms */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Key Terms & Conditions</h3>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal">Key Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="keyTerms" className="text-sm font-normal">Investment Terms</Label>
                  <Textarea
                    id="keyTerms"
                    value={formData.keyTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, keyTerms: e.target.value }))}
                    placeholder="Enter detailed investment terms..."
                    rows={4}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conditions and Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Conditions & Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-normal">Investment Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="conditions" className="text-sm font-normal">Conditions</Label>
                    <Textarea
                      id="conditions"
                      value={formData.conditions}
                      onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder="Enter investment conditions..."
                      rows={4}
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-normal flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-sm font-normal">Investment Timeline</Label>
                    <Textarea
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="Enter investment timeline..."
                      rows={4}
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Document Attachment</h3>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Term Sheet Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentUrl" className="text-sm font-normal">Document URL</Label>
                    <Input
                      id="documentUrl"
                      value={formData.documentUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, documentUrl: e.target.value }))}
                      placeholder="https://example.com/term-sheet.pdf"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentFileName" className="text-sm font-normal">File Name</Label>
                    <Input
                      id="documentFileName"
                      value={formData.documentFileName}
                      onChange={(e) => setFormData(prev => ({ ...prev, documentFileName: e.target.value }))}
                      placeholder="term-sheet.pdf"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="documentSize" className="text-sm font-normal">File Size (bytes)</Label>
                  <Input
                    id="documentSize"
                    type="number"
                    value={formData.documentSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentSize: parseInt(e.target.value) || 0 }))}
                    placeholder="1024000"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full"
          >
            {loading ? 'Processing...' : `${hasExistingData ? 'Update' : 'Create'} Term Sheet`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}