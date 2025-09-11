"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { 
  CiHome, 
  CiShop, 
  CiFileOn, 
  CiWallet, 
  CiUser
} from "react-icons/ci"

interface AppSwitcherProps {
  isOpen: boolean
  onClose: () => void
  onModuleSelect: (module: string) => void
  currentModule: string
}

const modules = [
  {
    id: "homepage",
    name: "Homepage",
    icon: CiHome,
    color: "oklch(0.60 0.18 252)", // Primary blue
  },
  {
    id: "portfolio-management",
    name: "Portfolio Management",
    icon: CiShop,
    color: "oklch(0.72 0.12 225)", // Light blue
  },
  {
    id: "performance-management",
    name: "Performance Management",
    icon: CiShop,
    color: "oklch(0.58 0.09 260)", // Dark blue
  },
  {
    id: "applications",
    name: "Applications",
    icon: CiFileOn,
    color: "oklch(0.78 0.12 190)", // Cyan
  },
  {
    id: "companies",
    name: "Companies",
    icon: CiShop,
    color: "oklch(0.54 0.1 280)", // Purple
  },
  {
    id: "funds",
    name: "Funds",
    icon: CiWallet,
    color: "oklch(0.64 0.18 252)", // Primary blue
  },
  {
    id: "account-performance",
    name: "Account & Performance",
    icon: CiUser,
    color: "oklch(0.72 0.12 225)", // Light blue
  },
]

export function AppSwitcher({ isOpen, onClose, onModuleSelect, currentModule }: AppSwitcherProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="w-[80vw] max-w-9xl" hideCloseButton>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">Select Module</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-muted/60 hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-foreground/70" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-8 p-8">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = currentModule === module.id

            return (
              <Button
                key={module.id}
                variant="ghost"
                className={`h-auto p-6 flex flex-col items-center gap-5 hover:bg-accent transition-all duration-200 ${
                  isActive ? "bg-accent border-2 border-primary shadow-lg" : ""
                }`}
                onClick={() => onModuleSelect(module.id)}
              >
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: module.color }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg leading-tight text-foreground/90 whitespace-normal text-center">
                    {module.name}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}