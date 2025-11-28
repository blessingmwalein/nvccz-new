
"use client"

import React, { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '@/lib/store'
import { fetchDashboard } from '@/lib/store/slices/procurementV2Slice'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, ShoppingCart, FileCheck, Package, Plus, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/lib/store'

export function ProcurementDashboard() {
  const dispatch = useAppDispatch()
  const { dashboard, dashboardLoading } = useAppSelector((state) => state.procurementV2)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  if (dashboardLoading || !dashboard) {
    return <DashboardSkeleton />
  }

  const stats = [
    {
      title: 'Purchase Requisitions',
      icon: FileText,
      total: dashboard.requisitions.total,
      pending: dashboard.requisitions.pending,
      approved: dashboard.requisitions.approved,
      href: '/procurement/requisitions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Purchase Orders',
      icon: ShoppingCart,
      total: dashboard.purchaseOrders.total,
      pending: dashboard.purchaseOrders.pending,
      approved: dashboard.purchaseOrders.received,
      href: '/procurement/purchase-orders',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Invoices',
      icon: FileCheck,
      total: dashboard.invoices.total,
      pending: dashboard.invoices.pending,
      approved: dashboard.invoices.approved,
      href: '/procurement/invoices',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Goods Received Notes',
      icon: Package,
      total: dashboard.grns.total,
      pending: dashboard.grns.pending,
      // No 'approved' property for grns, so remove or set to 0
      approved: 0,
      href: '/procurement/grns',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procurement Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your procurement activities
          </p>
        </div>
        <Link href="/procurement/requisitions">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Requisition
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="text-yellow-600">
                      {stat.pending} pending
                    </span>
                    <span className="text-green-600">
                      {stat.approved} completed
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common procurement tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/procurement/requisitions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Requisition
              </Button>
            </Link>
            <Link href="/procurement/rfq">
              <Button variant="outline" className="w-full justify-start">
                <FileCheck className="mr-2 h-4 w-4" />
                View RFQs
              </Button>
            </Link>
            <Link href="/procurement/quotations">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Compare Quotations
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Requisitions</span>
                <span className="text-sm font-semibold">
                  {dashboard.requisitions.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Purchase Orders</span>
                <span className="text-sm font-semibold">
                  {dashboard.purchaseOrders.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoices</span>
                <span className="text-sm font-semibold">
                  {dashboard.invoices.pending}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest procurement updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">New requisition created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">PO approved</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">GRN completed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-[300px]" />
          <Skeleton className="h-4 w-[200px] mt-2" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-3 w-[60px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-[160px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
