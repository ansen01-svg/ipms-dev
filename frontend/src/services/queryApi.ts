// services/queryApi.ts

import {
  CreateQueryRequest,
  CreateQueryResponse,
  GetQueriesResponse,
  UpdateQueryRequest,
  EscalateQueryRequest,
  EscalateQueryResponse,
  QuerySearchRequest,
  QuerySearchResponse,
  QueryFilters,
  RaisedQuery,
} from "../types/query.types";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL || "";

class QueryApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    // Adjust this based on your auth implementation
    return localStorage.getItem("token");
  }

  /**
   * Make authenticated API request
   */
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Create a new query for a project
   */
  async createQuery(
    projectId: string,
    queryData: CreateQueryRequest
  ): Promise<CreateQueryResponse> {
    return this.apiRequest<CreateQueryResponse>(
      `${API_BASE_URL}/archive-project/${projectId}/queries`,
      {
        method: "POST",
        body: JSON.stringify(queryData),
      }
    );
  }

  /**
   * Get all queries for a specific project
   */
  async getProjectQueries(
    projectId: string,
    filters?: QueryFilters & {
      page?: number;
      limit?: number;
    }
  ): Promise<GetQueriesResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.assignedTo)
      queryParams.append("assignedTo", filters.assignedTo);
    if (filters?.raisedBy) queryParams.append("raisedBy", filters.raisedBy);
    if (filters?.overdue !== undefined)
      queryParams.append("overdue", filters.overdue.toString());
    if (filters?.search) queryParams.append("search", filters.search);

    const queryString = queryParams.toString();
    const endpoint = `${API_BASE_URL}/archive-project/${projectId}/queries${
      queryString ? `?${queryString}` : ""
    }`;

    return this.apiRequest<GetQueriesResponse>(endpoint);
  }

  /**
   * Get a single query by queryId
   */
  async getQueryById(
    queryId: string
  ): Promise<{ success: boolean; data: { query: RaisedQuery } }> {
    return this.apiRequest<{ success: boolean; data: { query: RaisedQuery } }>(
      `${API_BASE_URL}/queries/${queryId}`
    );
  }

  /**
   * Update an existing query
   */
  async updateQuery(
    queryId: string,
    updateData: UpdateQueryRequest
  ): Promise<{ success: boolean; data: { query: RaisedQuery } }> {
    return this.apiRequest<{ success: boolean; data: { query: RaisedQuery } }>(
      `/api/queries/${queryId}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      }
    );
  }

  /**
   * Delete a query (soft delete)
   */
  async deleteQuery(
    queryId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.apiRequest<{ success: boolean; message: string }>(
      `${API_BASE_URL}/queries/${queryId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Escalate a query
   */
  async escalateQuery(
    queryId: string,
    escalationData: EscalateQueryRequest
  ): Promise<EscalateQueryResponse> {
    return this.apiRequest<EscalateQueryResponse>(
      `${API_BASE_URL}/queries/${queryId}/escalate`,
      {
        method: "PUT",
        body: JSON.stringify(escalationData),
      }
    );
  }

  /**
   * Get query statistics across all projects
   */
  async getQueryStatistics(filters?: {
    financialYear?: string;
    concernedEngineer?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<{
    success: boolean;
    data: {
      overview: unknown;
      distributions: unknown;
      resolution: unknown;
      filters: unknown;
      generatedAt: string;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (filters?.financialYear)
      queryParams.append("financialYear", filters.financialYear);
    if (filters?.concernedEngineer)
      queryParams.append("concernedEngineer", filters.concernedEngineer);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.category) queryParams.append("category", filters.category);

    const queryString = queryParams.toString();
    const endpoint = `${API_BASE_URL}/queries/statistics${
      queryString ? `?${queryString}` : ""
    }`;

    return this.apiRequest(endpoint);
  }

  /**
   * Search queries across all projects
   */
  async searchQueries(
    searchParams: QuerySearchRequest
  ): Promise<QuerySearchResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append("q", searchParams.q);
    if (searchParams.page)
      queryParams.append("page", searchParams.page.toString());
    if (searchParams.limit)
      queryParams.append("limit", searchParams.limit.toString());
    if (searchParams.status) queryParams.append("status", searchParams.status);
    if (searchParams.priority)
      queryParams.append("priority", searchParams.priority);
    if (searchParams.category)
      queryParams.append("category", searchParams.category);
    if (searchParams.financialYear)
      queryParams.append("financialYear", searchParams.financialYear);
    if (searchParams.concernedEngineer)
      queryParams.append("concernedEngineer", searchParams.concernedEngineer);

    const endpoint = `/api/queries/search?${queryParams.toString()}`;

    return this.apiRequest<QuerySearchResponse>(endpoint);
  }

  /**
   * Bulk operations for queries (if needed in the future)
   */
  async bulkUpdateQueries(
    updates: Array<{
      queryId: string;
      updateData: UpdateQueryRequest;
    }>
  ): Promise<{
    success: boolean;
    data: {
      successful: unknown[];
      failed: unknown[];
      summary: {
        total: number;
        successful: number;
        failed: number;
      };
    };
  }> {
    return this.apiRequest("API_BASE_URL/queries/bulk-update", {
      method: "POST",
      body: JSON.stringify({ updates }),
    });
  }

  /**
   * Get queries assigned to current user
   */
  async getMyQueries(
    filters?: QueryFilters & {
      page?: number;
      limit?: number;
    }
  ): Promise<QuerySearchResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.category) queryParams.append("category", filters.category);

    // Add current user filter - you'll need to get this from your auth context
    // queryParams.append('assignedTo', currentUser.name);

    const queryString = queryParams.toString();
    const endpoint = `/api/queries/search${
      queryString ? `?${queryString}` : ""
    }`;

    return this.apiRequest<QuerySearchResponse>(endpoint);
  }

  /**
   * Get overdue queries
   */
  async getOverdueQueries(filters?: {
    page?: number;
    limit?: number;
    priority?: string;
    category?: string;
  }): Promise<QuerySearchResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append("overdue", "true");
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.category) queryParams.append("category", filters.category);

    const endpoint = `/api/queries/search?${queryParams.toString()}`;

    return this.apiRequest<QuerySearchResponse>(endpoint);
  }

  /**
   * Get recently created queries
   */
  async getRecentQueries(limit: number = 10): Promise<QuerySearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("sortBy", "raisedDate");
    queryParams.append("sortOrder", "desc");

    const endpoint = `/api/queries/search?${queryParams.toString()}`;

    return this.apiRequest<QuerySearchResponse>(endpoint);
  }

  /**
   * Get high priority queries
   */
  async getHighPriorityQueries(filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<QuerySearchResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append("priority", "High,Urgent");
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.status) queryParams.append("status", filters.status);

    const endpoint = `${API_BASE_URL}/queries/search?${queryParams.toString()}`;

    return this.apiRequest<QuerySearchResponse>(endpoint);
  }

  /**
   * Check API health/status
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.apiRequest("/api/health");
  }
}

// Create singleton instance
export const queryApiService = new QueryApiService();

// Export class for testing or custom instances
export default QueryApiService;

/**
 * Error handler for API calls
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: unknown }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response &&
    typeof (
      (error as { response: { data?: unknown } }).response as { data?: unknown }
    ).data === "object" &&
    ((error as { response: { data?: unknown } }).response as { data?: unknown })
      .data !== null &&
    "message" in
      (
        (error as { response: { data?: unknown } }).response as {
          data: { message?: unknown };
        }
      ).data
  ) {
    return (
      (
        (error as { response: { data: { message?: unknown } } }).response as {
          data: { message?: unknown };
        }
      ).data as { message: string }
    ).message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Retry failed API calls with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes("status: 4")) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
