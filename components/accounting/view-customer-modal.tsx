"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  CreditCard
} from "lucide-react"
import { Customer } from "@/lib/api/accounting-api"

interface ViewCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer | null
}

export function ViewCustomerModal({ isOpen, onClose, customer }: ViewCustomerModalProps) {
  if (!customer) return null

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span>{customer.name}</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-gray-500 font-normal">Customer Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Customer Name & Contact Person */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Customer Name</p>
                <p className="font-semibold text-gray-900 text-lg">{customer.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact Person</p>
                <p className="font-medium text-gray-900">
                  {customer.contactPerson || <span className="text-gray-400 text-sm">Not specified</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {customer.email || <span className="text-gray-400 text-sm">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="font-medium text-gray-900">
                  {customer.phone || <span className="text-gray-400 text-sm">Not provided</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Row 3: Tax Number & Payment Terms */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tax Number</p>
                <p className="font-medium text-gray-900 font-mono text-sm">
                  {customer.taxNumber || <span className="text-gray-400 text-sm font-sans">Not specified</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Payment Terms</p>
                {customer.paymentTerms ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {customer.paymentTerms}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-sm">Not specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Address & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {customer.address || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getStatusIcon(customer.isActive)}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <Badge className={getStatusColor(customer.isActive)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(customer.isActive)}
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 5: Created & Last Updated */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(customer.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(customer.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}