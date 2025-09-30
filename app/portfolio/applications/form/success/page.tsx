"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CiCircleCheck } from "react-icons/ci"
import { resetForm } from "@/lib/store/slices/applicationSlice"

export default function ApplicationSuccessPage() {
  const { lastResponse } = useAppSelector(state => state.application)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const data = lastResponse?.data
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      BUSINESS_PLAN: 'Business Plan',
      PROOF_OF_CONCEPT: 'Proof of Concept',
      MARKET_RESEARCH: 'Market Research',
      PROJECTED_CASH_FLOWS: 'Projected Cash Flows',
      HISTORICAL_FINANCIALS: 'Historical Financials',
    }
    return map[type] || type
  }

  return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center mb-4">
              <CiCircleCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Application Submitted</h1>
            <p className="text-gray-600 mt-2">We received your application successfully.</p>
          </div>

          {data ? (
            <div className="bg-white border rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Application ID</p>
                  <p className="font-medium">{data.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Applicant</p>
                  <p className="font-medium">{data.applicantName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{data.applicantEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{data.applicantPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Business</p>
                  <p className="font-medium">{data.businessName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stage</p>
                  <p className="font-medium">{data.businessStage}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Description</p>
                  <p className="font-medium">{data.businessDescription}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-700 font-medium mb-2">Documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.documents?.map((doc: any) => (
                    <div key={doc.id} className="border rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{getTypeLabel(doc.documentType)}</p>
                        <p className="text-xs text-gray-500">{doc.fileName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${doc.isRequired ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {doc.isRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <Button variant="outline" onClick={() => router.push('/')}>Go Home</Button>
                <Button
                  variant="gradient"
                  onClick={() => { dispatch(resetForm()); router.push('/applications/form') }}
                >
                  Submit Another Application
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-6">No submission data found.</p>
              <Button variant="gradient" onClick={() => router.push('/applications/form')}>Start Application</Button>
            </div>
          )}
        </div>
      </div>
  )
}


