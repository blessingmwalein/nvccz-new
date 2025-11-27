// ============================================================================
// APPROVAL CONFIGURATION PAGE V2
// Configure approval workflows - follows new Redux architecture
// ============================================================================

'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  fetchApprovalConfigs,
  createApprovalConfig,
  updateApprovalConfig,
  deleteApprovalConfig,
  selectAllApprovalConfigs,
  selectApprovalConfigsState,
} from '@/lib/store/slices/procurementV2Slice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, DollarSign, Settings } from 'lucide-react'
import type { CreateApprovalConfigDto, ApprovalConfiguration } from '@/lib/api/types/procurement.types'

export default function ApprovalConfigPageV2() {
  const dispatch = useAppDispatch()
  const configs = useAppSelector(selectAllApprovalConfigs)
  const { loading } = useAppSelector(selectApprovalConfigsState)

  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ApprovalConfiguration | null>(null)
  const [deletingConfig, setDeletingConfig] = useState<ApprovalConfiguration | null>(null)

  // Form state
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [requiredLevel, setRequiredLevel] = useState<'HEAD' | 'DEPUTY' | 'MEMBER'>('HEAD')
  const [autoApprove, setAutoApprove] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchApprovalConfigs())
  }, [dispatch])

  const handleOpenDialog = (config?: ApprovalConfiguration) => {
    if (config) {
      setEditingConfig(config)
      setMinAmount(config.minAmount.toString())
      setMaxAmount(config.maxAmount ? config.maxAmount.toString() : '')
      setRequiredLevel(config.requiredApprovalLevel)
      setAutoApprove(config.autoApprove || false)
    } else {
      setEditingConfig(null)
      setMinAmount('')
      setMaxAmount('')
      setRequiredLevel('HEAD')
      setAutoApprove(false)
    }
    setShowDialog(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const dto: CreateApprovalConfigDto = {
        minAmount: Number(minAmount),
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        requiredApprovalLevel: requiredLevel,
        autoApprove,
      }

      if (editingConfig) {
        await dispatch(updateApprovalConfig({ id: editingConfig.id, data: dto })).unwrap()
      } else {
        await dispatch(createApprovalConfig(dto)).unwrap()
      }

      setShowDialog(false)
    } catch (error) {
      console.error('Failed to save approval config:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingConfig) return

    setIsSubmitting(true)
    try {
      await dispatch(deleteApprovalConfig(deletingConfig.id)).unwrap()
      setShowDeleteDialog(false)
      setDeletingConfig(null)
    } catch (error) {
      console.error('Failed to delete approval config:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (config: ApprovalConfiguration) => {
    setDeletingConfig(config)
    setShowDeleteDialog(true)
  }

  const sortedConfigs = [...configs].sort((a, b) => a.minAmount - b.minAmount)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Configure approval workflows based on requisition amounts
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How Approval Configurations Work</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Set approval levels based on requisition amount ranges</li>
                <li>• HEAD = Department Head | DEPUTY = Deputy Head | MEMBER = Team Member</li>
                <li>• Auto-approve enables automatic approval for the specified range</li>
                <li>• Configurations should not overlap - ensure each amount range is unique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Approval Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading configurations...</p>
              </div>
            </div>
          ) : sortedConfigs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No configurations found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first approval configuration to get started
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Configuration
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount Range</TableHead>
                  <TableHead>Required Approval Level</TableHead>
                  <TableHead>Auto-Approve</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div className="font-medium">
                        ${config.minAmount.toFixed(2)}
                        {config.maxAmount ? ` - $${config.maxAmount.toFixed(2)}` : ' and above'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ApprovalLevelBadge level={config.requiredApprovalLevel} />
                    </TableCell>
                    <TableCell>
                      {config.autoApprove ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(config)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(config)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Approval Configuration' : 'Add Approval Configuration'}
            </DialogTitle>
            <DialogDescription>
              Set the approval requirements for a specific amount range
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">
                Minimum Amount ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAmount">Maximum Amount ($)</Label>
              <Input
                id="maxAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Leave empty for no upper limit"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to apply this rule for all amounts above the minimum
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalLevel">
                Required Approval Level <span className="text-red-500">*</span>
              </Label>
              <Select value={requiredLevel} onValueChange={(v: any) => setRequiredLevel(v)}>
                <SelectTrigger id="approvalLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Team Member</SelectItem>
                  <SelectItem value="DEPUTY">Deputy Head</SelectItem>
                  <SelectItem value="HEAD">Department Head</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoApprove"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="autoApprove" className="text-sm font-normal cursor-pointer">
                Enable automatic approval for this range
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !minAmount || Number(minAmount) < 0}
            >
              {isSubmitting ? 'Saving...' : editingConfig ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Approval Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this approval configuration? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ApprovalLevelBadge({ level }: { level: string }) {
  const config: Record<string, { className: string; label: string }> = {
    HEAD: { className: 'bg-purple-100 text-purple-800', label: 'Department Head' },
    DEPUTY: { className: 'bg-blue-100 text-blue-800', label: 'Deputy Head' },
    MEMBER: { className: 'bg-gray-100 text-gray-800', label: 'Team Member' },
  }

  const { className, label } = config[level] || config.MEMBER

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
