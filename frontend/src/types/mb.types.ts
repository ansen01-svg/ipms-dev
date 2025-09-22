import { DbArchiveProject } from "./archive-projects.types";
import { DbProject } from "./projects.types";

export interface MeasurementBook {
  _id: string;
  project: {
    _id: string;
    projectName: string;
    workOrderNumber: string;
    estimatedCost: number;
    district: string;
    state?: string;
  };
  description: string;
  uploadedFile: {
    fileName: string;
    originalName: string;
    downloadURL: string; // Firebase URL
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: "document" | "image";
    uploadedAt: string;
  };
  createdBy: {
    userId: string;
    name: string;
    role: string;
  };
  lastModifiedBy?: {
    userId: string;
    name: string;
    role: string;
    modifiedAt: string;
  };
  approvedBy?: {
    userId: string;
    name: string;
    role: string;
    approvedAt: string;
  };
  remarks?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  fileUrl?: string; // Virtual field
  humanReadableFileSize?: string; // Virtual field
}

export interface MBPaginationData {
  measurementBooks: MeasurementBook[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  summary: {
    totalMBs: number;
    uniqueProjects: number;
    approvedMBs: number;
    mbsWithRemarks: number;
    approvalRate: number;
    remarksRate: number;
    totalFileSize: number;
    avgFileSize: number;
    humanReadableTotalSize: string;
    humanReadableAvgSize: string;
  };
  projectStats: Array<{
    _id: string;
    count: number;
    totalFileSize: number;
    approvedCount: number;
    withRemarksCount: number;
    projectName: string;
    workOrderNumber: string;
  }>;
  filters: {
    search: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    hasRemarks: string | null;
    isApproved: string | null;
    projectId: string | null;
  };
}

export interface MBFilterConfig {
  search: string;
  dateFrom: string;
  dateTo: string;
  hasRemarks: "all" | "true" | "false";
  isApproved: "all" | "true" | "false";
  fileType: string;
}

export interface CreateMBData {
  project: string;
  description: string;
  remarks?: string;
  mbFile: File;
}

export interface UpdateMBData {
  description?: string;
  remarks?: string;
}

export interface MeasurementBookFile {
  fileName: string;
  originalName: string;
  downloadURL: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: "document" | "image";
  uploadedAt: string;
}

export interface MeasurementBookCreatedBy {
  userId: string;
  name: string;
  role: string;
}

export interface MeasurementBookLastModifiedBy {
  userId?: string;
  name?: string;
  role?: string;
  modifiedAt?: string;
}

export interface MeasurementBookApprovedBy {
  userId?: string;
  name?: string;
  role?: string;
  approvedAt?: string;
}

export interface DbMeasurementBook {
  _id: string;
  project: string; // MongoDB ObjectId, but populated with project details
  projectType: "Project" | "ArchiveProject";
  description: string;
  uploadedFile: MeasurementBookFile;
  createdBy: MeasurementBookCreatedBy;
  lastModifiedBy?: MeasurementBookLastModifiedBy;
  remarks?: string;
  approvedBy?: MeasurementBookApprovedBy;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;

