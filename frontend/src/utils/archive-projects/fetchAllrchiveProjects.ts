import { clearAuthData, getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import {
  ArchiveProjectFilterOptions,
  ArchiveProjectFilters,
  ArchiveProjectsResponse,
  DbArchiveProject,
  FinancialProgressStatisticsResponse,
  ProgressStatisticsResponse,
  ProjectCompletionStatusResponse,
} from "@/types/archive-projects.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle authentication errors
  if (response.status === 401) {
    console.error("Authentication failed - clearing stored data");
    clearAuthData();
    window.location.replace("/login");
    throw new Error("Authentication expired");
  }

  return response;
};

// Build query string from filters
const buildQueryString = (filters: ArchiveProjectFilters): string => {
  const params = new URLSearchParams();

  // Handle basic filters
  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      if (Array.isArray(value)) {
        // Handle array values (multiple selections)
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params.toString();
};

// Response type for single archive project with additional data
export interface ArchiveProjectByIdResponse {
  success: boolean;
  message: string;
  data: {
    project: DbArchiveProject;
    metrics: {
      daysFromAAToFWO: number | null;
      daysFromFWOToNow: number | null;
      billSubmissionRate: number;
      isPhysicallyOverdue: boolean;
      isFinanciallyOverdue: boolean;
      projectAge: number;
      progressGap: number;
      isFullyComplete: boolean;
    };
    relatedProjects: {
      byContractor: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        financialProgress: number;
        workValue: number;
        financialYear: string;
        billSubmittedAmount: number;
        progressSummary: {
          physical: {
            percentage: number;
            status: string;
          };
          financial: {
            percentage: number;
            status: string;
          };
        };
      }>;
      byEngineer: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        financialProgress: number;
        workValue: number;
        financialYear: string;
        billSubmittedAmount: number;
        progressSummary: {
          physical: {
            percentage: number;
            status: string;
          };
          financial: {
            percentage: number;
            status: string;
          };
        };
      }>;
      byLocation: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        financialProgress: number;
        workValue: number;
        financialYear: string;
        billSubmittedAmount: number;
        progressSummary: {
          physical: {
            percentage: number;
            status: string;
          };
          financial: {
            percentage: number;
            status: string;
          };
        };
      }>;
    };
  };
  metadata: {
    retrievedAt: string;
    projectId: string;
    financialYear: string;
    lastUpdated: string;
    lastProgressUpdate: string | null;
    lastFinancialProgressUpdate: string | null;
  };
}

/**
 * Fetch single archive project by ID with enhanced financial progress data
 */
export const fetchArchiveProjectById = async (
  projectId: string
): Promise<DbArchiveProject | undefined> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const url = `${API_BASE_URL}/archive-project/${projectId}`;
    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArchiveProjectByIdResponse = await response.json();

    // The actual project data is nested under data.project
    if (data.success && data.data && data.data.project) {
      return data.data.project;
    } else {
      throw new Error(data.message || "Failed to fetch archive project");
    }
  } catch (error) {
    console.error(
      `Error fetching archive project with ID ${projectId}:`,
      error
    );
    throw error;
  }
};

/**
 * Fetch single archive project by ID with full details including metrics and related projects
 */
export const fetchArchiveProjectByIdWithDetails = async (
  projectId: string
): Promise<ArchiveProjectByIdResponse | undefined> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const url = `${API_BASE_URL}/archive-project/${projectId}`;
    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArchiveProjectByIdResponse = await response.json();
    console.log("Fetched archive project with details:", data);

    if (data.success && data.data) {
      return data;
    } else {
      throw new Error(
        data.message || "Failed to fetch archive project details"
      );
    }
  } catch (error) {
    console.error(
      `Error fetching archive project details with ID ${projectId}:`,
      error
    );
    throw error;
  }
};

/**
 * Fetch all archive projects with enhanced financial progress filters
 */
