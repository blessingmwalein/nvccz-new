"use client"

import { ReactNode } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProcurementDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
}

export function ProcurementDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "lg",
  showCloseButton = true
}: ProcurementDrawerProps) {
  const sizeClasses = {
    sm: "max-w-[50%]",
    md: "max-w-[50%]", 
    lg: "max-w-[50%]",
    xl: "max-w-[50%]"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={`!${sizeClasses[size]} overflow-y-auto`}
      >
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-semibold text-gray-900">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-sm text-gray-600">
                  {description}
                </SheetDescription>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="mt-6 p-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
