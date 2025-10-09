"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { ProcurementDataTable, Column } from "./procurement-data-table"
import { ProcurementDrawer } from "./procurement-drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  setApprovalConfigs, 
  addApprovalConfig, 
  updateApprovalConfig, 
  removeApprovalConfig,
  setApprovalConfigsLoading,
  setApprovalConfigsError
} from "@/lib/store/slices/procurementSlice"
import { procurementApi, ApprovalConfiguration } from "@/lib/api/procurement-api"
import { CiSettings, CiCalendar, CiUser, CiCircleCheck } from "react-icons/ci"
import { Settings, CheckCircle, Clock, Users, Building } from "lucide-react"
import { toast } from "sonner"
import { CreateApprovalConfigModal } from "./create-approval-config-modal"
import { ApprovalDialog } from "./approval-dialog"

export function ApprovalConfigurations() {
  const dispatch = useAppDispatch()
  const { approvalConfigs, approvalConfigsLoading } = useAppSelector(state => state.procurement)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewingConfig, setViewingConfig] = useState<ApprovalConfiguration | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [activateLoading, setActivateLoading] = useState(false)
  const [selectedConfigForActivation, setSelectedConfigForActivation] = useState<ApprovalConfiguration | null>(null)

  useEffect(() => {
    loadApprovalConfigs()
  }, [])

  const loadApprovalConfigs = async () => {
    try {
      dispatch(setApprovalConfigsLoading(true))
      const response = await procurementApi.getApprovalConfigs()
      if (response.success && response.data) {
        dispatch(setApprovalConfigs(response.data))
      } else {
        dispatch(setApprovalConfigsError('Failed to load approval configurations'))
        toast.error("Failed to load approval configurations")
      }
    } catch (error: any) {
      dispatch(setApprovalConfigsError(error.message))
      toast.error("Error loading approval configurations", { description: error.message })
    } finally {
      dispatch(setApprovalConfigsLoading(false))
    }
  }

  const handleView = (config: ApprovalConfiguration) => {
    setViewingConfig(config)
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (config: ApprovalConfiguration) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon")
  }

  const handleDelete = async (config: ApprovalConfiguration) => {
    if (!confirm(`Are you sure you want to delete configuration "${config.name}"?`)) {
      return
    }

    try {
      // TODO: Implement delete API call
      dispatch(removeApprovalConfig(config.id))
      toast.success("Approval configuration deleted successfully")
    } catch (error: any) {
      toast.error("Failed to delete approval configuration", { description: error.message })
    }
  }

  const handleActivate = async (config: ApprovalConfiguration) => {
    try {
      // TODO: Implement activate API call
      toast.success(`Configuration "${config.name}" activated successfully`)
      await loadApprovalConfigs()
    } catch (error: any) {
      toast.error("Failed to activate configuration", { description: error.message })
    }
  }

  const getStepTypeIcon = (stepType: string) => {
    switch (stepType) {
      case 'USER': return <CiUser className="w-3 h-3" />
      case 'ROLE': return <Users className="w-3 h-3" />
      case 'DEPARTMENT': return <Building className="w-3 h-3" />
      default: return <CiUser className="w-3 h-3" />
    }
  }

  const getStepTypeColor = (stepType: string) => {
    switch (stepType) {
      case 'USER': return 'bg-blue-100 text-blue-800'
      case 'ROLE': return 'bg-green-100 text-green-800'
      case 'DEPARTMENT': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const columns: Column<ApprovalConfiguration>[] = [
    {
      key: 'name',
      label: 'Configuration Name',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CiSettings className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{value}</span>
          </div>
          {row.isActive && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-600">{value || 'No description'}</span>
      )
    },
    {
      key: 'stages',
      label: 'Stages Configured',
      render: (stages) => {
        if (!stages || stages.length === 0) return <span className="text-gray-500">No stages</span>
        
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{stages.length} stage(s)</div>
            <div className="flex flex-wrap gap-1">
              {stages.slice(0, 3).map((stage: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {stage.stageType.replace('_', ' ')}
                </Badge>
              ))}
              {stages.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{stages.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <CiCalendar className="w-4 h-4 text-purple-600" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  const filterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  const bulkActions = [
    { label: 'Activate', value: 'activate', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
    { label: 'Deactivate', value: 'deactivate', icon: <Clock className="w-4 h-4 mr-1" /> }
  ]

  const handleBulkAction = (selectedConfigs: ApprovalConfiguration[], action: string) => {
    switch (action) {
      case 'activate':
        toast.info(`Activating ${selectedConfigs.length} configurations`)
        break
      case 'deactivate':
        toast.info(`Deactivating ${selectedConfigs.length} configurations`)
        break
      default:
        toast.info(`Bulk action: ${action}`)
    }
  }

  const handleExport = (data: ApprovalConfiguration[]) => {
    // TODO: Implement export functionality
    toast.success(`Exporting ${data.length} approval configurations`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Approval Configurations</h1>
          <p className="text-muted-foreground">Configure approval workflows for procurement processes</p>
        </div>
      </div>

      {/* Data Table */}
      <ProcurementDataTable
        data={approvalConfigs}
        columns={columns}
        title="Approval Configurations"
        searchPlaceholder="Search configurations..."
        filterOptions={filterOptions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onBulkAction={handleBulkAction}
        bulkActions={bulkActions}
        loading={approvalConfigsLoading}
        onExport={handleExport}
        emptyMessage="No approval configurations found. Create your first configuration to get started."
        extraControls={
          <Button 
            variant="outline" 
            onClick={() => toast.info("Load default configuration functionality coming soon")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Load Defaults
          </Button>
        }
      />

      {/* View Drawer */}
      <ProcurementDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={`Configuration: ${viewingConfig?.name || ''}`}
        description="View and manage approval workflow configuration"
        size="xl"
      >
        {viewingConfig && (
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
