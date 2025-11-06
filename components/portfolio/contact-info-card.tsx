"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, User } from "lucide-react"

interface ContactInfoCardProps {
  company: any
}

export function ContactInfoCard({ company }: ContactInfoCardProps) {
  return (
    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-muted-foreground">Contact Person</label>
            <p className="font-medium">{company.contactPerson}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              Phone
            </label>
            <p className="font-medium">{company.contactPhone}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500" />
              Email
            </label>
            <p className="font-medium">{company.contactEmail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
