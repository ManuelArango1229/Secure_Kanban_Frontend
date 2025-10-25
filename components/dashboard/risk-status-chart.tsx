"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart } from "recharts"
import type { Risk } from "@/lib/types"
import { Activity } from "lucide-react"

interface RiskStatusChartProps {
  risks: Risk[]
}

export function RiskStatusChart({ risks }: RiskStatusChartProps) {
  const statusCounts = {
    identified: risks.filter((r) => r.status === "identified").length,
    in_progress: risks.filter((r) => r.status === "in_progress").length,
    mitigated: risks.filter((r) => r.status === "mitigated").length,
    accepted: risks.filter((r) => r.status === "accepted").length,
  }

  const data = [
    { name: "Identified", value: statusCounts.identified, fill: "hsl(var(--chart-1))" },
    { name: "In Progress", value: statusCounts.in_progress, fill: "hsl(var(--chart-4))" },
    { name: "Mitigated", value: statusCounts.mitigated, fill: "hsl(var(--chart-3))" },
    { name: "Accepted", value: statusCounts.accepted, fill: "hsl(var(--chart-5))" },
  ]

  return (
    <Card className="dark:gradient-card dark:border-primary/20 glow-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Risk Status Overview
              <Activity className="h-4 w-4 text-primary" />
            </CardTitle>
            <CardDescription>Current status of all identified risks</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Risks",
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: item.fill, color: item.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: <span className="font-medium text-foreground">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
