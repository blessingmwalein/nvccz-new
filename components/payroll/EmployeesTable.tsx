"use client"

import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CiUser, CiWallet } from "react-icons/ci"

export function EmployeesTable() {
  const { employees, groups } = useAppSelector(s => s.payroll)

  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          <CiUser className="w-5 h-5" /> Employees
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(emp => {
                const grp = groups.find(g => g.id === emp.employment.payGroupId)
                return (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.employment.jobTitle}</TableCell>
                    <TableCell>{grp?.name}</TableCell>
                    <TableCell>{emp.banking.bankName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-full">View</Button>
                        <Button size="sm" variant="outline" className="rounded-full">Actions</Button>
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


