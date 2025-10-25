"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
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

  const data = [
    { severity: "Critical", count: severityCounts.critical, fill: "hsl(var(--chart-1))" },
    { severity: "High", count: severityCounts.high, fill: "hsl(var(--chart-2))" },
    { severity: "Medium", count: severityCounts.medium, fill: "hsl(var(--chart-3))" },
    { severity: "Low", count: severityCounts.low, fill: "hsl(var(--chart-4))" },
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
            <Bar dataKey="count" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
