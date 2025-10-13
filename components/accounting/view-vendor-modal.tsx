"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Building, 
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
import { Vendor } from "@/lib/api/accounting-api"

interface ViewVendorModalProps {
  isOpen: boolean
  onClose: () => void
  vendor?: Vendor | null
}

export function ViewVendorModal({ isOpen, onClose, vendor }: ViewVendorModalProps) {
  if (!vendor) return null

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
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span>{vendor.name}</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                    {getInitials(vendor.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-gray-500 font-normal">Vendor Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Vendor Name & Contact Person */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Building className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vendor Name</p>
                <p className="font-semibold text-gray-900 text-lg">{vendor.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact Person</p>
                <p className="font-medium text-gray-900">
                  {vendor.contactPerson || <span className="text-gray-400 text-sm">Not specified</span>}
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
                  {vendor.email || <span className="text-gray-400 text-sm">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="font-medium text-gray-900">
                  {vendor.phone || <span className="text-gray-400 text-sm">Not provided</span>}
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
                  {vendor.taxNumber || <span className="text-gray-400 text-sm font-sans">Not specified</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Payment Terms</p>
                {vendor.paymentTerms ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {vendor.paymentTerms}
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
                  {vendor.address || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getStatusIcon(vendor.isActive)}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <Badge className={getStatusColor(vendor.isActive)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(vendor.isActive)}
                    {vendor.isActive ? 'Active' : 'Inactive'}
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
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(vendor.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(vendor.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(vendor.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}