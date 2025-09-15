// hooks/useQueries.ts

import { useState, useEffect, useCallback } from "react";
import {
  RaisedQuery,
  CreateQueryRequest,
  UpdateQueryRequest,
  QueryFilters,
  GetQueriesResponse,
  CreateQueryResponse,
  APIError,
  UseQueryReturn,
} from "../types/query.types";
import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
export function useQueries(
  projectId: string,
  initialFilters?: QueryFilters
): UseQueryReturn {
  const [queries, setQueries] = useState<RaisedQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token - adjust this based on your auth implementation
  //   const getAuthToken = useCallback(() => {
  //     return localStorage.getItem("token"); // or from context/redux store
  //   }, []);

  // API call helper
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = getAuthToken();
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    },
    [getAuthToken]
  );

  // Fetch queries for the project
  const fetchQueries = useCallback(
    async (filters?: QueryFilters) => {
      if (!projectId) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.priority) queryParams.append("priority", filters.priority);
        if (filters?.category) queryParams.append("category", filters.category);
        if (filters?.assignedTo)
          queryParams.append("assignedTo", filters.assignedTo);
        if (filters?.raisedBy) queryParams.append("raisedBy", filters.raisedBy);
        if (filters?.overdue)
          queryParams.append("overdue", filters.overdue.toString());
        if (filters?.search) queryParams.append("search", filters.search);

        const queryString = queryParams.toString();
        const endpoint = `${
          process.env.NEXT_PUBLIC_DEV_API_URL
        }/archive-project/${projectId}/queries${
          queryString ? `?${queryString}` : ""
        }`;

        const response: GetQueriesResponse = await apiCall(endpoint);

        if (response.success) {
          setQueries(response.data.queries);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch queries";
        setError(errorMessage);
        console.error("Error fetching queries:", err);
      } finally {
        setLoading(false);
      }
    },
    [projectId, apiCall]
  );

  // Create a new query
  const createQuery = useCallback(
    async (data: CreateQueryRequest): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: CreateQueryResponse = await apiCall(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/queries`,
          {
            method: "POST",
            body: JSON.stringify(data),
          }
        );

        if (response.success) {
          // Add the new query to the list
          setQueries((prev) => [response.data.query, ...prev]);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create query";
        setError(errorMessage);
        throw err; // Re-throw so the component can handle it
      } finally {
        setLoading(false);
      }
    },
    [projectId, apiCall]
  );

  // Update an existing query
  const updateQuery = useCallback(
    async (queryId: string, data: UpdateQueryRequest): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/queries/${queryId}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
          }
        );

        if (response.success) {
          // Update the query in the list
          setQueries((prev) =>
            prev.map((query) =>
              query.queryId === queryId
                ? { ...query, ...response.data.query }
                : query
            )
          );
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update query";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  // Delete a query (soft delete)
  const deleteQuery = useCallback(
    async (queryId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/queries/${queryId}`,
          {
            method: "DELETE",
          }
        );

        if (response.success) {
          // Remove the query from the list
          setQueries((prev) =>
            prev.filter((query) => query.queryId !== queryId)
          );
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete query";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  // Escalate a query
  const escalateQuery = useCallback(
    async (queryId: string, reason?: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(
          `${process.env.NEXT_PUBLIC_DEV_API_URL}/queries/${queryId}/escalate`,
          {
            method: "PUT",
            body: JSON.stringify({ reason }),
          }
        );

        if (response.success) {
          // Update the query in the list
          setQueries((prev) =>
            prev.map((query) =>
              query.queryId === queryId
                ? { ...query, ...response.data.query }
                : query
            )
          );
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to escalate query";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  // Refresh queries
  const refreshQueries = useCallback(async (): Promise<void> => {
    await fetchQueries(initialFilters);
  }, [fetchQueries, initialFilters]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchQueries(initialFilters);
    }
  }, [projectId, fetchQueries, initialFilters]);

  return {
    queries,
    loading,
    error,
    createQuery,
    updateQuery,
    deleteQuery,
    escalateQuery,
    refreshQueries,
  };
}

// Additional hook for query statistics
export function useQueryStatistics(projectId?: string) {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/queries?limit=1`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatistics(data.data.statistics);
      } else {
        throw new Error(data.message || "Failed to fetch statistics");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch query statistics";
      setError(errorMessage);
      console.error("Error fetching query statistics:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchStatistics();
    }
  }, [projectId, fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refreshStatistics: fetchStatistics,
  };
}

// Hook for searching queries across all projects
export function useQuerySearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchQueries = useCallback(
    async (searchTerm: string, filters?: any) => {
      if (!searchTerm || searchTerm.trim().length < 3) {
        setError("Search term must be at least 3 characters long");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({ q: searchTerm.trim() });

        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.priority) queryParams.append("priority", filters.priority);
        if (filters?.category) queryParams.append("category", filters.category);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_DEV_API_URL
          }/queries/search?${queryParams.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setResults(data.data.queries);
        } else {
          throw new Error(data.message || "Search failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        console.error("Error searching queries:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchQueries,
    clearResults,
  };
}
