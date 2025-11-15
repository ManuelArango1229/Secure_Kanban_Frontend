"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // Asegúrate de importar Link correctamente
import { ArrowLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { RiskDetailDialog } from "@/components/kanban/risk-detail-dialog"
import { CreateRiskDialog } from "@/components/kanban/create-risk-dialog"
import { supabase } from "@/lib/supabase/client"
import type { Risk, Project } from "@/lib/types"
import { useParams } from "next/navigation"

export default function ProjectPage() {
  const { id } = useParams()

  const projectId = Array.isArray(id) ? id[0] : id // Asegurarse de que id sea un string
  if (!projectId) {
    return <div>Error: Invalid project ID</div>
  }

  const [project, setProject] = useState<Project | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()
      if (error) {
        console.error("Error fetching project:", error)
      } else {
        setProject(data)
      }
    }
    fetchProject()
  }, [projectId])

  useEffect(() => {
    const fetchRisks = async () => {
      const { data, error } = await supabase.from("risks").select("*").eq("project_id", projectId)
      if (error) {
        console.error("Error fetching risks:", error)
      } else {
        setRisks(data)
      }
    }
    fetchRisks()
  }, [projectId])

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
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreateRiskDialog projectId={projectId} onRiskCreated={(newRisk) => setRisks((prev) => [...prev, newRisk])} />
            <Button variant="outline" size="icon" asChild>
              <Link href={`/projects/${projectId}/settings`}>
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
