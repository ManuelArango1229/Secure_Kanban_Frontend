import { mockProjects, mockRisks } from "@/lib/mock-data"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

export default function ProjectsPage() {
  // Get projects with risk counts
  const projectsWithStats = mockProjects.map((project) => {
    const projectRisks = mockRisks.filter((r) => r.project_id === project.id)
    return {
      ...project,
      riskCount: projectRisks.length,
      criticalCount: projectRisks.filter((r) => r.severity === "critical").length,
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your security assessment projects</p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projectsWithStats.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
