import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, TrendingUp, TrendingDown } from "lucide-react"
import { mockProjects, mockRisks } from "@/lib/mock-data"
import { ProjectCard } from "@/components/projects/project-card"
import { RiskSeverityChart } from "@/components/dashboard/risk-severity-chart"
import { RiskStatusChart } from "@/components/dashboard/risk-status-chart"
import { RecentRisksTable } from "@/components/dashboard/recent-risks-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  // Calculate statistics from mock data
  const totalProjects = mockProjects.length
  const totalRisks = mockRisks.length
  const criticalRisks = mockRisks.filter((r) => r.severity === "critical").length
  const mitigatedRisks = mockRisks.filter((r) => r.status === "mitigated").length
  const inProgressRisks = mockRisks.filter((r) => r.status === "in_progress").length

  // Calculate trends (mock data)
  const riskTrend = -12 // 12% decrease
  const mitigationRate = ((mitigatedRisks / totalRisks) * 100).toFixed(0)

  const risksByTool = mockRisks.reduce(
    (acc, risk) => {
      const tool = risk.source_tool || "unknown"
      acc[tool] = (acc[tool] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const toolNames = {
    owasp: "OWASP",
    trivy: "Trivy",
    bandit: "Bandit",
    dependency_track: "Dependency-Track",
    sonarqube: "SonarQube",
    snyk: "Snyk",
    custom: "Custom",
    unknown: "Unknown",
  }

  // Get projects with risk counts
  const projectsWithStats = mockProjects.map((project) => {
    const projectRisks = mockRisks.filter((r) => r.project_id === project.id)
    return {
      ...project,
      riskCount: projectRisks.length,
      criticalCount: projectRisks.filter((r) => r.severity === "critical").length,
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight glow-text">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your security risk management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:gradient-card dark:border-primary/20 glow-border transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Active security projects</p>
          </CardContent>
        </Card>

        <Card className="dark:gradient-card dark:border-primary/20 glow-border transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRisks}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-black-600 font-medium">{Math.abs(riskTrend)}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "dark:gradient-card dark:border-red-500/30 transition-all duration-300 hover:scale-[1.02]",
            "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalRisks}</div>
            <p className="text-xs text-muted-foreground mt-1">{inProgressRisks} in progress</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "dark:gradient-card dark:border-green-500/30 transition-all duration-300 hover:scale-[1.02]",
            "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigation Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mitigationRate}%</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-black-600 font-medium">8%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:gradient-card dark:border-primary/20 glow-border">
        <CardHeader>
          <CardTitle>Risks by Security Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Object.entries(risksByTool).map(([tool, count]) => (
              <div
                key={tool}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="text-2xl font-bold text-primary">{count}</div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {toolNames[tool as keyof typeof toolNames]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 slide-in">
        <RiskSeverityChart risks={mockRisks} />
        <RiskStatusChart risks={mockRisks} />
      </div>

      <RecentRisksTable risks={mockRisks} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button variant="outline" asChild className="border-primary/30 hover:bg-primary/10 bg-transparent">
            <Link href="/projects">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projectsWithStats.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
