import { clearAuthData, getAuthToken } from "@/lib/rbac-config.ts/auth-local";

// const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Type definitions for project status operations
export interface StatusUpdateRequest {
  newStatus: string;
  remarks?: string;
  rejectionReason?: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: {
      id: string;
      projectId: string;
      projectName: string;
      previousStatus: string;
      currentStatus: string;
      updatedAt: string;
      updatedBy: {
        name: string;
        role: string;
      };
    };
    statusChange: {
      remarks?: string;
      rejectionReason?: string;
      timestamp: string;
    };
  };
}

export interface StatusHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectInfo: {
      id: string;
      projectId: string;
      projectName: string;
      currentStatus: string;
    };
    statusHistory: Array<{
      previousStatus: string;
      newStatus: string;
      changedBy: {
        userId: string;
        name: string;
        role: string;
      };
      remarks?: string;
      rejectionReason?: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEntries: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

export interface AllowedTransitionsResponse {
  success: boolean;
  message: string;
  data: {
    project: {
      id: string;
      projectId: string;
      projectName: string;
      currentStatus: string;
    };
    user: {
      role: string;
      canUpdateStatus: boolean;
    };
    allowedTransitions: string[];
    requiresRejectionReason: boolean;
  };
}

export interface StatusSummaryResponse {
  success: boolean;
  message: string;
  data: {
    summary: Array<{
      status: string;
      count: number;
      percentage: number;
      totalEstimatedCost: number;
      avgEstimatedCost: number;
      costPercentage: number;
      recentProjects: Array<{
        _id: string;
        projectId: string;
        projectName: string;
        estimatedCost: number;
        district: string;
        contractorName: string;
        updatedAt: string;
      }>;
    }>;
    totals: {
      totalProjects: number;
      totalEstimatedCost: number;
      avgProjectCost: number;
    };
    filters: {
      district?: string;
      fund?: string;
      createdBy?: string;
    };
    generatedAt: string;
  };
}

export interface BulkStatusUpdateRequest {
  updates: Array<{
    projectId: string;
    newStatus: string;
    remarks?: string;
    rejectionReason?: string;
  }>;
}

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
 * Update project status
 * PUT /api/project/:id/status
 */
export const updateProjectStatus = async (
  projectId: string,
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  console.log("Updating project status:", {
    projectId,
    newStatus: statusData.newStatus,
    hasRemarks: !!statusData.remarks,
    hasRejectionReason: !!statusData.rejectionReason,
  });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/${projectId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update project status");
  }

  return response.json();
};

/**
 * Get project status history
 * GET /api/project/:id/status/history
 */
export const getProjectStatusHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<StatusHistoryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/${projectId}/status/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch status history");
  }

  return response.json();
};

/**
 * Get allowed status transitions for current user
 * GET /api/project/:id/status/transitions
 */
