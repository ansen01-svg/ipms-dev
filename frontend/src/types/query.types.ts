// types/query.types.ts

export interface RaisedQuery {
  _id: string;
  queryId: string;
  projectId: string;
  queryTitle: string;
  queryDescription: string;
  queryCategory: QueryCategory;
  priority: QueryPriority;
  status: QueryStatus;
  raisedBy: string;
  assignedTo?: string;
  raisedDate: string;
  expectedResolutionDate: string;
  actualResolutionDate?: string;
  queryResponse?: string;
  internalRemarks?: string;
  escalationLevel: number;
  isActive: boolean;
  // Attachments array as seen in the API response
  attachments?: QueryAttachment[];
  createdAt: string;
  updatedAt: string;
  // Virtual fields added by backend
  daysSinceRaised?: number;
  daysUntilDue?: number | null;
  isOverdue?: boolean;
}

export type QueryCategory =
  | "Technical"
  | "Financial"
  | "Administrative"
  | "Legal"
  | "Compliance"
  | "Design"
  | "Material"
  | "Safety"
  | "Environmental"
  | "Other";

export type QueryPriority = "Low" | "Medium" | "High" | "Urgent";

export type QueryStatus =
  | "Open"
  | "In Progress"
  | "Under Review"
  | "Resolved"
  | "Closed"
  | "Escalated";

export interface QueryFormData {
  queryTitle: string;
  queryDescription: string;
  queryCategory: QueryCategory | "";
  priority: QueryPriority;
  expectedResolutionDate: string;
  assignedTo: string;
}

export interface CreateQueryRequest {
  queryTitle: string;
  queryDescription: string;
  queryCategory: QueryCategory;
  priority: QueryPriority;
  expectedResolutionDate: string;
  assignedTo?: string;
}

export interface CreateQueryResponse {
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    projectInfo: {
      projectId: string;
      nameOfWork: string;
      concernedEngineer: string;
    };
  };
  metadata: {
    createdAt: string;
    createdBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    totalQueriesForProject: number;
  };
}

export interface GetQueriesResponse {
  success: boolean;
  message: string;
  data: {
    projectInfo: {
      projectId: string;
      nameOfWork: string;
      concernedEngineer: string;
    };
    queries: RaisedQuery[];
    statistics: QueryStatistics;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: QueryFilters;
  };
}

export interface QueryStatistics {
  total: number;
  byStatus: Record<QueryStatus, number>;
  byPriority: Record<QueryPriority, number>;
  overdue: number;
  avgEscalationLevel: number;
}

export interface QueryFilters {
  status?: QueryStatus;
  priority?: QueryPriority;
  category?: QueryCategory;
  assignedTo?: string;
  raisedBy?: string;
  overdue?: boolean;
  search?: string;
}

export interface UpdateQueryRequest {
  queryTitle?: string;
  queryDescription?: string;
  queryCategory?: QueryCategory;
  priority?: QueryPriority;
  status?: QueryStatus;
  assignedTo?: string;
  expectedResolutionDate?: string;
  queryResponse?: string;
  internalRemarks?: string;
}

export interface EscalateQueryRequest {
  reason?: string;
}

export interface EscalateQueryResponse {
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    escalation: {
      from: number;
      to: number;
      reason: string;
    };
  };
  metadata: {
    escalatedAt: string;
    escalatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
  };
}

export interface QuerySearchRequest {
  q: string;
  page?: number;
  limit?: number;
  status?: QueryStatus;
  priority?: QueryPriority;
  category?: QueryCategory;
  financialYear?: string;
  concernedEngineer?: string;
}

export interface QuerySearchResponse {
  success: boolean;
  message: string;
  data: {
    queries: (RaisedQuery & {
      projectInfo: {
        projectId: string;
        nameOfWork: string;
        concernedEngineer: string;
        location: string;
      };
    })[];
    searchTerm: string;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: QueryFilters;
  };
}

// Component Props Types
export interface RaisedQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSubmitSuccess?: () => void;
}

export interface ViewerActionsProps {
  projectId: string;
  projectName?: string;
  onQuerySubmitted?: () => void;
}

