"use client"
import { useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { BankReconciliationRecords } from "./bank-reconciliation-records"
import { BankReconciliationAuditTrail } from "./bank-reconciliation-audit-trail"
import { BankReconciliationUploadModal } from "./bank-reconciliation-upload-modal"

export function BankReconciliationManagement() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("records")

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
        <button className="btn btn-primary" onClick={() => setUploadModalOpen(true)}>
          Upload Statement
        </button>
      </div>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="records">Reconciliation Records</Tabs.Trigger>
          <Tabs.Trigger value="audit">Audit Trail</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="records">
          <BankReconciliationRecords />
        </Tabs.Content>
        <Tabs.Content value="audit">
          <BankReconciliationAuditTrail />
        </Tabs.Content>
      </Tabs.Root>
      <BankReconciliationUploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  )
}
