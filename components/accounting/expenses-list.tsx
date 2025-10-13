"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Eye,
  Edit,
  Trash2,
  Building,
  Calendar,
  DollarSign,
  Receipt,
  Tag
} from "lucide-react"
import { Expense } from "@/lib/api/accounting-api"

interface ExpensesListProps {
  expenses: Expense[]
  loading: boolean
  onViewExpense: (expense: Expense) => void
  activeTab: string
}

export function ExpensesList({ expenses, loading, onViewExpense, activeTab }: ExpensesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'POSTED':
        return 'bg-green-100 text-green-800'
      case 'VOID':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'bg-yellow-100 text-yellow-800'
      case 'BANK':
        return 'bg-blue-100 text-blue-800'
      case 'CARD':
        return 'bg-purple-100 text-purple-800'
      case 'CHEQUE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {activeTab !== 'all' ? activeTab : ''} expenses found
        </h3>
        <p className="text-gray-500">
          {activeTab === 'all' 
            ? 'Start by creating your first expense.' 
            : `No ${activeTab} expenses available.`
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4 flex-1">
            {/* Vendor Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {getInitials(expense.vendor?.name || 'UN')}
              </AvatarFallback>
            </Avatar>

            {/* Expense Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-lg">{expense.description}</h4>
                <Badge className={getStatusColor(expense.status)}>
                  {expense.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{expense.vendor?.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{expense.category?.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(expense.transactionDate).toLocaleDateString()}</span>
                </div>

                {expense.receiptNumber && (
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <span>{expense.receiptNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount & Payment Method */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-lg font-semibold">
                  {expense.currency?.symbol}{expense.totalAmount || expense.amount}
                </span>
              </div>
              
              <Badge variant="outline" className={getPaymentMethodColor(expense.paymentMethod)}>
                {expense.paymentMethod}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewExpense(expense)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm" 
              className="hover:bg-green-50 hover:text-green-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}