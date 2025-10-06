import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  CombinedProgressUpdateRequest,
  CombinedProgressUpdateResponse,
  FinancialProgressHistoryResponse,
  FinancialProgressStatisticsResponse,
  FinancialProgressUpdateRequest,
  FinancialProgressUpdateResponse,
  ProgressHistoryResponse,
  ProgressStatisticsResponse,
  ProgressUpdateRequest,
  ProgressUpdateResponse,
  ProjectCompletionStatusResponse,
} from "@/types/archive-projects.types";

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
 * Update physical progress of a project
 * PUT /api/archive-project/:id/progress
 */
export const updateProjectProgress = async (
  projectId: string,
  progressData: ProgressUpdateRequest
): Promise<ProgressUpdateResponse> => {
  const formData = new FormData();

  formData.append("progress", progressData.progress.toString());
  if (progressData.remarks) {
    formData.append("remarks", progressData.remarks);
  }

  // Use "supportingFiles" field name as expected by backend
  if (progressData.files && progressData.files.length > 0) {
    progressData.files.forEach((file) => {
      formData.append("supportingFiles", file);
    });
  }

  // Debug FormData contents (remove in production)
  // formData.forEach((value, key) => {
  //   if (value instanceof File) {
  //     console.log(`${key}:`, {
  //       name: value.name,
  //       size: value.size,
  //       type: value.type,
  //     });
  //   } else {
  //     console.log(`${key}:`, value);
  //   }
  // });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/progress`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update progress");
  }

  return response.json();
};

/**
 * Update financial progress of a project
 * PUT /api/archive-project/:id/financial-progress
 */
export const updateFinancialProgress = async (
  projectId: string,
  financialProgressData: FinancialProgressUpdateRequest
): Promise<FinancialProgressUpdateResponse> => {
  const formData = new FormData();

  // Add bill amount
  formData.append(
    "newBillAmount",
    financialProgressData.newBillAmount.toString()
  );

  // Add optional remarks
  if (financialProgressData.remarks) {
    formData.append("remarks", financialProgressData.remarks);
  }

  // Add bill details as JSON string if provided
  if (financialProgressData.billDetails) {
    formData.append(
      "billDetails",
      JSON.stringify(financialProgressData.billDetails)
    );
  }

  // Add supporting files using the correct field name from backend
  if (financialProgressData.files && financialProgressData.files.length > 0) {
    financialProgressData.files.forEach((file) => {
      formData.append("supportingFiles", file);
    });
  }

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/financial-progress`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update financial progress");
  }

  return response.json();
};

/**
 * Update both physical and financial progress together
 * PUT /api/archive-project/:id/progress/combined
 */
export const updateCombinedProgress = async (
  projectId: string,
  combinedProgressData: CombinedProgressUpdateRequest
): Promise<CombinedProgressUpdateResponse> => {
  const formData = new FormData();

  // Add physical progress if provided
  if (combinedProgressData.progress !== undefined) {
    formData.append("progress", combinedProgressData.progress.toString());
  }

  // Add financial progress (bill amount) if provided
  if (combinedProgressData.newBillAmount !== undefined) {
    formData.append(
      "newBillAmount",
      combinedProgressData.newBillAmount.toString()
    );
  }

  // Add optional remarks
  if (combinedProgressData.remarks) {
    formData.append("remarks", combinedProgressData.remarks);
  }

  // Add bill details as JSON string if provided
  if (combinedProgressData.billDetails) {
    formData.append(
      "billDetails",
      JSON.stringify(combinedProgressData.billDetails)
    );
  }

  // Add supporting files
  if (combinedProgressData.files && combinedProgressData.files.length > 0) {
    combinedProgressData.files.forEach((file) => {
      formData.append("supportingFiles", file);
    });
  }

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/progress/combined`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update combined progress");
  }

  return response.json();
};

/**
 * Get physical progress update history
 * GET /api/archive-project/:id/progress/history
 */
export const getProgressHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<ProgressHistoryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/progress/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch progress history");
  }

  return response.json();
};

/**
 * Get progress statistics across projects
 * GET /api/archive-project/progress/statistics
 */
