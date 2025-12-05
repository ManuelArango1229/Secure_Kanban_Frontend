"use client"

import { useEffect } from "react"
import type { Risk, RiskStatus } from "@/lib/types"

interface RiskActivityLoggerProps {
  risk: Risk
  previousStatus?: RiskStatus
}

export function RiskActivityLogger({ risk, previousStatus }: RiskActivityLoggerProps) {
  useEffect(() => {
    // Log cuando el estado cambia
    if (previousStatus && previousStatus !== risk.status) {
      console.log(`📝 Status changed: ${previousStatus} → ${risk.status} for risk ${risk.id}`)
      
      // Aquí podrías auto-crear un comentario de sistema
      // que refleje el cambio de estado
      const statusChangeMessage = `Status changed from ${previousStatus} to ${risk.status}`
      console.log("💬 Auto-comment:", statusChangeMessage)
    }
  }, [risk.status, previousStatus, risk.id])

  return null
}
