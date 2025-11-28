// ============================================================================
// PROCUREMENT DASHBOARD PAGE
// Main dashboard showing procurement statistics
// ============================================================================

'use client'

import React, { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '@/lib/store'
import { fetchDashboard } from '@/lib/store/slices/procurementV2Slice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, ShoppingCart, FileCheck, Package } from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/lib/store'

export default function ProcurementPage() {
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
      approved: 0,
      href: '/procurement/grn',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage requisitions, RFQs, quotations, and purchase orders
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>
                      Pending: <span className="font-semibold text-orange-600">{stat.pending}</span>
                    </span>
                    <span>
                      Approved: <span className="font-semibold text-green-600">{stat.approved}</span>
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common procurement tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/procurement/requisitions?action=create"
              className="block w-full px-4 py-2 text-sm font-medium text-left bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Create New Requisition
            </Link>
            <Link
              href="/procurement/rfq?action=create"
              className="block w-full px-4 py-2 text-sm font-medium text-left border border-input bg-background rounded-md hover:bg-accent transition-colors"
            >
              Send RFQ to Vendors
            </Link>
            <Link
              href="/procurement/purchase-orders?action=create"
              className="block w-full px-4 py-2 text-sm font-medium text-left border border-input bg-background rounded-md hover:bg-accent transition-colors"
            >
              Create Purchase Order
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard.requisitions.pending > 0 && (
              <Link
                href="/procurement/requisitions?tab=pending-approval"
                className="flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              >
                <span>Requisitions</span>
                <span className="font-semibold text-orange-600">{dashboard.requisitions.pending}</span>
              </Link>
            )}
            {dashboard.invoices.pending > 0 && (
              <Link
                href="/procurement/invoices?status=pending"
                className="flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              >
                <span>Invoices</span>
                <span className="font-semibold text-orange-600">{dashboard.invoices.pending}</span>
              </Link>
            )}
            {dashboard.grns.pending > 0 && (
              <Link
                href="/procurement/grn?status=pending"
                className="flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              >
                <span>GRNs</span>
                <span className="font-semibold text-orange-600">{dashboard.grns.pending}</span>
              </Link>
            )}
            {dashboard.requisitions.pending === 0 &&
              dashboard.invoices.pending === 0 &&
              dashboard.grns.pending === 0 && (
                <p className="text-sm text-muted-foreground px-4 py-2">No pending approvals</p>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Manage approval workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/procurement/approval-configs"
              className="block w-full px-4 py-2 text-sm font-medium text-left border border-input bg-background rounded-md hover:bg-accent transition-colors"
            >
              Approval Configurations
            </Link>
            <Link
              href="/admin/users?department=Procurement"
              className="block w-full px-4 py-2 text-sm font-medium text-left border border-input bg-background rounded-md hover:bg-accent transition-colors"
            >
              Manage Users & Roles
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
