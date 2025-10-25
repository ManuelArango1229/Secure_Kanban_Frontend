import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project & {
    riskCount?: number
    criticalCount?: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:scale-[1.02]",
        "dark:gradient-card dark:border-primary/20 hover:glow-border",
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">
            <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors hover:glow-text">
              {project.name}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Risks:</span>
              <span className="font-medium">{project.riskCount || 0}</span>
            </div>
            {(project.criticalCount || 0) > 0 && (
              <div
                className={cn(
                  "flex items-center gap-1 text-destructive",
                  "px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30",
                  "shadow-[0_0_10px_rgba(239,68,68,0.2)]",
                )}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{project.criticalCount}</span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs border border-primary/30 bg-primary/10">
            Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
