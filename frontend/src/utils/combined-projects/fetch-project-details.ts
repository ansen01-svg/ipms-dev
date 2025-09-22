import { DbArchiveProject } from "@/types/archive-projects.types";
import { DbProject } from "@/types/projects.types";
import { fetchArchiveProjectById } from "@/utils/archive-projects/fetchAllrchiveProjects";
import { fetchProjectById } from "@/utils/projects/fetchAllProjects";

export interface UnifiedProjectDetails {
  id: string;
  name: string;
  contractorName: string;
  contractorPhone?: string;
  contractorAddress?: string;
  startDate: string;
  endDate?: string;
  location: string;
  workValue: number;
  projectType: "Project" | "ArchiveProject";

  // Additional details that might be useful
  workOrderNumber?: string;
  fund?: string;
  subFund?: string;
  district?: string;
  progress?: number;
  financialProgress?: number;
  billSubmittedAmount?: number;
  status?: string;

  // Original project object for reference
  originalProject: DbProject | DbArchiveProject;
}

/**
 * Fetch project details by projectId from either Project or ArchiveProject collections
 * This function will automatically detect which collection contains the project
 *
 * @param projectId - The project ID string to search for
 * @returns Promise<UnifiedProjectDetails | null> - Unified project details or null if not found
 */
export const fetchUnifiedProjectDetails = async (
  projectId: string
): Promise<UnifiedProjectDetails | null> => {
  if (!projectId || projectId.trim().length === 0) {
    return null;
  }

  const trimmedProjectId = projectId.trim();

  try {
    // First, try to fetch from regular projects collection
    try {
      const project = await fetchProjectById(trimmedProjectId);
      if (project) {
        return {
          id: project.projectId,
          name: project.projectName,
          contractorName: project.contractorName,
          contractorPhone: project.contractorPhoneNumber,
          contractorAddress: project.contractorAddress,
          startDate: project.projectStartDate,
          endDate: project.projectEndDate,
          location: project.district,
          workValue: project.estimatedCost,
          projectType: "Project",

          // Additional details
          workOrderNumber: project.workOrderNumber,
          fund: project.fund,
          subFund: project.subFund,
          district: project.district,
          progress: project.progressPercentage || project.progress,
          financialProgress: project.financialProgress,
          billSubmittedAmount: project.billSubmittedAmount,
          status: project.status,

          originalProject: project,
        };
      }
    } catch (regularProjectError) {
      console.log(
        regularProjectError,
        "Project not found in regular projects collection, trying archive projects..."
      );
    }

    // If not found in regular projects, try archive projects collection
    try {
      const archiveProject = await fetchArchiveProjectById(trimmedProjectId);
      if (archiveProject) {
        return {
          id: archiveProject.projectId,
          name: archiveProject.nameOfWork,
          contractorName: archiveProject.nameOfContractor,
          contractorPhone: undefined, // Archive projects might not have phone
          contractorAddress: undefined, // Archive projects might not have address
          startDate: archiveProject.FWODate || archiveProject.AADated,
          endDate: undefined, // Archive projects might not have explicit end date
          location: archiveProject.location,
          workValue: archiveProject.workValue,
          projectType: "ArchiveProject",

          // Additional details
          workOrderNumber: archiveProject.FWONumberAndDate,
          district: archiveProject.location,
          progress: archiveProject.progress,
          financialProgress: archiveProject.financialProgress,
          billSubmittedAmount: archiveProject.billSubmittedAmount,

          originalProject: archiveProject,
        };
      }
    } catch (archiveProjectError) {
      console.log(
        archiveProjectError,
        "Project not found in archive projects collection either"
      );
    }

    // If not found in either collection, return null
    return null;
  } catch (error) {
    console.error(
      `Error fetching project details for projectId ${projectId}:`,
      error
    );
    throw new Error(
      `Failed to fetch project details: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Validate if a projectId exists in either collection
 *
 * @param projectId - The project ID string to validate
 * @returns Promise<boolean> - True if project exists, false otherwise
 */
export const validateProjectExists = async (
  projectId: string
): Promise<boolean> => {
  try {
    const projectDetails = await fetchUnifiedProjectDetails(projectId);
    return projectDetails !== null;
  } catch (error) {
    console.error(
      `Error validating project existence for ${projectId}:`,
      error
    );
    return false;
  }
};

/**
 * Get project type for a given projectId
 *
 * @param projectId - The project ID string
 * @returns Promise<'Project' | 'ArchiveProject' | null> - Project type or null if not found
 */
export const getProjectType = async (
  projectId: string
): Promise<"Project" | "ArchiveProject" | null> => {
  try {
    const projectDetails = await fetchUnifiedProjectDetails(projectId);
    return projectDetails?.projectType || null;
  } catch (error) {
    console.error(`Error getting project type for ${projectId}:`, error);
    return null;
  }
};

/**
 * Batch fetch project details for multiple projectIds
 *
 * @param projectIds - Array of project ID strings
 * @returns Promise<Array<{projectId: string, details: UnifiedProjectDetails | null, error?: string}>>
 */
export const fetchMultipleProjectDetails = async (
  projectIds: string[]
): Promise<
  Array<{
    projectId: string;
    details: UnifiedProjectDetails | null;
    error?: string;
  }>
> => {
  const results = await Promise.allSettled(
    projectIds.map(async (projectId) => {
      try {
        const details = await fetchUnifiedProjectDetails(projectId);
        return { projectId, details };
      } catch (error) {
        return {
          projectId,
          details: null,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        projectId: projectIds[index],
        details: null,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Failed to fetch project details",
      };
    }
  });
};

/**
 * Format project details for display
 *
 * @param details - Unified project details
 * @returns Formatted project info for UI display
 */
export const formatProjectDetailsForDisplay = (
  details: UnifiedProjectDetails
) => {
  return {
    title: details.name,
    subtitle: `${details.projectType} • ${details.id}`,
    contractor: details.contractorPhone
      ? `${details.contractorName} (${details.contractorPhone})`
      : details.contractorName,
    location: details.location,
    workValue: `₹${details.workValue.toLocaleString()}`,
    dates: {
      start: new Date(details.startDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      end: details.endDate
        ? new Date(details.endDate).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Not specified",
    },
    progress: {
      physical: details.progress || 0,
      financial: details.financialProgress || 0,
    },
    fund:
      details.fund && details.subFund
        ? `${details.fund} - ${details.subFund}`
        : details.fund || "Not specified",
    workOrder: details.workOrderNumber || "Not specified",
  };
};

/**
 * Search projects by name or ID across both collections
 *
 * @param searchTerm - Search term to match against project name or ID
 * @param limit - Maximum number of results to return
 * @returns Promise<UnifiedProjectDetails[]> - Array of matching projects
 */
export const searchProjectsUnified = async (
  searchTerm: string,
  limit: number = 10
): Promise<UnifiedProjectDetails[]> => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const results: UnifiedProjectDetails[] = [];

  try {
    // This is a simplified search - in a real implementation, you might want to
    // call dedicated search endpoints that can search across both collections
    // For now, we'll just try exact matches and partial matches

    // Try exact match first
    const exactMatch = await fetchUnifiedProjectDetails(searchTerm.trim());
    if (exactMatch) {
      results.push(exactMatch);
    }

    // For partial matches, you would typically need backend support
    // This is just a placeholder for the concept

    return results.slice(0, limit);
  } catch (error) {
    console.error(`Error searching projects with term "${searchTerm}":`, error);
    return [];
  }
};
