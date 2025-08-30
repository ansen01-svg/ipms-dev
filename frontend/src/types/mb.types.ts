// frontend/src/types/mb.types.ts - Updated to match backend schema

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
