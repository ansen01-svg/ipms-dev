"use client";

import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { FileText } from "lucide-react";
import { useState } from "react";

interface AEEActionsProps {
  project: DbProject;
}

export function AEEActions({ project }: AEEActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  const canReview =
    project.status === PROJECT_STATUSES.SUBMITTED_TO_AEE ||
    project.status === PROJECT_STATUSES.APPROVED ||
    project.status === PROJECT_STATUSES.ONGOING;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-xl shadow-sm">
        <h4 className="font-medium text-green-900 mb-2">
          Assistant Executive Engineer Actions
        </h4>
        <p className="text-sm text-green-700 mb-4">
          Review and approve projects for technical compliance
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("Technical Review")}
            disabled={!canReview || loading === "Technical Review"}
            variant="outline"
            className="flex items-center gap-2 text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-700 active:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <FileText className="h-4 w-4" />
            {loading === "Technical Review"
              ? "Reviewing..."
              : "Technical Review"}
          </Button>

          {/* <Button
            onClick={() => handleAction("Add Comments")}
            disabled={loading === "Add Comments"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {loading === "Add Comments" ? "Adding..." : "Add Comments"}
          </Button>

          <Button
            onClick={() => handleAction("Approve & Forward to CE")}
            disabled={!canReview || loading === "Approve & Forward to CE"}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            {loading === "Approve & Forward to CE"
              ? "Approving..."
              : "Approve & Forward to CE"}
          </Button>

          <Button
            onClick={() => handleAction("Reject & Return to JE")}
            disabled={!canReview || loading === "Reject & Return to JE"}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            {loading === "Reject & Return to JE"
              ? "Rejecting..."
              : "Reject & Return to JE"}
          </Button> */}
        </div>

        <div className="mt-3 text-xs text-green-600">
          💡 Current Status: {project.status} -{" "}
          {canReview ? "Ready for Review" : "Not in review stage"}
        </div>
      </div>
    </div>
  );
}
