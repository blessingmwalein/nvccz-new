"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, User, Calendar, PenLine } from "lucide-react"
import type { ApplicationData } from "../timeline-types"
import { SignatureView } from "@/components/application-portal/signature-view"

interface TermSheetSectionProps {
  application: ApplicationData
}

export function TermSheetSection({ application }: TermSheetSectionProps) {
  const termSheet = application?.termSheet

  if (!termSheet) {
    return <div className="text-center py-4 text-sm text-gray-500">Term sheet not yet created</div>
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Term Sheet Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            {termSheet.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-gray-500">Status</label>
              <Badge
                className={`mt-1 ${termSheet.status === "SIGNED" ? "bg-green-100 text-green-800" : termSheet.status === "FINAL" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {termSheet.status}
              </Badge>
            </div>
            <div>
              <label className="text-gray-500">Version</label>
              <p className="font-medium">{termSheet.version}</p>
            </div>
          </div>

          {termSheet.isSigned && termSheet.signedAt && (
            <div>
              <label className="text-gray-500">Signed At</label>
              <p className="font-medium text-green-600">
                {new Date(termSheet.signedAt).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Investment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-gray-500">Investment Amount</label>
              <p className="text-lg font-bold text-green-600">${Number(termSheet.investmentAmount).toLocaleString()}</p>
            </div>
            {termSheet.equityPercentage && (
              <div>
                <label className="text-gray-500">Equity</label>
                <p className="text-lg font-bold text-blue-600">{termSheet.equityPercentage}%</p>
              </div>
            )}
            {termSheet.valuation && (
              <div className="col-span-2">
                <label className="text-gray-500">Valuation</label>
                <p className="text-lg font-bold text-purple-600">${Number(termSheet.valuation).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Terms, Conditions, Timeline */}
      {(termSheet.keyTerms || termSheet.conditions || termSheet.timeline) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {termSheet.keyTerms && (
              <div>
                <label className="text-sm text-gray-500 font-medium">Key Terms</label>
                <p className="mt-1 text-sm">{termSheet.keyTerms}</p>
              </div>
            )}
            {termSheet.conditions && (
              <div>
                <label className="text-sm text-gray-500 font-medium">Conditions</label>
                <p className="mt-1 text-sm">{termSheet.conditions}</p>
              </div>
            )}
            {termSheet.timeline && (
              <div>
                <label className="text-sm text-gray-500 font-medium">Timeline</label>
                <p className="mt-1 text-sm">{termSheet.timeline}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Document */}
      {termSheet.documentUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{termSheet.documentFileName}</p>
                <p className="text-sm text-muted-foreground">
                  {(termSheet.documentSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(termSheet.documentUrl, '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created By */}
      {termSheet.createdBy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              Created By
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">
                  {termSheet.createdBy.firstName} {termSheet.createdBy.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{termSheet.createdBy.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <label className="text-sm text-gray-500">Created At</label>
            <p className="font-medium">
              {new Date(termSheet.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Last Updated</label>
            <p className="font-medium">
              {new Date(termSheet.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signatures Section */}
      {(termSheet.applicantSignatureUrl || termSheet.investorSignatureUrl) && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <PenLine className="w-5 h-5" />
            Signatures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SignatureView
              type="applicant"
              signatureUrl={termSheet.applicantSignatureUrl}
              signedAt={termSheet.applicantSignedAt}
              signerName={application.applicantName}
            />
            <SignatureView
              type="investor"
              signatureUrl={termSheet.investorSignatureUrl}
              signedAt={termSheet.investorSignedAt}
              signerName={termSheet.createdBy ? `${termSheet.createdBy.firstName} ${termSheet.createdBy.lastName}` : 'Investor'}
            />
          </div>
        </div>
      )}
    </div>
  )
}
