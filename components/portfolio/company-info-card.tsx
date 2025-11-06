"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe } from "lucide-react"

interface CompanyInfoCardProps {
  company: any
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Company Name</label>
            <p className="font-medium text-lg">{company.name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Registration Number</label>
            <p className="font-medium">{company.registrationNumber}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Industry</label>
            <p className="font-medium">{company.industry}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Company Size</label>
            <p className="font-medium">{company.companySize}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Funding Stage</label>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50">
              {company.fundingStage}
            </Badge>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Founding Date</label>
            <p className="font-medium">
              {new Date(company.foundingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Address</label>
            <p className="font-medium">{company.address}</p>
          </div>
          {company.website && (
            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </label>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                {company.website}
              </a>
            </div>
          )}
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Description</label>
            <p className="font-medium text-gray-700 leading-relaxed">{company.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
