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