export const getAllowedStatusTransitions = async (
  projectId: string
): Promise<AllowedTransitionsResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/${projectId}/status/transitions`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch allowed transitions");
  }

  return response.json();
};

/**
 * Get projects by status with filtering
 * GET /api/project/status/list
 */
export const getProjectsByStatus = async (
  filters: {
    status?: string;
    page?: number;
    limit?: number;
    district?: string;
    fund?: string;
    createdBy?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<{
  success: boolean;
  message: string;
  data: {
    projects: Array<{
      _id: string;
      projectId: string;
      projectName: string;
      status: string;
      district: string;
      fund: string;
      estimatedCost: number;
      contractorName: string;
      createdBy: {
        userId: string;
        name: string;
        role: string;
      };
      statusWorkflow: {
        submittedAt?: string;
        approvedAt?: string;
        rejectedAt?: string;
        completedAt?: string;
      };
      updatedAt: string;
      statusInfo: {
        isRejected: boolean;
        isApproved: boolean;
        isCompleted: boolean;
        isPending: boolean;
      };
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProjects: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    filters: typeof filters;
  };
}> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/status/list?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch projects by status");
  }

  return response.json();
};

/**
 * Get status summary for dashboard
 * GET /api/project/status/summary
 */
export const getProjectStatusSummary = async (
  filters: {
    district?: string;
    fund?: string;
    createdBy?: string;
  } = {}
): Promise<StatusSummaryResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value);
    }
  });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/status/summary?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch status summary");
  }

  return response.json();
};

/**
 * Get pending approval projects
 * GET /api/project/status/pending-approval
 */
export const getPendingApprovals = async (
  page: number = 1,
  limit: number = 10,
  filters: {
    district?: string;
    fund?: string;
  } = {}
): Promise<{
  success: boolean;
  message: string;
  data: {
    projects: Array<{
      _id: string;
      projectId: string;
      projectName: string;
      status: string;
      district: string;
      fund: string;
      estimatedCost: number;
      contractorName: string;
      createdBy: {
        userId: string;
        name: string;
        role: string;
      };
      statusWorkflow: {
        submittedAt?: string;
      };
      updatedAt: string;
      daysPending: number;
      urgency: "low" | "medium" | "high";
      isResubmission: boolean;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProjects: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    summary: {
      totalPending: number;
      highUrgency: number;
      resubmissions: number;
    };
    userRole: string;
  };
}> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value);
    }
  });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/status/pending-approval?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch pending approvals");
  }

  return response.json();
};

/**
 * Bulk status update
 * POST /api/project/status/bulk-update
 */
export const bulkUpdateProjectStatus = async (
  updates: BulkStatusUpdateRequest["updates"]
): Promise<{
  success: boolean;
  message: string;
  data: {
    successful: Array<{
      projectId: string;
      projectName: string;
      previousStatus: string;
      newStatus: string;
      updatedAt: string;
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
  console.log(`Bulk updating ${updates.length} projects`);

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/status/bulk-update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to bulk update project status"
    );
  }

  return response.json();
};

/**
 * Get projects rejected by current user
 * GET /api/project/status/my-rejected
 */
export const getMyRejectedProjects = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  success: boolean;
  message: string;
  data: {
    projects: Array<{
      _id: string;
      projectId: string;
      projectName: string;
      status: string;
      district: string;
      fund: string;
      estimatedCost: number;
      contractorName: string;
      createdBy: {
        userId: string;
        name: string;
        role: string;
      };
      statusWorkflow: {
        rejectedAt?: string;
      };
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProjects: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    userRole: string;
    totalRejected: number;
  };
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/project/status/my-rejected?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch rejected projects");
  }

  return response.json();
};

// Validation helpers
export const validateStatusUpdate = (
  currentStatus: string,
  newStatus: string,
  userRole: string,
  rejectionReason?: string
) => {
  const errors: Record<string, string> = {};

  // Validate required rejection reason
  if (newStatus.includes("Rejected") && !rejectionReason?.trim()) {
    errors.rejectionReason = "Rejection reason is required for rejected status";
    return errors;
  }

  if (rejectionReason && rejectionReason.trim().length < 10) {
    errors.rejectionReason =
      "Rejection reason must be at least 10 characters long";
    return errors;
  }

  // Role-based validation
  const rolePermissions = {
    AEE: ["Ongoing", "Rejected by AEE"],
    CE: ["Ongoing", "Rejected by CE"],
    MD: ["Ongoing", "Rejected by MD"],
    JE: ["Resubmitted for Approval", "Completed"],
  };

  const allowedStatuses =
    rolePermissions[userRole as keyof typeof rolePermissions];
  if (!allowedStatuses?.includes(newStatus)) {
    errors.newStatus = `${userRole} is not authorized to set status to "${newStatus}"`;
  }

  // Status transition validation
  const validTransitions: Record<string, string[]> = {
    "Submitted for Approval": [
      "Ongoing",
      "Rejected by AEE",
      "Rejected by CE",
      "Rejected by MD",
    ],
    "Resubmitted for Approval": [
      "Ongoing",
      "Rejected by AEE",
      "Rejected by CE",
      "Rejected by MD",
    ],
    "Rejected by AEE": ["Resubmitted for Approval"],
    "Rejected by CE": ["Resubmitted for Approval"],
    "Rejected by MD": ["Resubmitted for Approval"],
    Ongoing: ["Completed"],
    Completed: [], // No further transitions
  };

  const allowedTransitions =
    validTransitions[currentStatus as keyof typeof validTransitions];
  if (!allowedTransitions?.includes(newStatus)) {
    errors.transition = `Invalid status transition from "${currentStatus}" to "${newStatus}"`;
  }

  return errors;
};

// Helper functions for status display
export const getStatusDisplayInfo = (status: string) => {
  const statusConfig = {
    "Submitted for Approval": {
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "📋",
      description: "Awaiting review and approval",
    },
    "Resubmitted for Approval": {
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      icon: "🔄",
      description: "Resubmitted after addressing feedback",
    },
    "Rejected by AEE": {
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "❌",
      description: "Rejected by Assistant Executive Engineer",
    },
    "Rejected by CE": {
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "❌",
      description: "Rejected by Chief Engineer",
    },
    "Rejected by MD": {
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "❌",
      description: "Rejected by Managing Director",
    },
    Ongoing: {
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: "🟢",
      description: "Project approved and in progress",
    },
    Completed: {
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: "✅",
      description: "Project completed successfully",
    },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      color: "gray",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: "❓",
      description: "Unknown status",
    }
  );
};

export const getStatusColor = (status: string): string => {
  return getStatusDisplayInfo(status).color;
};

export const getStatusIcon = (status: string): string => {
  return getStatusDisplayInfo(status).icon;
};

export const getStatusDescription = (status: string): string => {
  return getStatusDisplayInfo(status).description;
};

export const formatStatusChangeDescription = (
  previousStatus: string,
  newStatus: string,
  changedBy: string,
  timestamp: string
) => {
  const date = new Date(timestamp).toLocaleDateString();
  const time = new Date(timestamp).toLocaleTimeString();

  return `Status changed from "${previousStatus}" to "${newStatus}" by ${changedBy} on ${date} at ${time}`;
};

// Status workflow helpers
export const isStatusRejected = (status: string): boolean => {
  return status.includes("Rejected");
};

export const isStatusPending = (status: string): boolean => {
  return ["Submitted for Approval", "Resubmitted for Approval"].includes(
    status
  );
};

export const isStatusApproved = (status: string): boolean => {
  return status === "Ongoing";
};

export const isStatusCompleted = (status: string): boolean => {
  return status === "Completed";
};

export const getStatusPriority = (status: string): number => {
  // Higher number = higher priority for sorting
  const priorities = {
    "Submitted for Approval": 5,
    "Resubmitted for Approval": 4,
    "Rejected by AEE": 3,
    "Rejected by CE": 3,
    "Rejected by MD": 3,
    Ongoing: 2,
    Completed: 1,
  };

  return priorities[status as keyof typeof priorities] || 0;
};
