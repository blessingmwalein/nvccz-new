"use client"

import type React from "react"
import { ModuleLayout } from "./module-layout"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return <ModuleLayout>{children}</ModuleLayout>
}
