// Type definitions for SecureKanban

export type UserRole = "admin" | "manager" | "member"
export type ProjectRole = "owner" | "editor" | "viewer"
export type RiskSeverity = "critical" | "high" | "medium" | "low"
export type RiskStatus = "identified" | "in_progress" | "mitigated" | "closed"
export type ToolName = "owasp" | "trivy" | "bandit" | "dependency_track" | "sonarqube" | "snyk" | "custom"

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
  created_at: string
}

export interface Risk {
  id: string
  project_id: string
  title: string
  description?: string | null
  severity: RiskSeverity
  status: RiskStatus
  cvss_score?: number | null
  cwe_id?: string | null
  affected_component?: string | null
  mitigation_plan?: string | null
  assigned_to?: string | null
  source_tool?: ToolName | null
  position?: number
  created_by?: string | null
  created_at: string
  updated_at: string
}
  updated_at: string
}

export interface RiskComment {
  id: string
  risk_id: string
  user_id: string
  comment: string
  created_at: string
}

export interface ToolIntegration {
  id: string
  project_id: string
  tool_name: ToolName
  api_url?: string
  last_sync?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  project_id?: string
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  details?: Record<string, unknown>
  created_at: string
}
