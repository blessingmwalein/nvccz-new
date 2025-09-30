"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { UserApplications } from "@/components/applications/user-applications"

export default function ApplicationsPage() {
  return (
    <PortfolioLayout>
      <UserApplications />
    </PortfolioLayout>
  )
}