import { DbArchiveProject } from "./archive-projects.types";
import { DbProject } from "./projects.types";

// Updated Measurement Item structure
export interface MeasurementItem {
  id: string;
  description: string;
  unit: string;
  uploadedFile: {
    fileName: string;
    originalName: string;
    downloadURL: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: "document" | "image";
    uploadedAt: string;
  };
}

// Updated Measurement Book structure
export interface DbMeasurementBook {
  _id: string;
  project: string | DbProject | DbArchiveProject;
  projectType: "Project" | "ArchiveProject";
  mbId: string; // Auto-generated unique ID like MB_123456
  mbNo: string;
  nameOfWork: string;
  location: string;
  contractor: string;
  tenderAgreement?: string;
  aaOrFsNo?: string;
  aaOrFsDate?: string;
  slNoOfBill?: string;
  dateOfCommencement: string;
  dateOfCompletion: string;
  dateOfMeasurement: string;
  measurements: MeasurementItem[];
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
  createdAt: string;
  updatedAt: string;
  totalMeasurements?: number;
  totalFileSize?: number;
  humanReadableTotalFileSize?: string;
}

// Frontend form measurement item
export interface FormMeasurementItem {
  id: string;
  description: string;
  unit: string;
  uploadedFile: File | null;
  // For reference/calculation
  no: number;
  length: number;
  width: number;
  height: number;
  total: number;
}

// Create MB Request
export interface CreateMBRequest {
  project: string;
  mbNo: string;
  nameOfWork: string;
  location: string;
  contractor: string;
  tenderAgreement?: string;
  aaOrFsNo?: string;
  aaOrFsDate?: string;
  slNoOfBill?: string;
  dateOfCommencement: string;
  dateOfCompletion: string;
  dateOfMeasurement: string;
  measurements: Array<{
    id: string;
    description: string;
    unit: string;
  }>;
}

// Response types
export interface MBCreateResponse {
  success: boolean;
  message: string;
  data: {
    measurementBooks: Array<{
      mbId: string;
      mbNo: string;
      nameOfWork: string;
      project: string;
      projectType: "Project" | "ArchiveProject";
      totalMeasurements: number;
    }>;
    summary: {
      totalCreated: number;
      totalMeasurementItems: number;
    };
  };
}

export interface MBListResponse {
  success: boolean;
  data: {
    measurementBooks: DbMeasurementBook[];
    project?: {
      _id: string;
      projectId: string;
      projectName?: string;
      nameOfWork?: string;
      contractorName?: string;
      nameOfContractor?: string;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    summary: {
      total: number;
      totalMeasurementItems: number;
      byProjectType: {
        Project?: number;
        ArchiveProject?: number;
      };
    };
  };
}

export interface MBSingleResponse {
  success: boolean;
  data: {
    measurementBook: DbMeasurementBook;
  };
}

// Update request
export interface UpdateMBRequest {
  mbNo?: string;
  nameOfWork?: string;
  location?: string;
  contractor?: string;
  tenderAgreement?: string;
  aaOrFsNo?: string;
  aaOrFsDate?: string;
  slNoOfBill?: string;
  dateOfCommencement?: string;
  dateOfCompletion?: string;
  dateOfMeasurement?: string;
}

// Measurement operations
export interface AddMeasurementRequest {
  id: string;
  description: string;
  unit: string;
}

export interface UpdateMeasurementRequest {
  description?: string;
  unit?: string;
}

// Error response
export interface MBErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  validatedCount?: number;
  totalCount?: number;
}

// Filters
export interface MBFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | 1 | -1;
  projectType?: "Project" | "ArchiveProject";
  mbId?: string;
  mbNo?: string;
  contractor?: string;
  location?: string;
  search?: string;
  createdBy?: string;
}

// Unified project details for MB form
export interface UnifiedProjectDetails {
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
  district?: string;
  progress?: number;
  financialProgress?: number;
  billSubmittedAmount?: number;
  status?: string;
  originalProject: DbProject | DbArchiveProject;
}
