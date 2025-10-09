"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RichDataTable } from "@/components/payroll/rich-data-table"
import { Plus, Wallet } from "lucide-react"
import { fundsApi, type Fund } from "@/lib/api/funds-api"
import { FundCreateModal } from "./fund-create-modal"
import { toast } from "sonner"

export function FundsTable() {
  const [items, setItems] = useState<Fund[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const loadFunds = async () => {
    try {
      setLoading(true)
      const res = await fundsApi.getAll()
      setItems(res.data.funds || [])
    } catch (e: any) {
      toast.error("Failed to load funds", { description: e?.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFunds() }, [])

  const columns = [
    { key: 'name' as keyof Fund, label: 'Name', sortable: true },
    { key: 'description' as keyof Fund, label: 'Description', sortable: false, width: 'w-[30%]' },
    { key: 'totalAmount' as keyof Fund, label: 'Total', sortable: true, render: (v: string) => `$${Number(v).toLocaleString()}` },
    { key: 'remainingAmount' as keyof Fund, label: 'Remaining', sortable: true, render: (v: string) => `$${Number(v).toLocaleString()}` },
    { key: 'minInvestment' as keyof Fund, label: 'Min Inv.', sortable: true, render: (v: string) => `$${Number(v).toLocaleString()}` },
    { key: 'maxInvestment' as keyof Fund, label: 'Max Inv.', sortable: true, render: (v: string) => `$${Number(v).toLocaleString()}` },
    { key: 'status' as keyof Fund, label: 'Status', sortable: true, filterable: true, render: (v: Fund['status']) => (
      <Badge variant={v === 'OPEN' ? 'default' : 'secondary'}>{v}</Badge>
    ) },
    { key: 'applicationStart' as keyof Fund, label: 'App. Start', sortable: true, render: (v: string) => new Date(v).toLocaleString() },
    { key: 'applicationEnd' as keyof Fund, label: 'App. End', sortable: true, render: (v: string) => new Date(v).toLocaleString() },
  ]

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'OPEN', label: 'OPEN' },
    { value: 'CLOSED', label: 'CLOSED' },
    { value: 'PAUSED', label: 'PAUSED' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-gray-900 flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            Fund Management
          </h1>
          <p className="text-gray-600 mt-1">View, filter and create funds</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="rounded-full gradient-primary text-white font-normal">
          <Plus className="w-4 h-4 mr-2" />
          Create Fund
        </Button>
      </div>

      <RichDataTable<Fund>
        data={items}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        searchPlaceholder="Search funds by name, description or industry..."
        title="Funds"
      />

      <FundCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadFunds}
      />
    </div>
  )
}
