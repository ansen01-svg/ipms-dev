// Updated Archive Project Types aligned with backend schema
export interface DbArchiveProject {
  _id: string;
  projectId: string;
  financialYear: string;
  AANumber: string;
  AAAmount: number;
  AADated: string;
  nameOfWork: string;
  nameOfContractor: string;
  workValue: number;
  FWONumberAndDate: string;
  FWODate: string;

  // Physical Progress
  progress: number;

  // Financial Progress - New fields from backend
  financialProgress: number;
  billSubmittedAmount: number;

  location: string;
  billNumber: string;
  concernedEngineer: string;
  remarks?: string;

  // Progress Updates Arrays
  progressUpdates: ProgressUpdate[];
  financialProgressUpdates: FinancialProgressUpdate[];

  // Last Update Tracking
  lastProgressUpdate: string | null;
  lastFinancialProgressUpdate: string | null;

  // Update Enable/Disable Flags
  progressUpdatesEnabled: boolean;
  financialProgressUpdatesEnabled: boolean;

  // Virtual fields calculated on backend
  remainingWorkValue: number;
  remainingBillAmount: number;
  progressStatus: ProgressStatus;
  financialProgressStatus: ProgressStatus;
  totalProgressUpdates: number;
  totalFinancialProgressUpdates: number;
  latestProgressUpdate: ProgressUpdate | null;
  latestFinancialProgressUpdate: FinancialProgressUpdate | null;

  // Progress Summary (virtual field)
  progressSummary: {
    physical: {
      percentage: number;
      status: ProgressStatus;
      lastUpdate: string | null;
    };
    financial: {
      percentage: number;
      status: ProgressStatus;
      lastUpdate: string | null;
      amountSubmitted: number;
      amountRemaining: number;
    };
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type ProgressStatus =
  | "Not Started"
  | "Just Started"
  | "In Progress"
  | "Halfway Complete"
  | "Near Completion"
  | "Completed";

// Physical Progress Update
export interface ProgressUpdate {
  _id: string;
  previousProgress: number;
  newProgress: number;
  progressDifference: number;
  remarks: string;
  supportingDocuments: SupportingDocument[];
  updatedBy: {
    userId: string;
    userName: string;
    userDesignation: string;
  };
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

// Financial Progress Update - New type based on backend schema
export interface FinancialProgressUpdate {
  _id: string;
  previousFinancialProgress: number;
  newFinancialProgress: number;
  progressDifference: number;
  previousBillAmount: number;
  newBillAmount: number;
  amountDifference: number;
  remarks: string;
  billDetails: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  supportingDocuments: SupportingDocument[];
  updatedBy: {
    userId: string;
    userName: string;
    userDesignation: string;
  };
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportingDocument {
  _id?: string;
  fileName: string;
  originalName: string;
  downloadURL: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: "document" | "image";
  uploadedAt: string;
}

// Request Types
export interface ProgressUpdateRequest {
  progress: number;
  remarks?: string;
  files?: File[];
}

// Financial Progress Update Request - New type
export interface FinancialProgressUpdateRequest {
  newBillAmount: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  files?: File[];
}

// Combined Progress Update Request - New type
export interface CombinedProgressUpdateRequest {
  progress?: number;
  newBillAmount?: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  files?: File[];
}

// Response Types
export interface ProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbArchiveProject;
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
    updatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    totalProgressUpdates: number;
  };
}

// Financial Progress Update Response - New type
export interface FinancialProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbArchiveProject;
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
  };
  metadata: {
    updatedAt: string;
    updatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    totalFinancialProgressUpdates: number;
    isFullyComplete: boolean;
  };
}

// Combined Progress Update Response - New type
export interface CombinedProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbArchiveProject;
    updatesApplied: string[];
    filesUploaded: {
      count: number;
      totalSize: number;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    isFullyComplete: boolean;
  };
}

export interface ProgressHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    currentProgress: number;
    progressStatus: string;
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
      lastUpdateDate: string | null;
    };
  };
}

// Financial Progress History Response - New type
export interface FinancialProgressHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    workValue: number;
    currentBillAmount: number;
    currentFinancialProgress: number;
    financialProgressStatus: string;
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
      lastUpdateDate: string | null;
    };
  };
}

