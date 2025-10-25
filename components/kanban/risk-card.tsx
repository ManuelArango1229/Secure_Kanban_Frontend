"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Risk } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RiskCardProps {
  risk: Risk
  onClick?: () => void
}

const severityConfig = {
  critical: {
    color: "bg-red-500",
    label: "Critical",
    textColor: "text-red-500",
    glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  },
  high: {
    color: "bg-orange-500",
    label: "High",
    textColor: "text-orange-500",
    glowColor: "shadow-[0_0_12px_rgba(249,115,22,0.4)]",
  },
  medium: {
    color: "bg-yellow-500",
    label: "Medium",
    textColor: "text-yellow-500",
    glowColor: "shadow-[0_0_10px_rgba(234,179,8,0.3)]",
  },
  low: {
    color: "bg-blue-500",
    label: "Low",
    textColor: "text-blue-500",
    glowColor: "shadow-[0_0_8px_rgba(59,130,246,0.3)]",
  },
}

const toolNames = {
  owasp: "OWASP",
  trivy: "Trivy",
  bandit: "Bandit",
  dependency_track: "Dependency-Track",
  sonarqube: "SonarQube",
  snyk: "Snyk",
  custom: "Custom",
}

export function RiskCard({ risk, onClick }: RiskCardProps) {
  const severity = severityConfig[risk.severity]

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 slide-in",
        "hover:glow-border hover:scale-[1.02]",
        "dark:gradient-card dark:border-primary/20",
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full animate-pulse", severity.color, severity.glowColor)} />
              <h3 className="font-medium text-sm leading-tight line-clamp-2">{risk.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {risk.cwe_id && (
                <Badge variant="outline" className="text-xs border-primary/30">
                  {risk.cwe_id}
                </Badge>
              )}
              {risk.source_tool && (
                <Badge variant="secondary" className="text-xs bg-primary/20 border-primary/30">
                  {toolNames[risk.source_tool]}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2 -mt-1 hover:bg-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {risk.description && <p className="text-xs text-muted-foreground line-clamp-2">{risk.description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {risk.cvss_score && (
              <div
                className={cn("flex items-center gap-1 px-2 py-1 rounded-md", "bg-primary/10 border border-primary/20")}
              >
                <Zap className={cn("h-3 w-3", severity.textColor)} />
                <span className="text-xs font-bold">{risk.cvss_score}</span>
              </div>
            )}
            {risk.affected_component && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{risk.affected_component}</span>
            )}
          </div>
          {risk.assigned_to && (
            <Avatar className="h-6 w-6 ring-2 ring-primary/30">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">DU</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
