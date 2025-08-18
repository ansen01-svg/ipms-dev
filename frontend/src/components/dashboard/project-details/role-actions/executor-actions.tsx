"use client";

import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { BarChart, Camera, Upload, Users, Wrench } from "lucide-react";
import { useState } from "react";

interface ExecutorActionsProps {
  project: DbProject;
}

export function ExecutorActions({ project }: ExecutorActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  const canUpdate =
    project.status === PROJECT_STATUSES.SUBMITTED_TO_EXECUTING_DEPARTMENT;

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">Executor Actions</h4>
        <p className="text-sm text-orange-700 mb-4">
          On-ground implementation and progress tracking
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("Update Progress")}
            disabled={loading === "Update Progress"}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <BarChart className="h-4 w-4" />
            {loading === "Update Progress" ? "Updating..." : "Update Progress"}
          </Button>

          <Button
            onClick={() => handleAction("Upload Photos")}
            disabled={loading === "Upload Photos"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            {loading === "Upload Photos" ? "Uploading..." : "Upload Photos"}
          </Button>

          <Button
            onClick={() => handleAction("Submit Milestone")}
            disabled={loading === "Submit Milestone"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {loading === "Submit Milestone"
              ? "Submitting..."
              : "Submit Milestone"}
          </Button>

          <Button
            onClick={() => handleAction("Manage Workforce")}
            disabled={loading === "Manage Workforce"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {loading === "Manage Workforce"
              ? "Managing..."
              : "Manage Workforce"}
          </Button>

          <Button
            onClick={() => handleAction("Update Resources")}
            disabled={loading === "Update Resources"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Wrench className="h-4 w-4" />
            {loading === "Update Resources"
              ? "Updating..."
              : "Update Resources"}
          </Button>
        </div>

        <div className="mt-3 text-xs text-orange-600">
          💡 Current Status: {project.status} -{" "}
          {canUpdate
            ? "Ready for Updates"
            : "Project not in implementation phase"}
        </div>
      </div>
    </div>
  );
}
