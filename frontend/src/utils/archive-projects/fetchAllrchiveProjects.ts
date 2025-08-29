import { clearAuthData, getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import {
  ArchiveProjectFilterOptions,
  ArchiveProjectFilters,
  ArchiveProjectsResponse,
  DbArchiveProject,
} from "@/types/archive-projects.types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

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
      isOverdue: boolean;
      projectAge: number;
    };
    relatedProjects: {
      byContractor: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        workValue: number;
        financialYear: string;
      }>;
      byEngineer: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        workValue: number;
        financialYear: string;
      }>;
      byLocation: Array<{
        _id: string;
        nameOfWork: string;
        progress: number;
        workValue: number;
        financialYear: string;
      }>;
    };
  };
  metadata: {
    retrievedAt: string;
    projectId: string;
    financialYear: string;
    lastUpdated: string;
  };
}

// Fetch single archive project by ID - returns just the project data
// For token/cookies based auth
// export const fetchArchiveProjectById = async (projectId: string) => {
//   try {
//     if (!projectId) {
//       throw new Error("Project ID is required");
//     }

//     const url = `${API_BASE_URL}/archive-project/${projectId}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: ArchiveProjectByIdResponse = await response.json();

//     // The actual project data is nested under data.project
//     if (data.success && data.data && data.data.project) {
//       return data.data.project;
//     } else {
//       throw new Error(data.message || "Failed to fetch archive project");
//     }
//   } catch (error) {
//     console.error(
//       `Error fetching archive project with ID ${projectId}:`,
//       error
//     );
//   }
// };

// For localStorage based auth
export const fetchArchiveProjectById = async (projectId: string) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    // Get token from localStorage
    const token = getAuthToken();

    const url = `${API_BASE_URL}/archive-project/${projectId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  }
};

// Fetch single archive project by ID - returns full response with metrics and related projects
export const fetchArchiveProjectByIdWithDetails = async (projectId: string) => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const url = `${API_BASE_URL}/archive-project/${projectId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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
  }
};

// Fetch all archive projects with filters, pagination, sorting
// For token/cookies based auth
// export const fetchAllArchiveProjects = async (
//   filters: ArchiveProjectFilters = { limit: 5, page: 1 }
// ): Promise<ArchiveProjectsResponse> => {
//   try {
//     const queryString = buildQueryString(filters);
//     const url = `${API_BASE_URL}/archive-project${
//       queryString ? `?${queryString}` : ""
//     }`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: ArchiveProjectsResponse = await response.json();
//     console.log("Fetched archive projects data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching archive projects:", error);
//     throw new Error("Failed to fetch archive projects");
//   }
// };

// For localStorage based auth
export const fetchAllArchiveProjects = async (
  filters: ArchiveProjectFilters = { limit: 5, page: 1 }
): Promise<ArchiveProjectsResponse> => {
  try {
    // Get token from localStorage
    const token = getAuthToken();

    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/archive-project${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

// Fetch summary/statistics for archive projects
export const fetchArchiveProjectsSummary = async (
  filters: Pick<
    ArchiveProjectFilters,
    "financialYear" | "concernedEngineer"
  > = {}
): Promise<{ data: unknown }> => {
  try {
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/archive-projects/summary${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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

// Fetch filter options (unique values for dropdowns)
export const fetchArchiveProjectFilterOptions =
  async (): Promise<ArchiveProjectFilterOptions> => {
    try {
      const url = `${API_BASE_URL}/archive-project/filter-options`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

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
 * Fetch archive projects for dropdown/selection purposes
 * Returns a simplified list suitable for dropdowns
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
      progress: project.progress,
    }));
  } catch (error) {
    console.error("Error fetching projects for selection:", error);
    throw new Error("Failed to fetch projects for selection");
  }
};
