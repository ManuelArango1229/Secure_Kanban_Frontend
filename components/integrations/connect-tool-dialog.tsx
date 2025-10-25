"use client"

import type React from "react"

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
import type { ToolName } from "@/lib/types"

interface ConnectToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toolName: ToolName
  toolDisplayName: string
}

export function ConnectToolDialog({ open, onOpenChange, toolName, toolDisplayName }: ConnectToolDialogProps) {
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock integration setup
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Connecting tool:", { toolName, apiUrl, apiKey: "***" })

    setApiUrl("")
    setApiKey("")
    onOpenChange(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Connect {toolDisplayName}</DialogTitle>
            <DialogDescription>
              Enter your {toolDisplayName} API credentials to import vulnerabilities automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                placeholder="https://your-instance.com/api"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Your API key will be encrypted and stored securely.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
