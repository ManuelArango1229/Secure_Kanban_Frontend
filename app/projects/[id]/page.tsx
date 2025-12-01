"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"

import type { Risk, RiskStatus, Project } from "@/lib/types"
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

  // Cargar proyecto desde API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/projects`)
        if (!res.ok) throw new Error("Error fetching projects")
        const projects = await res.json()
        const found = projects.find((p: Project) => p.id === id) || null
        if (mounted) setProject(found)
      } catch (err) {
        console.error("Error fetching project:", err)
        if (mounted) setProject(null)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  // Cargar riesgos desde API
  useEffect(() => {
    let mounted = true

    const fetchRisks = async () => {
      try {
        const res = await fetch(`/api/risks?project_id=${id}`)
        if (!res.ok) throw new Error("Error fetching risks")
        const data = await res.json()
        if (mounted) setRisks(data || [])
      } catch (err) {
        console.error("Error fetching risks:", err)
        if (mounted) setRisks([])
      }
    }

    // Cargar inicialmente
    fetchRisks()

    // Polling cada 5 segundos para sincronizar cambios
    const interval = setInterval(fetchRisks, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
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

  const handleRiskCreated = (newRisk: Risk) => {
    setRisks((prev) => [newRisk, ...prev])
  }

  const handleRiskDeleted = async (riskId: string) => {
    console.log("handleRiskDeleted called with id:", riskId)
    try {
      const res = await fetch(`/api/risks/${riskId}`, { method: "DELETE" })
      console.log("Delete response status:", res.status)
      if (!res.ok && res.status !== 204) throw new Error("Error deleting risk")
      setRisks((prev) => prev.filter(r => r.id !== riskId))
    } catch (err) {
      console.error("Delete risk error:", err)
      throw err
    }
  }

  const handleDrop = async (riskId: string, newStatus: RiskStatus) => {
    // Actualizar localmente primero (optimistic update)
    setRisks((prev) => prev.map((r) => (r.id === riskId ? { ...r, status: newStatus } : r)))

    // Luego actualizar en la BD
    try {
      const res = await fetch(`/api/risks/${riskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Error updating risk")
    } catch (err) {
      console.error("Error updating risk status:", err)
      // Revertir el cambio si falla
      setRisks((prev) => prev.map((r) => (r.id === riskId ? { ...r, status: risks.find(rk => rk.id === riskId)?.status || "identified" } : r)))
    }
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

      <RiskDetailDialog risk={selectedRisk} open={dialogOpen} onOpenChange={setDialogOpen} onDelete={handleRiskDeleted} />
    </div>
  )
}
