"use client"

import { useState } from "react"
import { Building2, TrendingUp, DollarSign, BarChart3, Search, Plus, Eye, Edit, Trash2, CreditCard } from "lucide-react"
import { 
  CiBank, 
  CiDollar, 
  CiSearch, 
  CiCirclePlus,
  CiEdit,
  CiTrash,
  CiCreditCard1
} from "react-icons/ci"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"

const portfolioCompanies = [
  {
    id: 1,
    name: "TechFlow Solutions",
    sector: "Technology",
    stage: "Series B",
    investment: "$2.5M",
    valuation: "$15M",
    ownership: "16.7%",
    status: "Active",
    lastUpdate: "2024-01-15",
    performance: "+23%",
    logo: "🚀",
  },
  {
    id: 2,
    name: "GreenEnergy Corp",
    sector: "Clean Energy",
    stage: "Series A",
    investment: "$1.8M",
    valuation: "$8M",
    ownership: "22.5%",
    status: "Active",
    lastUpdate: "2024-01-10",
    performance: "+18%",
    logo: "🌱",
  },
  {
    id: 3,
    name: "HealthTech Innovations",
    sector: "Healthcare",
    stage: "Seed",
    investment: "$500K",
    valuation: "$3M",
    ownership: "16.7%",
    status: "Under Review",
    lastUpdate: "2024-01-08",
    performance: "+12%",
    logo: "🏥",
  },
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("All")

  const sectors = ["All", "Technology", "Healthcare", "Clean Energy", "Fintech"]

  const filteredCompanies = portfolioCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === "All" || company.sector === selectedSector
    return matchesSearch && matchesSector
  })

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">Portfolio Companies</h1>
          <p className="text-gray-600 mt-1">Manage and track your portfolio companies</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full">
          <CiCirclePlus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Companies - Gradient Blue */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiBank className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">Total Companies</p>
              <p className="text-3xl font-normal text-white">24</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="w-3/4 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Active Investments - Gradient Green */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">Active Investments</p>
              <p className="text-3xl font-normal text-white">18</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="w-4/5 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Total Investment - Gradient Amber */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CiDollar className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">Total Investment</p>
              <p className="text-3xl font-normal text-white">$45.2M</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="w-2/3 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Avg Performance - Gradient Purple */}
        <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">Avg. Performance</p>
              <p className="text-3xl font-normal text-white">+17.8%</p>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="w-5/6 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {sectors.map((sector) => (
                <Button
                  key={sector}
                  variant={selectedSector === sector ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSector(sector)}
                  className={selectedSector === sector 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full border-0" 
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full"
                  }
                >
                  {sector}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 cursor-pointer">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                  {company.logo}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{company.name}</h3>
                  <p className="text-sm text-white/80">{company.sector}</p>
                </div>
              </div>
              <Badge className={`text-xs ${
                company.status === "Active" 
                  ? "bg-green-500/20 text-green-100 border-green-400/30" 
                  : "bg-yellow-500/20 text-yellow-100 border-yellow-400/30"
              }`}>
                {company.status}
              </Badge>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/70">Investment</p>
                  <p className="text-lg font-normal text-white">{company.investment}</p>
                </div>
                <div>
                  <p className="text-white/70">Valuation</p>
                  <p className="text-lg font-normal text-white">{company.valuation}</p>
                </div>
                <div>
                  <p className="text-white/70">Ownership</p>
                  <p className="text-lg font-normal text-white">{company.ownership}</p>
                </div>
                <div>
                  <p className="text-white/70">Performance</p>
                  <p className="text-lg font-normal text-green-200">{company.performance}</p>
                </div>
              </div>
            </div>

            {/* Last Update */}
            <div className="pt-3 border-t border-white/20 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Last Update</span>
                <span className="text-white/90">{company.lastUpdate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full flex-1">
                <CiEdit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full flex-1">
                <CiCreditCard1 className="w-4 h-4 mr-1" />
                Fund
              </Button>
              <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-100 border-0 rounded-full">
                <CiTrash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </MainLayout>
  )
}
