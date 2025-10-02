"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { dueDiligenceApi, DueDiligenceUpdateRequest } from "@/lib/api/due-diligence-api"

interface DueDiligenceModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  onSuccess?: () => void
}

export function DueDiligenceModal({ isOpen, onClose, applicationId, onSuccess }: DueDiligenceModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DueDiligenceUpdateRequest>({
    marketResearchViable: false,
    marketResearchComments: '',
    financialViable: false,
    financialComments: '',
    competitiveOpportunities: false,
    competitiveComments: '',
    managementTeamQualified: false,
    managementComments: '',
    legalCompliant: false,
    legalComments: '',
    riskTolerable: false,
    riskComments: '',
    recommendation: 'APPROVE',
    finalComments: ''
  })

  const [existingData, setExistingData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && applicationId) {
      loadExistingData()
    }
  }, [isOpen, applicationId])

  const loadExistingData = async () => {
    try {
      const response = await dueDiligenceApi.getByApplicationId(applicationId)
      if (response.success) {
        setExistingData(response.data)
        setFormData({
          marketResearchViable: response.data.marketResearchViable,
          marketResearchComments: response.data.marketResearchComments || '',
          financialViable: response.data.financialViable,
          financialComments: response.data.financialComments || '',
          competitiveOpportunities: response.data.competitiveOpportunities,
          competitiveComments: response.data.competitiveComments || '',
          managementTeamQualified: response.data.managementTeamQualified,
          managementComments: response.data.managementComments || '',
          legalCompliant: response.data.legalCompliant,
          legalComments: response.data.legalComments || '',
          riskTolerable: response.data.riskTolerable,
          riskComments: response.data.riskComments || '',
          recommendation: response.data.recommendation as 'APPROVE' | 'REJECT' | 'CONDITIONAL' || 'APPROVE',
          finalComments: response.data.finalComments || ''
        })
      }
    } catch (error) {
      console.error('Error loading existing data:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await dueDiligenceApi.update(applicationId, formData)
      toast.success('Due diligence updated successfully')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error('Failed to update due diligence', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (value: boolean) => {
    return value ? 'text-green-600' : 'text-red-600'
  }

  const getScoreIcon = (value: boolean) => {
    return value ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
  }

  const overallScore = [
    formData.marketResearchViable,
    formData.financialViable,
    formData.competitiveOpportunities,
    formData.managementTeamQualified,
    formData.legalCompliant,
    formData.riskTolerable
  ].filter(Boolean).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <AlertCircle className="w-5 h-5" />
            Update Due Diligence Assessment
          </DialogTitle>
          <p className="text-gray-600">
            Update comprehensive evaluation of the investment opportunity
          </p>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* Overall Score */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Overall Assessment Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className="text-2xl font-normal text-blue-600">{overallScore}/6</p>
                </div>
                <div className="text-right">
                  <Badge variant={overallScore >= 4 ? 'default' : overallScore >= 2 ? 'secondary' : 'destructive'}>
                    {overallScore >= 4 ? 'Strong' : overallScore >= 2 ? 'Moderate' : 'Weak'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Criteria */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Assessment Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Research */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.marketResearchViable)}
                  <span className={getScoreColor(formData.marketResearchViable)}>Market Research</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketResearchViable" className="text-sm font-normal">Market Research Viable</Label>
                  <Switch
                    id="marketResearchViable"
                    checked={formData.marketResearchViable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketResearchViable: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketResearchComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="marketResearchComments"
                    value={formData.marketResearchComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketResearchComments: e.target.value }))}
                    placeholder="Enter market research assessment..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Viability */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.financialViable)}
                  <span className={getScoreColor(formData.financialViable)}>Financial Viability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="financialViable" className="text-sm font-normal">Financial Viable</Label>
                  <Switch
                    id="financialViable"
                    checked={formData.financialViable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, financialViable: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financialComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="financialComments"
                    value={formData.financialComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, financialComments: e.target.value }))}
                    placeholder="Enter financial assessment..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Competitive Opportunities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.competitiveOpportunities)}
                  <span className={getScoreColor(formData.competitiveOpportunities)}>Competitive Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="competitiveOpportunities" className="text-sm font-normal">Competitive Opportunities</Label>
                  <Switch
                    id="competitiveOpportunities"
                    checked={formData.competitiveOpportunities}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, competitiveOpportunities: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitiveComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="competitiveComments"
                    value={formData.competitiveComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, competitiveComments: e.target.value }))}
                    placeholder="Enter competitive analysis..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Management Team */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.managementTeamQualified)}
                  <span className={getScoreColor(formData.managementTeamQualified)}>Management Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="managementTeamQualified" className="text-sm font-normal">Team Qualified</Label>
                  <Switch
                    id="managementTeamQualified"
                    checked={formData.managementTeamQualified}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, managementTeamQualified: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="managementComments"
                    value={formData.managementComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, managementComments: e.target.value }))}
                    placeholder="Enter management team assessment..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Legal Compliance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.legalCompliant)}
                  <span className={getScoreColor(formData.legalCompliant)}>Legal Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="legalCompliant" className="text-sm font-normal">Legally Compliant</Label>
                  <Switch
                    id="legalCompliant"
                    checked={formData.legalCompliant}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, legalCompliant: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="legalComments"
                    value={formData.legalComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, legalComments: e.target.value }))}
                    placeholder="Enter legal compliance assessment..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  {getScoreIcon(formData.riskTolerable)}
                  <span className={getScoreColor(formData.riskTolerable)}>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="riskTolerable" className="text-sm font-normal">Risk Tolerable</Label>
                  <Switch
                    id="riskTolerable"
                    checked={formData.riskTolerable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, riskTolerable: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskComments" className="text-sm font-normal">Comments</Label>
                  <Textarea
                    id="riskComments"
                    value={formData.riskComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, riskComments: e.target.value }))}
                    placeholder="Enter risk assessment..."
                    rows={3}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Final Assessment */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Final Assessment</h3>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-500" />
                  Recommendation & Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recommendation" className="text-sm font-normal">Recommendation</Label>
                  <Select
                    value={formData.recommendation}
                    onValueChange={(value: 'APPROVE' | 'REJECT' | 'CONDITIONAL') => 
                      setFormData(prev => ({ ...prev, recommendation: value }))
                    }
                  >
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVE">Approve</SelectItem>
                      <SelectItem value="REJECT">Reject</SelectItem>
                      <SelectItem value="CONDITIONAL">Conditional Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalComments" className="text-sm font-normal">Final Comments</Label>
                  <Textarea
                    id="finalComments"
                    value={formData.finalComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, finalComments: e.target.value }))}
                    placeholder="Enter final assessment comments..."
                    rows={4}
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
          <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full">
            {loading ? 'Updating...' : 'Update Due Diligence'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
