"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, DollarSign, Plus, Trash2, Building2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { procurementApi, CreateRequisitionRequest } from "@/lib/api/procurement-api"
import { departmentApiService, Department } from "@/lib/api/department-api"
import { accountingApi, Currency } from "@/lib/api/accounting-api"

interface CreateRequisitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface RequisitionItem {
  itemName: string
  description: string
  quantity: number
  unitPrice: number
  unit: string
  preferredVendorId?: string
}


export function CreateRequisitionModal({ isOpen, onClose, onSuccess }: CreateRequisitionModalProps) {
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  const [formData, setFormData] = useState<CreateRequisitionRequest>({
    title: '',
    description: '',
    departmentId: '',
    priority: 'MEDIUM',
    justification: '',
    currencyId: '',
    items: [{
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pcs',
      preferredVendorId: ''
    }]
  })

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      
      // Load departments
      const deptResponse = await departmentApiService.getDepartments({ isActive: true })
      if (deptResponse.success && deptResponse.departments) {
        setDepartments(deptResponse.departments)
      }

      // Load currencies
      const currResponse = await accountingApi.currencies.getAll()
      if (currResponse.success && currResponse.data) {
        setCurrencies(currResponse.data)
        // Set default currency
        const defaultCurrency = currResponse.data.find(c => c.isDefault) || currResponse.data[0]
        if (defaultCurrency) {
          setFormData(prev => ({ ...prev, currencyId: defaultCurrency.id }))
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        itemName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        unit: 'pieces'
      }]
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const updateItem = (index: number, field: keyof RequisitionItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0)
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return
    }

    if (!formData.departmentId) {
      toast.error('Please select a department')
      return
    }

    if (!formData.justification.trim()) {
      toast.error('Please provide justification')
      return
    }

    // Validate items
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]
      if (!item.itemName.trim()) {
        toast.error(`Please enter item name for item ${i + 1}`)
        return
      }
      if (item.quantity <= 0) {
        toast.error(`Please enter valid quantity for item ${i + 1}`)
        return
      }
      if (item.unitPrice <= 0) {
        toast.error(`Please enter valid unit price for item ${i + 1}`)
        return
      }
    }

    try {
      setLoading(true)
      await procurementApi.createRequisition(formData)
      toast.success('Purchase requisition created successfully')
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        departmentId: '',
        priority: 'MEDIUM',
        justification: '',
        currencyId: 'usd',
        items: [{
          itemName: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          unit: 'pieces'
        }]
      })
    } catch (error: any) {
      toast.error('Failed to create requisition', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const selectedCurrency = currencies.find(c => c.id === formData.currencyId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <FileText className="w-5 h-5" />
            Create Purchase Requisition
          </DialogTitle>
          <p className="text-gray-600">
            Create a new purchase requisition for approval
          </p>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Basic Information</h3>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Requisition Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter requisition title..."
                      className="rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => 
                        setFormData(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter detailed description..."
                    rows={3}
                    className="rounded-lg"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department & Currency */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Department & Currency</h3>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departmentId">Department *</Label>
                    <Select 
                      value={formData.departmentId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
                      disabled={loadingData}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder={loadingData ? "Loading departments..." : "Select department"} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {dept.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencyId">Currency *</Label>
                    <Select 
                      value={formData.currencyId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currencyId: value }))}
                      disabled={loadingData}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder={loadingData ? "Loading currencies..." : "Select currency"} />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              {currency.code} - {currency.name} ({currency.symbol})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Justification */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Justification</h3>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-500" />
                  Business Justification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="justification">Justification *</Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                    placeholder="Provide business justification for this requisition..."
                    rows={4}
                    className="rounded-lg"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-normal text-gray-900">Requisition Items</h3>
              <Button
                type="button"
                onClick={addItem}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  Items & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Item Name *</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                          placeholder="Enter item name..."
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select 
                          value={item.unit} 
                          onValueChange={(value) => updateItem(index, 'unit', value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="reams">Reams</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="meters">Meters</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price ({selectedCurrency?.symbol}) *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Enter item description..."
                        rows={2}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <div className="text-right">
                        <Label className="text-sm text-gray-500">Item Total</Label>
                        <p className="text-lg font-medium">
                          {selectedCurrency?.symbol}{(item.quantity * item.unitPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-end">
                  <div className="text-right">
                    <Label className="text-base text-gray-700">Grand Total</Label>
                    <p className="text-2xl font-bold text-amber-600">
                      {selectedCurrency?.symbol}{calculateTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full"
          >
            {loading ? 'Creating...' : 'Create Requisition'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
