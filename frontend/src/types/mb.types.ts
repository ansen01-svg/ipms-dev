// frontend/src/types/measurement-book.types.ts

export interface MeasurementBook {
  _id: string;
  projectId: string;
  project: {
    _id: string;
    projectName: string;
    workOrderNumber: string;
    estimatedCost: number;
    district: string;
  };
  title: string;
  description: string;
  mbNumber: string;
  measurementDate: string;
  workOrderNumber?: string;
  contractorName?: string;
  uploadedFile: {
    fileName: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    mimeType: string;
  };
  status: MBStatus;
  remarks?: string;
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
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  humanReadableFileSize: string;
}

export type MBStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface CreateMBData {
  projectId: string;
  title: string;
  description: string;
  mbNumber: string;
  measurementDate: string;
  workOrderNumber?: string;
  contractorName?: string;
  remarks?: string;
  mbFile: File;
}

export interface UpdateMBData {
  title?: string;
  description?: string;
  measurementDate?: string;
  workOrderNumber?: string;
  contractorName?: string;
  remarks?: string;
  status?: MBStatus;
}

export interface MBStatistics {
  overview: {
    totalMBs: number;
    statusBreakdown: Record<MBStatus, number>;
    fileTypeBreakdown: Record<string, number>;
  };
  monthlyCreationTrend: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
  recentMBs: Array<{
    _id: string;
    title: string;
    mbNumber: string;
    status: MBStatus;
    createdAt: string;
    createdBy: {
      name: string;
    };
  }>;
}

export interface MBFilterConfig {
  status: string;
  fileType: string;
  dateRange: {
    start?: string;
    end?: string;
  };
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
  project: {
    projectId: string;
    projectName: string;
    workOrderNumber: string;
  };
  statusCounts: Record<MBStatus, number>;
}

export interface BulkUpdateData {
  mbIds: string[];
  status: MBStatus;
  remarks?: string;
}
