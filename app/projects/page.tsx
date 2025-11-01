"use client"

import { useEffect, useMemo, useState } from "react"
import type { Project } from "@/lib/types"
import { mockProjects, mockRisks } from "@/lib/mock-data"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { getProjects, addProject, setProjects, removeProject } from "@/lib/project-store"

type CreateData = { name: string; description?: string }

export default function ProjectsPage() {
  const [projects, setProjectsState] = useState<Project[]>([])

  // Carga inicial desde localStorage, con fallback a mocks
  useEffect(() => {
    setProjectsState(getProjects(mockProjects))
  }, [])

  // Mantén localStorage en sync cuando cambie la lista
  useEffect(() => {
    // si prefieres que al quedar vacío no vuelvan los mocks, deja igual la carga inicial
    setProjects(projects)
  }, [projects])

  const projectsWithStats = useMemo(
    () =>
      projects.map((project) => {
        const prs = mockRisks.filter((r) => r.project_id === project.id)
        return {
          ...project,
          riskCount: prs.length,
          criticalCount: prs.filter((r) => r.severity === "critical").length,
        }
      }),
    [projects]
  )

  const handleCreate = (data: CreateData) => {
    const now = new Date().toISOString()
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      description: (data.description || "").trim(),
      owner_id: "local-user",
      created_at: now,
      updated_at: now,
    }
    // Actualiza estado y persiste
    setProjectsState(prev => {
      const next = [newProject, ...prev]
      setProjects(next)
      return next
    })
    // Por si navegas antes de que React sincronice
    addProject(newProject)
  }

  const handleDelete = (id: string) => {
    setProjectsState(prev => {
      const next = prev.filter(p => p.id !== id)
      setProjects(next)      // persiste lista sin el proyecto
      return next
    })
    removeProject(id)         // refuerzo en localStorage
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your security assessment projects</p>
        </div>
        <CreateProjectDialog onCreate={handleCreate} />
      </div>

      {projectsWithStats.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No projects yet. Create your first one with “New project”.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectsWithStats.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDelete(project.id)}  // ← habilita borrar
            />
          ))}
        </div>
      )}
    </div>
  )
}
