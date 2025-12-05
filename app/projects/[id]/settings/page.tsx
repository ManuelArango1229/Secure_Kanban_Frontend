"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { RiskDetailDialog } from "@/components/kanban/risk-detail-dialog"
import { CreateRiskDialog } from "@/components/kanban/create-risk-dialog"
import { useParams } from "next/navigation"
import type { Risk, Project } from "@/lib/types"

export default function ProjectPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""

  const [project, setProject] = useState<Project | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  // Cargar proyecto desde API
  useEffect(() => {
    if (!id) return
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
    if (!id) return
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

    fetchRisks()
    const interval = setInterval(fetchRisks, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [id])

  const handleRiskCreated = (newRisk: Risk) => {
    setRisks((prev) => [newRisk, ...prev])
  }

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk)
    setDialogOpen(true)
  }

  const handleRiskDeleted = async (riskId: string) => {
    try {
      const res = await fetch(`/api/risks/${riskId}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Error deleting risk")

      // Actualizar estado local
      setRisks((prev) => prev.filter((r) => r.id !== riskId))
      setDialogOpen(false)
    } catch (err) {
      console.error("Delete risk error:", err)
      throw err
    }
  }

  const handleRiskUpdated = async (riskId: string, updatedData: Partial<Risk>) => {
    try {
      const res = await fetch(`/api/risks/${riskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error("Error updating risk")
      const updated = await res.json()
      setRisks((prev) => prev.map((r) => (r.id === riskId ? updated : r)))
    } catch (err) {
      console.error("Update risk error:", err)
      throw err
    }
  }

  const handleDrop = async (riskId: string, newStatus: "identified" | "in_progress" | "mitigated" | "closed") => {
    console.log("📍 SETTINGS PAGE handleDrop:", riskId, "->", newStatus)
    const previousRisk = risks.find(r => r.id === riskId)
    if (!previousRisk) {
      console.log("❌ Risk not found:", riskId)
      return
    }
    
    const previousStatus = previousRisk.status

    // Actualizar localmente primero
    setRisks((prev) => prev.map((r) => (r.id === riskId ? { ...r, status: newStatus } : r)))

    try {
      console.log("🔵 Sending PATCH to /api/risks/" + riskId)
      const res = await fetch(`/api/risks/${riskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      console.log("🔵 PATCH response status:", res.status)
      if (!res.ok) throw new Error("Error updating risk")
      const updated = await res.json()
      console.log("✅ Risk updated:", updated)
      setRisks((prev) => prev.map((r) => (r.id === riskId ? updated : r)))

      // Registrar cambio de estado como comentario del sistema
      console.log("💬 Adding system comment for status change")
      const statusLabels: Record<"identified" | "in_progress" | "mitigated" | "closed", string> = {
        identified: "Identificado",
        in_progress: "En Progreso",
        mitigated: "Mitigado",
        closed: "Cerrado",
      }
      const statusChangeMessage = `Estado cambió de **${statusLabels[previousStatus]}** a **${statusLabels[newStatus]}**`
      try {
        const commentRes = await fetch(`/api/risks/${riskId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: statusChangeMessage,
            user_id: "system",
          }),
        })
        if (commentRes.ok) {
          console.log("✅ System comment created")
        }
      } catch (err) {
        console.error("❌ Error creating system comment:", err)
      }
    } catch (err) {
      console.error("❌ Error updating risk status:", err)
      setRisks((prev) => prev.map((r) => (r.id === riskId ? { ...r, status: previousStatus } : r)))
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
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            risks={risks.filter((r) => r.status === "in_progress")}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Mitigated"
            status="mitigated"
            risks={risks.filter((r) => r.status === "mitigated")}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Closed"
            status="closed"
            risks={risks.filter((r) => r.status === "closed")}
            onRiskClick={handleRiskClick}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <RiskDetailDialog risk={selectedRisk} open={dialogOpen} onOpenChange={setDialogOpen} onDelete={handleRiskDeleted} onUpdate={handleRiskUpdated} />
    </div>
  )
}
