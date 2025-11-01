"use client"

import Link from "next/link"
import { Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types"

// ✅ Extiende props para aceptar onDelete (opcional)
export type ProjectCardProps = {
  project: Project & { riskCount?: number; criticalCount?: number }
  onDelete?: () => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3 relative">
      {/* Título / link al proyecto */}
      <Link href={`/projects/${project.id}/settings`} className="hover:underline">
        <h3 className="font-semibold">{project.name}</h3>
      </Link>

      {/* Descripción (si hay) */}
      {project.description ? (
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      ) : null}

      {/* Métricas */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Risks: {project.riskCount ?? 0} · Critical: {project.criticalCount ?? 0}
        </span>
        <span>{new Date(project.created_at).toLocaleDateString()}</span>
      </div>

      {/* Acciones (Eliminar opcional) */}
      {onDelete ? (
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="gap-2"
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default ProjectCard
