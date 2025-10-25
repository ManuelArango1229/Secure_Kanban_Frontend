-- Enable Row Level Security (RLS) on all tables
-- This ensures users can only access data they have permission to see

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they are members of"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
  ON projects FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects"
  ON projects FOR DELETE
  USING (owner_id = auth.uid());

-- Project members policies
CREATE POLICY "Users can view project members for their projects"
  ON project_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage members"
  ON project_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Risks policies
CREATE POLICY "Users can view risks in their projects"
  ON risks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = risks.project_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project editors can create risks"
  ON risks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = risks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Project editors can update risks"
  ON risks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = risks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Project editors can delete risks"
  ON risks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = risks.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'editor')
    )
  );

-- Risk comments policies
CREATE POLICY "Users can view comments on risks in their projects"
  ON risk_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM risks
      JOIN project_members ON project_members.project_id = risks.project_id
      WHERE risks.id = risk_comments.risk_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can create comments"
  ON risk_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM risks
      JOIN project_members ON project_members.project_id = risks.project_id
      WHERE risks.id = risk_comments.risk_id
      AND project_members.user_id = auth.uid()
    )
  );

-- Tool integrations policies
CREATE POLICY "Users can view integrations for their projects"
  ON tool_integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = tool_integrations.project_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage integrations"
  ON tool_integrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tool_integrations.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Audit logs policies
CREATE POLICY "Users can view audit logs for their projects"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = audit_logs.project_id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
