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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { RiskSeverity, Risk } from "@/lib/types"

interface CreateRiskDialogProps {
  projectId: string
  onRiskCreated: (newRisk: Risk) => void // Callback para pasar el nuevo riesgo a la página principal
}

export function CreateRiskDialog({ projectId, onRiskCreated }: CreateRiskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<RiskSeverity>("medium")
  const [cweId, setCweId] = useState("")
  const [component, setComponent] = useState("")
  const [cvssScore, setCvssScore] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          title,
          description,
          severity,
          status: "identified",
          cvss_score: cvssScore ? parseFloat(cvssScore) : null,
          cwe_id: cweId || null,
          affected_component: component || null,
        }),
      })

      if (!res.ok) throw new Error("Error creating risk")
      const newRisk = await res.json()

      onRiskCreated(newRisk as Risk)

      // Resetear el formulario
      setTitle("")
      setDescription("")
      setSeverity("medium")
      setCweId("")
      setComponent("")
      setCvssScore("")
      setOpen(false)
    } catch (err) {
      console.error("Error creando riesgo:", err)
      // Aquí puedes mostrar un toast o mensaje de error al usuario
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Risk</DialogTitle>
            <DialogDescription>Create a new security risk or vulnerability for this project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="SQL Injection in Login Form"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the vulnerability..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
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
                  placeholder="9.8"
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
                  placeholder="CWE-89"
                  value={cweId}
                  onChange={(e) => setCweId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="component">Affected Component</Label>
                <Input
                  id="component"
                  placeholder="Authentication Module"
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Risk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
