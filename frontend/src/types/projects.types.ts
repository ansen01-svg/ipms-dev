// Document interface for uploaded files
export interface UploadedFile {
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
}

// Sub-project interface matching backend schema
export interface SubProject {
  _id?: string;
  projectName: string;
  estimatedAmount: number;
  typeOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  extensionPeriodForCompletion?: string;
  parentProjectId: string;
}

// Geolocation interface matching backend
export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

// Created by interface
export interface CreatedBy {
  userId: string;
  name: string;
  role: string;
}

// Last modified by interface
export interface LastModifiedBy {
  userId?: string;
  name?: string;
  role?: string;
  modifiedAt?: Date;
}

// User info for progress updates
export interface UpdatedBy {
  userId: string;
  userName: string;
  userDesignation: string;
}

// Supporting documents for progress updates
export interface SupportingDocument {
  fileName: string;
  originalName: string;
  downloadURL: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: "document" | "image";
  uploadedAt: Date;
}

// Progress update interface
export interface ProgressUpdate {
  _id?: string;
  previousProgress: number;
  newProgress: number;
  progressDifference: number;
  remarks?: string;
  supportingDocuments: SupportingDocument[];
  updatedBy: UpdatedBy;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Bill details interface
export interface BillDetails {
  billNumber?: string;
  billDate?: Date;
  billDescription?: string;
}

// Financial progress update interface
export interface FinancialProgressUpdate {
  _id?: string;
  previousFinancialProgress: number;
  newFinancialProgress: number;
  progressDifference: number;
  previousBillAmount: number;
  newBillAmount: number;
  amountDifference: number;
  remarks?: string;
  billDetails?: BillDetails;
  supportingDocuments: SupportingDocument[];
  updatedBy: UpdatedBy;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Progress summary interfaces
export interface PhysicalProgressSummary {
  percentage: number;
  status: string;
  lastUpdate?: Date;
  totalUpdates?: number;
}

export interface FinancialProgressSummary {
  percentage: number;
  status: string;
  lastUpdate?: Date;
  totalUpdates?: number;
  amountSubmitted: number;
  amountRemaining: number;
}

export interface ProgressSummary {
  physical: PhysicalProgressSummary;
  financial: FinancialProgressSummary;
}

// Project status enum/type - matches backend constants
export type ProjectStatus =
  | "Submitted to AEE"
  | "Submitted to CE"
  | "Submitted to MD"
  | "Approved"
  | "Ongoing"
  | "Completed"
  | "Rejected"
  | "On Hold";

// Project progress status
export type ProgressStatus =
  | "Not Started"
  | "Just Started"
  | "In Progress"
  | "Halfway Complete"
  | "Near Completion"
  | "Completed";

// Main project interface matching enhanced backend schema
export interface DbProject {
  _id?: string;

  // Core project fields from backend
  dateOfIssueOfWorkOrder: string;
  projectId: string;
  projectName: string;
  description?: string;
  hasSubProjects: boolean;
  fund: string;
  sanctionAndDepartment: string;
  budgetHead?: string;
  executingDepartment: string;
  beneficiary?: string;
  workOrderNumber: string;
  estimatedCost: number;
  typeOfWork: string;
  natureOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  extensionPeriodForCompletion?: string;
  district: string;
  block?: string;
  gramPanchayat?: string;

  // Nested objects
  subProjects: SubProject[];
  uploadedFiles: UploadedFile[];
  geoLocation: GeoLocation;
  createdBy: CreatedBy;
  lastModifiedBy?: LastModifiedBy;

  // Project status and progress
  status: ProjectStatus;
  progressPercentage: number;

  // NEW: Progress and Financial Tracking Fields
  financialProgress: number;
  billSubmittedAmount: number;
  progressUpdates: ProgressUpdate[];
  financialProgressUpdates: FinancialProgressUpdate[];
  lastProgressUpdate?: Date;
  lastFinancialProgressUpdate?: Date;
  progressUpdatesEnabled: boolean;
  financialProgressUpdatesEnabled: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Virtual/calculated fields (may come from backend or frontend)
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

  // Frontend-calculated fields
  totalSubProjects?: number;
  daysRemaining?: number;
  currentStage?: string;
  lastUpdated?: string;
  budgetUtilized?: number;

