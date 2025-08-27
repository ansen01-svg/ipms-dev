// Document interface for uploaded files
export interface UploadedFile {
  _id?: string;
  fileName: string;
  fileType: "pdf" | "jpg" | "jpeg" | "png";
  fileSize: number;
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

// Project status enum/type - matches backend constants
export type ProjectStatus =
  | "Draft"
  | "Submitted to AEE"
  | "Rejected by AEE"
  | "Submitted to CE"
  | "Rejected by CE"
  | "Submitted to MD"
  | "Rejected by MD"
  | "Submitted to Executing Department"
  | "Rejected by Executing Department"
  | "Approved"
  | "Ongoing"
  | "Pending"
  | "Completed";

// Main project interface matching backend schema exactly
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

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Frontend-calculated fields (not from backend)
  totalSubProjects?: number;
  daysRemaining?: number;
  currentStage?: string;
  lastUpdated?: string;
  budgetUtilized?: number;

  // Virtual fields for backward compatibility
  progress?: number; // alias for progressPercentage
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
