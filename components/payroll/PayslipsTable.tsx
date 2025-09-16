"use client"

import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CiFileOn } from "react-icons/ci"

export function PayslipsTable() {
  const { payslips, employees } = useAppSelector(s => s.payroll)

  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          <CiFileOn className="w-5 h-5" /> Payslips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payslip</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map(ps => {
                const emp = employees.find(e => e.id === ps.employeeId)
                return (
                  <TableRow key={ps.id}>
                    <TableCell>{ps.id}</TableCell>
                    <TableCell>{emp?.firstName} {emp?.lastName}</TableCell>
                    <TableCell>${ps.totals.gross.toLocaleString()}</TableCell>
                    <TableCell>${ps.totals.netPay.toLocaleString()}</TableCell>
                    <TableCell>{ps.currencyId}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-full">View</Button>
                        <Button size="sm" variant="outline" className="rounded-full">Download</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


