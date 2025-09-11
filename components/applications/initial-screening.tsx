"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  CiDollar, 
  CiFilter, 
  CiCalendar, 
  CiUser, 
  CiEdit, 
  CiTrash, 
  CiPlay1,
  CiMail,
  CiPhone,
  CiLocationOn,
  CiFileOn,
  CiClock1,
  CiBank,
  CiText
} from "react-icons/ci"
import { Search, Filter, Plus, Building2, DollarSign, Calendar, User, FileText, Eye, Download, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function InitialScreening() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const handleNewApplication = () => {
    router.push('/applications/form')
  }

  const screeningApplications = [
    {
      id: "APP-006",
      company: "AI Robotics Inc.",
      sector: "AI/Robotics",
      amount: 30000000,
      stage: "Series B",
      submittedAt: "Nov 10, 2024",
      contact: "John Smith",
      email: "john@airobotics.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, San Francisco, CA 94105",
      status: "pending",
      score: null,
      firstName: "John",
      lastName: "Smith",
      businessDescription: "Revolutionary AI-powered robotics solutions for industrial automation and smart manufacturing.",
      industry: "Technology",
      businessStage: "GROWTH",
      foundingDate: "2020-03-15",
      documents: [
        { name: "Business Plan", type: "pdf", size: "2.4 MB" },
        { name: "Financial Projections", type: "xlsx", size: "1.2 MB" },
        { name: "Market Research", type: "pdf", size: "3.1 MB" }
      ]
    },
    {
      id: "APP-007",
      company: "BioTech Solutions",
      sector: "Biotechnology",
      amount: 18000000,
      stage: "Series A",
      submittedAt: "Nov 9, 2024",
      contact: "Sarah Johnson",
      email: "sarah@biotech.com",
      phone: "+1-555-0456",
      address: "456 Research Blvd, Boston, MA 02115",
      status: "approved",
      score: 85,
      firstName: "Sarah",
      lastName: "Johnson",
      businessDescription: "Cutting-edge biotechnology solutions for personalized medicine and drug discovery.",
      industry: "Healthcare",
      businessStage: "STARTUP",
      foundingDate: "2022-08-20",
      documents: [
        { name: "Business Plan", type: "pdf", size: "2.8 MB" },
        { name: "Clinical Trial Data", type: "pdf", size: "4.2 MB" },
        { name: "Patent Documentation", type: "pdf", size: "1.5 MB" }
      ]
    },
    {
      id: "APP-008",
      company: "Quantum Computing Co.",
      sector: "Technology",
      amount: 45000000,
      stage: "Series C",
      submittedAt: "Nov 8, 2024",
      contact: "Michael Chen",
      email: "michael@quantum.com",
      phone: "+1-555-0789",
      address: "789 Quantum Lane, Austin, TX 78701",
      status: "under_review",
      score: 78,
      firstName: "Michael",
      lastName: "Chen",
      businessDescription: "Next-generation quantum computing hardware and software for enterprise applications.",
      industry: "Technology",
      businessStage: "MATURE",
      foundingDate: "2018-11-10",
      documents: [
        { name: "Business Plan", type: "pdf", size: "3.2 MB" },
        { name: "Technical Specifications", type: "pdf", size: "2.1 MB" },
        { name: "Partnership Agreements", type: "pdf", size: "1.8 MB" }
      ]
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "under_review":
        return "bg-yellow-100 text-yellow-700"
      case "pending":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">Initial Screening</h1>
          <p className="text-gray-600 mt-1">Review and evaluate new investment applications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search applications..." className="pl-10 w-64 rounded-full border-gray-300" />
          </div>
          <Button variant="outline" className="rounded-full border-gray-300">
            <CiFilter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={handleNewApplication}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Review Card - Gradient Blue */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiFileOn className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-white/90 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold">24</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Applications</span>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiClock1 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Approved Card - White Background */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CiBank className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Applications</span>
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CiPlay1 className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Under Review Card - Gradient Yellow/Orange */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiDollar className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-white/90 text-sm font-medium">Under Review</p>
              <p className="text-3xl font-bold">6</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Applications</span>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiEdit className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Rejected Card - White Background */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <CiCalendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Applications</span>
            <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <CiTrash className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Applications List */}
      <div className="space-y-6">
        <h2 className="text-xl font-normal text-gray-900 flex items-center gap-2">
          <CiFileOn className="w-5 h-5 text-blue-600" />
          Applications for Screening
        </h2>
        
        <div className="grid gap-6">
          {screeningApplications.map((app) => {
            const isExpanded = expandedCards.has(app.id)
            return (
              <div key={app.id} className="rounded-2xl border border-gray-200  hover:shadow-md transition-shadow">
                <Collapsible open={isExpanded} onOpenChange={() => toggleCard(app.id)}>
                  <CardContent className="p-6">
                    {/* Header Section - Always Visible */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-normal text-gray-900">{app.company}</h3>
                          <Badge variant="secondary" className="rounded-full">
                            {app.sector}
                          </Badge>
                          <Badge className={`rounded-full ${getStatusColor(app.status)}`}>
                            {app.status.replace("_", " ")}
                          </Badge>
                        </div>
                        
                        {/* Key Metrics - Always Visible */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CiDollar className="w-4 h-4" />
                            <span className="text-sm">{formatCurrency(app.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CiBank className="w-4 h-4" />
                            <span className="text-sm">{app.stage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CiUser className="w-4 h-4" />
                            <span className="text-sm">{app.firstName} {app.lastName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CiCalendar className="w-4 h-4" />
                            <span className="text-sm">{app.submittedAt}</span>
                          </div>
                        </div>

                        {/* Preview Business Description - Always Visible */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {app.businessDescription}
                          </p>
                        </div>

                        {/* Preview Documents - Always Visible */}
                        <div className="">
                          <div className="flex flex-wrap gap-2">
                            {app.documents.slice(0, 3).map((doc, index) => {
                              const getDocStyle = (docType: string, index: number) => {
                                const styles = [
                                  "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700",
                                  "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700", 
                                  "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-700"
                                ]
                                return styles[index % styles.length]
                              }
                              
                              return (
                                <div key={index} className={`flex items-center gap-1.5 ${getDocStyle(doc.type, index)} rounded-full px-3 py-1.5 text-xs`}>
                                  <CiFileOn className="w-3 h-3" />
                                  <span className="font-medium">{doc.name}</span>
                                  <span className="opacity-70 text-xs">({doc.size})</span>
                                </div>
                              )
                            })}
                            {app.documents.length > 3 && (
                              <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 text-xs">
                                <span className="text-gray-600 font-medium">+{app.documents.length - 3} more</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Score, Actions and Toggle */}
                      <div className="text-right space-y-3">
                        {app.score && (
                          <div className="text-sm">
                            <span className="text-gray-500">Score: </span>
                            <span className="font-semibold text-gray-900">{app.score}/100</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="rounded-full">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full">
                            <CiPlay1 className="w-4 h-4 mr-1" />
                            Due Diligence
                          </Button>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            <span className="ml-1 text-sm">
                              {isExpanded ? 'Show Less' : 'Show More'}
                            </span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <CollapsibleContent>
                      <div className="space-y-6">
                        {/* Detailed Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Contact Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <CiUser className="w-4 h-4" />
                              Contact Information
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CiMail className="w-4 h-4" />
                                <span>{app.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CiPhone className="w-4 h-4" />
                                <span>{app.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CiLocationOn className="w-4 h-4" />
                                <span className="text-xs">{app.address}</span>
                              </div>
                            </div>
                          </div>

                          {/* Business Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <CiBank className="w-4 h-4" />
                              Business Information
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div><span className="font-medium">Industry:</span> {app.industry}</div>
                              <div><span className="font-medium">Stage:</span> {app.businessStage}</div>
                              <div><span className="font-medium">Founded:</span> {new Date(app.foundingDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Full Business Description */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <CiText className="w-4 h-4" />
                            Business Description
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{app.businessDescription}</p>
                        </div>

                        {/* Documents Section */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <CiFileOn className="w-4 h-4" />
                            Uploaded Documents
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {app.documents.map((doc, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                                <CiFileOn className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{doc.name}</span>
                                <span className="text-gray-500 text-xs">({doc.size})</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-full">
                              <CiEdit className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full text-red-600 border-red-200 hover:bg-red-50">
                              <CiTrash className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                          <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full">
                            <CiPlay1 className="w-4 h-4 mr-2" />
                            Initiate Due Diligence
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Collapsible>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
