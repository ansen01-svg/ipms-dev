import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  CreateQueryRequest,
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
 * POST /api/archive-projects/:id/queries
 */
export const createQuery = async (
  projectId: string,
  queryData: CreateQueryRequest
): Promise<{
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    projectInfo: {
      projectId: string;
      nameOfWork: string;
      concernedEngineer: string;
    };
  };
  metadata: {
    createdAt: string;
    createdBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    totalQueriesForProject: number;
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/queries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryTitle: queryData.queryTitle.trim(),
        queryDescription: queryData.queryDescription.trim(),
        queryCategory: queryData.queryCategory,
        priority: queryData.priority,
        expectedResolutionDate: queryData.expectedResolutionDate,
        assignedTo: queryData.assignedTo?.trim() || undefined,
      }),
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
 * GET /api/archive-projects/:id/queries
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

  const url = `${API_BASE_URL}/archive-project/${projectId}/queries${
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
 * Get a single query by queryId
 * GET /api/queries/:queryId
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
      nameOfWork: string;
      concernedEngineer: string;
      location: string;
    };
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/queries/${queryId}`,
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
 * PUT /api/queries/:queryId
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
      nameOfWork: string;
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
    `${API_BASE_URL}/archive-project/queries/${queryId}`,
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
 * DELETE /api/queries/:queryId
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
    `${API_BASE_URL}/archive-project/queries/${queryId}`,
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
 * PUT /api/queries/:queryId/escalate
 */
export const escalateQuery = async (
  queryId: string,
  reason?: string
): Promise<EscalateQueryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/queries/${queryId}/escalate`,
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

// Helper functions for status and priority styling
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Open":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Under Review":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-300";
    case "Closed":
      return "bg-gray-100 text-gray-600 border-gray-300";
    case "Escalated":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "bg-green-100 text-green-800 border-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Urgent":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Technical":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Financial":
      return "bg-green-100 text-green-800 border-green-300";
    case "Administrative":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Legal":
      return "bg-red-100 text-red-800 border-red-300";
    case "Compliance":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Design":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "Material":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Safety":
      return "bg-red-100 text-red-800 border-red-300";
    case "Environmental":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const validateQueryCreate = (queryData: {
  queryTitle: string;
  queryDescription: string;
  queryCategory: string;
  priority: string;
  expectedResolutionDate: string;
  assignedTo?: string;
}) => {
  const errors: Record<string, string> = {};

  // Query Title validation
  if (!queryData.queryTitle || queryData.queryTitle.trim().length === 0) {
    errors.queryTitle = "Query title is required";
  } else if (queryData.queryTitle.trim().length < 5) {
    errors.queryTitle = "Query title must be at least 5 characters";
  } else if (queryData.queryTitle.trim().length > 200) {
    errors.queryTitle = "Query title cannot exceed 200 characters";
  }

  // Query Description validation
  if (
    !queryData.queryDescription ||
    queryData.queryDescription.trim().length === 0
  ) {
    errors.queryDescription = "Query description is required";
  } else if (queryData.queryDescription.trim().length < 20) {
    errors.queryDescription =
      "Query description must be at least 20 characters";
  } else if (queryData.queryDescription.trim().length > 2000) {
    errors.queryDescription = "Query description cannot exceed 2000 characters";
  }

  // Query Category validation
  if (!queryData.queryCategory || queryData.queryCategory.trim().length === 0) {
    errors.queryCategory = "Query category is required";
  }

  // Priority validation
  if (!queryData.priority || queryData.priority.trim().length === 0) {
    errors.priority = "Priority is required";
  } else {
    const validPriorities = ["Low", "Medium", "High", "Urgent"];
    if (!validPriorities.includes(queryData.priority)) {
      errors.priority = "Priority must be Low, Medium, High, or Urgent";
    }
  }

  // Expected Resolution Date validation
  if (
    !queryData.expectedResolutionDate ||
    queryData.expectedResolutionDate.trim().length === 0
  ) {
    errors.expectedResolutionDate = "Expected resolution date is required";
  } else {
    const expectedDate = new Date(queryData.expectedResolutionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (isNaN(expectedDate.getTime())) {
      errors.expectedResolutionDate = "Please provide a valid date";
    } else if (expectedDate <= today) {
      errors.expectedResolutionDate =
        "Expected resolution date must be in the future";
    }
  }

  // Assigned To validation (optional field)
  if (queryData.assignedTo && queryData.assignedTo.trim().length > 100) {
    errors.assignedTo = "Assigned to field cannot exceed 100 characters";
  }

  return errors;
};

// Validation helpers
export const validateQueryUpdate = (updateData: UpdateQueryRequest) => {
  const errors: Record<string, string> = {};

  if (updateData.queryTitle && updateData.queryTitle.trim().length < 5) {
    errors.queryTitle = "Query title must be at least 5 characters";
  }

  if (updateData.queryTitle && updateData.queryTitle.trim().length > 200) {
    errors.queryTitle = "Query title cannot exceed 200 characters";
  }

  if (
    updateData.queryDescription &&
    updateData.queryDescription.trim().length < 20
  ) {
    errors.queryDescription =
      "Query description must be at least 20 characters";
  }

  if (
    updateData.queryDescription &&
    updateData.queryDescription.trim().length > 2000
  ) {
    errors.queryDescription = "Query description cannot exceed 2000 characters";
  }

  if (updateData.expectedResolutionDate) {
    const expectedDate = new Date(updateData.expectedResolutionDate);
    if (expectedDate <= new Date()) {
      errors.expectedResolutionDate =
        "Expected resolution date must be in the future";
    }
  }

  if (
    updateData.queryResponse &&
    updateData.queryResponse.trim().length > 2000
  ) {
    errors.queryResponse = "Query response cannot exceed 2000 characters";
  }

  if (
    updateData.internalRemarks &&
    updateData.internalRemarks.trim().length > 1000
  ) {
    errors.internalRemarks = "Internal remarks cannot exceed 1000 characters";
  }

  return errors;
};

// Helper function to format dates
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper function to calculate days difference
export const getDaysDifference = (
  date1: string | Date,
  date2: string | Date = new Date()
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to check if query is overdue
export const isQueryOverdue = (
  expectedResolutionDate: string | Date,
  status: string
): boolean => {
  if (status === "Resolved" || status === "Closed") {
    return false;
  }
  return new Date(expectedResolutionDate) < new Date();
};
