"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { BarChart3, Edit, IndianRupeeIcon, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FinancialProgressUpdateModal } from "../financial-progress-update-modal";
import { ProgressUpdateModal } from "../physical-progress-update-modal";

interface JEActionsProps {
  project: DbProject;
  onProjectUpdate?: (updatedProject: DbProject) => void;
}

export function JEActions({ project, onProjectUpdate }: JEActionsProps) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const router = useRouter();

  const { user } = useAuth();
  const isProjectCreator = user?.name === project.createdBy.name;

  const handleProgressUpdateSuccess = (updatedProject: DbProject) => {
    // Update the parent component with the new project data
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setIsProgressModalOpen(false);
  };

  const handleFinancialProgressUpdateSuccess = (updatedProject: DbProject) => {
    // Update the parent component with the new project data
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setIsFinancialModalOpen(false);
  };

  const handleEditProject = () => {
    // Navigate to edit page with project ID
    router.push(`/dashboard/projects/${project.projectId}/edit`);
  };

  const canUpdatePhysicalProgress =
    project.status === PROJECT_STATUSES.ONGOING &&
    !project.isProjectEditable &&
    (project.progressPercentage || 0) < 100 &&
    isProjectCreator;

  const canUpdateFinancialProgress =
    project.status === PROJECT_STATUSES.ONGOING &&
    !project.isProjectEditable &&
    ((project as DbProject).billSubmittedAmount || 0) < project.estimatedCost &&
    isProjectCreator;

  const canEditProject = project.isProjectEditable && isProjectCreator;

  // Get current values for display
  const currentBillAmount = (project as DbProject).billSubmittedAmount || 0;
  const currentFinancialProgress =
    (project as DbProject).financialProgress || 0;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-medium text-teal-900 mb-2">
          Junior Engineer Actions
        </h4>
        <p className="text-sm text-teal-700 mb-6">
          Update project progress and manage financial submissions with
          supporting documents
        </p>

        {/* Current Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              <h5 className="font-medium text-teal-900">Physical Progress</h5>
            </div>
            <div className="text-2xl font-bold text-teal-700 mb-1">
              {project.progressPercentage || 0}%
            </div>
            <div className="text-sm text-teal-600">
              Status: {project.status}
            </div>
            {(project as DbProject).lastProgressUpdate && (
              <div className="text-xs text-teal-500 mt-1">
                Last updated:{" "}
                {new Date(project.lastProgressUpdate ?? "").toLocaleDateString(
                  "en-IN"
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupeeIcon className="h-5 w-5 text-blue-600" />
              <h5 className="font-medium text-blue-900">Financial Progress</h5>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {currentFinancialProgress.toFixed(1)}%
            </div>
            <div className="text-sm text-blue-600">
              Bill: ₹{(currentBillAmount / 100000).toFixed(1)}L / ₹
              {(project.estimatedCost / 100000).toFixed(1)}L
            </div>
            {(project as DbProject).lastFinancialProgressUpdate && (
              <div className="text-xs text-blue-500 mt-1">
                Last updated:{" "}
                {new Date(
                  project.lastFinancialProgressUpdate ?? ""
                ).toLocaleDateString("en-IN")}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Edit Project Button - Only for rejected projects */}
          {canEditProject && (
            <Button
              onClick={handleEditProject}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Edit className="h-4 w-4 transition-transform duration-200" />
              Edit Project
            </Button>
          )}

          <Button
            onClick={() => setIsProgressModalOpen(true)}
            disabled={!canUpdatePhysicalProgress}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <TrendingUp className="h-4 w-4 transition-transform duration-200" />
            Update Physical Progress
          </Button>

          <Button
            onClick={() => setIsFinancialModalOpen(true)}
            disabled={!canUpdateFinancialProgress}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <IndianRupeeIcon className="h-4 w-4 transition-transform duration-200" />
            Update Financial Progress
          </Button>
        </div>

        {/* Status Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="text-teal-600">
            <div className="font-medium">Physical Progress:</div>
            <div>
              Current: {project.progressPercentage || 0}% • Status:{" "}
              {project.status}
              {!canUpdatePhysicalProgress &&
                (project.progressPercentage || 0) >= 100 &&
                " (Completed)"}
              {!canUpdatePhysicalProgress &&
                project.status !== PROJECT_STATUSES.ONGOING &&
                " (Not Ready for Updates)"}
            </div>
          </div>
          <div className="text-blue-600">
            <div className="font-medium">Financial Progress:</div>
            <div>
              Current: {currentFinancialProgress.toFixed(1)}% • Remaining: ₹
              {((project.estimatedCost - currentBillAmount) / 100000).toFixed(
                1
              )}
              L
              {!canUpdateFinancialProgress &&
                currentBillAmount >= project.estimatedCost &&
                " (Completed)"}
              {!canUpdateFinancialProgress &&
                project.status !== PROJECT_STATUSES.ONGOING &&
                " (Not Ready for Updates)"}
            </div>
          </div>
        </div>

        {/* Project Edit Information */}
        {canEditProject && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Project Editable</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              This project is currently editable. You can make changes and
              resubmit for approval.
            </div>
          </div>
        )}

        {/* Progress Bar Visualization */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Physical Progress</span>
              <span>{project.progressPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(project.progressPercentage || 0, 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Financial Progress</span>
              <span>{currentFinancialProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(currentFinancialProgress, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Completion Status */}
        {(project.progressPercentage || 0) === 100 &&
          currentFinancialProgress >= 100 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Project Fully Complete
                </span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                Both physical work and financial settlement are complete
              </div>
            </div>
          )}

        <div className="mt-3 text-xs text-teal-600">
          💡 Current Status: {project.status} -{" "}
          {canUpdatePhysicalProgress && canUpdateFinancialProgress
            ? "Editable"
            : canEditProject
            ? "Can Edit Project"
            : "Read-only"}
          {canUpdatePhysicalProgress || canUpdateFinancialProgress
            ? " • Progress updates available"
            : canEditProject
            ? " • Project editing available"
            : ""}
        </div>
      </div>

      {/* Physical Progress Update Modal */}
      <ProgressUpdateModal
        project={project}
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        onSuccess={handleProgressUpdateSuccess}
      />

      {/* Financial Progress Update Modal */}
      <FinancialProgressUpdateModal
        project={project}
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        onSuccess={handleFinancialProgressUpdateSuccess}
      />
    </>
  );
}
