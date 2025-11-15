"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToolCard } from "@/components/integrations/tool-card";
import { ConnectToolDialog } from "@/components/integrations/connect-tool-dialog";
import type { ToolName } from "@/lib/types";

const tools = [
  {
    name: "SonarQube",
    toolName: "sonarqube" as ToolName,
    description: "Import code quality and security issues from SonarQube",
  },
  {
    name: "Snyk",
    toolName: "snyk" as ToolName,
    description: "Import dependency vulnerabilities from Snyk",
  },
  {
    name: "OWASP DEPENDENCY TRACK",
    toolName: "owasp_zap" as ToolName,
    description:
      "Import web application security findings from OWASP DEPENDENCY TRACK",
  },
  {
    name: "Burp Suite",
    toolName: "burp_suite" as ToolName,
    description: "Import penetration testing results from Burp Suite",
  },
];

export default function SettingsPage() {
  const [connectedTools, setConnectedTools] = useState<Set<ToolName>>(
    new Set(),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{
    name: string;
    toolName: ToolName;
  } | null>(null);

  const handleConnect = (toolName: ToolName, displayName: string) => {
    setSelectedTool({ name: displayName, toolName });
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open && selectedTool) {
      // Mock: mark tool as connected
      setConnectedTools((prev) => new Set(prev).add(selectedTool.toolName));
      setSelectedTool(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and integrations
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DevSecOps Tools</CardTitle>
              <CardDescription>
                Connect your security tools to automatically import
                vulnerabilities and findings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.toolName}
                    name={tool.name}
                    description={tool.description}
                    toolName={tool.toolName}
                    connected={connectedTools.has(tool.toolName)}
                    onConnect={() => handleConnect(tool.toolName, tool.name)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Profile settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Invite team members and manage permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Team management coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTool && (
        <ConnectToolDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          toolName={selectedTool.toolName}
          toolDisplayName={selectedTool.name}
        />
      )}
    </div>
  );
}
