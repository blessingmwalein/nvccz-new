"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CiUser, CiDollar, CiFileOn } from "react-icons/ci"
import { Building2, Eye } from "lucide-react"
import type { Application } from '../applications-dashboard'
import { DocumentPreviewModal } from '../document-preview-modal'

import type { ExtendedApplication } from '@/lib/api/applications-api'

interface ApplicationDataSectionProps {
  application: ExtendedApplication
}

export function ApplicationDataSection({ application }: ApplicationDataSectionProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocIndex, setSelectedDocIndex] = useState(0)

  const handlePreviewDocument = (index: number) => {
    setSelectedDocIndex(index)
    setPreviewOpen(true)
  }

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
            Submitted Documents ({application.documents?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!application.documents || application.documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CiFileOn className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No documents submitted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.documents.map((doc, index) => (
                <div 
                  key={doc.id} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer group"
                  onClick={() => handlePreviewDocument(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium truncate">
                        {doc.documentType.replaceAll('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{doc.fileName}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-200 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewDocument(index)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.isRequired ? 'destructive' : 'secondary'} className="text-xs">
                      {doc.isRequired ? 'Required' : 'Optional'}
                    </Badge>
                    {doc.isSubmitted && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        Submitted
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documents={application.documents || []}
        initialDocumentIndex={selectedDocIndex}
      />
    </div>
  )
}
