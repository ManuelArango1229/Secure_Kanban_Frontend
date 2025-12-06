"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import type { Risk } from "@/lib/types"
import { TrendingUp } from "lucide-react"

interface RiskSeverityChartProps {
  risks: Risk[]
}

export function RiskSeverityChart({ risks }: RiskSeverityChartProps) {
  const severityCounts = {
    critical: risks.filter((r) => r.severity === "critical").length,
    high: risks.filter((r) => r.severity === "high").length,
    medium: risks.filter((r) => r.severity === "medium").length,
    low: risks.filter((r) => r.severity === "low").length,
  }

  // Colores igual que RiskStatusChart
  const severityColors = {
    Critical: "#ef4444",      // rojo (Identified)
    High: "#3b82f6",         // azul (In Progress)
    Medium: "#22c55e",       // verde (Mitigated)
    Low: "#f59e42",          // naranja (Accepted)
  }
  const data = [
    { severity: "Critical", count: severityCounts.critical },
    { severity: "High", count: severityCounts.high },
    { severity: "Medium", count: severityCounts.medium },
    { severity: "Low", count: severityCounts.low },
  ]

  return (
    <Card className="dark:gradient-card dark:border-primary/20 glow-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Risk Distribution by Severity
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardTitle>
            <CardDescription>Breakdown of vulnerabilities by severity level</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Count",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data}>
            <XAxis dataKey="severity" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[12, 12, 0, 0]}>
              {data.map((entry, idx) => {
                const key = entry.severity.charAt(0).toUpperCase() + entry.severity.slice(1).toLowerCase();
                return (
                  <Cell key={`cell-${idx}`} fill={severityColors[key as keyof typeof severityColors]} />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