export interface QueryListProps {
  projectId: string;
  filters?: QueryFilters;
  onQueryUpdate?: (query: RaisedQuery) => void;
}

export interface QueryCardProps {
  query: RaisedQuery;
  onUpdate?: (query: RaisedQuery) => void;
  onEscalate?: (queryId: string) => void;
  onDelete?: (queryId: string) => void;
}

// API Error Types
export interface APIError {
  success: false;
  message: string;
  details?: unknown;
  errors?: Array<{
    field: string;
    message: string;
    value: unknown;
  }>;
}

// Hook Types
export interface UseQueryReturn {
  queries: RaisedQuery[];
  loading: boolean;
  error: string | null;
  createQuery: (data: CreateQueryRequest) => Promise<void>;
  updateQuery: (queryId: string, data: UpdateQueryRequest) => Promise<void>;
  deleteQuery: (queryId: string) => Promise<void>;
  escalateQuery: (queryId: string, reason?: string) => Promise<void>;
  refreshQueries: () => Promise<void>;
}

// Constants
export const QUERY_CATEGORIES: QueryCategory[] = [
  "Technical",
  "Financial",
  "Administrative",
  "Legal",
  "Compliance",
  "Design",
  "Material",
  "Safety",
  "Environmental",
  "Other",
];

export const QUERY_PRIORITIES: Array<{
  value: QueryPriority;
  label: string;
  color: string;
}> = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

export const QUERY_STATUSES: Array<{
  value: QueryStatus;
  label: string;
  color: string;
}> = [
  { value: "Open", label: "Open", color: "bg-gray-100 text-gray-800" },
  {
    value: "In Progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Resolved",
    label: "Resolved",
    color: "bg-green-100 text-green-800",
  },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-600" },
];

// Updated types in @/types/query.types.ts

export interface UpdateQueryRequest {
  queryTitle?: string;
  queryDescription?: string;
  queryCategory?: QueryCategory;
  priority?: QueryPriority;
  status?: QueryStatus;
  assignedTo?: string;
  expectedResolutionDate?: string;
  queryResponse?: string;
  internalRemarks?: string;
  // NEW: File attachments support
  attachments?: File[];
}

// NEW: File attachment metadata interface
export interface QueryAttachment {
  downloadURL: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: "document" | "image";
  id: string;
  mimeType: string;
  originalName: string;
  uploadedAt: string;
  uploadedBy: {
    userDesignation: string;
    userId: string;
    userName: string;
  };
}

// Enhanced RaisedQuery interface
export interface RaisedQuery {
  _id: string;
  queryId: string;
  projectId: string;
  queryTitle: string;
  queryDescription: string;
  queryCategory: QueryCategory;
  priority: QueryPriority;
  status: QueryStatus;
  raisedBy: string;
  assignedTo?: string;
  raisedDate: string;
  expectedResolutionDate: string;
  actualResolutionDate?: string;
  queryResponse?: string;
  internalRemarks?: string;
  escalationLevel: number;
  isActive: boolean;
  // NEW: Attachments support
  attachments?: QueryAttachment[];
  totalAttachments?: number;
  latestAttachment?: QueryAttachment;
  // Virtual fields
  daysSinceRaised?: number;
  daysUntilDue?: number | null;
  isOverdue?: boolean;
  resolutionTimeInDays?: number;
  createdAt: string;
  updatedAt: string;
}

// NEW: Update query response interface
export interface UpdateQueryResponse {
  success: boolean;
  message: string;
  data: {
    query: RaisedQuery;
    changes: Record<string, { from: string | number; to: string | number }>;
    projectInfo: {
      projectId: string;
      projectName: string;
    };
    // NEW: File upload summary
    fileUploadSummary?: {
      totalFilesUploaded: number;
      totalAttachments: number;
      uploadedFiles: Array<{
        fileName: string;
        originalName: string;
        fileSize: number;
        fileType: string;
      }>;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: {
      userId: string;
      userName: string;
      userDesignation: string;
    };
    filesProcessed: number;
  };
}

// File validation constants
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_UPDATE = 5;

export const FILE_TYPE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
};
