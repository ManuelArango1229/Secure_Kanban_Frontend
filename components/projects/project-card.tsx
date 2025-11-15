"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link" // Asegúrate de importar Link correctamente
import type { Project } from "@/lib/types"

export type ProjectCardProps = {
  project: Project
  onDelete?: () => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3 relative">
      <Link href={`/projects/${project.id}/settings`} className="hover:underline">
        <h3 className="font-semibold">{project.name}</h3>
      </Link>

      {project.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{new Date(project.created_at).toLocaleDateString()}</span>
      </div>

      {onDelete && (
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
      )}
    </div>
  )
}
