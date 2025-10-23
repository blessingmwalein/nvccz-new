import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBankReconciliations, fetchBankReconciliationSummary } from "@/lib/store/slices/accountingSlice"
// ...import DataTable, Drawer, etc...

export function BankReconciliationRecords() {
  const dispatch = useDispatch()
  const { bankReconciliations, bankReconciliationSummary, bankReconciliationLoading } = useSelector((state: any) => state.accounting)

  useEffect(() => {
    dispatch(fetchBankReconciliations())
    dispatch(fetchBankReconciliationSummary())
  }, [dispatch])

  // ...render stats cards, data table, drawer/modal for details...
  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Example card */}
        <div className="card">
          <div className="card-title">Total Reconciliations</div>
          <div className="card-value">{bankReconciliationSummary?.totalReconciliations ?? 0}</div>
        </div>
        {/* ...other cards for completed, pending, failed, matched, unmatched, etc... */}
      </div>
      {/* Data table for records */}
      {/* <DataTable data={bankReconciliations} ... /> */}
      {/* Drawer/modal for viewing/editing a reconciliation */}
    </div>
  )
}
