"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CiUser, CiDollar, CiFileOn } from "react-icons/ci"
import { Building2 } from "lucide-react"
import type { Application } from '../applications-dashboard'

interface ApplicationDataSectionProps {
  application: Application
}

export function ApplicationDataSection({ application }: ApplicationDataSectionProps) {
  return (
    <div className="space-y-6">
      {/* Applicant Information */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <CiUser className="w-5 h-5 text-blue-500" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="text-sm font-medium">{application.applicantName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-sm font-medium">{application.applicantEmail}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-sm font-medium">{application.applicantPhone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="text-sm font-medium">{application.applicantAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-500" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Business Name</label>
              <p className="text-sm font-medium">{application.businessName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Industry</label>
              <p className="text-sm font-medium">{application.industry}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Business Stage</label>
              <p className="text-sm font-medium">{application.businessStage}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Founding Date</label>
              <p className="text-sm font-medium">
                {new Date(application.foundingDate).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">Business Description</label>
              <p className="text-sm font-medium">{application.businessDescription}</p>
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
              <label className="text-sm text-gray-500">Requested Amount</label>
              <p className="text-xl font-normal text-purple-600">
                ${Number(application.requestedAmount).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <CiFileOn className="w-5 h-5 text-amber-500" />
            Submitted Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {application.documents?.map((doc) => (
              <div key={doc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{doc.documentType.replaceAll('_', ' ')}</p>
                  <p className="text-xs text-gray-600">{doc.fileName}</p>
                </div>
                <Badge variant={doc.isRequired ? 'destructive' : 'secondary'} className="text-xs">
                  {doc.isRequired ? 'Required' : 'Optional'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
