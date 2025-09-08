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

// Fund and Sub Fund interfaces
export interface SubFund {
  id: number;
  name: string;
  code: string;
}

export interface Fund {
  id: number;
  name: string;
  code: string;
  subFunds: SubFund[];
}

export interface FundDetails {
  mainFund: {
    name: string;
    code: string;
  };
  subFund: {
    name: string;
    code: string;
  } | null;
  fullName: string;
  fullCode: string;
}

// Contractor interfaces
export interface ContractorContact {
  name: string;
  address: string;
  phone: string;
}

export interface ContractorInfo {
  name: string;
  phone: string;
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

  // Nested objects
  subProjects: SubProject[];
  uploadedFiles: UploadedFile[];
  geoLocation: GeoLocation;
  createdBy: CreatedBy;
  lastModifiedBy?: LastModifiedBy;

  // Project status and progress
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

  // NEW: Virtual fields for contractor and fund details
  contractorContact?: ContractorContact;
  fundDetails?: FundDetails;

  // Frontend-calculated fields
  totalSubProjects?: number;
  daysRemaining?: number;
  currentStage?: string;
  lastUpdated?: string;
  budgetUtilized?: number;

  // Virtual fields for backward compatibility
  progress?: number; // alias for progressPercentage
}

// Enhanced Project API Response interfaces
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
    // NEW: Enhanced metadata
    contractorInfo?: ContractorInfo;
    fundInfo?: {
      fund: string;
      subFund: string;
      fundDetails?: FundDetails;
    };
  };
}

// Enhanced project with related projects
export interface ProjectWithRelatedResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject;
    metrics: {
      daysFromStartToNow?: number;
      daysUntilDeadline?: number;
      daysWithExtension?: number;
      billSubmissionRate: number;
      isPhysicallyOverdue: boolean;
      isFinanciallyOverdue: boolean;
      projectAge: number;
      progressGap: number;
      isFullyComplete: boolean;
      hasExtension: boolean;
      isWithinBudget: boolean;
      budgetUtilization: number;
    };
    relatedProjects: {
      byCreator: DbProject[];
      byDistrict: DbProject[];
      byFund: DbProject[];
      bySubFund: DbProject[]; // NEW: Related projects by sub fund
      byType: DbProject[];
      byContractor: DbProject[]; // NEW: Related projects by contractor
    };
  };
  metadata?: {
    retrievedAt: string;
    projectId: string;
    status: ProjectStatus;
    lastUpdated: string;
    lastProgressUpdate?: Date;
    lastFinancialProgressUpdate?: Date;
    hasSubProjects: boolean;
    subProjectsCount: number;
    contractorInfo?: ContractorInfo;
    fundInfo?: {
      fund: string;
      subFund: string;
      fundDetails?: FundDetails;
    };
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
    // NEW: Contractor and fund summaries
    totalUniqueContractors?: number;
    topContractors?: Array<{
      name: string;
      projectCount: number;
      totalValue: number;
    }>;
    fundDistribution?: Array<{
      fund: string;
      subFund?: string;
      projectCount: number;
      totalValue: number;
    }>;
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

// Enhanced Project summary and statistics interfaces
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
      // NEW: Contractor metrics
      totalUniqueContractors: number;
      avgProjectsPerContractor: number;
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
        contractorCount: number; // NEW
      }>;
      funds: Array<{
        name: string;
        projectCount: number;
        totalValue: number;
        avgPhysicalProgress: number;
        avgFinancialProgress: number;
        completedProjects: number;
        completionRate: number;
        contractorCount: number; // NEW
      }>;
      // NEW: Sub funds analysis
      subFunds: Array<{
        fund: string;
        subFund: string;
        projectCount: number;
        totalValue: number;
        avgPhysicalProgress: number;
        avgFinancialProgress: number;
        completedProjects: number;
        completionRate: number;
        contractorCount: number;
      }>;
      // NEW: Top contractors
      contractors: Array<{
        contractorName: string;
        contractorPhone: string;
        projectCount: number;
        totalValue: number;
        totalBillSubmitted: number;
        avgPhysicalProgress: number;
        avgFinancialProgress: number;
        completedProjects: number;
        financiallyCompletedProjects: number;
        ongoingProjects: number;
        districtCount: number;
        workTypeCount: number;
        avgProjectValue: number;
        budgetUtilization: number;
        physicalCompletionRate: number;
        financialCompletionRate: number;
      }>;
    };
    progressMetrics: {
      totalUpdates: number;
      physicalUpdates: number;
      financialUpdates: number;
      avgUpdatesPerProject: number;
      avgProgressGap: number;
    };
    // NEW: Contractor metrics
    contractorMetrics: {
      totalUniqueContractors: number;
      avgProjectsPerContractor: number;
    };
  };
  filters: {
    status?: string | null;
    district?: string | null;
    fund?: string | null;
    subFund?: string | null; // NEW
    createdBy?: string | null;
    typeOfWork?: string | null;
    natureOfWork?: string | null;
    contractorName?: string | null; // NEW
  };
  metadata: {
    generatedAt: string;
    dataFreshness: string;
    totalProjectsAnalyzed: number;
    totalContractorsAnalyzed: number; // NEW
  };
}

