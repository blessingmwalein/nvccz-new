"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SharedTopbar } from "./shared-topbar"
import { AdminSidebar } from "./admin-sidebar"
import { MODULE_CONFIG, getModuleByPath } from "@/lib/config/modules"
import { ApplicationPortalSidebar } from "./application-portal-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function ApplicationPortalLayout({ children }: AdminLayoutProps) {
  const [currentModule, setCurrentModule] = useState("application-portal")
  const pathname = usePathname()

  useEffect(() => {
    const module = getModuleByPath(pathname)
    if (module) {
      setCurrentModule(module.id)
    }
  }, [pathname])

  const handleModuleSelect = (module: string) => {
    console.log('ApplicationPortalLayout handleModuleSelect called with:', module)
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
        <ApplicationPortalSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
