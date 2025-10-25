"use client"

import { useState } from "react"
import { mockProjects, mockRisks } from "@/lib/mock-data"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { RiskDetailDialog } from "@/components/kanban/risk-detail-dialog"
import { CreateRiskDialog } from "@/components/kanban/create-risk-dialog"
import { ImportDialog } from "@/components/integrations/import-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import type { Risk, RiskStatus } from "@/lib/types"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [risks, setRisks] = useState(mockRisks.filter((r) => r.project_id === id))

  // Get project
  const project = mockProjects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
      </div>
    )
  }

  // Group risks by status
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
    setRisks((prevRisks) => prevRisks.map((risk) => (risk.id === riskId ? { ...risk, status: newStatus } : risk)))
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
              {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
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
