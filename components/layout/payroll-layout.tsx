"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SharedTopbar } from "./shared-topbar"
import { PayrollSidebar } from "./payroll-sidebar"
import { MODULE_CONFIG, getModuleByPath } from "@/lib/config/modules"

interface PayrollLayoutProps {
  children: React.ReactNode
}

export function PayrollLayout({ children }: PayrollLayoutProps) {
  const [currentModule, setCurrentModule] = useState("payroll")
  const pathname = usePathname()

  useEffect(() => {
    const module = getModuleByPath(pathname)
    if (module) {
      setCurrentModule(module.id)
    }
  }, [pathname])

  const handleModuleSelect = (module: string) => {
    console.log('PayrollLayout handleModuleSelect called with:', module)
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
        <PayrollSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
