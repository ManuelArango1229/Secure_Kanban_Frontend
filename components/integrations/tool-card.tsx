"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus } from "lucide-react"
import type { ToolName } from "@/lib/types"

interface ToolCardProps {
  name: string
  description: string
  toolName: ToolName
  connected: boolean
  onConnect: () => void
}

export function ToolCard({ name, description, connected, onConnect }: ToolCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {connected && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button variant={connected ? "outline" : "default"} onClick={onConnect} className="w-full">
          {connected ? (
            <>Configure</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
