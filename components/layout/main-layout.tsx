"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Topbar } from "./topbar"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [currentModule, setCurrentModule] = useState("homepage")
  const [activeItem, setActiveItem] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname.startsWith("/portfolio")) {
      setCurrentModule("portfolio-management")
    } else if (pathname.startsWith("/applications")) {
      setCurrentModule("applications")
    } else if (pathname.startsWith("/companies")) {
      setCurrentModule("companies")
    } else if (pathname.startsWith("/funds")) {
      setCurrentModule("funds")
    } else if (pathname.startsWith("/account")) {
      setCurrentModule("account-performance")
    } else {
      setCurrentModule("homepage")
    }
  }, [pathname])

  const handleModuleSelect = (module: string) => {
    console.log('handleModuleSelect called with:', module)
    setCurrentModule(module)
    setActiveItem("") // Reset active item when switching modules
    
    // Navigate to the main dashboard page of each module
    let targetPath = "/"
    
    switch (module) {
      case "homepage":
        targetPath = "/"
        break
      case "portfolio-management":
        targetPath = "/portfolio"
        break
      case "applications":
        targetPath = "/applications"
        break
      case "companies":
        targetPath = "/companies"
        break
      case "funds":
        targetPath = "/funds"
        break
      case "account-performance":
        targetPath = "/account"
        break
      default:
        targetPath = "/"
    }
    
    console.log('Navigating to:', targetPath)
    window.location.href = targetPath;

    
    // Try router.push first, fallback to window.location if needed
    
  }

  const isHomePage = pathname === "/"

  return (
    <div className="min-h-screen bg-background">
      <Topbar onModuleSelect={handleModuleSelect} currentModule={currentModule} />

      <div className="flex">
        {!isHomePage && (
          <Sidebar currentModule={currentModule} activeItem={activeItem} onItemSelect={setActiveItem} />
        )}

        <main className={`${isHomePage ? 'w-full' : 'flex-1'} overflow-auto`}>{children}</main>
      </div>
    </div>
  )
}
