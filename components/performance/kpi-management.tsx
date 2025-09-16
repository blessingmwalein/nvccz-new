"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addKPI, 
  updateKPI, 
  removeKPI,
  setSelectedCategory,
  setSearchTerm 
} from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Target,
  Edit,
  Trash2,
  Search,
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { toast } from "sonner"

export function KPIManagement() {
  const dispatch = useAppDispatch()
  const { kpis, selectedCategory, searchTerm } = useAppSelector((state) => state.performance)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKPI, setEditingKPI] = useState<any>(null)

  const filteredKPIs = kpis.filter(kpi => {
    const matchesCategory = selectedCategory === "all" || kpi.category === selectedCategory
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCreateKPI = async (kpiData: any) => {
    try {
      const newKPI = await performanceAPI.createKPI(kpiData)
      dispatch(addKPI(newKPI))
      toast.success("KPI created successfully")
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to create KPI")
    }
  }

  const handleUpdateKPI = async (id: string, updates: any) => {
    try {
      const updatedKPI = await performanceAPI.updateKPI(id, updates)
      dispatch(updateKPI({ id, updates: updatedKPI }))
      toast.success("KPI updated successfully")
      setIsDialogOpen(false)
      setEditingKPI(null)
    } catch (error) {
      toast.error("Failed to update KPI")
    }
  }

  const handleDeleteKPI = async (id: string) => {
    try {
      await performanceAPI.deleteKPI(id)
      dispatch(removeKPI(id))
      toast.success("KPI deleted successfully")
    } catch (error) {
      toast.error("Failed to delete KPI")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-100 text-blue-800'
      case 'financial': return 'bg-green-100 text-green-800'
      case 'operational': return 'bg-orange-100 text-orange-800'
      case 'investment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800'
      case 'weekly': return 'bg-orange-100 text-orange-800'
      case 'monthly': return 'bg-blue-100 text-blue-800'
      case 'quarterly': return 'bg-green-100 text-green-800'
      case 'yearly': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">KPI Management</h1>
          <p className="text-gray-600 font-normal">Create and manage key performance indicators</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl md:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingKPI ? "Edit KPI" : "Create New KPI"}
              </DialogTitle>
            </DialogHeader>
            <KPIModal 
              kpi={editingKPI}
              onSave={editingKPI ? 
                (updates) => handleUpdateKPI(editingKPI.id, updates) : 
                handleCreateKPI
              }
              onClose={() => {
                setIsDialogOpen(false)
                setEditingKPI(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={(value) => dispatch(setSelectedCategory(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.map((kpi) => (
          <Card key={kpi.id} className="bg-white border border-gray-200 rounded-2xl shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{kpi.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-9 h-9 p-0 gradient-primary text-white"
                    onClick={() => setEditingKPI(kpi)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-9 h-9 p-0 gradient-primary text-white"
                    onClick={() => handleDeleteKPI(kpi.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(kpi.category)}>
                  {kpi.category}
                </Badge>
                <Badge className={getFrequencyColor(kpi.frequency)}>
                  {kpi.frequency}
                </Badge>
                <Badge variant={kpi.isActive ? "default" : "secondary"}>
                  {kpi.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{kpi.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current: {kpi.currentValue}{kpi.unit}</span>
                  <span>Target: {kpi.targetValue}{kpi.unit}</span>
                </div>
                
                <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${(kpi.currentValue / kpi.targetValue) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {kpi.currentValue >= kpi.targetValue ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={kpi.currentValue >= kpi.targetValue ? "text-green-600" : "text-red-600"}>
                      {kpi.currentValue >= kpi.targetValue ? "On Track" : "Behind Target"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Weight: {(kpi.weightValue * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredKPIs.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No KPIs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first KPI"
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="rounded-full gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add KPI
          </Button>
        </div>
      )}
    </div>
  )
}

// KPI Modal Component
function KPIModal({ kpi, onSave, onClose }: { 
  kpi?: any, 
  onSave: (data: any) => void, 
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    name: kpi?.name || "",
    description: kpi?.description || "",
    type: kpi?.type || "Percentage",
    unit: kpi?.unit || "%",
    targetValue: kpi?.targetValue || 0,
    currentValue: kpi?.currentValue || 0,
    category: kpi?.category || "sales",
    frequency: kpi?.frequency || "monthly",
    departmentId: kpi?.departmentId || "",
    weightValue: kpi?.weightValue || 0.1,
    isActive: kpi?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="KPI Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Percentage">Percentage</SelectItem>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="Currency">Currency</SelectItem>
              <SelectItem value="Ratio">Ratio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="KPI Description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Unit"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Target Value</Label>
          <Input
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) })}
            placeholder="Target"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Current Value</Label>
          <Input
            type="number"
            value={formData.currentValue}
            onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
            placeholder="Current"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Weight Value</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={formData.weightValue}
            onChange={(e) => setFormData({ ...formData, weightValue: parseFloat(e.target.value) })}
            placeholder="0.1"
            required
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="gradient-primary text-white">
          {kpi ? "Update KPI" : "Create KPI"}
        </Button>
      </div>
    </form>
  )
}
