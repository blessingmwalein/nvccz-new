"use client"

import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { FundsList } from "@/components/portfolio/funds/funds-list"

export default function FundsPage() {
  return (
    <PortfolioLayout>
      <div className="container mx-auto py-6 px-6">
        <FundsList />
      </div>
    </PortfolioLayout>
  )
}
