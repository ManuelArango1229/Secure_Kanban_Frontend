"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImportDialogProps {
  projectId: string;
}

export function ImportDialog({ projectId }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);

  const handleImport = async () => {
    setLoading(true);
    setProgress(0);
    setImported(0);

    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
      if (i === 100) {
        setImported(12); // Mock: imported 12 vulnerabilities
      }
    }

    console.log("[v0] Imported vulnerabilities from:", tool);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTool("");
    setProgress(0);
    setImported(0);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import Vulnerabilities
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Vulnerabilities</DialogTitle>
          <DialogDescription>
            Import security findings from your DevSecOps tools.
          </DialogDescription>
        </DialogHeader>

        {imported === 0 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tool">Select Tool</Label>
              <Select value={tool} onValueChange={setTool} disabled={loading}>
                <SelectTrigger id="tool">
                  <SelectValue placeholder="Choose a tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sonarqube">SonarQube</SelectItem>
                  <SelectItem value="snyk">Snyk</SelectItem>
                  <SelectItem value="owasp_d_track">OWASP D_Track</SelectItem>
                  <SelectItem value="burp_suite">Burp Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Importing vulnerabilities...
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">Import Successful</p>
              <p className="text-sm text-muted-foreground">
                Imported {imported} vulnerabilities from{" "}
                {tool === "sonarqube" ? "SonarQube" : tool}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {imported === 0 ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!tool || loading}>
                {loading ? "Importing..." : "Import"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
