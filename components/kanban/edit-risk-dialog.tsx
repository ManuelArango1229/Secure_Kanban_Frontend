"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Risk, RiskSeverity } from "@/lib/types"

interface EditRiskDialogProps {
  risk: Risk | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (updatedRisk: Partial<Risk>) => Promise<void>
}

export function EditRiskDialog({ risk, open, onOpenChange, onSave }: EditRiskDialogProps) {
  const [title, setTitle] = useState(risk?.title || "")
  const [description, setDescription] = useState(risk?.description || "")
  const [severity, setSeverity] = useState<RiskSeverity>(risk?.severity || "medium")
  const [cweId, setCweId] = useState(risk?.cwe_id || "")
  const [component, setComponent] = useState(risk?.affected_component || "")
  const [cvssScore, setCvssScore] = useState(risk?.cvss_score?.toString() || "")
  const [mitigation, setMitigation] = useState(risk?.mitigation_plan || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!risk || !onSave) return

    setLoading(true)
    try {
      await onSave({
        title,
        description: description || null,
        severity,
        cvss_score: cvssScore ? parseFloat(cvssScore) : null,
        cwe_id: cweId || null,
        affected_component: component || null,
        mitigation_plan: mitigation || null,
      })
      onOpenChange(false)
    } catch (err) {
      console.error("Error saving risk:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!risk) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Risk</DialogTitle>
          <DialogDescription>Update the risk details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as RiskSeverity)}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvss">CVSS Score</Label>
              <Input
                id="cvss"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cvssScore}
                onChange={(e) => setCvssScore(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cwe">CWE ID</Label>
              <Input
                id="cwe"
                value={cweId}
                onChange={(e) => setCweId(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="component">Affected Component</Label>
              <Input
                id="component"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigation">Mitigation Plan</Label>
            <Textarea
              id="mitigation"
              value={mitigation}
              onChange={(e) => setMitigation(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
