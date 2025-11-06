"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp } from "lucide-react"

interface AdditionalInfoCardProps {
  company: any
}

export function AdditionalInfoCard({ company }: AdditionalInfoCardProps) {
  return (
    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.employeeCount && (
            <div>
              <label className="text-sm text-muted-foreground">Employee Count</label>
              <p className="font-medium text-lg">{company.employeeCount}</p>
            </div>
          )}
          {company.annualRevenue && (
            <div>
              <label className="text-sm text-muted-foreground">Annual Revenue</label>
              <p className="font-medium text-lg text-green-600">
                ${Number(company.annualRevenue).toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Created At
            </label>
            <p className="font-medium">
              {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Last Updated
            </label>
            <p className="font-medium">
              {new Date(company.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