export const fetchAllArchiveProjects = async (
  filters: ArchiveProjectFilters = { limit: 5, page: 1 }
): Promise<ArchiveProjectsResponse> => {
  try {
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/archive-project${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArchiveProjectsResponse = await response.json();
    console.log("Fetched archive projects data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching archive projects:", error);
    throw new Error("Failed to fetch archive projects");
  }
};

/**
 * Fetch summary/statistics for archive projects with financial progress data
 */
export const fetchArchiveProjectsSummary = async (
  filters: Pick<
    ArchiveProjectFilters,
    "financialYear" | "concernedEngineer"
  > = {}
): Promise<{
  success: boolean;
  message: string;
  data: {
    overview: {
      totalProjects: number;
      totalWorkValue: number;
      totalAAAmount: number;
      totalBillSubmitted: number;
      avgProgress: number;
      avgFinancialProgress: number;
      maxWorkValue: number;
      minWorkValue: number;
      completedProjects: number;
      financiallyCompletedProjects: number;
      fullyCompletedProjects: number;
      inProgressProjects: number;
      financiallyInProgressProjects: number;
      notStartedProjects: number;
      financiallyNotStartedProjects: number;
      completionRate: number;
      financialCompletionRate: number;
      fullCompletionRate: number;
      totalRemainingValue: number;
      billSubmissionRate: number;
    };
    topContractors: Array<{
      name: string;
      projectCount: number;
      totalValue: number;
      avgProgress: number;
      avgFinancialProgress: number;
    }>;
    topEngineers: Array<{
      name: string;
      projectCount: number;
      totalValue: number;
      avgProgress: number;
      avgFinancialProgress: number;
    }>;
  };
  filters: {
    financialYear: string | null;
    concernedEngineer: string | null;
  };
}> => {
  try {
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/archive-project/summary${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching archive projects summary:", error);
    throw new Error("Failed to fetch archive projects summary");
  }
};

/**
 * Fetch filter options with financial progress statuses
 */
export const fetchArchiveProjectFilterOptions =
  async (): Promise<ArchiveProjectFilterOptions> => {
    try {
      const url = `${API_BASE_URL}/archive-project/filter-options`;
      const response = await makeAuthenticatedRequest(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ArchiveProjectFilterOptions = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching archive project filter options:", error);
      throw new Error("Failed to fetch filter options");
    }
  };

/**
 * Fetch archive projects for dropdown/selection purposes with financial data
 */
export const fetchArchiveProjectsForSelection = async () => {
  try {
    const response = await fetchAllArchiveProjects({
      limit: 200, // Load more for selection
      page: 1,
      sortBy: "nameOfWork",
      sortOrder: "asc",
    });

    return response.data.map((project) => ({
      id: project.projectId,
      name: project.nameOfWork,
      workOrderNumber: project.FWONumberAndDate,
      location: project.location,
      contractor: project.nameOfContractor,
      workValue: project.workValue,
      progress: project.progress || 0,
      financialProgress: project.financialProgress || 0,
      billSubmittedAmount: project.billSubmittedAmount || 0,
      isPhysicallyComplete: (project.progress || 0) === 100,
      isFinanciallyComplete: (project.financialProgress || 0) === 100,
      isFullyComplete:
        (project.progress || 0) === 100 &&
        (project.financialProgress || 0) === 100,
    }));
  } catch (error) {
    console.error("Error fetching projects for selection:", error);
    throw new Error("Failed to fetch projects for selection");
  }
};

/**
 * Get project completion status (both physical and financial)
 * GET /api/archive-project/:id/completion-status
 */
export const fetchProjectCompletionStatus = async (
  projectId: string
): Promise<ProjectCompletionStatusResponse> => {
  try {
    const url = `${API_BASE_URL}/archive-project/${projectId}/completion-status`;
    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching completion status:", error);
    throw new Error("Failed to fetch completion status");
  }
};

/**
 * Get progress statistics across projects
 * GET /api/archive-project/progress/statistics
 */
export const fetchProgressStatistics = async (filters?: {
  financialYear?: string;
  concernedEngineer?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ProgressStatisticsResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/archive-project/progress/statistics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching progress statistics:", error);
    throw new Error("Failed to fetch progress statistics");
  }
};

/**
 * Get financial progress statistics across projects
 * GET /api/archive-project/financial-progress/statistics
 */
export const fetchFinancialProgressStatistics = async (filters?: {
  financialYear?: string;
  concernedEngineer?: string;
  startDate?: string;
  endDate?: string;
}): Promise<FinancialProgressStatisticsResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/archive-project/financial-progress/statistics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching financial progress statistics:", error);
    throw new Error("Failed to fetch financial progress statistics");
  }
};

/**
 * Toggle progress updates for a project
 * PATCH /api/archive-project/:id/progress/toggle
 */
export const toggleProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string; data: unknown }> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/archive-project/${projectId}/progress/toggle`,
      {
        method: "PATCH",
        body: JSON.stringify({ enabled }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error toggling progress updates:", error);
    throw new Error("Failed to toggle progress updates");
  }
};

/**
 * Toggle financial progress updates for a project
 * PATCH /api/archive-project/:id/financial-progress/toggle
 */
export const toggleFinancialProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string; data: unknown }> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/archive-project/${projectId}/financial-progress/toggle`,
      {
        method: "PATCH",
        body: JSON.stringify({ enabled }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error toggling financial progress updates:", error);
    throw new Error("Failed to toggle financial progress updates");
  }
};

/**
 * Toggle both progress update types at once
 * PATCH /api/archive-project/:id/progress/toggle-all
 */
