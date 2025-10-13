"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Tag, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  Folder,
  FolderOpen,
  Users
} from "lucide-react"
import { ExpenseCategory } from "@/lib/api/accounting-api"

interface ViewExpenseCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: ExpenseCategory | null
}

export function ViewExpenseCategoryModal({ isOpen, onClose, category }: ViewExpenseCategoryModalProps) {
  if (!category) return null

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = () => {
    if (category.parentId) {
      return <Folder className="w-4 h-4 text-yellow-500" />
    }
    return <FolderOpen className="w-4 h-4 text-yellow-600" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span>{category.name}</span>
                {getCategoryIcon()}
              </div>
              <p className="text-sm text-gray-500 font-normal">Expense Category Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Category Name & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category Name</p>
                <p className="font-semibold text-gray-900 text-lg">{category.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getCategoryIcon()}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type</p>
                <Badge variant="outline" className={category.parentId ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                  {category.parentId ? "Subcategory" : "Parent Category"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          {category.description && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-900 leading-relaxed">{category.description}</p>
              </div>
            </div>
          )}

          {/* Row 3: Parent Category & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FolderOpen className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Parent Category</p>
                <p className="font-medium text-gray-900">
                  {category.parent ? (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {category.parent.name}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">Top Level</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getStatusIcon(category.isActive)}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <Badge className={getStatusColor(category.isActive)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(category.isActive)}
                    {category.isActive ? 'Active' : 'Inactive'}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 4: Subcategories & Expenses Count */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Folder className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Subcategories</p>
                <p className="text-sm font-medium text-gray-900">
                  {category.children?.length || 0} subcategories
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Expenses</p>
                <p className="text-sm font-medium text-gray-900">
                  {category.expenses?.length || 0} expenses
                </p>
              </div>
            </div>
          </div>

          {/* Row 5: Created & Last Updated */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(category.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(category.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(category.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Row 6: Subcategories List (if any) */}
          {category.children && category.children.length > 0 && (
            <div className="flex items-start gap-3">
              <Folder className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Subcategories</p>
                <div className="flex flex-wrap gap-2">
                  {category.children.map((child) => (
                    <Badge key={child.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {child.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}