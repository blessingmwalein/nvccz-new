"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchCompany, updateCompany } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, X, Building, FileText as FileTextIcon } from "lucide-react"
import { toast } from "sonner"
import { CompanyInfoCard } from "@/components/portfolio/company-info-card"
import { ContactInfoCard } from "@/components/portfolio/contact-info-card"
import { AdditionalInfoCard } from "@/components/portfolio/additional-info-card"
import { CompanyEditForm } from "@/components/portfolio/company-edit-form"
import { PortfolioSkeleton } from "@/components/portfolio/portfolio-skeleton"
import { FinancialStatementsView } from "@/components/portfolio/financial-statements-view"
import { cn } from "@/lib/utils"

const tabs = [
  { id: 'profile', label: 'Company Profile', icon: Building },
  { id: 'financials', label: 'Financial Statements', icon: FileTextIcon },
]

export default function PortfolioCompanyPage() {
  const dispatch = useAppDispatch()
  const { company, companyLoading } = useAppSelector((state) => state.applicationPortal)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    address: '',
    website: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
  })

  useEffect(() => {
    dispatch(fetchCompany())
  }, [dispatch])

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        address: company.address || '',
        website: company.website || '',
        description: company.description || '',
        contactPerson: company.contactPerson || '',
        contactPhone: company.contactPhone || '',
        contactEmail: company.contactEmail || '',
      })
    }
  }, [company])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(updateCompany(formData)).unwrap()
      toast.success('Company information updated successfully')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error || 'Failed to update company information')
    }
  }

  const renderTabContent = () => {
    if (activeTab === 'profile') {
      return isEditing ? (
        <CompanyEditForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          <CompanyInfoCard company={company!} />
          <ContactInfoCard company={company!} />
          <AdditionalInfoCard company={company!} />
        </div>
      )
    }
    if (activeTab === 'financials') {
      return <FinancialStatementsView />
    }
    return null
  }

  if (companyLoading) {
    return (
      <ApplicationPortalLayout>
        <PortfolioSkeleton />
      </ApplicationPortalLayout>
    )
  }

  if (!company) {
    return (
      <ApplicationPortalLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Company Found</h3>
              <p className="text-muted-foreground">Your company profile will appear here once registered.</p>
            </div>
          </div>
        </div>
      </ApplicationPortalLayout>
    )
  }

  return (
    <ApplicationPortalLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio Company
            </h1>
            <p className="text-muted-foreground">Manage your company information and financial reporting</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={
              company.status === 'ACTIVE' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200'
            }>
              {company.status}
            </Badge>
            {activeTab === 'profile' && (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className={
                  isEditing
                    ? "rounded-full h-10 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    : "rounded-full h-10 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                }
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200",
                    isActive ? "text-blue-600 border-blue-600" : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-200",
                      isActive ? "from-blue-400 to-blue-600" : "from-gray-300 to-gray-400"
                    )}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {renderTabContent()}
      </div>
    </ApplicationPortalLayout>
  )
}