// Updated filter types to include financial progress
export interface ArchiveProjectFilters {
  search?: string;
  financialYear?: string | string[];
  concernedEngineer?: string | string[];
  nameOfContractor?: string;
  location?: string;
  minWorkValue?: number;
  maxWorkValue?: number;
  minAAAmount?: number;
  maxAAAmount?: number;
  minProgress?: number;
  maxProgress?: number;
  // New financial progress filters
  minFinancialProgress?: number;
  maxFinancialProgress?: number;
  financialProgressStatus?: ProgressStatus | ProgressStatus[];
  progressStatus?: ProgressStatus | ProgressStatus[];
  startAADate?: string;
  endAADate?: string;
  startFWODate?: string;
  endFWODate?: string;
  startCreatedDate?: string;
  endCreatedDate?: string;
  billNumber?: string;
  AANumber?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof DbArchiveProject;
  sortOrder?: "asc" | "desc";
}

export interface ArchiveProjectsPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  skip: number;
}

// Updated summary to include financial progress
export interface ArchiveProjectsSummary {
  totalProjects: number;
  totalWorkValue: number;
  totalAAAmount: number;
  totalBillSubmitted: number;
  avgProgress: number;
  avgFinancialProgress: number; // New field
  completedProjects: number;
  financiallyCompletedProjects: number; // New field
  fullyCompletedProjects: number; // New field - both physical and financial complete
  inProgressProjects: number;
  financiallyInProgressProjects: number; // New field
  notStartedProjects: number;
  financiallyNotStartedProjects: number; // New field
  totalRemainingValue: number;
  completionRate: number;
  financialCompletionRate: number; // New field
  fullCompletionRate: number; // New field
  billSubmissionRate: number; // New field
}

export interface ArchiveProjectsResponse {
  success: boolean;
  message: string;
  data: DbArchiveProject[];
  pagination: ArchiveProjectsPaginationMeta;
  summary: ArchiveProjectsSummary;
  filters: {
    applied: boolean;
    search: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

export interface ArchiveProjectFilterOptions {
  success: boolean;
  message: string;
  data: {
    financialYears: string[];
    contractors: string[];
    engineers: string[];
    locations: string[];
    progressStatuses: ProgressStatus[];
  };
}

// Timeline and Completion Status Types
export interface ProjectCompletionStatus {
  physical: {
    percentage: number;
    status: ProgressStatus;
    isComplete: boolean;
    lastUpdate: string | null;
    totalUpdates: number;
  };
  financial: {
    percentage: number;
    status: ProgressStatus;
    isComplete: boolean;
    lastUpdate: string | null;
    totalUpdates: number;
    amountSubmitted: number;
    amountRemaining: number;
  };
  overall: {
    isFullyComplete: boolean;
    completionScore: number;
    progressGap: number;
  };
}

export interface ProjectCompletionStatusResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    workValue: number;
    completionStatus: ProjectCompletionStatus;
  };
}

// Statistics Response Types
export interface ProgressStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    projectOverview: {
      totalProjects: number;
      avgProgress: number;
      completedProjects: number;
      inProgressProjects: number;
      notStartedProjects: number;
      totalProgressUpdates: number;
    };
    progressUpdateStats: {
      totalUpdates: number;
      avgProgressIncrease: number;
      maxProgressIncrease: number;
      minProgressIncrease: number;
      totalFilesUploaded: number;
    };
    additionalMetrics: {
      completionRate: number;
      averageUpdatesPerProject: number;
      projectDistribution: {
        notStarted: number;
        inProgress: number;
        completed: number;
      };
    };
    filters: {
      financialYear: string | null;
      concernedEngineer: string | null;
      startDate: string | null;
      endDate: string | null;
    };
    generatedAt: string;
  };
}

export interface FinancialProgressStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    projectOverview: {
      totalProjects: number;
      totalWorkValue: number;
      totalBillSubmitted: number;
      avgFinancialProgress: number;
      financiallyCompletedProjects: number;
      financiallyInProgressProjects: number;
      financiallyNotStartedProjects: number;
      totalFinancialProgressUpdates: number;
    };
    financialProgressUpdateStats: {
      totalUpdates: number;
      avgProgressIncrease: number;
      avgAmountIncrease: number;
      totalAmountSubmitted: number;
      maxProgressIncrease: number;
      minProgressIncrease: number;
      totalFilesUploaded: number;
    };
    additionalMetrics: {
      financialCompletionRate: number;
      billSubmissionRate: number;
      averageUpdatesPerProject: number;
      remainingWorkValue: number;
      projectDistribution: {
        notStarted: number;
        inProgress: number;
        completed: number;
      };
    };
    filters: {
      financialYear: string | null;
      concernedEngineer: string | null;
      startDate: string | null;
      endDate: string | null;
    };
    generatedAt: string;
  };
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  details?: {
    field?: string;
    value?: unknown;
    expectedType?: string;
    errorCode?: string;
  };
  errors?: Array<{
    field: string;
    message: string;
    value: unknown;
  }>;
}
