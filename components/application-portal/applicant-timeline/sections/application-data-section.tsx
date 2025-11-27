"use client"

import { Badge } from "@/components/ui/badge"
import { User, Building2, DollarSign, FileText, Eye } from "lucide-react"
import type { ApplicationData } from "../timeline-types"

interface ApplicationDataSectionProps {
  application: ApplicationData
  onPreviewDocument: (index: number) => void
}

export function ApplicationDataSection({ application, onPreviewDocument }: ApplicationDataSectionProps) {
  return (
    <div className="space-y-4 pt-2">
      {/* Applicant Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-sm">Applicant Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500">Name</label>
            <p className="font-medium">{application?.applicantName}</p>
          </div>
          <div>
            <label className="text-gray-500">Email</label>
            <p className="font-medium">{application?.applicantEmail}</p>
          </div>
          <div>
            <label className="text-gray-500">Phone</label>
            <p className="font-medium">{application?.applicantPhone}</p>
          </div>
          <div>
            <label className="text-gray-500">Address</label>
            <p className="font-medium">{application?.applicantAddress}</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-green-600" />
          <h4 className="font-medium text-sm">Business Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500">Business Name</label>
            <p className="font-medium">{application?.businessName}</p>
          </div>
          <div>
            <label className="text-gray-500">Industry</label>
            <p className="font-medium">{application?.industry}</p>
          </div>
          <div>
            <label className="text-gray-500">Stage</label>
            <p className="font-medium">{application?.businessStage}</p>
          </div>
          <div>
            <label className="text-gray-500">Founded</label>
            <p className="font-medium">
              {application?.foundingDate && new Date(application.foundingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-2">
            <label className="text-gray-500">Description</label>
            <p className="font-medium">{application?.businessDescription}</p>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-purple-600" />
          <h4 className="font-medium text-sm">Requested Amount</h4>
        </div>
        <p className="text-2xl font-bold text-purple-600">
          ${Number(application?.requestedAmount || 0).toLocaleString()}
        </p>
      </div>

      {/* Documents */}
      {application?.documents && application.documents.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-amber-600" />
            <h4 className="font-medium text-sm">Submitted Documents</h4>
          </div>
          <div className="space-y-2">
            {application.documents.map((doc, index) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-white p-3 rounded border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer group"
                onClick={() => onPreviewDocument(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.documentType.replaceAll("_", " ")}</p>
                    <p className="text-xs text-gray-500">{doc.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.isRequired ? "default" : "secondary"} className="text-xs">
                    {doc.isRequired ? "Required" : "Optional"}
                  </Badge>
                  <Eye className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
