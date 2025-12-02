'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Mail, Phone, Calendar, FileText, DollarSign, Banknote, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface PaymentDrawerContentProps {
  payment: any
}

export function PaymentDrawerContent({ payment }: PaymentDrawerContentProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PARTIALLY_PAID': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Status Card */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{payment.invoiceNumber}</h3>
                <Badge className={getPaymentStatusColor(payment.paymentStatus)}>
                  {payment.paymentStatus?.replace('_', ' ')}
                </Badge>
              </div>
              {payment.paymentReference && (
                <p className="text-sm text-gray-600">
                  Ref: {payment.paymentReference}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="text-lg font-semibold">
                {payment.paymentDate ? format(new Date(payment.paymentDate), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Vendor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">
                {getInitials(payment.vendor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium">{payment.vendor.name}</p>
              </div>
              {payment.vendor.email && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </p>
                  <p className="font-medium">{payment.vendor.email}</p>
                </div>
              )}
              {payment.vendor.phone && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                  </p>
                  <p className="font-medium">{payment.vendor.phone}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Invoice Date</p>
              <p className="font-medium">{format(new Date(payment.invoiceDate), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium">{format(new Date(payment.dueDate), 'MMM dd, yyyy')}</p>
            </div>
            {payment.paymentDate && (
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium text-green-600">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-600" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                {payment.currency.symbol}{parseFloat(payment.subtotal || '0').toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Tax Amount:</span>
              <span className="font-semibold">
                {payment.currency.symbol}{parseFloat(payment.taxAmount || '0').toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <span className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Total Amount:
              </span>
              <span>{payment.currency.symbol}{parseFloat(payment.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entry */}
      {payment.journalEntry && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Journal Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-medium font-mono">{payment.journalEntry.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge>{payment.journalEntry.status}</Badge>
              </div>
              {payment.journalEntry.transactionDate && (
                <div>
                  <p className="text-sm text-gray-500">Transaction Date</p>
                  <p className="font-medium">
                    {format(new Date(payment.journalEntry.transactionDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Information */}
      {payment.documentPath && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Document Type</p>
                <Badge variant="outline">{payment.documentType || 'N/A'}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Document Path</p>
                <p className="font-medium text-sm truncate">{payment.documentPath}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created By */}
      {payment.createdBy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              Audit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium">{payment.createdBy.firstName} {payment.createdBy.lastName}</p>
                <p className="text-sm text-gray-600">{payment.createdBy.email}</p>
              </div>
              {payment.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
