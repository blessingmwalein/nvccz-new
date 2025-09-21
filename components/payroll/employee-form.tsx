"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employeeFormSchema, EmployeeFormData } from "@/lib/validations/payroll"
import { Employee } from "@/lib/api/payroll-api"
import { User, Building2, CreditCard, DollarSign, AlertCircle } from "lucide-react"

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  editingEmployee?: Employee | null
  loading?: boolean
}

// Mock users data - in real app, this would come from an API
const mockUsers = [
  { id: "cme40ejfb0002uno01jhz7bo8", firstName: "Admin", lastName: "User", email: "admin@nvccz.co.zw" },
  { id: "user2", firstName: "John", lastName: "Doe", email: "john.doe@company.com" },
  { id: "user3", firstName: "Jane", lastName: "Smith", email: "jane.smith@company.com" },
  { id: "user4", firstName: "Mike", lastName: "Johnson", email: "mike.johnson@company.com" }
]

// Mock currencies data
const mockCurrencies = [
  { id: "cmefh5k3m0003un8gyi9sy1zk", code: "USD", name: "United States Dollar", symbol: "$" },
  { id: "currency2", code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" },
  { id: "currency3", code: "EUR", name: "Euro", symbol: "€" }
]

export function EmployeeForm({ isOpen, onClose, onSubmit, editingEmployee, loading }: EmployeeFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeFormSchema),
    defaultValues: editingEmployee ? {
      userId: editingEmployee.userId,
      bankName: editingEmployee.bankName,
      branchCode: editingEmployee.branchCode,
      accountNumber: editingEmployee.accountNumber,
      basicSalary: parseFloat(editingEmployee.basicSalary),
      currencyId: editingEmployee.currencyId
    } : {
      userId: '',
      bankName: '',
      branchCode: '',
      accountNumber: '',
      basicSalary: 0,
      currencyId: 'cmefh5k3m0003un8gyi9sy1zk' // Default to USD
    }
  })

  // Reset form when editingEmployee changes
  useEffect(() => {
    if (editingEmployee) {
      const formData = {
        userId: editingEmployee.userId,
        bankName: editingEmployee.bankName,
        branchCode: editingEmployee.branchCode,
        accountNumber: editingEmployee.accountNumber,
        basicSalary: parseFloat(editingEmployee.basicSalary),
        currencyId: editingEmployee.currencyId
      }
      reset(formData)
    } else {
      reset({
        userId: '',
        bankName: '',
        branchCode: '',
        accountNumber: '',
        basicSalary: 0,
        currencyId: 'cmefh5k3m0003un8gyi9sy1zk'
      })
    }
  }, [editingEmployee, reset])

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit(data)
    if (!editingEmployee) {
      reset()
    }
  }

  const handleClose = () => {
    onClose()
    if (!editingEmployee) {
      reset()
    }
  }

  const selectedUserId = watch('userId')
  const selectedUser = mockUsers.find(user => user.id === selectedUserId)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <User className="w-5 h-5" />
            {editingEmployee ? 'Edit Employee' : 'Create Employee'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingEmployee 
              ? 'Update employee information and payroll details'
              : 'Create a new employee from an existing user account'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              User Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Select User *</Label>
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Choose a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.firstName} {user.lastName}</span>
                              <span className="text-sm text-gray-500">{user.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.userId && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.userId.message}
                  </p>
                )}
              </div>

              {selectedUser && (
                <div className="space-y-2">
                  <Label>Selected User</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="font-medium text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{selectedUser.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Banking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., Standard Bank"
                      className="rounded-full"
                    />
                  )}
                />
                {errors.bankName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchCode">Branch Code *</Label>
                <Controller
                  name="branchCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., 001"
                      className="rounded-full"
                    />
                  )}
                />
                {errors.branchCode && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.branchCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., 1234567890"
                      className="rounded-full"
                    />
                  )}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Salary Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary *</Label>
                <Controller
                  name="basicSalary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2500.00"
                      className="rounded-full"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
                {errors.basicSalary && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.basicSalary.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyId">Currency *</Label>
                <Controller
                  name="currencyId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Select currency..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currency.symbol}</span>
                              <span>{currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currencyId && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.currencyId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
