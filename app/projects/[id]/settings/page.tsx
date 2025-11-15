"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { RiskDetailDialog } from "@/components/kanban/risk-detail-dialog"
import { CreateRiskDialog } from "@/components/kanban/create-risk-dialog"
import { mockProjects } from "@/lib/mock-data"
import { findProject } from "@/lib/project-store"
import { useParams } from "next/navigation"
import type { Risk, Project } from "@/lib/types"

export default function ProjectPage() {
  const { id } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  // Cargar proyecto desde localStorage con fallback a mocks
  useEffect(() => {
    if (id) {
      const p = findProject(id, mockProjects) ?? null
      setProject(p)
    }
  }, [id])

  // Cargar riesgos desde localStorage
  useEffect(() => {
    const storedRisks = localStorage.getItem(`risks-${id}`)
    if (storedRisks) {
      setRisks(JSON.parse(storedRisks))
    }
  }, [id])

  const handleRiskCreated = (newRisk: Risk) => {
    // Agregar el nuevo riesgo al estado y al localStorage
    setRisks((prev) => [...prev, newRisk])
    const storedRisks = localStorage.getItem(`risks-${id}`)
    const risks = storedRisks ? JSON.parse(storedRisks) : []
    risks.push(newRisk)
    localStorage.setItem(`risks-${id}`, JSON.stringify(risks))
  }

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk)
    setDialogOpen(true)
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
              <h1 className="text-2xl font-bold">{project?.name}</h1>
              {project?.description && (
                <p className="text-sm text-muted-foreground mt-1">{project?.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreateRiskDialog projectId={id} onRiskCreated={handleRiskCreated} />
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
            risks={risks.filter((r) => r.status === "identified")}
            onRiskClick={handleRiskClick}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            risks={risks.filter((r) => r.status === "in_progress")}
            onRiskClick={handleRiskClick}
          />
          <KanbanColumn
            title="Mitigated"
            status="mitigated"
            risks={risks.filter((r) => r.status === "mitigated")}
            onRiskClick={handleRiskClick}
          />
          <KanbanColumn
            title="Closed"
            status="closed"
            risks={risks.filter((r) => r.status === "closed")}
            onRiskClick={handleRiskClick}
          />
        </div>
      </div>

      <RiskDetailDialog risk={selectedRisk} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
