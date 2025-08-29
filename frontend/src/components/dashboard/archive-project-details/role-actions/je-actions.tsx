"use client";

import { Button } from "@/components/ui/button";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { ProgressUpdateModal } from "../progress-update-modal";

interface ArchiveJEActionsProps {
  project: DbArchiveProject;
  onProjectUpdate?: (updatedProject: DbArchiveProject) => void;
}

export default function ArchiveJEActions({
  project,
  onProjectUpdate,
}: ArchiveJEActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProgressUpdateSuccess = (updatedProject: DbArchiveProject) => {
    // Update the parent component with the new project data
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setIsModalOpen(false);
  };

  const canUpdateProgress =
    project.progressUpdatesEnabled !== false && project.progress < 100;

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-medium text-teal-900 mb-2">
          Junior Engineer Actions
        </h4>
        <p className="text-sm text-teal-700 mb-4">
          Update project progress and upload supporting documents
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!canUpdateProgress}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <TrendingUp className="h-4 w-4 transition-transform duration-200" />
            Update Progress
          </Button>
        </div>

        <div className="mt-3 text-xs text-teal-600">
          Current Progress: {project.progress}% • Status:{" "}
          {project.progressStatus}
          {!canUpdateProgress && project.progress >= 100 && " (Completed)"}
          {!canUpdateProgress &&
            !project.progressUpdatesEnabled &&
            " (Updates Disabled)"}
        </div>
      </div>

      <ProgressUpdateModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProgressUpdateSuccess}
      />
    </>
  );
}
