"use client";

import { DbProject } from "@/types/projects.types";
import { User, UserRole } from "@/types/user.types";
import { fetchProjectById } from "@/utils/projects/fetchAllProjects";
import { useCallback, useEffect, useState } from "react";
import ProjectDetailsSkeleton from "./loading-skeleton";
import { ProjectNotFound } from "./not-found";
import { ProjectHeader } from "./project-header";
import { ProjectStats } from "./project-stats";
import { ProjectTabs } from "./project-tabs";
import { RoleActionSelector } from "./role-action-selector";

interface ProjectsContainerProps {
  user: User;
  activeTab: string;
  projectId: string;
}

// Helper function to ensure project has all required calculated fields for backward compatibility
const enrichProjectData = (project: DbProject): DbProject => {
  const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Mock budget utilization calculation (since it's not in the interface yet)
  // In a real scenario, this would come from the backend or be calculated
  const mockBudgetUtilized =
    project.estimatedCost * (project.progressPercentage / 100) * 0.8;

  // Add financial progress fields if they don't exist
  const billSubmittedAmount = (project as DbProject).billSubmittedAmount || 0;
  const financialProgress =
    project.estimatedCost > 0
      ? (billSubmittedAmount / project.estimatedCost) * 100
      : 0;

  return {
    ...project,
    // Ensure backward compatibility fields are present
    daysRemaining: calculateDaysRemaining(project.projectEndDate),
    currentStage: project.status,
    lastUpdated: project.updatedAt,
    totalSubProjects: project.subProjects ? project.subProjects.length : 0,
    progress: project.progressPercentage, // Alias for backward compatibility
    budgetUtilized: mockBudgetUtilized,
    // Add financial fields
    billSubmittedAmount,
    financialProgress,
  };
};

export default function ProjectContainer({
  user,
  activeTab,
  projectId,
}: ProjectsContainerProps) {
  const [currentProject, setCurrentProject] = useState<DbProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const fetchedProject = await fetchProjectById(projectId);

      if (fetchedProject) {
        // Enrich the project data with calculated fields
        const enrichedProject = enrichProjectData(fetchedProject);
        setCurrentProject(enrichedProject);
      } else {
        console.log("Project not found");
        setCurrentProject(null);
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError(err instanceof Error ? err.message : "Failed to load project");
      setCurrentProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [projectId, loadProject]);

  // Handle project updates from child components
  const handleProjectUpdate = useCallback((updatedProject: DbProject) => {
    // Enrich the updated project data and set it
    const enrichedProject = enrichProjectData(updatedProject);
    setCurrentProject(enrichedProject);
  }, []);

  // Retry function
  const retryLoadProject = () => {
    setError(null);
    setCurrentProject(null);
    loadProject();
  };

  // Show loading state while fetching project
  if (isLoading) {
    return (
      <ProjectDetailsSkeleton
        showHeader={true}
        showDetails={true}
        showStats={true}
      />
    );
  }

  // Show error state with option to retry
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="text-red-800 font-medium text-lg">
              Failed to load project
            </div>
          </div>

          <div className="text-red-700 text-sm mb-4 leading-relaxed">
            {error}
          </div>

          <div className="flex gap-3">
            <button
              onClick={retryLoadProject}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
            >
              {isLoading ? "Retrying..." : "Try Again"}
            </button>

            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors duration-200"
            >
              Go Back
            </button>
          </div>

          <div className="mt-4 p-3 bg-red-100 rounded border border-red-200">
            <div className="text-red-800 text-xs font-medium mb-1">
              Troubleshooting:
            </div>
            <ul className="text-red-700 text-xs space-y-1 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>
                Verify the project ID is correct:{" "}
                <code className="bg-red-200 px-1 rounded">{projectId}</code>
              </li>
              <li>Ensure you have permission to view this project</li>
              <li>The project may have been deleted or moved</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If no project found, show not found
  if (!currentProject) {
    return <ProjectNotFound projectId={projectId} />;
  }

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <ProjectHeader project={currentProject} user={user} />

      {/* Role-Based Action Buttons */}
      <RoleActionSelector
        user={user}
        project={currentProject}
        onProjectUpdate={handleProjectUpdate}
      />

      {/* Project Statistics Cards */}
      <ProjectStats project={currentProject} />

      {/* Project Tabs Content */}
      <ProjectTabs
        project={currentProject}
        userRole={user?.role as UserRole}
        activeTab={activeTab}
      />
    </div>
  );
}
