"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  fetchApprovalConfigs,
  updateApprovalConfig as updateApprovalConfigThunk
} from "@/lib/store/slices/procurementV2Slice"
import { ApprovalConfiguration } from "@/lib/api/procurement-api-v2"
import { apiClient } from "@/lib/api/api-client"
import { Settings, CheckCircle, Edit, Plus, Building2, Shield } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface Department {
  id: string
  name: string
  description?: string
}

export function ApprovalConfigurations() {
  const dispatch = useAppDispatch()
  const { approvalConfigs, approvalConfigsLoading } = useAppSelector(state => state.procurementV2)
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [selectedConfig, setSelectedConfig] = useState<ApprovalConfiguration | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await Promise.all([
      loadDepartments(),
      loadApprovalConfigs()
    ])
  }

  const loadDepartments = async () => {
    try {
      setDepartmentsLoading(true)
      const response = await apiClient.get<{ success: boolean; data: Department[] }>('/departments')
      if (response.data.success) {
        setDepartments(response.data.data)
      }
    } catch (error: any) {
      toast.error("Failed to load departments", { description: error.message })
    } finally {
      setDepartmentsLoading(false)
    }
  }

  const loadApprovalConfigs = async () => {
    try {
      await dispatch(fetchApprovalConfigs()).unwrap()
    } catch (error: any) {
      toast.error("Failed to load approval configurations", { description: error.message })
    }
  }

  const handleConfigure = (department: Department, existingConfig?: ApprovalConfiguration) => {
    setSelectedDepartment(department)
    setSelectedConfig(existingConfig || null)
    setIsConfigModalOpen(true)
  }

  const getDepartmentConfig = (departmentName: string) => {
    return approvalConfigs.find(config => config.department === departmentName)
  }

  if (departmentsLoading || approvalConfigsLoading) {
    return <ApprovalConfigsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Configurations</h1>
          <p className="text-muted-foreground mt-1">
            Configure department-based approval workflows for procurement processes
          </p>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => {
          const config = getDepartmentConfig(department.name)
          const isConfigured = !!config
          
          return (
            <Card key={department.id} className={`hover:shadow-lg transition-shadow ${isConfigured ? 'border-green-200' : 'border-orange-200'}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                  </div>
                  {isConfigured ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Settings className="w-3 h-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
                {department.description && (
                  <CardDescription className="text-sm">{department.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {isConfigured && config ? (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Configuration:</span> {config.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {config.stages.length} approval stage(s) configured
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {config.stages.map((stage, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stage.stageType.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => handleConfigure(department, config)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Configuration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No approval workflow configured for this department yet.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => handleConfigure(department)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Configure Approval Flow
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && selectedDepartment && (
        <ConfigurationModal
          open={isConfigModalOpen}
          onOpenChange={setIsConfigModalOpen}
          department={selectedDepartment}
          existingConfig={selectedConfig}
          onSuccess={loadApprovalConfigs}
        />
      )}
    </div>
  )
}

function ApprovalConfigsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface ConfigurationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department
  existingConfig: ApprovalConfiguration | null
  onSuccess: () => void
}

function ConfigurationModal({ open, onOpenChange, department, existingConfig, onSuccess }: ConfigurationModalProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: existingConfig?.name || `${department.name} Approval Workflow`,
    description: existingConfig?.description || '',
    department: department.name,
    stages: existingConfig?.stages || []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      if (existingConfig) {
        // Update existing config
        await dispatch(updateApprovalConfigThunk({
          id: existingConfig.id,
          payload: formData as any
        })).unwrap()
        toast.success("Approval configuration updated successfully")
      } else {
        // Create new config
        const response = await apiClient.post('/procurement-approval-configs', formData)
        if (response.data.success) {
          toast.success("Approval configuration created successfully")
        }
      }
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to save configuration", { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingConfig ? 'Update' : 'Configure'} Approval Workflow for {department.name}
          </DialogTitle>
          <DialogDescription>
            Set up the approval stages and steps for procurement processes in this department
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={department.name} disabled />
          </div>

          <div className="space-y-3">
            <Label>Approval Stages</Label>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure approval stages for different procurement process types.
                  Each stage can have multiple approval steps with specific role requirements.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Purchase Requisition Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Invoice Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Purchase Order Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">GRN Approval</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Detailed stage configuration will be available in the next update. 
                  For now, default approval flows will be applied based on department hierarchy.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : existingConfig ? 'Update Configuration' : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
          <div className="space-y-6">
            {/* Configuration Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CiSettings className="w-5 h-5" />
                  Configuration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg font-semibold">{viewingConfig.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={viewingConfig.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {viewingConfig.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-700">{viewingConfig.description || 'No description provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Stages */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Stages & Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {viewingConfig.stages?.map((stage, stageIndex) => (
                    <div key={stageIndex} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="font-medium">
                          {stage.stageType.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {stage.steps?.length || 0} step(s)
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {stage.steps?.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                                {step.stepNumber}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{step.stepName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getStepTypeColor(step.stepType)} variant="outline">
                                    {getStepTypeIcon(step.stepType)}
                                    {step.stepType}
                                  </Badge>
                                  {step.isRequired && (
                                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                      Required
                                    </Badge>
                                  )}
                                  {step.canDelegate && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                      Can Delegate
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {step.approvalOrder}
                            </Badge>
                          </div>
                        )) || (
                          <p className="text-gray-500 text-center py-2">No steps configured</p>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No stages configured</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Close
              </Button>
              {!viewingConfig.isActive && (
                <Button 
                  onClick={() => {
                    setSelectedConfigForActivation(viewingConfig)
                    setIsActivateDialogOpen(true)
                  }}
                  className="gradient-primary text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate Configuration
                </Button>
              )}
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Configuration
              </Button>
            </div>
          </div>
        )}
      </ProcurementDrawer>

      {/* Create Modal */}
      <CreateApprovalConfigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          loadApprovalConfigs()
        }}
      />

      {/* Activate Dialog */}
      <ApprovalDialog
        open={isActivateDialogOpen}
        onOpenChange={setIsActivateDialogOpen}
        title="Activate Approval Configuration"
        description={`Are you sure you want to activate "${selectedConfigForActivation?.name}" configuration? This will deactivate any currently active configuration.`}
        loading={activateLoading}
        onConfirm={async () => {
          if (!selectedConfigForActivation) return
          setActivateLoading(true)
          try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Configuration activated successfully')
            setIsActivateDialogOpen(false)
            loadApprovalConfigs()
          } catch (error) {
            toast.error('Failed to activate configuration')
          } finally {
            setActivateLoading(false)
          }
        }}
      />
    </div>
  )
}
