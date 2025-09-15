// utils/queryUtils.ts

import {
  RaisedQuery,
  QueryPriority,
  QueryStatus,
  QueryCategory,
  QueryFormData,
  QUERY_PRIORITIES,
  QUERY_STATUSES,
  QUERY_CATEGORIES,
} from "../../types/query.types";

/**
 * Format date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate days between two dates
 */
export function calculateDaysBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days since query was raised
 */
export function getDaysSinceRaised(raisedDate: Date | string): number {
  return calculateDaysBetween(raisedDate, new Date());
}

/**
 * Calculate days until due date
 */
export function getDaysUntilDue(expectedDate: Date | string): number {
  const days = calculateDaysBetween(new Date(), expectedDate);
  const expected =
    typeof expectedDate === "string" ? new Date(expectedDate) : expectedDate;
  return expected < new Date() ? -days : days;
}

/**
 * Check if query is overdue
 */
export function isQueryOverdue(query: RaisedQuery): boolean {
  if (
    !query.expectedResolutionDate ||
    ["Resolved", "Closed"].includes(query.status)
  ) {
    return false;
  }
  return new Date() > new Date(query.expectedResolutionDate);
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: QueryPriority): string {
  const priorityInfo = QUERY_PRIORITIES.find((p) => p.value === priority);
  return priorityInfo?.color || "bg-gray-100 text-gray-800";
}

/**
 * Get status color class
 */
export function getStatusColor(status: QueryStatus): string {
  const statusInfo = QUERY_STATUSES.find((s) => s.value === status);
  return statusInfo?.color || "bg-gray-100 text-gray-800";
}

/**
 * Get priority icon or indicator
 */
export function getPriorityIndicator(priority: QueryPriority): string {
  switch (priority) {
    case "Low":
      return "🟢";
    case "Medium":
      return "🟡";
    case "High":
      return "🟠";
    case "Urgent":
      return "🔴";
    default:
      return "⚪";
  }
}

/**
 * Get status icon or indicator
 */
export function getStatusIndicator(status: QueryStatus): string {
  switch (status) {
    case "Open":
      return "📝";
    case "In Progress":
      return "⏳";
    case "Under Review":
      return "👀";
    case "Resolved":
      return "✅";
    case "Closed":
      return "🔒";
    case "Escalated":
      return "🚨";
    default:
      return "❓";
  }
}

/**
 * Validate query form data
 */
export function validateQueryForm(
  formData: QueryFormData
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate title
  if (!formData.queryTitle.trim()) {
    errors.queryTitle = "Query title is required";
  } else if (formData.queryTitle.trim().length < 5) {
    errors.queryTitle = "Query title must be at least 5 characters";
  } else if (formData.queryTitle.trim().length > 200) {
    errors.queryTitle = "Query title cannot exceed 200 characters";
  }

  // Validate description
  if (!formData.queryDescription.trim()) {
    errors.queryDescription = "Query description is required";
  } else if (formData.queryDescription.trim().length < 20) {
    errors.queryDescription =
      "Query description must be at least 20 characters";
  } else if (formData.queryDescription.trim().length > 2000) {
    errors.queryDescription = "Query description cannot exceed 2000 characters";
  }

  // Validate category
  if (!formData.queryCategory) {
    errors.queryCategory = "Query category is required";
  } else if (
    !QUERY_CATEGORIES.includes(formData.queryCategory as QueryCategory)
  ) {
    errors.queryCategory = "Invalid query category";
  }

  // Validate expected resolution date
  if (!formData.expectedResolutionDate) {
    errors.expectedResolutionDate = "Expected resolution date is required";
  } else {
    const selectedDate = new Date(formData.expectedResolutionDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      errors.expectedResolutionDate =
        "Expected resolution date must be at least tomorrow";
    }
  }

  return errors;
}

/**
 * Sort queries by priority (Urgent first, then High, Medium, Low)
 */
export function sortQueriesByPriority(queries: RaisedQuery[]): RaisedQuery[] {
  const priorityOrder: Record<QueryPriority, number> = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...queries].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Sort queries by status (Open first, then In Progress, etc.)
 */
export function sortQueriesByStatus(queries: RaisedQuery[]): RaisedQuery[] {
  const statusOrder: Record<QueryStatus, number> = {
    Escalated: 6,
    Open: 5,
    "In Progress": 4,
    "Under Review": 3,
    Resolved: 2,
    Closed: 1,
  };

  return [...queries].sort((a, b) => {
    return statusOrder[b.status] - statusOrder[a.status];
  });
}

