"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SharedTopbar } from "./shared-topbar"
import { PortfolioSidebar } from "./portfolio-sidebar"
import { MODULE_CONFIG, getModuleByPath } from "@/lib/config/modules"

interface PortfolioLayoutProps {
  children: React.ReactNode
}

export function PortfolioLayout({ children }: PortfolioLayoutProps) {
  const [currentModule, setCurrentModule] = useState("portfolio-management")
  const pathname = usePathname()

  useEffect(() => {
    const module = getModuleByPath(pathname)
    if (module) {
      setCurrentModule(module.id)
    }
  }, [pathname])

  const handleModuleSelect = (module: string) => {
    console.log('PortfolioLayout handleModuleSelect called with:', module)
    setCurrentModule(module)
    
    const moduleConfig = MODULE_CONFIG.find(m => m.id === module)
    if (moduleConfig) {
      console.log('Navigating to:', moduleConfig.path)
      window.location.href = moduleConfig.path
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedTopbar onModuleSelect={handleModuleSelect} currentModule={currentModule} />

      <div className="flex">
        <PortfolioSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
