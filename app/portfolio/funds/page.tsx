"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Wallet, TrendingUp, Users, DollarSign, Search, Plus, Calendar } from "lucide-react"
import { PortfolioLayout } from "@/components/layout/portfolio-layout"

const funds = [
  {
    id: 1,
    name: "Arcus Growth Fund I",
    type: "Growth Equity",
    vintage: "2022",
    size: "$50M",
    committed: "$45M",
    deployed: "$32M",
    remaining: "$13M",
    irr: "18.5%",
    multiple: "1.4x",
    status: "Active",
    investors: 24,
    companies: 12,
  },
  {
    id: 2,
    name: "Arcus Seed Fund",
    type: "Seed",
    vintage: "2023",
    size: "$25M",
    committed: "$22M",
    deployed: "$15M",
    remaining: "$7M",
    irr: "22.3%",
    multiple: "1.6x",
    status: "Active",
    investors: 18,
    companies: 8,
  },
  {
    id: 3,
    name: "Arcus Tech Fund",
    type: "Venture Capital",
    vintage: "2021",
    size: "$75M",
    committed: "$75M",
    deployed: "$68M",
    remaining: "$7M",
    irr: "15.2%",
    multiple: "1.2x",
    status: "Mature",
    investors: 32,
    companies: 18,
  },
]

export default function FundsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")

  const fundTypes = ["All", "Growth Equity", "Seed", "Venture Capital"]

  const filteredFunds = funds.filter((fund) => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "All" || fund.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <PortfolioLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fund Management</h1>
          <p className="text-gray-600 mt-1">Manage and track your investment funds</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Fund
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total AUM</p>
                <p className="text-2xl font-bold text-blue-900">$150M</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Deployed Capital</p>
                <p className="text-2xl font-bold text-green-900">$115M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Portfolio IRR</p>
                <p className="text-2xl font-bold text-purple-900">18.7%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Total Investors</p>
                <p className="text-2xl font-bold text-amber-900">74</p>
              </div>
              <Users className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search funds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {fundTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredFunds.map((fund) => (
          <Card key={fund.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{fund.name}</CardTitle>
                  <p className="text-gray-600">
                    {fund.type} • Vintage {fund.vintage}
                  </p>
                </div>
                <Badge variant={fund.status === "Active" ? "default" : "secondary"}>{fund.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Fund Size & Deployment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fund Size</p>
                    <p className="text-lg font-semibold">{fund.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Committed</p>
                    <p className="text-lg font-semibold">{fund.committed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deployed</p>
                    <p className="text-lg font-semibold text-green-600">{fund.deployed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-semibold text-blue-600">{fund.remaining}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-600">IRR</p>
                      <p className="text-xl font-bold text-green-900">{fund.irr}</p>
                    </div>
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-600">Multiple</p>
                      <p className="text-xl font-bold text-blue-900">{fund.multiple}</p>
                    </div>
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-600">{fund.investors} Investors</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-600">{fund.companies} Companies</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </PortfolioLayout>
  )
}
