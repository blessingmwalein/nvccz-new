import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBankReconciliationAuditTrail } from "@/lib/store/slices/accountingSlice"

export function BankReconciliationAuditTrail() {
  const dispatch = useDispatch()
  const { selectedBankReconciliation, bankReconciliationAuditTrail } = useSelector((state: any) => state.accounting)

  useEffect(() => {
    if (selectedBankReconciliation?.id) {
      dispatch(fetchBankReconciliationAuditTrail(selectedBankReconciliation.id))
    }
  }, [dispatch, selectedBankReconciliation?.id])

  // ...render audit trail table...
  return (
    <div>
      {/* Table of audit trail events */}
      {/* <DataTable data={bankReconciliationAuditTrail} ... /> */}
    </div>
  )
}
