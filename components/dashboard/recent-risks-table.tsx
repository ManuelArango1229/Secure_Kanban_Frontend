import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Risk } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecentRisksTableProps {
  risks: Risk[]
}

const severityConfig = {
  critical: { color: "bg-red-500", label: "Critical", textColor: "text-red-500" },
  high: { color: "bg-orange-500", label: "High", textColor: "text-orange-500" },
  medium: { color: "bg-yellow-500", label: "Medium", textColor: "text-yellow-500" },
  low: { color: "bg-blue-500", label: "Low", textColor: "text-blue-500" },
}

const statusLabels = {
  identified: "Identified",
  in_progress: "In Progress",
  mitigated: "Mitigated",
  accepted: "Accepted",
}

export function RecentRisksTable({ risks }: RecentRisksTableProps) {
  const recentRisks = risks.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Risks</CardTitle>
        <CardDescription>Latest identified security vulnerabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CVSS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRisks.map((risk) => {
              const severity = severityConfig[risk.severity]
              return (
                <TableRow key={risk.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", severity.color)} />
                      <span className="font-medium">{risk.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(severity.textColor)}>
                      {severity.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{statusLabels[risk.status]}</Badge>
                  </TableCell>
                  <TableCell>{risk.cvss_score ? risk.cvss_score.toFixed(1) : "N/A"}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