  // Virtual fields for backward compatibility
  progress?: number; // alias for progressPercentage
}

// Project API Response interfaces
export interface ProjectResponse {
  success: boolean;
  message: string;
  data: DbProject;
  metadata?: {
    retrievedAt: string;
    projectId: string;
    status: ProjectStatus;
    lastUpdated: string;
    lastProgressUpdate?: Date;
    lastFinancialProgressUpdate?: Date;
    hasSubProjects: boolean;
    subProjectsCount: number;
  };
}

export interface ProjectsListResponse {
  success: boolean;
  message: string;
  data: DbProject[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    skip: number;
  };
  summary?: {
    totalProjects: number;
    totalEstimatedCost: number;
    totalBillSubmitted: number;
    avgPhysicalProgress: number;
    avgFinancialProgress: number;
    completedProjects: number;
    inProgressProjects: number;
  };
}

// Progress update API interfaces
export interface ProgressUpdateRequest {
  progress: number;
  remarks?: string;
  supportingFiles?: File[];
}

export interface FinancialProgressUpdateRequest {
  newBillAmount: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  supportingFiles?: File[];
}

export interface CombinedProgressUpdateRequest {
  progress?: number;
  newBillAmount?: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  supportingFiles?: File[];
}

// Progress update response interfaces
export interface ProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject;
    latestProgressUpdate: ProgressUpdate;
    progressChange: {
      from: number;
      to: number;
      difference: number;
      changeType: "increase" | "decrease" | "no change";
    };
    filesUploaded: {
      count: number;
      totalSize: number;
      types: Record<string, number>;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: UpdatedBy;
    totalProgressUpdates: number;
    projectDurationDays?: number;
    daysUntilDeadline?: number;
  };
}

export interface FinancialProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject;
    latestFinancialProgressUpdate: FinancialProgressUpdate;
    financialProgressChange: {
      from: {
        amount: number;
        percentage: number;
      };
      to: {
        amount: number;
        percentage: number;
      };
      difference: {
        amount: number;
        percentage: number;
      };
      changeType: "increase" | "decrease" | "no change";
    };
    filesUploaded: {
      count: number;
      totalSize: number;
      types: Record<string, number>;
    };
    budgetAnalysis: {
      utilizationRate: number;
      remainingBudget: number;
      isWithinBudget: boolean;
      subProjectsCost: number;
      subProjectsUtilization: number;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: UpdatedBy;
    totalFinancialProgressUpdates: number;
    isFullyComplete: boolean;
    projectType: {
      hasSubProjects: boolean;
      subProjectsCount: number;
    };
    deadlineInfo: {
      daysUntilDeadline?: number;
      hasExtension: boolean;
    };
  };
}

// Progress history interfaces
export interface ProgressHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    currentProgress: number;
    progressStatus: ProgressStatus;
    estimatedCost: number;
    projectDuration: number;
    history: {
      updates: ProgressUpdate[];
      totalUpdates: number;
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      totalUpdates: number;
      totalProgressIncrease: number;
      totalProgressDecrease: number;
      totalFilesUploaded: number;
      avgProgressChange: number;
      lastUpdateDate?: Date;
      firstUpdateDate?: Date;
      mostActiveUser?: {
        userId: string;
        name: string;
        count: number;
      };
      largestProgressJump: number;
    };
    projectMetrics: {
      daysFromStart?: number;
      daysUntilDeadline?: number;
      hasExtension: boolean;
      isOverdue: boolean;
    };
  };
}

export interface FinancialProgressHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    estimatedCost: number;
    currentBillAmount: number;
    currentFinancialProgress: number;
    financialProgressStatus: ProgressStatus;
    remainingBudget: number;
    history: {
      updates: FinancialProgressUpdate[];
      totalUpdates: number;
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      totalUpdates: number;
      totalAmountIncrease: number;
      totalAmountDecrease: number;
      totalFilesUploaded: number;
      avgProgressChange: number;
      avgAmountChange: number;
      lastUpdateDate?: Date;
      firstUpdateDate?: Date;
      largestAmountIncrease: number;
      mostActiveUser?: {
        userId: string;
        name: string;
        count: number;
      };
      billsSubmitted: number;
    };
    budgetTrend: Array<{
      updateNumber: number;
      date: Date;
      amount: number;
      percentage: number;
      utilizationRate: number;
    }>;
    projectMetrics: {
      hasSubProjects: boolean;
      subProjectsCount: number;
      totalSubProjectsCost: number;
      daysFromStart?: number;
      daysUntilDeadline?: number;
      budgetUtilizationRate: number;
    };
  };
}

