"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  FileText, 
  Users, 
  DollarSign,
  ChevronRight,
  Eye,
  Edit,
  Play,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock4,
  RefreshCw,
  Send,
  X,
  ShoppingCart
} from "lucide-react"
import { CiUser, CiDollar, CiFileOn, CiCalendar } from "react-icons/ci"
import { PurchaseRequisition } from "@/lib/api/procurement-api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface RequisitionTimelineProps {
  requisition: PurchaseRequisition
  onSubmitForApproval?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
  onCreatePurchaseOrder?: (id: string) => void
  refreshTrigger?: number
}

const stages = [
  {
    id: "DRAFT",
    title: "Draft",
    description: "Requisition is being prepared",
    icon: FileText,
    color: "bg-gray-500",
    completedColor: "bg-green-500"
  },
  {
    id: "PENDING_APPROVAL",
    title: "Pending Approval",
    description: "Waiting for management approval",
    icon: Clock,
    color: "bg-amber-500",
    completedColor: "bg-green-500"
  },
  {
    id: "APPROVED",
    title: "Approved",
    description: "Requisition has been approved",
    icon: CheckCircle,
    color: "bg-green-500",
    completedColor: "bg-green-500"
  },
  {
    id: "PURCHASE_ORDER_CREATED",
    title: "Purchase Order Created",
    description: "Purchase order has been generated",
    icon: FileText,
    color: "bg-blue-500",
    completedColor: "bg-green-500"
  },
  {
    id: "DELIVERED",
    title: "Delivered",
    description: "Items have been delivered and received",
    icon: CheckCircle2,
    color: "bg-purple-500",
    completedColor: "bg-green-500"
  }
]

export function RequisitionTimeline({
  requisition,
  onSubmitForApproval,
  onApprove,
  onReject,
  onCreatePurchaseOrder,
  refreshTrigger
}: RequisitionTimelineProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    const stageIndex = stages.findIndex(stage => stage.id === requisition.status)
    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0)
  }, [requisition.status])

  const getStageStatus = (index: number) => {
    if (requisition.status === "REJECTED" || requisition.status === "CANCELLED") {
      return index === 0 ? "completed" : "cancelled"
    }
    
    if (index < currentStageIndex) return "completed"
    if (index === currentStageIndex) return "current"
    return "upcoming"
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }
    
    if (onReject) {
      await onReject(requisition.id, rejectionReason)
      setShowRejectForm(false)
      setRejectionReason("")
    }
  }

  const getStageActions = (stageId: string) => {
    // Only show actions for the current stage
    if (requisition.status !== stageId) {
      return null
    }

    switch (stageId) {
      case "DRAFT":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onSubmitForApproval?.(requisition.id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        )
      case "PENDING_APPROVAL":
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => onApprove?.(requisition.id)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50 rounded-full"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
            
            {showRejectForm && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-normal text-red-600">Reject Requisition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Rejection Reason</label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      rows={3}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectionReason("")
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      case "APPROVED":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onCreatePurchaseOrder?.(requisition.id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const renderRequisitionData = () => {
    return (
      <div className="space-y-4">
        {/* Basic Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiFileOn className="w-5 h-5 text-blue-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Requisition Number</label>
                <p className="text-base font-medium">{requisition.requisitionNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Priority</label>
                <Badge className={`ml-2 ${
                  requisition.priority === 'HIGH' || requisition.priority === 'URGENT' 
                    ? 'bg-red-100 text-red-800'
                    : requisition.priority === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {requisition.priority}
                </Badge>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-base">{requisition.description}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Justification</label>
                <p className="text-base">{requisition.justification}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requestor Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiUser className="w-5 h-5 text-green-500" />
              Requestor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="text-base font-medium">
                  {requisition.requestedBy.firstName} {requisition.requestedBy.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-base">{requisition.requestedBy.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Department</label>
                <p className="text-base">{requisition.department?.name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiDollar className="w-5 h-5 text-purple-500" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-500">Total Amount</label>
                <p className="text-xl font-normal text-purple-600">
                  {requisition.currency?.symbol || '$'}{Number(requisition.totalAmount).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Currency</label>
                <p className="text-base">{requisition.currency?.name || 'USD'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Requisition Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requisition.items?.map((item, index) => (
                <div key={item.id || index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Item Name</label>
                      <p className="text-sm font-medium">{item.itemName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Quantity</label>
                      <p className="text-sm">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Unit Price</label>
                      <p className="text-sm">{requisition.currency?.symbol || '$'}{Number(item.unitPrice).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Total</label>
                      <p className="text-sm font-medium">{requisition.currency?.symbol || '$'}{Number(item.totalPrice || 0).toLocaleString()}</p>
                    </div>
                    {item.description && (
                      <div className="md:col-span-4">
                        <label className="text-xs text-gray-500">Description</label>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-normal text-gray-900 mb-2">Requisition Timeline</h2>
        <p className="text-sm text-gray-600">Track the progress of this purchase requisition</p>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {stages.map((stage, index) => {
          const status = getStageStatus(index)
          const isCompleted = status === "completed"
          const isCurrent = status === "current"
          const isUpcoming = status === "upcoming"
          const isCancelled = status === "cancelled"
          const Icon = stage.icon

          return (
            <div key={stage.id} className="relative flex items-start">
              {/* Timeline Line */}
              {index < stages.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-full ${
                  isCancelled ? 'bg-red-200' : 'bg-gray-200'
                }`} />
              )}

              {/* Timeline Icon */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-white shadow-lg">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : isCurrent ? (
                  <div className={`w-6 h-6 rounded-full ${stage.color} flex items-center justify-center`}>
                    <stage.icon className="w-4 h-4 text-white" />
                  </div>
                ) : isCancelled ? (
                  <X className="w-6 h-6 text-red-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Stage Content */}
              <div className="ml-6 flex-1 pb-8">
                <Card className={`transition-all duration-300 ${
                  isCurrent 
                    ? 'border-2 border-blue-500 shadow-lg bg-white' 
                    : isCompleted 
                    ? 'border-green-200 bg-white' 
                    : isCancelled
                    ? 'border-red-200 bg-red-50'
                    : isUpcoming
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className={`text-base font-normal ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : isCancelled ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {stage.title}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Current
                          </Badge>
                        )}
                        {isCancelled && (
                          <Badge className="bg-red-100 text-red-800">
                            Cancelled
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="secondary">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Requisition Data Accordion - Only for Draft stage */}
                      {stage.id === "DRAFT" && !isUpcoming && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="requisition-data">
                            <AccordionTrigger className="text-left hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                  <CiFileOn className="w-4 h-4 text-blue-500" />
                                </div>
                                <span>Requisition Details</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {renderRequisitionData()}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {/* Stage Actions */}
                      <div className="pt-4 border-t border-gray-200">
                        {!isUpcoming && !isCancelled && getStageActions(stage.id)}
                        {isUpcoming && (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 italic">This stage is not yet available</p>
                          </div>
                        )}
                        {isCancelled && (
                          <div className="text-center py-4">
                            <p className="text-sm text-red-500 italic">Process was cancelled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
