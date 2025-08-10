"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { FileCheck, Settings, Shield } from "lucide-react";
import { useState } from "react";

interface MDActionsProps {
  project: Project;
}

export function MDActions({ project }: MDActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  const canReview = project.status === PROJECT_STATUSES.SUBMITTED_TO_MD;

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">
          Managing Director Actions
        </h4>
        <p className="text-sm text-red-700 mb-4">
          Executive sanction and policy decisions
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("Policy Review")}
            disabled={loading === "Policy Review"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {loading === "Policy Review" ? "Reviewing..." : "Policy Review"}
          </Button>

          <Button
            onClick={() => handleAction("Executive Summary")}
            disabled={loading === "Executive Summary"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileCheck className="h-4 w-4" />
            {loading === "Executive Summary"
              ? "Generating..."
              : "Executive Summary"}
          </Button>

          <Button
            onClick={() => handleAction("Grant Final Sanction")}
            disabled={!canReview || loading === "Review"}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Shield className="h-4 w-4" />
            {loading === "Review" ? "Reviewing..." : "Review"}
          </Button>

          {/* <Button
            onClick={() => handleAction("Reject & Return to CE")}
            disabled={!canSanction || loading === "Reject & Return to CE"}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            {loading === "Reject & Return to CE"
              ? "Rejecting..."
              : "Reject & Return to CE"}
          </Button> */}
        </div>

        <div className="mt-3 text-xs text-red-600">
          💡 Current Status: {project.status} -{" "}
          {canReview ? "Ready for Review" : "Not ready for MD review"}
        </div>
      </div>
    </div>
  );
}
