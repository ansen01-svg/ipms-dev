"use client";

import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { Edit } from "lucide-react";
import { useState } from "react";

interface JEActionsProps {
  project: DbProject;
}

export function JEActions({ project }: JEActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    // Simulate API call
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  const canEdit =
    project.status === PROJECT_STATUSES.DRAFT ||
    project.status === PROJECT_STATUSES.REJECTED_BY_AEE ||
    project.status === PROJECT_STATUSES.APPROVED ||
    project.status === PROJECT_STATUSES.ONGOING;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-medium text-teal-900 mb-2">
          Junior Engineer Actions
        </h4>
        <p className="text-sm text-teal-700 mb-4">
          You can edit, submit, and manage your own projects
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("Edit Project")}
            disabled={!canEdit || loading === "Edit Project"}
            variant="outline"
            className="flex items-center gap-2 text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-700 active:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Edit className="h-4 w-4 transition-transform duration-200" />
            {loading === "Edit Project" ? "Editing..." : "Update Progress"}
          </Button>

          {/* Draft button */}
          {/* <Button
            onClick={() => handleAction("Save Draft")}
            disabled={loading === "Save Draft"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading === "Save Draft" ? "Saving..." : "Save Draft"}
          </Button> */}

          {/* Upload documents button */}
          {/* <Button
            onClick={() => handleAction("Upload Documents")}
            disabled={loading === "Upload Documents"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileUp className="h-4 w-4" />
            {loading === "Upload Documents"
              ? "Uploading..."
              : "Upload Documents"}
          </Button> */}

          {/* Submit button */}
          {/* <Button
            onClick={() => handleAction("Submit for Review")}
            disabled={!canSubmit || loading === "Submit for Review"}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            {loading === "Submit for Review"
              ? "Submitting..."
              : "Submit for Review"}
          </Button> */}
        </div>

        <div className="mt-3 text-xs text-teal-600">
          💡 Current Status: {project.status} -{" "}
          {canEdit ? "Editable" : "Read-only"}
        </div>
      </div>
    </div>
  );
}
