"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"

import type { Risk, RiskStatus, Project } from "@/lib/types"
import { mockProjects, mockRisks } from "@/lib/mock-data"
import { findProject } from "@/lib/project-store"       // <-- lee del localStorage

import { KanbanColumn } from "@/components/kanban/kanban-column"
import { RiskDetailDialog } from "@/components/kanban/risk-detail-dialog"
import { CreateRiskDialog } from "@/components/kanban/create-risk-dialog"
import { ImportDialog } from "@/components/integrations/import-dialog"
import { Button } from "@/components/ui/button"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params

  const [project, setProject] = useState<Project | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  // Cargar proyecto desde localStorage con fallback a mocks
  useEffect(() => {
    const p = findProject(id, mockProjects) ?? null
    setProject(p)
  }, [id])

  // Cargar riesgos (si el proyecto es nuevo, no tendrá riesgos → [])
  useEffect(() => {
    setRisks(mockRisks.filter((r) => r.project_id === id))
  }, [id])

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
        <div className="mt-4">
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Agrupar riesgos por estado
  const risksByStatus = {
    identified: risks.filter((r) => r.status === "identified"),
    in_progress: risks.filter((r) => r.status === "in_progress"),
    mitigated: risks.filter((r) => r.status === "mitigated"),
    closed: risks.filter((r) => r.status === "closed"),
  }

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk)
    setDialogOpen(true)
  }

  const handleDrop = (riskId: string, newStatus: RiskStatus) => {
    setRisks((prev) => prev.map((r) => (r.id === riskId ? { ...r, status: newStatus } : r)))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ImportDialog projectId={id} />
            <CreateRiskDialog projectId={id} />
            <Button variant="outline" size="icon" asChild>
              <Link href={`/projects/${id}/settings`}>
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full">
          <KanbanColumn
            title="Identified"
            status="identified"
            risks={risksByStatus.identified}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            risks={risksByStatus.in_progress}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Mitigated"
            status="mitigated"
            risks={risksByStatus.mitigated}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Closed"
            status="closed"
            risks={risksByStatus.closed}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <RiskDetailDialog risk={selectedRisk} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
