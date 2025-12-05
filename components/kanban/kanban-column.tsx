"use client"

import type React from "react"

import type { Risk, RiskStatus } from "@/lib/types"
import { RiskCard } from "./risk-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface KanbanColumnProps {
  title: string
  status: RiskStatus
  risks: Risk[]
  onRiskClick: (risk: Risk) => void
  onDrop?: (riskId: string, newStatus: RiskStatus) => void
}

const statusColors = {
  identified: "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
  mitigated: "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/30",
}

export function KanbanColumn({ title, status, risks, onRiskClick, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null)

  const handleDragStart = (e: React.DragEvent, riskId: string) => {
    console.log("🟢 DRAG START:", riskId)
    setDragStartPos({ x: e.clientX, y: e.clientY })
    e.dataTransfer.setData("text/plain", riskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleClick = (risk: Risk, e: React.MouseEvent) => {
    // Solo abrir el diálogo si no hubo drag (posición cambió muy poco)
    if (dragStartPos) {
      const dx = Math.abs(e.clientX - dragStartPos.x)
      const dy = Math.abs(e.clientY - dragStartPos.y)
      if (dx < 5 && dy < 5) {
        onRiskClick(risk)
      }
      setDragStartPos(null)
    } else {
      onRiskClick(risk)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const riskId = e.dataTransfer.getData("text/plain")
    if (riskId && onDrop) {
      onDrop(riskId, status)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full min-w-[320px] p-4 rounded-xl",
        "dark:gradient-card dark:border dark:border-primary/20",
        "transition-all duration-300 hover:glow-border",
        isDragOver && "ring-2 ring-primary scale-[1.02]",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className={cn("text-xs border", statusColors[status])}>
            {risks.length}
          </Badge>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 min-h-[200px]">
        {risks.map((risk) => (
          <div
            key={risk.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, risk.id)}
            onDragOver={(e) => e.stopPropagation()}
            onClick={(e) => handleClick(risk, e)}
          >
            <RiskCard risk={risk} />
          </div>
        ))}
        {risks.length === 0 && (
          <div
            className={cn(
              "flex items-center justify-center h-32 rounded-lg text-sm text-muted-foreground",
              "border-2 border-dashed border-primary/20",
            )}
          >
            No risks
          </div>
        )}
      </div>
    </div>
  )
}
