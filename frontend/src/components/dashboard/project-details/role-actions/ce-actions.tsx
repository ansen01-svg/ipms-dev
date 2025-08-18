"use client";

import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { BarChart, CheckCircle, DollarSign } from "lucide-react";
import { useState } from "react";

interface CEActionsProps {
  project: DbProject;
}

export function CEActions({ project }: CEActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  const canReview = project.status === PROJECT_STATUSES.SUBMITTED_TO_CE;

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">
          Chief Engineer Actions
        </h4>
        <p className="text-sm text-purple-700 mb-4">
          Final technical approval and budget validation
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("Budget Analysis")}
            disabled={loading === "Budget Analysis"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            {loading === "Budget Analysis" ? "Analyzing..." : "Budget Analysis"}
          </Button>

          <Button
            onClick={() => handleAction("Policy Compliance Check")}
            disabled={loading === "Policy Compliance Check"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            {loading === "Policy Compliance Check"
              ? "Checking..."
              : "Policy Compliance Check"}
          </Button>

          <Button
            onClick={() => handleAction("Review Project")}
            disabled={!canReview || loading === "Review Project"}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="h-4 w-4" />
            {loading === "Review Project" ? "Reviewing..." : "Review Project"}
          </Button>

          {/* <Button
            onClick={() => handleAction("Reject & Return to AEE")}
            disabled={!canApprove || loading === "Reject & Return to AEE"}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            {loading === "Reject & Return to AEE"
              ? "Rejecting..."
              : "Reject & Return to AEE"}
          </Button> */}
        </div>

        <div className="mt-3 text-xs text-purple-600">
          💡 Current Status: {project.status} -{" "}
          {canReview ? "Review Project" : "Not ready for CE review"}
        </div>
      </div>
    </div>
  );
}
