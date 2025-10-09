"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  Calendar,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Package,
  Receipt,
  Truck
} from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { procurementApi, PurchaseRequisition, PurchaseOrder, ProcurementInvoice, GoodsReceivedNote } from "@/lib/api/procurement-api"
import { 
  setRequisitions, 
  setPurchaseOrders, 
  setInvoices, 
  setGoodsReceivedNotes,
  setRequisitionsLoading,
  setPurchaseOrdersLoading,
  setInvoicesLoading,
  setGRNLoading
} from "@/lib/store/slices/procurementSlice"

export function ProcurementDashboard() {
  const dispatch = useAppDispatch()
  const { 
    requisitions, 
    purchaseOrders, 
    invoices, 
    goodsReceivedNotes,
    requisitionsLoading,
    purchaseOrdersLoading,
    invoicesLoading,
    grnLoading
  } = useAppSelector(state => state.procurement)
  
  const [timeRange, setTimeRange] = useState("30d")
  const [error, setError] = useState<string | null>(null)

  const loading = requisitionsLoading || purchaseOrdersLoading || invoicesLoading || grnLoading

  useEffect(() => {
    fetchAllData()
  }, [timeRange])

  const fetchAllData = async () => {
    try {
      setError(null)
      
      // Fetch all procurement data in parallel
      const [reqResponse, poResponse, invResponse, grnResponse] = await Promise.all([
        procurementApi.getRequisitions().catch(() => ({ success: false, data: [] })),
        procurementApi.getPurchaseOrders().catch(() => ({ success: false, data: [] })),
        procurementApi.getInvoices().catch(() => ({ success: false, data: [] })),
        procurementApi.getGoodsReceivedNotes().catch(() => ({ success: false, data: [] }))
      ])

      if (reqResponse.success) dispatch(setRequisitions(reqResponse.data))
      if (poResponse.success) dispatch(setPurchaseOrders(poResponse.data))
      if (invResponse.success) dispatch(setInvoices(invResponse.data))
      if (grnResponse.success) dispatch(setGoodsReceivedNotes(grnResponse.data))
      
    } catch (err: any) {
      setError("Failed to fetch procurement data.")
      console.error(err)
    }
  }

  // Calculate comprehensive metrics
  const totalRequisitions = requisitions.length
  const totalPurchaseOrders = purchaseOrders.length
  const totalInvoices = invoices.length
  const totalGRNs = goodsReceivedNotes.length

  // Requisition metrics
  const pendingApproval = requisitions.filter(r => r.status === 'PENDING_APPROVAL').length
  const approved = requisitions.filter(r => r.status === 'APPROVED').length
  const draft = requisitions.filter(r => r.status === 'DRAFT').length
  const rejected = requisitions.filter(r => r.status === 'REJECTED').length
  const totalReqValue = requisitions.reduce((sum, r) => sum + parseFloat(r.totalAmount || '0'), 0)
  const approvalRate = totalRequisitions > 0 ? (approved / totalRequisitions * 100).toFixed(1) : "0"

  // Purchase Order metrics
  const poSent = purchaseOrders.filter(po => po.status === 'SENT').length
  const poReceived = purchaseOrders.filter(po => po.status === 'RECEIVED').length
  const totalPOValue = purchaseOrders.reduce((sum, po) => sum + parseFloat(po.totalAmount || '0'), 0)

  // Invoice metrics
  const invoicesMatched = invoices.filter(inv => inv.matchingStatus === 'MATCHED').length
  const invoicesDiscrepancy = invoices.filter(inv => inv.matchingStatus === 'DISCREPANCY').length
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || '0'), 0)

  // GRN metrics
  const grnApproved = goodsReceivedNotes.filter(grn => grn.status === 'APPROVED').length
  const grnPending = goodsReceivedNotes.filter(grn => grn.status === 'PENDING_APPROVAL').length

  // Data for charts
  const statusData = [
    { name: 'Draft', value: draft, color: '#6B7280' },
    { name: 'Pending', value: pendingApproval, color: '#F59E0B' },
    { name: 'Approved', value: approved, color: '#10B981' },
    { name: 'Rejected', value: rejected, color: '#EF4444' }
  ]

  const procurementOverview = [
    { name: 'Requisitions', value: totalRequisitions, amount: totalReqValue },
    { name: 'Purchase Orders', value: totalPurchaseOrders, amount: totalPOValue },
    { name: 'Invoices', value: totalInvoices, amount: totalInvoiceValue },
    { name: 'GRNs', value: totalGRNs, amount: 0 }
  ]

  const monthlyData = [
    { month: 'Jan', requisitions: 45, orders: 38, invoices: 42, value: 125000 },
    { month: 'Feb', requisitions: 52, orders: 45, invoices: 48, value: 145000 },
    { month: 'Mar', requisitions: 48, orders: 42, invoices: 45, value: 135000 },
    { month: 'Apr', requisitions: 61, orders: 55, invoices: 58, value: 165000 },
    { month: 'May', requisitions: 55, orders: 48, invoices: 52, value: 155000 },
    { month: 'Jun', requisitions: 67, orders: 62, invoices: 65, value: 185000 }
  ]

  const totalValue = totalReqValue + totalPOValue + totalInvoiceValue

  const procurementMetrics = [
    {
      title: "Total Procurement Value",
      value: `$${totalValue.toLocaleString()}`,
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Requisitions",
      value: totalRequisitions.toString(),
      change: `${approvalRate}% approved`,
      trend: "up",
      icon: FileText,
    },
    {
      title: "Purchase Orders",
      value: totalPurchaseOrders.toString(),
      change: `${poReceived}/${totalPurchaseOrders} received`,
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Invoice Matching",
      value: `${invoicesMatched}/${totalInvoices}`,
      change: `${invoicesDiscrepancy} discrepancies`,
      trend: invoicesDiscrepancy > 0 ? "down" : "up",
      icon: Receipt,
    },
    {
      title: "Approval Rate",
      value: `${approvalRate}%`,
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Requisitions",
      value: totalRequisitions.toString(),
      change: `+${pendingApproval}`,
      trend: "up",
      icon: FileText,
    },
    {
      title: "Avg Processing Time",
      value: "3.2 days",
      change: "-0.8 days",
      trend: "up",
      icon: Clock,
    },
  ]

  if (loading) return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Procurement Overview</h1>
          <p className="text-muted-foreground">Comprehensive view of your procurement operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Q4 2024
          </Button>
          <Button className="gradient-primary text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {procurementMetrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === "up"

          return (
            <Card key={index} className={`border border-gray-200 hover:border-gray-300 transition-all duration-300 ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.title}</CardTitle>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-white/20' : 'gradient-primary'}`}>
                  <Icon className={`h-4 w-4 ${index % 2 === 0 ? 'text-white' : 'text-white'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${index % 2 === 0 ? 'text-white' : 'text-gray-900'}`}>{metric.value}</div>
                <div className={`flex items-center gap-1 ${index % 2 === 0 ? 'text-white/80' : 'text-gray-600'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span className="text-xs">{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Requisition Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${((entry.value / statusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Procurement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requisitions" fill="#3B82F6" name="Requisitions" />
                  <Bar dataKey="value" fill="#10B981" name="Value ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Requisitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requisitions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requisitions found. Create your first purchase requisition to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {requisitions.slice(0, 5).map((requisition) => (
                <div key={requisition.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{requisition.title}</h4>
                      <p className="text-sm text-gray-600">{requisition.requisitionNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      requisition.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800'
                        : requisition.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : requisition.status === 'DRAFT'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }>
                      {requisition.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">${parseFloat(requisition.totalAmount).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
