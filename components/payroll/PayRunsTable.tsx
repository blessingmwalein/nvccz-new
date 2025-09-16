"use client"

import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CiCalendar } from "react-icons/ci"

export function PayRunsTable() {
  const { payRuns, groups } = useAppSelector(s => s.payroll)

  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          <CiCalendar className="w-5 h-5" /> Pay Runs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payRuns.map(run => {
                const grp = groups.find(g => g.id === run.payGroupId)
                return (
                  <TableRow key={run.id}>
                    <TableCell>{run.name}</TableCell>
                    <TableCell>{grp?.name}</TableCell>
                    <TableCell>{run.periodStart} → {run.periodEnd}</TableCell>
                    <TableCell>{run.payoutDate}</TableCell>
                    <TableCell>{run.status}</TableCell>
                    <TableCell>${run.statistics.grossTotal.toLocaleString()}</TableCell>
                    <TableCell>${run.statistics.netTotal.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-full">Open</Button>
                        <Button size="sm" variant="outline" className="rounded-full">Post</Button>
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


