"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockProjects } from "@/lib/mock-data"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ToolName } from "@/lib/types"

const availableTools = [
  {
    name: "OWASP Top 10",
    toolName: "owasp" as ToolName,
    description: "Web application security risks",
  },
  {
    name: "Trivy",
    toolName: "trivy" as ToolName,
    description: "Container and dependency scanning",
  },
  {
    name: "Bandit",
    toolName: "bandit" as ToolName,
    description: "Python security linter",
  },
  {
    name: "Dependency-Track",
    toolName: "dependency_track" as ToolName,
    description: "Component analysis platform",
  },
  {
    name: "SonarQube",
    toolName: "sonarqube" as ToolName,
    description: "Code quality and security",
  },
  {
    name: "Snyk",
    toolName: "snyk" as ToolName,
    description: "Developer security platform",
  },
]

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const project = mockProjects.find((p) => p.id === id)

  const [enabledTools, setEnabledTools] = useState<Set<ToolName>>(new Set(["owasp", "trivy", "dependency_track"]))

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
      </div>
    )
  }

  const toggleTool = (toolName: ToolName) => {
    setEnabledTools((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(toolName)) {
        newSet.delete(toolName)
      } else {
        newSet.add(toolName)
      }
      return newSet
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
          <p className="text-muted-foreground mt-1">{project.name}</p>
        </div>
      </div>

      <Card className="dark:gradient-card dark:border-primary/20">
        <CardHeader>
          <CardTitle>Security Tools Configuration</CardTitle>
          <CardDescription>
            Enable or disable security tools for this project. Only enabled tools will be available for importing
            vulnerabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableTools.map((tool) => (
            <div
              key={tool.toolName}
              className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="space-y-0.5">
                <Label htmlFor={tool.toolName} className="text-base font-medium cursor-pointer">
                  {tool.name}
                </Label>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <Switch
                id={tool.toolName}
                checked={enabledTools.has(tool.toolName)}
                onCheckedChange={() => toggleTool(tool.toolName)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="dark:gradient-card dark:border-primary/20">
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Basic project details and configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Additional project settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
