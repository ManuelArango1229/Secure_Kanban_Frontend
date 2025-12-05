"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, TrendingUp, TrendingDown } from "lucide-react"
import { ProjectCard } from "@/components/projects/project-card"
import { RiskSeverityChart } from "@/components/dashboard/risk-severity-chart"
import { RiskStatusChart } from "@/components/dashboard/risk-status-chart"
import { RecentRisksTable } from "@/components/dashboard/recent-risks-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Project, Risk } from "@/lib/types"

export function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📥 Fetching dashboard data...")
        const [projectsRes, risksRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/risks"),
        ])

        if (projectsRes.ok) {
          const data = await projectsRes.json()
          console.log("✅ Projects loaded:", data.length)
          setProjects(data)
        }

        if (risksRes.ok) {
          const data = await risksRes.json()
          console.log("✅ Risks loaded:", data.length)
          setRisks(data)
        }
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Recargar datos cada 5 segundos
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Calculate statistics
  const totalProjects = projects.length
  const totalRisks = risks.length
  const criticalRisks = risks.filter((r) => r.severity === "critical").length
  const mitigatedRisks = risks.filter((r) => r.status === "mitigated").length
  const inProgressRisks = risks.filter((r) => r.status === "in_progress").length

  const riskTrend = -12
  const mitigationRate = totalRisks > 0 ? ((mitigatedRisks / totalRisks) * 100).toFixed(0) : 0

  const risksByTool = risks.reduce(
    (acc, risk) => {
      const tool = risk.source_tool || "unknown"
      acc[tool] = (acc[tool] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const toolNames: Record<string, string> = {
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
  const projectsWithStats = projects.map((project) => {
    const projectRisks = risks.filter((r) => r.project_id === project.id)
    return {
      ...project,
      riskCount: projectRisks.length,
      criticalCount: projectRisks.filter((r) => r.severity === "critical").length,
    }
  })

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">⏳ Cargando dashboard...</p>
      </div>
    )
  }

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
                  {toolNames[tool] || "Unknown"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 slide-in">
        <RiskSeverityChart risks={risks} />
        <RiskStatusChart risks={risks} />
      </div>

      <RecentRisksTable risks={risks.slice(0, 5)} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Button asChild>
            <Link href="/projects">View all</Link>
          </Button>
        </div>

        {projectsWithStats.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No projects yet.{" "}
            <Link href="/projects" className="text-primary hover:underline">
              Create your first one
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsWithStats.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={() => {
                  setProjects((prev) => prev.filter((p) => p.id !== project.id))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