/**
 * Filter queries by various criteria
 */
export function filterQueries(
  queries: RaisedQuery[],
  filters: {
    status?: QueryStatus[];
    priority?: QueryPriority[];
    category?: QueryCategory[];
    overdue?: boolean;
    escalated?: boolean;
    searchTerm?: string;
  }
): RaisedQuery[] {
  return queries.filter((query) => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(query.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(query.priority)) return false;
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(query.queryCategory)) return false;
    }

    // Overdue filter
    if (filters.overdue === true && !isQueryOverdue(query)) {
      return false;
    }

    // Escalated filter
    if (filters.escalated === true && query.escalationLevel === 0) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchFields = [
        query.queryTitle,
        query.queryDescription,
        query.queryResponse || "",
        query.internalRemarks || "",
        query.raisedBy,
        query.assignedTo || "",
      ]
        .join(" ")
        .toLowerCase();

      if (!searchFields.includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * Get query summary statistics
 */
export function getQuerySummaryStats(queries: RaisedQuery[]) {
  const stats = {
    total: queries.length,
    byStatus: {} as Record<QueryStatus, number>,
    byPriority: {} as Record<QueryPriority, number>,
    byCategory: {} as Record<QueryCategory, number>,
    overdue: 0,
    escalated: 0,
    avgResolutionTime: 0,
    resolutionRate: 0,
  };

  if (queries.length === 0) return stats;

  // Initialize counters
  QUERY_STATUSES.forEach((status: { value: QueryStatus; color: string }) => {
    stats.byStatus[status.value] = 0;
  });
  QUERY_PRIORITIES.forEach(
    (priority: { value: QueryPriority; color: string }) => {
      stats.byPriority[priority.value] = 0;
    }
  );
  QUERY_CATEGORIES.forEach((category: QueryCategory) => {
    stats.byCategory[category] = 0;
  });

  let totalResolutionTime = 0;
  let resolvedCount = 0;

  queries.forEach((query) => {
    // Count by status
    stats.byStatus[query.status]++;

    // Count by priority
    stats.byPriority[query.priority]++;

    // Count by category
    stats.byCategory[query.queryCategory]++;

    // Count overdue
    if (isQueryOverdue(query)) {
      stats.overdue++;
    }

    // Count escalated
    if (query.escalationLevel > 0) {
      stats.escalated++;
    }

    // Calculate resolution time
    if (query.actualResolutionDate && query.raisedDate) {
      const resolutionTime = calculateDaysBetween(
        query.raisedDate,
        query.actualResolutionDate
      );
      totalResolutionTime += resolutionTime;
      resolvedCount++;
    }
  });

  // Calculate averages and rates
  stats.avgResolutionTime =
    resolvedCount > 0 ? Math.round(totalResolutionTime / resolvedCount) : 0;
  stats.resolutionRate = Math.round(
    ((stats.byStatus["Resolved"] + stats.byStatus["Closed"]) / queries.length) *
      100
  );

  return stats;
}

/**
 * Generate query ID (client-side preview)
 */
export function generateQueryId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `QRY-${year}-${String(randomNum).padStart(4, "0")}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Export queries to CSV format
 */
export function exportQueriesToCSV(queries: RaisedQuery[]): string {
  const headers = [
    "Query ID",
    "Title",
    "Description",
    "Category",
    "Priority",
    "Status",
    "Raised By",
    "Assigned To",
    "Raised Date",
    "Expected Resolution Date",
    "Actual Resolution Date",
    "Days Since Raised",
    "Days Until Due",
    "Is Overdue",
    "Escalation Level",
  ];

  const rows = queries.map((query) => [
    query.queryId,
    `"${query.queryTitle.replace(/"/g, '""')}"`,
    `"${query.queryDescription.replace(/"/g, '""')}"`,
    query.queryCategory,
    query.priority,
    query.status,
    query.raisedBy,
    query.assignedTo || "",
    formatDate(query.raisedDate),
    formatDate(query.expectedResolutionDate),
    query.actualResolutionDate ? formatDate(query.actualResolutionDate) : "",
    getDaysSinceRaised(query.raisedDate),
    getDaysUntilDue(query.expectedResolutionDate),
    isQueryOverdue(query) ? "Yes" : "No",
    query.escalationLevel,
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Validate email format (for assignedTo field)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
