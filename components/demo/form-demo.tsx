"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyForm } from "@/components/forms/company-form"
import { ApplicationForm } from "@/components/forms/application-form"
import { FundForm } from "@/components/forms/fund-form"
import { Building2, FileText, Wallet } from "lucide-react"

export function FormDemo() {
  const [activeForm, setActiveForm] = useState<"company" | "application" | "fund" | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Examples with Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => setActiveForm("company")}
            >
              <Building2 className="w-6 h-6" />
              <span>Company Form</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => setActiveForm("application")}
            >
              <FileText className="w-6 h-6" />
              <span>Application Form</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => setActiveForm("fund")}
            >
              <Wallet className="w-6 h-6" />
              <span>Fund Form</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeForm === "company" && <CompanyForm onCancel={() => setActiveForm(null)} />}

      {activeForm === "application" && <ApplicationForm onCancel={() => setActiveForm(null)} />}

      {activeForm === "fund" && <FundForm onCancel={() => setActiveForm(null)} />}
    </div>
  )
}
