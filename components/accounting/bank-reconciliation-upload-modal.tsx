import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { uploadBankReconciliationFile } from "@/lib/store/slices/accounting-slice"

export function BankReconciliationUploadModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const dispatch = useDispatch()
  const { bankReconciliationUploadLoading, bankReconciliationUploadError } = useSelector((state: any) => state.accounting)

  const handleUpload = () => {
    if (file) {
      dispatch(uploadBankReconciliationFile(file))
      onClose()
    }
  }

  if (!open) return null
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Upload Bank Statement</h2>
        <input type="file" accept=".csv,.xls,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
        {bankReconciliationUploadError && <div className="text-red-500">{bankReconciliationUploadError}</div>}
        <div className="flex justify-end mt-4">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary ml-2" onClick={handleUpload} disabled={bankReconciliationUploadLoading || !file}>
            {bankReconciliationUploadLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}