export const getProgressStatistics = async (filters?: {
  financialYear?: string;
  concernedEngineer?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ProgressStatisticsResponse> => {
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

  const response = await makeAuthenticatedRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch progress statistics");
  }

  return response.json();
};

/**
 * Toggle progress updates for a project
 * PATCH /api/archive-project/:id/progress/toggle
 */
export const toggleProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/progress/toggle`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to toggle progress updates");
  }

  return response.json();
};

// Validation helpers
export const validateProgressUpdate = (
  currentProgress: number,
  newProgress: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // Basic progress validation
  if (newProgress < 0 || newProgress > 100) {
    errors.progress = "Progress must be between 0 and 100";
    return errors;
  }

  const progressDiff = newProgress - currentProgress;

  // Backward progress check (max 5% decrease)
  if (progressDiff < 0 && Math.abs(progressDiff) > 5) {
    errors.progress =
      "Significant backward progress not allowed. Maximum 5% decrease per update for corrections.";
  }

  // Progress jump check (max 50% increase)
  if (progressDiff > 50) {
    errors.progress =
      "Progress increase exceeds reasonable limits. Maximum 50% increase per update.";
  }

  // Completion requires documents
  if (newProgress === 100 && files.length === 0) {
    errors.files =
      "Project completion (100% progress) requires at least one supporting document";
  }

  // File size validation (10MB max per file)
  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    errors.files = `Files exceed 10MB limit: ${oversizedFiles
      .map((f) => f.name)
      .join(", ")}`;
  }

  return errors;
};

export const validateFinancialProgressUpdate = (
  currentBillAmount: number,
  newBillAmount: number,
  workValue: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // Basic amount validation
  if (newBillAmount < 0) {
    errors.newBillAmount = "Bill amount cannot be negative";
    return errors;
  }

  if (newBillAmount > workValue) {
    errors.newBillAmount = "Bill amount cannot exceed work value";
    return errors;
  }

  const amountDiff = newBillAmount - currentBillAmount;
  const workValuePercentage = (Math.abs(amountDiff) / workValue) * 100;

  // Backward progress check (max 5% of work value decrease)
  if (amountDiff < 0 && workValuePercentage > 5) {
    errors.newBillAmount =
      "Significant backward financial progress not allowed. Maximum 5% of work value decrease for corrections.";
  }

  // Progress jump check (max 50% of work value increase)
  if (amountDiff > 0 && workValuePercentage > 50) {
    errors.newBillAmount =
      "Financial progress increase exceeds reasonable limits. Maximum 50% of work value increase per update.";
  }

  // Calculate new financial progress percentage
  const newFinancialProgress = Math.round((newBillAmount / workValue) * 100);

  // Completion requires documents
  if (newFinancialProgress === 100 && files.length === 0) {
    errors.files =
      "Financial completion (100% progress) requires at least one supporting document";
  }

  // File size validation (10MB max per file)
  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    errors.files = `Files exceed 10MB limit: ${oversizedFiles
      .map((f) => f.name)
      .join(", ")}`;
  }

  return errors;
};

export const validateCombinedProgressUpdate = (
  currentProgress: number,
  newProgress: number | undefined,
  currentBillAmount: number,
  newBillAmount: number | undefined,
  workValue: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // At least one progress type must be provided
  if (newProgress === undefined && newBillAmount === undefined) {
    errors.general =
      "At least one progress update (physical or financial) must be provided";
    return errors;
  }

  // Validate physical progress if provided
  if (newProgress !== undefined) {
    const physicalErrors = validateProgressUpdate(
      currentProgress,
      newProgress,
      files
    );
    Object.assign(errors, physicalErrors);
  }

  // Validate financial progress if provided
  if (newBillAmount !== undefined) {
    const financialErrors = validateFinancialProgressUpdate(
      currentBillAmount,
      newBillAmount,
      workValue,
      files
    );
    Object.assign(errors, financialErrors);
  }

  return errors;
};

// Helper functions for descriptions
export const getProgressChangeDescription = (from: number, to: number) => {
  const diff = to - from;
  if (diff > 0) {
    return `Increased by ${diff.toFixed(1)}%`;
  } else if (diff < 0) {
    return `Decreased by ${Math.abs(diff).toFixed(1)}%`;
  }
  return "No change";
};

export const getFinancialProgressChangeDescription = (
  fromAmount: number,
  toAmount: number,
  workValue: number
) => {
  const amountDiff = toAmount - fromAmount;
  const fromPercentage = Math.round((fromAmount / workValue) * 100);
  const toPercentage = Math.round((toAmount / workValue) * 100);
  const percentageDiff = toPercentage - fromPercentage;

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  if (amountDiff > 0) {
    return `Increased by ${formatAmount(amountDiff)} (${percentageDiff.toFixed(
      1
    )}%)`;
  } else if (amountDiff < 0) {
    return `Decreased by ${formatAmount(Math.abs(amountDiff))} (${Math.abs(
      percentageDiff
    ).toFixed(1)}%)`;
  }
  return "No change";
};

/**
 * Get financial progress update history
 * GET /api/archive-project/:id/financial-progress/history
 */
export const getFinancialProgressHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<FinancialProgressHistoryResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/financial-progress/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch financial progress history"
    );
  }

  return response.json();
};

/**
 * Get financial progress statistics across projects
 * GET /api/archive-project/financial-progress/statistics
 */
export const getFinancialProgressStatistics = async (filters?: {
  financialYear?: string;
  concernedEngineer?: string;
  startDate?: string;
  endDate?: string;
}): Promise<FinancialProgressStatisticsResponse> => {
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

  const response = await makeAuthenticatedRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch financial progress statistics"
    );
  }

  return response.json();
};

/**
 * Get project completion status (both physical and financial)
 * GET /api/archive-project/:id/completion-status
 */
export const getProjectCompletionStatus = async (
  projectId: string
): Promise<ProjectCompletionStatusResponse> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/completion-status`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch completion status");
  }

  return response.json();
};

/**
 * Toggle financial progress updates for a project
 * PATCH /api/archive-project/:id/financial-progress/toggle
 */
export const toggleFinancialProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/financial-progress/toggle`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to toggle financial progress updates"
    );
  }

  return response.json();
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
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/archive-project/${projectId}/progress/toggle-all`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to toggle progress updates");
  }

  return response.json();
};
