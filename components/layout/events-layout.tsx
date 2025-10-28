"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SharedTopbar } from "./shared-topbar"
import { PerformanceSidebar } from "./performance-sidebar"
import { MODULE_CONFIG, getModuleByPath } from "@/lib/config/modules"
import { EventsSidebar } from "./events-sidebar"

interface EventsLayoutProps {
  children: React.ReactNode
}

export function EventsLayout({ children }: EventsLayoutProps) {
  const [currentModule, setCurrentModule] = useState("events-management")
  const pathname = usePathname()

  useEffect(() => {
    const module = getModuleByPath(pathname)
    if (module) {
      setCurrentModule(module.id)
    }
  }, [pathname])

  const handleModuleSelect = (module: string) => {
    console.log('EventsLayout handleModuleSelect called with:', module)
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
        <EventsSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
