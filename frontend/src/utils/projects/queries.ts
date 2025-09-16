import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  CreateQueryRequest,
  CreateQueryResponse,
  EscalateQueryResponse,
  GetQueriesResponse,
  QueryFilters,
  RaisedQuery,
  UpdateQueryRequest,
} from "@/types/query.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
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

/**
 * Create a new query for a project
 * POST /api/projects/:id/queries
 */
export const createProjectQuery = async (
  projectId: string,
  queryData: CreateQueryRequest
): Promise<CreateQueryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/${projectId}/queries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create query");
  }

  return response.json();
};

/**
 * Get queries for a project with filtering and pagination
 * GET /api/projects/:id/queries
 */
export const getProjectQueries = async (
  projectId: string,
  filters?: QueryFilters & {
    page?: number;
    limit?: number;
  }
): Promise<GetQueriesResponse> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/project/${projectId}/queries${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await makeAuthenticatedRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch project queries");
  }

  return response.json();
};

/**
 * Get project queries summary
 * GET /api/projects/:id/queries/summary
 */
export const getProjectQueriesSummary = async (
  projectId: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    projectInfo: {
      projectId: string;
      projectName: string;
      status: string;
      district: string;
    };
    summary: {
      total: number;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
      byCategory: Record<string, number>;
      overdue: number;
      dueThisWeek: number;
      escalated: number;
      avgEscalationLevel: number;
    };
    recentQueries: Array<{
      queryId: string;
      queryTitle: string;
      status: string;
      priority: string;
      raisedDate: Date;
      daysSinceRaised: number;
      isOverdue: boolean;
    }>;
    criticalQueries: Array<{
      queryId: string;
      queryTitle: string;
      status: string;
      priority: string;
      escalationLevel: number;
      expectedResolutionDate: Date;
      daysOverdue: number | null;
      urgencyReason: string;
    }>;
    insights: {
      resolutionRate: number;
      avgDaysToResolve: number;
      mostCommonCategory: string;
      needsAttention: boolean;
    };
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/${projectId}/queries/summary`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch queries summary");
  }

  return response.json();
};

/**
 * Get a single query by queryId
 * GET /api/projects/queries/:queryId
 */
export const getQueryById = async (
  queryId: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    projectInfo: {
      projectId: string;
      projectName: string;
      district: string;
      status: string;
    };
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/queries/${queryId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch query");
  }

  return response.json();
};

/**
 * Update a query
 * PUT /api/projects/queries/:queryId
 */
export const updateQuery = async (
  queryId: string,
  updateData: UpdateQueryRequest
): Promise<{
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    changes: Record<string, { from: string; to: string }>;
    projectInfo: {
      projectId: string;
      projectName: string;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/queries/${queryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update query");
  }

  return response.json();
};

/**
 * Delete (soft delete) a query
 * DELETE /api/projects/queries/:queryId
 */
export const deleteQuery = async (
  queryId: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    queryId: string;
    deletedAt: string;
  };
  metadata: {
    deletedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/queries/${queryId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete query");
  }

  return response.json();
};

/**
 * Escalate a query
 * PUT /api/projects/queries/:queryId/escalate
 */
export const escalateQuery = async (
  queryId: string,
  reason?: string
): Promise<EscalateQueryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/queries/${queryId}/escalate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: reason || "" }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to escalate query");
  }

  return response.json();
};

/**
 * Get queries that need attention
 * GET /api/projects/queries/needs-attention
 */
export const getQueriesNeedingAttention = async (filters?: {
  district?: string;
  fund?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  message: string;
  data: {
    queries: Array<
      RaisedQuery & {
        projectInfo: {
          projectId: string;
          projectName: string;
          district: string;
          fund: string;
          status: string;
        };
        attentionReasons: string[];
        daysOverdue: number;
        daysSinceRaised: number;
        urgencyScore: number;
      }
    >;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    summary: {
      totalNeedingAttention: number;
      urgent: number;
      overdue: number;
      escalated: number;
    };
    filters: {
      district?: string;
      fund?: string;
      assignedTo?: string;
    };
  };
}> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/project/queries/needs-attention${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await makeAuthenticatedRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch queries needing attention"
    );
  }

  return response.json();
};

// Re-export helper functions from archive project queries (since they're the same)
export {
  formatDate,
  getCategoryColor,
  getDaysDifference,
  getPriorityColor,
  getStatusColor,
  isQueryOverdue,
  validateQueryUpdate,
} from "@/utils/archive-projects/queries";