  // Virtual fields (calculated by backend)
  fileUrl?: string;
  humanReadableFileSize?: string;
}

// Request types for creating measurement books
export interface MeasurementBookCreateRequest {
  project: string; // projectId string
  description: string;
  remarks?: string;
  uploadedFile?: MeasurementBookFile; // Set by middleware
}

export interface BatchMeasurementBookCreateRequest {
  measurementBooks: MeasurementBookCreateRequest[];
}

// Response types
export interface MeasurementBookCreateResponse {
  success: boolean;
  message: string;
  data: {
    measurementBooks: DbMeasurementBook[];
    summary: {
      totalCreated: number;
      projectTypes: {
        regular: number;
        archive: number;
      };
    };
  };
}

export interface MeasurementBookResponse {
  success: boolean;
  message: string;
  data: DbMeasurementBook;
}

export interface MeasurementBooksListResponse {
  success: boolean;
  message: string;
  data: {
    measurementBooks: DbMeasurementBook[];
    project?: {
      _id: string;
      projectId: string;
      projectName?: string;
      nameOfWork?: string;
      contractorName?: string;
      nameOfContractor?: string;
      district?: string;
      location?: string;
      estimatedCost?: number;
      workValue?: number;
      projectType: "Project" | "ArchiveProject";
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

export interface MeasurementBookFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  projectType?: "Project" | "ArchiveProject";
  search?: string;
  createdBy?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MeasurementBookStatistics {
  success: boolean;
  message: string;
  data: {
    statistics: {
      totalMBs: number;
      totalFileSize: number;
      avgFileSize: number;
      totalFileSizeMB: number;
      projectTypeBreakdown: {
        Project: number;
        ArchiveProject: number;
      };
    };
    queryParameters: {
      projectType: string;
      dateRange: {
        from: string | null;
        to: string | null;
      };
    };
  };
}

// Update request types
export interface MeasurementBookUpdateRequest {
  description?: string;
  remarks?: string;
}

export interface MeasurementBookUpdateResponse {
  success: boolean;
  message: string;
  data: DbMeasurementBook;
}

// Error response type
export interface MeasurementBookError {
  success: false;
  message: string;
  errors?: string[];
  details?: {
    field?: string;
    value?: unknown;
    expectedType?: string;
    errorCode?: string;
  };
}

// Frontend-specific types for the create form
export interface WorkItemMeasurement {
  id: number;
  description: string;
  no: number;
  length: number;
  width: number;
  height: number;
  total: number;
}

export interface WorkItemForMB {
  id: number;
  description: string;
  unit: string;
  measurements: WorkItemMeasurement[];
  totalQuantity: number;
  uploadedFile: File | null;
  remarks: string;
}

// Unified project details for the frontend form
export interface ProjectDetailsForMB {
  id: string;
  name: string;
  contractorName: string;
  contractorPhone?: string;
  contractorAddress?: string;
  startDate: string;
  endDate?: string;
  location: string;
  workValue: number;
  projectType: "Project" | "ArchiveProject";
  workOrderNumber?: string;
  fund?: string;
  subFund?: string;
  progress?: number;
  financialProgress?: number;
  status?: string;
}

// API response type for project details
export interface ProjectDetailsResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject | DbArchiveProject; // The actual project object
    projectType: "Project" | "ArchiveProject";
  };
}

// Validation types
export interface MBValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    sizeFormatted: string;
  };
}

// API error types specific to MB operations
export interface MBApiError extends MeasurementBookError {
  validatedCount?: number;
  totalCount?: number;
  invalidProjectIds?: string[];
  validProjectIds?: string[];
}

// Bulk operations types
export interface BulkMBCreateResult {
  successful: DbMeasurementBook[];
  failed: Array<{
    index: number;
    description: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface BulkMBDeleteRequest {
  mbIds: string[];
}

export interface BulkMBDeleteResponse {
  success: boolean;
  message: string;
  data: {
    deleted: string[];
    failed: Array<{
      mbId: string;
      error: string;
    }>;
    summary: {
      total: number;
      deleted: number;
      failed: number;
    };
  };
}

// Export/Import types
export interface MBExportFilters extends MeasurementBookFilters {
  format?: "csv" | "excel" | "pdf";
  includeFiles?: boolean;
}

export interface MBExportResponse {
  success: boolean;
  message: string;
  data: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
    recordCount: number;
    format: string;
  };
}

// Utility types
export type MBSortField =
  | "createdAt"
  | "updatedAt"
  | "description"
  | "projectType";
export type MBSortOrder = "asc" | "desc";

export interface MBPaginationParams {
  page: number;
  limit: number;
  sortBy: MBSortField;
  sortOrder: MBSortOrder;
}