// NEW: District-wise summary with contractor info
export interface DistrictWiseProjectsSummaryResponse {
  success: boolean;
  message: string;
  data: {
    districts: Array<{
      districtName: string;
      projectCount: number;
      totalEstimatedCost: number;
      totalBillSubmitted: number;
      remainingBudget: number;
      avgPhysicalProgress: number;
      avgFinancialProgress: number;
      completedProjects: number;
      financiallyCompletedProjects: number;
      fullyCompletedProjects: number;
      ongoingProjects: number;
      totalUpdates: number;
      contractorCount: number;
      uniqueContractors: string[];
      physicalCompletionRate: number;
      financialCompletionRate: number;
      fullCompletionRate: number;
      budgetUtilizationRate: number;
      avgProjectValue: number;
      progressGap: number;
      avgProjectsPerContractor: number;
    }>;
    totalDistricts: number;
    aggregatedTotals: {
      totalProjects: number;
      totalEstimatedCost: number;
      totalBillSubmitted: number;
      totalCompletedProjects: number;
      totalOngoingProjects: number;
      totalUniqueContractors: number;
      totalContractorCount: number;
    };
  };
  filters: {
    status?: string | null;
    fund?: string | null;
    timeRange?: string;
    contractorName?: string | null;
  };
}

// NEW: Contractor-wise summary
export interface ContractorWiseProjectsSummaryResponse {
  success: boolean;
  message: string;
  data: {
    contractors: Array<{
      contractorName: string;
      contractorPhone: string;
      contractorAddress: string;
      projectCount: number;
      totalEstimatedCost: number;
      totalBillSubmitted: number;
      remainingBudget: number;
      avgPhysicalProgress: number;
      avgFinancialProgress: number;
      completedProjects: number;
      financiallyCompletedProjects: number;
      fullyCompletedProjects: number;
      ongoingProjects: number;
      districts: string[];
      workTypes: string[];
      funds: string[];
      districtCount: number;
      workTypeCount: number;
      fundCount: number;
      totalUpdates: number;
      physicalCompletionRate: number;
      financialCompletionRate: number;
      fullCompletionRate: number;
      budgetUtilizationRate: number;
      avgProjectValue: number;
      progressGap: number;
      diversityScore: number;
    }>;
    totalContractors: number;
    aggregatedTotals: {
      totalProjects: number;
      totalEstimatedCost: number;
      totalBillSubmitted: number;
      totalCompletedProjects: number;
      totalOngoingProjects: number;
    };
  };
  filters: {
    status?: string | null;
    district?: string | null;
    fund?: string | null;
    timeRange?: string;
  };
}

// NEW: Sub funds API response
export interface SubFundsListResponse {
  success: boolean;
  message: string;
  data: {
    fund?: string;
    subFunds?: SubFund[];
    funds?: Fund[];
  };
}

// Enhanced Project timeline interface
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
  details?: {
    contractor?: string;
    fund?: string;
    subFund?: string;
    fundDetails?: FundDetails;
    [key: string]: unknown;
  };
}

export interface ProjectTimelineResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    contractorName: string; // NEW
    fund: string; // NEW
    subFund: string; // NEW
    fundDetails: FundDetails; // NEW
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

// Enhanced project creation request
export interface ProjectCreateRequest {
  dateOfIssueOfWorkOrder: string;
  projectName: string;
  description?: string;
  hasSubProjects: boolean;
  fund: string;
  subFund: string; // NEW
  sanctioningDepartment: string;
  budgetHead?: string;
  beneficiary?: string;
  workOrderNumber: string;
  contractorName: string; // NEW
  contractorAddress: string; // NEW
  contractorPhoneNumber: string; // NEW
  estimatedCost: number;
  typeOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  extensionPeriodForCompletion?: string;
  district: string;
  block?: string;
  gramPanchayat?: string;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  subProjects?: SubProject[];
  uploadedFiles?: UploadedFile[];
}

// Enhanced project creation response
export interface ProjectCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    projectName: string;
    workOrderNumber: string;
    fund: string;
    subFund: string; // NEW
    fundDetails: FundDetails; // NEW
    contractorName: string; // NEW
    contractorPhoneNumber: string; // NEW
    status: ProjectStatus;
    createdAt: string;
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
  subFund?: string; // NEW
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

  // NEW: Contractor details
  contractorName?: string;
  contractorAddress?: string;
  contractorPhoneNumber?: string;

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

// NEW: Filter interfaces for enhanced queries
export interface ProjectFilters {
  status?: ProjectStatus;
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
}

// NEW: Search and pagination interface
export interface ProjectSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: ProjectFilters;
}
