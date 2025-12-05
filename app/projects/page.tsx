"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Project, Risk } from "@/lib/types"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Button } from "@/components/ui/button"

type CreateData = { name: string; description?: string }

export default function ProjectsPage() {
  const [projects, setProjectsState] = useState<Project[]>([])
  const [risks, setRisks] = useState<Risk[]>([])

  // Cargar proyectos desde API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/projects")
        if (!res.ok) throw new Error("Error fetching projects")
        const data = await res.json()
        if (mounted) setProjectsState(data || [])
      } catch (err) {
        console.error("Error fetching projects:", err)
        if (mounted) setProjectsState([])
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  // Cargar todos los risks desde API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/risks")
        if (!res.ok) throw new Error("Error fetching risks")
        const data = await res.json()
        if (mounted) setRisks(data || [])
      } catch (err) {
        console.error("Error fetching risks:", err)
        if (mounted) setRisks([])
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const projectsWithStats = useMemo(
    () =>
      projects.map((project) => {
        const prs = risks.filter((r) => r.project_id === project.id)
        return {
          ...project,
          riskCount: prs.length,
          criticalCount: prs.filter((r) => r.severity === "critical").length,
        }
      }),
    [projects, risks]
  )

  const handleCreate = async (data: CreateData) => {
    const now = new Date().toISOString()
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      description: (data.description || "").trim(),
      owner_id: "local-user",
      created_at: now,
      updated_at: now,
    }
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, description: data.description }),
      })
      if (!res.ok) throw new Error("Error creating project")
      const created = await res.json()
      setProjectsState(prev => [created, ...prev])
    } catch (err) {
      console.error("Create project error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Error deleting project")
      setProjectsState(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error("Delete project error:", err)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" asChild className="hover:bg-accent">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Dashboard</span>
          </Link>
        </Button>
      </div>

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
