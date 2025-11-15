"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Calendar, User, FileText, Shield } from "lucide-react"
import type { Risk } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RiskDetailDialogProps {
  risk: Risk | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const severityConfig = {
  critical: { color: "bg-red-500", label: "Critical", textColor: "text-red-500" },
  high: { color: "bg-orange-500", label: "High", textColor: "text-orange-500" },
  medium: { color: "bg-yellow-500", label: "Medium", textColor: "text-yellow-500" },
  low: { color: "bg-blue-500", label: "Low", textColor: "text-blue-500" },
}

const statusLabels = {
  identified: "Identified",
  in_progress: "In Progress",
  mitigated: "Mitigated",
  accepted: "Accepted",
  closed: "Closed",
}

export function RiskDetailDialog({ risk, open, onOpenChange }: RiskDetailDialogProps) {
  if (!risk) return null

  const severity = severityConfig[risk.severity]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={cn("h-3 w-3 rounded-full mt-1", severity.color)} />
            <div className="flex-1">
              <DialogTitle className="text-xl leading-tight">{risk.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn(severity.textColor)}>
                  {severity.label}
                </Badge>
                <Badge variant="secondary">{statusLabels[risk.status]}</Badge>
                {risk.cwe_id && <Badge variant="outline">{risk.cwe_id}</Badge>}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {risk.cvss_score && (
            <div className="flex items-center gap-3">
              <AlertTriangle className={cn("h-5 w-5", severity.textColor)} />
              <div>
                <p className="text-sm font-medium">CVSS Score</p>
                <p className="text-2xl font-bold">{risk.cvss_score}</p>
              </div>
            </div>
          )}

          <Separator />

          {risk.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{risk.description}</p>
            </div>
          )}

          {risk.affected_component && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Affected Component
              </div>
              <p className="text-sm">{risk.affected_component}</p>
            </div>
          )}

          {risk.mitigation_plan && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Mitigation Plan
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{risk.mitigation_plan}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {risk.assigned_to && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Assigned To
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">DU</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Demo User</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <p className="text-sm text-muted-foreground">{new Date(risk.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              Edit Risk
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