export const toggleAllProgressUpdates = async (
  projectId: string,
  options: {
    progressEnabled?: boolean;
    financialProgressEnabled?: boolean;
  }
): Promise<{ success: boolean; message: string; data: unknown }> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/archive-project/${projectId}/progress/toggle-all`,
      {
        method: "PATCH",
        body: JSON.stringify(options),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error toggling all progress updates:", error);
    throw new Error("Failed to toggle progress updates");
  }
};

/**
 * Bulk update progress for multiple projects (Admin only)
 * POST /api/archive-project/bulk/progress-update
 */
export const bulkUpdateProgress = async (
  updates: Array<{
    projectId: string;
    progress?: number;
    financialProgress?: number;
    remarks?: string;
  }>
): Promise<{
  success: boolean;
  message: string;
  data: {
    successful: Array<{
      projectId: string;
      status: string;
      previousProgress?: number;
      newProgress?: number;
      previousFinancialProgress?: number;
      newFinancialProgress?: number;
    }>;
    failed: Array<{
      projectId: string;
      error: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/archive-project/bulk/progress-update`,
      {
        method: "POST",
        body: JSON.stringify({ updates }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in bulk progress update:", error);
    throw new Error("Failed to perform bulk progress update");
  }
};

// Advanced search and filtering functions

/**
 * Search projects by multiple criteria with financial progress filters
 */
export const searchArchiveProjectsAdvanced = async (searchCriteria: {
  textSearch?: string;
  financialYear?: string[];
  engineers?: string[];
  contractors?: string[];
  locations?: string[];
  progressRange?: { min: number; max: number };
  financialProgressRange?: { min: number; max: number };
  workValueRange?: { min: number; max: number };
  dateRanges?: {
    aa?: { start: string; end: string };
    fwo?: { start: string; end: string };
    created?: { start: string; end: string };
  };
  completionStatus?: "physical" | "financial" | "both" | "none" | "partial";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
}) => {
  try {
    const filters: ArchiveProjectFilters = {
      search: searchCriteria.textSearch,
      financialYear: searchCriteria.financialYear,
      concernedEngineer: searchCriteria.engineers,
      nameOfContractor: searchCriteria.contractors?.[0], // API expects string, not array
      location: searchCriteria.locations?.[0], // API expects string, not array
      minProgress: searchCriteria.progressRange?.min,
      maxProgress: searchCriteria.progressRange?.max,
      minFinancialProgress: searchCriteria.financialProgressRange?.min,
      maxFinancialProgress: searchCriteria.financialProgressRange?.max,
      minWorkValue: searchCriteria.workValueRange?.min,
      maxWorkValue: searchCriteria.workValueRange?.max,
      startAADate: searchCriteria.dateRanges?.aa?.start,
      endAADate: searchCriteria.dateRanges?.aa?.end,
      startFWODate: searchCriteria.dateRanges?.fwo?.start,
      endFWODate: searchCriteria.dateRanges?.fwo?.end,
      startCreatedDate: searchCriteria.dateRanges?.created?.start,
      endCreatedDate: searchCriteria.dateRanges?.created?.end,
      sortBy: searchCriteria.sortBy as keyof DbArchiveProject,
      sortOrder: searchCriteria.sortOrder,
      limit: searchCriteria.limit || 20,
      page: searchCriteria.page || 1,
    };

    // Handle completion status filter
    if (searchCriteria.completionStatus) {
      switch (searchCriteria.completionStatus) {
        case "physical":
          filters.minProgress = 100;
          filters.maxProgress = 100;
          break;
        case "financial":
          filters.minFinancialProgress = 100;
          filters.maxFinancialProgress = 100;
          break;
        case "both":
          filters.minProgress = 100;
          filters.maxProgress = 100;
          filters.minFinancialProgress = 100;
          filters.maxFinancialProgress = 100;
          break;
        case "none":
          filters.maxProgress = 0;
          filters.maxFinancialProgress = 0;
          break;
        case "partial":
          // Projects that are neither 0% nor 100% complete
          filters.minProgress = 1;
          filters.maxProgress = 99;
          break;
      }
    }

    return await fetchAllArchiveProjects(filters);
  } catch (error) {
    console.error("Error in advanced search:", error);
    throw new Error("Advanced search failed");
  }
};

/**
 * Export archive projects data to CSV/Excel format
 */
export const exportArchiveProjectsData = async (
  filters?: ArchiveProjectFilters,
  format: "csv" | "excel" = "csv"
): Promise<Blob> => {
  try {
    const queryString = buildQueryString({
      ...filters,
      limit: 10000, // Export all matching records
      page: 1,
    });

    const url = `${API_BASE_URL}/archive-project/export?format=${format}${
      queryString ? `&${queryString}` : ""
    }`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error(`Export failed! status: ${response.status}`);
    }

    return response.blob();
  } catch (error) {
    console.error("Error exporting archive projects data:", error);
    throw new Error("Failed to export data");
  }
};