// Project summary and statistics interfaces
export interface ProjectSummaryResponse {
  success: boolean;
  message: string;
  data: {
    overview: {
      totalProjects: number;
      totalEstimatedCost: number;
      totalBillSubmitted: number;
      avgPhysicalProgress: number;
      avgFinancialProgress: number;
      physicallyCompletedProjects: number;
      financiallyCompletedProjects: number;
      fullyCompletedProjects: number;
      physicalCompletionRate: number;
      financialCompletionRate: number;
      fullCompletionRate: number;
      budgetUtilizationRate: number;
      totalRemainingBudget: number;
      avgProjectValue: number;
    };
    distribution: {
      byPhysicalProgress: {
        notStarted: number;
        inProgress: number;
        completed: number;
      };
      byFinancialProgress: {
        notStarted: number;
        inProgress: number;
        completed: number;
      };
      byStatus: Record<ProjectStatus, number>;
    };
    topPerformers: {
      districts: Array<{
        name: string;
        projectCount: number;
        totalValue: number;
        avgPhysicalProgress: number;
        avgFinancialProgress: number;
        completedProjects: number;
        completionRate: number;
      }>;
      funds: Array<{
        name: string;
        projectCount: number;
        totalValue: number;
        avgPhysicalProgress: number;
        avgFinancialProgress: number;
        completedProjects: number;
        completionRate: number;
      }>;
    };
    progressMetrics: {
      totalUpdates: number;
      physicalUpdates: number;
      financialUpdates: number;
      avgUpdatesPerProject: number;
      avgProgressGap: number;
    };
  };
  filters: Record<string, string | null>;
  metadata: {
    generatedAt: string;
    dataFreshness: string;
    totalProjectsAnalyzed: number;
  };
}

// Project timeline interface
export interface ProjectTimelineEvent {
  date: Date;
  event: string;
  description: string;
  type:
    | "creation"
    | "order"
    | "milestone"
    | "progress"
    | "financial"
    | "extension"
    | "update"
    | "financial_update";
  estimated?: boolean;
  details?: Record<string, unknown>;
}

export interface ProjectTimelineResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    timeline: ProjectTimelineEvent[];
    duration: {
      totalDays: number;
      plannedDuration: number;
      phases: {
        orderToStart?: number;
        startToNow?: number;
        remainingDays?: number;
      };
    };
    currentStatus: {
      physicalProgress: number;
      financialProgress: number;
      status: ProjectStatus;
      progressStatus: ProgressStatus;
      financialProgressStatus: ProgressStatus;
      remainingBudget: number;
    };
  };
}

// Completion status interface
export interface CompletionStatusResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    estimatedCost: number;
    completionStatus: {
      physical: {
        percentage: number;
        status: ProgressStatus;
        isComplete: boolean;
        lastUpdate?: Date;
        totalUpdates: number;
      };
      financial: {
        percentage: number;
        status: ProgressStatus;
        isComplete: boolean;
        lastUpdate?: Date;
        totalUpdates: number;
        amountSubmitted: number;
        amountRemaining: number;
      };
      overall: {
        isFullyComplete: boolean;
        completionScore: number;
        progressGap: number;
      };
    };
  };
}

// Legacy Project interface for backward compatibility (if needed)
export interface Project {
  // Basic project information
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  budgetUtilized: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  expectedCompletion: string;
  category: string;
  subProjects: number;
  daysRemaining: number;
  currentStage: string;
  lastUpdated: string;

  // Proposal information
  dateOfProposal: string;
  hasSubProjects: boolean;
  beneficiary: string;
  letterReference: string;

  // Financial details
  fund: string;
  function: string;
  budgetHead: string;
  scheme: string;
  subScheme: string;
  estimatedCost: number;

  // Department information
  owningDepartment: string;
  executingDepartment: string;

  // Work details
  typeOfWork: string;
  subTypeOfWork: string;
  natureOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  modeOfExecution: string;

  // Location details
  district: string;
  block: string;
  gramPanchayat: string;
  latitude: number;
  longitude: number;

  // Related data
  documents: ProjectDocument[];
  subProjectDetails: SubProjectDetail[];
}

// Document interface for legacy support
export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

// Sub-project interface for legacy support
export interface SubProjectDetail {
  id: string;
  name: string;
  estimatedAmount: number;
  typeOfWork: string;
  subType: string;
  nature: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  progress: number;
}

// Error interfaces
export interface ApiError {
  success: false;
  message: string;
  details?: Record<string, unknown>;
  errors?: Array<{
    field: string;
    message: string;
    value: unknown;
  }>;
}

// API response utility type
export type ApiResponse<T> = T | ApiError;
