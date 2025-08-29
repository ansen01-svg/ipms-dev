// Archive Project Types
export interface DbArchiveProject {
  projectId: string;
  _id: string;
  financialYear: string;
  AANumber: string;
  AAAmount: number;
  AADated: string;
  nameOfWork: string;
  nameOfContractor: string;
  workValue: number;
  FWONumberAndDate: string;
  FWODate: string;
  progress: number;
  billSubmittedAmount: number;
  location: string;
  billNumber: string;
  concernedEngineer: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;

  // Virtual fields calculated on backend
  remainingWorkValue: number;
  progressStatus: ProgressStatus;
  financialProgress: number;
}

export type ProgressStatus =
  | "Not Started"
  | "Just Started"
  | "In Progress"
  | "Halfway Complete"
  | "Near Completion"
  | "Completed";

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

export interface ArchiveProjectsSummary {
  totalProjects: number;
  totalWorkValue: number;
  totalAAAmount: number;
  totalBillSubmitted: number;
  avgProgress: number;
  completedProjects: number;
  inProgressProjects: number;
  notStartedProjects: number;
  totalRemainingValue: number;
  completionRate: number;
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
  progress: number;
  billSubmittedAmount: number;
  location: string;
  billNumber: string;
  concernedEngineer: string;
  remarks?: string;

  // New progress-related fields
  progressUpdates: ProgressUpdate[];
  lastProgressUpdate: string | null;
  progressUpdatesEnabled: boolean;

  // Virtual fields
  remainingWorkValue: number;
  progressStatus: ProgressStatus;
  financialProgress: number;
  totalProgressUpdates: number;
  latestProgressUpdate: ProgressUpdate | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// types/progress.types.ts
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

export interface SupportingDocument {
  _id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: "document" | "image";
  uploadedAt: string;
}

export interface ProgressUpdateRequest {
  progress: number;
  remarks?: string;
  files?: File[];
}

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
