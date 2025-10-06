import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  CombinedProgressUpdateRequest,
  CompletionStatusResponse,
  ContractorWiseProjectsSummaryResponse,
  DbProject,
  DistrictWiseProjectsSummaryResponse,
  FinancialProgressHistoryResponse,
  FinancialProgressUpdate,
  FinancialProgressUpdateRequest,
  FinancialProgressUpdateResponse,
  FundDetails,
  ProgressHistoryResponse,
  ProgressStatus,
  ProgressSummary,
  ProgressUpdate,
  ProgressUpdateRequest,
  ProgressUpdateResponse,
  ProjectsListResponse,
  ProjectStatus,
  ProjectSummaryResponse,
  ProjectTimelineResponse,
  SubFundsListResponse,
} from "@/types/projects.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Utility function to format date to "DD MMM YYYY" format
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

// Utility function to calculate days remaining
const calculateDaysRemaining = (
  endDate: string,
  extensionDate?: string
): number => {
  if (!endDate) return 0;

  const today = new Date();
  const projectEnd = new Date(extensionDate || endDate);
  const diffTime = projectEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Utility function to determine current stage based on status and progress
const determineCurrentStage = (
  status: string,
  progress: number,
  financialProgress: number = 0
): string => {
  // If status provides clear stage information, use it
  switch (status) {
    case "Submitted to AEE":
      return "Under Review - AEE";
    case "Submitted to CE":
      return "Under Review - CE";
    case "Submitted to MD":
      return "Under Review - MD";
    case "Approved":
      if (progress === 0 && financialProgress === 0) {
        return "Approved - Ready to Start";
      }
      return "Approved - In Progress";
    case "Ongoing":
      if (progress === 0 && financialProgress === 0)
        return "Ongoing - Initialization";
      if (progress === 100 && financialProgress === 100)
        return "Ongoing - Completed";
      if (progress === 100) return "Ongoing - Physically Complete";
      if (financialProgress === 100) return "Ongoing - Financially Complete";
      if (progress <= 25 && financialProgress <= 25)
        return "Ongoing - Initial Phase";
      if (progress <= 50 && financialProgress <= 50)
        return "Ongoing - Development";
      if (progress <= 75 && financialProgress <= 75)
        return "Ongoing - Implementation";
      return "Ongoing - Final Phase";
    case "Completed":
      return "Project Completed";
    case "Rejected":
      return "Project Rejected";
    case "On Hold":
      return "Project On Hold";
    default:
      return status || "Unknown Status";
  }
};

// Utility function to determine progress status
const getProgressStatus = (progress: number): ProgressStatus => {
  if (!progress || progress === 0) return "Not Started";
  if (progress < 25) return "Just Started";
  if (progress < 50) return "In Progress";
  if (progress < 75) return "Halfway Complete";
  if (progress < 100) return "Near Completion";
  return "Completed";
};

// Type for raw backend project response (before frontend enhancements)
interface BackendProject {
  _id?: string;
  dateOfIssueOfWorkOrder: string;
  projectId: string;
  projectName: string;
  description?: string;
  hasSubProjects: boolean;
  fund: string;
  subFund: string; // NEW: Sub fund field
  sanctioningDepartment: string;
  budgetHead?: string;
  executingDepartment: string;
  beneficiary?: string;
  workOrderNumber: string;
  // NEW: Contractor fields
  contractorName: string;
  contractorAddress: string;
  contractorPhoneNumber: string;
  estimatedCost: number;
  typeOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  extensionPeriodForCompletion?: string;
  district: string;
  block?: string;
  gramPanchayat?: string;
  subProjects: Array<{
    _id?: string;
    projectName: string;
    estimatedAmount: number;
    typeOfWork: string;
    projectStartDate: string;
    projectEndDate: string;
    extensionPeriodForCompletion?: string;
    parentProjectId: string;
  }>;
  uploadedFiles: Array<{
    _id?: string;
    fileName: string;
    originalName: string;
    downloadURL: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: "document" | "image";
    uploadedAt: Date;
    uploadedBy: {
      userId: string;
      name: string;
    };
  }>;
  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  createdBy: {
    userId: string;
    name: string;
    role: string;
  };
  lastModifiedBy?: {
    userId?: string;
    name?: string;
    role?: string;
    modifiedAt?: Date;
  };
  status: ProjectStatus;
  progressPercentage: number;

  // Progress and Financial Tracking Fields
  financialProgress: number;
  billSubmittedAmount: number;
  progressUpdates: ProgressUpdate[];
  financialProgressUpdates: FinancialProgressUpdate[];
  lastProgressUpdate?: Date;
  lastFinancialProgressUpdate?: Date;
  progressUpdatesEnabled: boolean;
  financialProgressUpdatesEnabled: boolean;

  // Virtual/calculated fields from backend
  remainingBudget?: number;
  progressStatus?: ProgressStatus;
  financialProgressStatus?: ProgressStatus;
  progressSummary?: ProgressSummary;
  totalProgressUpdates?: number;
  totalFinancialProgressUpdates?: number;
  latestProgressUpdate?: ProgressUpdate;
  latestFinancialProgressUpdate?: FinancialProgressUpdate;
  projectDurationDays?: number;
  totalSubProjectsCost?: number;
  // NEW: Virtual fields for contractor and fund details
  contractorContact?: {
    name: string;
    address: string;
    phone: string;
  };
  fundDetails?: FundDetails;

  createdAt: string;
  updatedAt: string;

  isProjectEditable: boolean;
}

// Add only frontend-calculated fields to backend project data
const enhanceProjectWithCalculatedFields = (
  backendProject: BackendProject
): DbProject => {
  // Calculate frontend-only fields
  const totalSubProjects = (backendProject.subProjects || []).length;
  const daysRemaining = calculateDaysRemaining(
    backendProject.projectEndDate,
    backendProject.extensionPeriodForCompletion
  );
  const currentStage = determineCurrentStage(
    backendProject.status,
    backendProject.progressPercentage || 0,
    backendProject.financialProgress || 0
  );
  const lastUpdated = formatDate(
    backendProject.updatedAt || backendProject.createdAt
  );

  // Calculate budget utilization from financial progress
  const budgetUtilized = backendProject.billSubmittedAmount || 0;

  // Ensure progress status calculations if not provided by backend
  const progressStatus =
    backendProject.progressStatus ||
    getProgressStatus(backendProject.progressPercentage || 0);
  const financialProgressStatus =
    backendProject.financialProgressStatus ||
    getProgressStatus(backendProject.financialProgress || 0);

  // Return project with backend fields plus calculated frontend fields
  return {
    ...backendProject,
    // Add calculated fields only
    totalSubProjects,
    daysRemaining,
    currentStage,
    lastUpdated,
    budgetUtilized,
    progress: backendProject.progressPercentage || 0, // Alias for progressPercentage
    progressStatus,
    financialProgressStatus,
    // Ensure these fields have defaults if not provided
    financialProgress: backendProject.financialProgress || 0,
    billSubmittedAmount: backendProject.billSubmittedAmount || 0,
    progressUpdates: backendProject.progressUpdates || [],
    financialProgressUpdates: backendProject.financialProgressUpdates || [],
    progressUpdatesEnabled: backendProject.progressUpdatesEnabled ?? true,
    financialProgressUpdatesEnabled:
      backendProject.financialProgressUpdatesEnabled ?? true,
  } as DbProject;
};

// Helper function to handle API errors
const handleApiError = (response: Response, errorText: string): never => {
  if (response.status === 401) {
    console.error("Authentication failed - clearing stored data");
    clearAuthData();
    window.location.replace("/login");
    throw new Error("Authentication expired");
  }
  throw new Error(`HTTP ${response.status}: ${errorText}`);
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Main fetch function - gets all projects from backend
const fetchAllProjects = async (
  filters?: Record<string, string>
): Promise<DbProject[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/project${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProjectsListResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API returned success: false");
    }

    if (!Array.isArray(data.data)) {
      console.warn("API response data is not an array:", data);
      return [];
    }

    const enhancedProjects: DbProject[] = (data.data as BackendProject[]).map(
      (project: BackendProject) => enhanceProjectWithCalculatedFields(project)
    );

    return enhancedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch single project by ID
const fetchProjectById = async (projectId: string): Promise<DbProject> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API returned success: false");
    }

    if (!data.data) {
      throw new Error("Project not found");
    }

    const enhancedProject: DbProject = enhanceProjectWithCalculatedFields(
      data.data.project as BackendProject
    );
    return enhancedProject;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

// NEW: Progress tracking API functions

// Update physical progress
const updateProjectProgress = async (
  projectId: string,
  progressData: ProgressUpdateRequest
): Promise<ProgressUpdateResponse> => {
  try {
    const formData = new FormData();
    formData.append("progress", progressData.progress.toString());
    if (progressData.remarks) {
      formData.append("remarks", progressData.remarks);
    }
    if (progressData.supportingFiles) {
      progressData.supportingFiles.forEach((file) => {
        formData.append("supportingFiles", file);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/progress`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProgressUpdateResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update progress");
    }

    return data;
  } catch (error) {
    console.error(`Error updating progress for project ${projectId}:`, error);
    throw error;
  }
};

// Update financial progress
const updateFinancialProgress = async (
  projectId: string,
  financialData: FinancialProgressUpdateRequest
): Promise<FinancialProgressUpdateResponse> => {
  try {
    const formData = new FormData();
    formData.append("newBillAmount", financialData.newBillAmount.toString());
    if (financialData.remarks) {
      formData.append("remarks", financialData.remarks);
    }
    if (financialData.billDetails) {
      formData.append("billDetails", JSON.stringify(financialData.billDetails));
    }
    if (financialData.supportingFiles) {
      financialData.supportingFiles.forEach((file) => {
        formData.append("supportingFiles", file);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/financial-progress`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: FinancialProgressUpdateResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update financial progress");
    }

    return data;
  } catch (error) {
    console.error(
      `Error updating financial progress for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Update combined progress
const updateCombinedProgress = async (
  projectId: string,
  combinedData: CombinedProgressUpdateRequest
): Promise<ProgressUpdateResponse | FinancialProgressUpdateResponse> => {
  try {
    const formData = new FormData();
    if (combinedData.progress !== undefined) {
      formData.append("progress", combinedData.progress.toString());
    }
    if (combinedData.newBillAmount !== undefined) {
      formData.append("newBillAmount", combinedData.newBillAmount.toString());
    }
    if (combinedData.remarks) {
      formData.append("remarks", combinedData.remarks);
    }
    if (combinedData.billDetails) {
      formData.append("billDetails", JSON.stringify(combinedData.billDetails));
    }
    if (combinedData.supportingFiles) {
      combinedData.supportingFiles.forEach((file) => {
        formData.append("supportingFiles", file);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/progress/combined`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update combined progress");
    }

    return data;
  } catch (error) {
    console.error(
      `Error updating combined progress for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Get progress history
const getProgressHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<ProgressHistoryResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/progress/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProgressHistoryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch progress history");
    }

    return data;
  } catch (error) {
    console.error(
      `Error fetching progress history for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Get financial progress history
const getFinancialProgressHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<FinancialProgressHistoryResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/financial-progress/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: FinancialProgressHistoryResponse = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Failed to fetch financial progress history"
      );
    }

    return data;
  } catch (error) {
    console.error(
      `Error fetching financial progress history for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Get project summary
const getProjectSummary = async (
  filters?: Record<string, string>
): Promise<ProjectSummaryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/project/summary${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProjectSummaryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch project summary");
    }

    return data;
  } catch (error) {
    console.error("Error fetching project summary:", error);
    throw error;
  }
};

// NEW: Get district-wise project summary
const getDistrictWiseProjectsSummary = async (
  filters?: Record<string, string>
): Promise<DistrictWiseProjectsSummaryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/project/summary/districts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: DistrictWiseProjectsSummaryResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch district-wise summary");
    }

    return data;
  } catch (error) {
    console.error("Error fetching district-wise project summary:", error);
    throw error;
  }
};

// NEW: Get contractor-wise project summary
const getContractorWiseProjectsSummary = async (
  filters?: Record<string, string>
): Promise<ContractorWiseProjectsSummaryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const url = `${API_BASE_URL}/project/summary/contractors${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ContractorWiseProjectsSummaryResponse = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Failed to fetch contractor-wise summary"
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching contractor-wise project summary:", error);
    throw error;
  }
};

// NEW: Get sub funds list
const getSubFundsList = async (
  fund?: string
): Promise<SubFundsListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (fund) {
      queryParams.append("fund", fund);
    }

    const url = `${API_BASE_URL}/project/subfunds${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: SubFundsListResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch sub funds list");
    }

    return data;
  } catch (error) {
    console.error("Error fetching sub funds list:", error);
    throw error;
  }
};

// Get project timeline
const getProjectTimeline = async (
  projectId: string
): Promise<ProjectTimelineResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/timeline`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProjectTimelineResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch project timeline");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching timeline for project ${projectId}:`, error);
    throw error;
  }
};

// Get completion status
const getCompletionStatus = async (
  projectId: string
): Promise<CompletionStatusResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/completion-status`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: CompletionStatusResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch completion status");
    }

    return data;
  } catch (error) {
    console.error(
      `Error fetching completion status for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Toggle progress updates
const toggleProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/progress/toggle`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to toggle progress updates");
    }

    return data;
  } catch (error) {
    console.error(
      `Error toggling progress updates for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Toggle financial progress updates
const toggleFinancialProgressUpdates = async (
  projectId: string,
  enabled: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/financial-progress/toggle`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Failed to toggle financial progress updates"
      );
    }

    return data;
  } catch (error) {
    console.error(
      `Error toggling financial progress updates for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Bulk update projects
const bulkUpdateProgress = async (
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
    successful: {
      projectId: string;
      progress?: number;
      financialProgress?: number;
      remarks?: string;
    }[];
    failed: {
      projectId: string;
      progress?: number;
      financialProgress?: number;
      remarks?: string;
      error?: string;
    }[];
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/bulk/progress-update`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ updates }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to bulk update progress");
    }

    return data;
  } catch (error) {
    console.error("Error bulk updating progress:", error);
    throw error;
  }
};

// NEW: Search projects with enhanced filters
const searchProjects = async (searchParams: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    status?: string;
    district?: string;
    fund?: string;
    subFund?: string;
    contractorName?: string;
    createdBy?: string;
    typeOfWork?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    progressRange?: {
      min: number;
      max: number;
    };
    budgetRange?: {
      min: number;
      max: number;
    };
  };
}): Promise<ProjectsListResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.search) queryParams.append("search", searchParams.search);
    if (searchParams.page)
      queryParams.append("page", searchParams.page.toString());
    if (searchParams.limit)
      queryParams.append("limit", searchParams.limit.toString());
    if (searchParams.sortBy) queryParams.append("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder)
      queryParams.append("sortOrder", searchParams.sortOrder);

    if (searchParams.filters) {
      Object.entries(searchParams.filters).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          queryParams.append(key, value);
        } else if (value && typeof value === "object") {
          queryParams.append(key, JSON.stringify(value));
        }
      });
    }

    const url = `${API_BASE_URL}/project/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const data: ProjectsListResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to search projects");
    }

    return data;
  } catch (error) {
    console.error("Error searching projects:", error);
    throw error;
  }
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Utility function to get progress color based on percentage
export const getProgressColor = (progress: number): string => {
  if (progress === 0) return "text-gray-500";
  if (progress < 25) return "text-red-500";
  if (progress < 50) return "text-orange-500";
  if (progress < 75) return "text-yellow-500";
  if (progress < 100) return "text-blue-500";
  return "text-green-500";
};

// Utility function to calculate progress gap
export const calculateProgressGap = (
  physicalProgress: number,
  financialProgress: number
): {
  gap: number;
  isAligned: boolean;
  status: "ahead_physical" | "ahead_financial" | "aligned";
} => {
  const gap = Math.abs(physicalProgress - financialProgress);
  const isAligned = gap <= 10; // Within 10% is considered aligned

  let status: "ahead_physical" | "ahead_financial" | "aligned";
  if (gap <= 5) {
    status = "aligned";
  } else if (physicalProgress > financialProgress) {
    status = "ahead_physical";
  } else {
    status = "ahead_financial";
  }

  return { gap, isAligned, status };
};

// NEW: Utility function to format contractor info
export const formatContractorInfo = (
  contractorName: string,
  contractorPhone?: string
): string => {
  if (!contractorName) return "Unknown Contractor";
  if (!contractorPhone) return contractorName;
  return `${contractorName} (${contractorPhone})`;
};

// NEW: Utility function to format fund info
export const formatFundInfo = (fund: string, subFund?: string): string => {
  if (!fund) return "Unknown Fund";
  if (!subFund) return fund;
  return `${fund} - ${subFund}`;
};

// Export all functions
export {
  bulkUpdateProgress,
  calculateDaysRemaining,
  determineCurrentStage,
  enhanceProjectWithCalculatedFields,
  fetchAllProjects,
  fetchProjectById,
  formatDate,
  getCompletionStatus,
  getContractorWiseProjectsSummary, // NEW
  getDistrictWiseProjectsSummary, // NEW
  getFinancialProgressHistory,
  getProgressHistory,
  getProgressStatus,
  getProjectSummary,
  getProjectTimeline,
  getSubFundsList, // NEW
  searchProjects, // NEW
  toggleFinancialProgressUpdates,
  toggleProgressUpdates,
  updateCombinedProgress,
  updateFinancialProgress,
  updateProjectProgress,
};
