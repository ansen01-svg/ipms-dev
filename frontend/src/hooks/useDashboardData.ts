import { getAuthToken } from "@/lib/rbac-config/auth-local";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Types for hook return values
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
}

// API service functions
const dashboardAPI = {
  getKPIs: async (params?: Record<string, string | number>) => {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/dashboard/kpis?${new URLSearchParams(
        params as Record<string, string>
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch KPIs");
    return response.json();
  },

  getRecentActivity: async (params?: Record<string, string | number>) => {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/dashboard/recent-activity?${new URLSearchParams(
        params as Record<string, string>
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch recent activity");
    return response.json();
  },

  getActionItems: async (params?: Record<string, string | number>) => {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/dashboard/action-items?${new URLSearchParams(
        params as Record<string, string>
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch action items");
    return response.json();
  },

  // NEW: District Analytics endpoint
  getDistrictAnalytics: async (params?: Record<string, string | number>) => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/dashboard/district-analytics?${queryParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch district analytics");
    return response.json();
  },

  // NEW: Workload Distribution endpoint
  getWorkloadDistribution: async (params?: Record<string, string | number>) => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/dashboard/workload-distribution?${queryParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch workload distribution");
    return response.json();
  },
};

// Helper function to create stable object key
const getStableKey = (obj: unknown): string => {
  if (obj === null || obj === undefined) return "null";
  if (typeof obj !== "object") return String(obj);
  return JSON.stringify(
    obj,
    Object.keys(obj as Record<string, unknown>).sort()
  );
};

// Generic hook for data fetching with caching
const useFetch = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    staleTime?: number;
  } = {}
): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const { enabled = true, staleTime = 0 } = options;
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);
  const keyRef = useRef<string>(key);

  // Clear cache if key changes
  if (keyRef.current !== key) {
    cacheRef.current = null;
    keyRef.current = key;
  }

  const fetchData = useCallback(async () => {
    // Check if we have fresh cached data
    if (
      cacheRef.current &&
      staleTime > 0 &&
      Date.now() - cacheRef.current.timestamp < staleTime
    ) {
      setState({
        data: cacheRef.current.data,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchFn();

      // Update cache
      cacheRef.current = { data, timestamp: Date.now() };

      setState({
        data,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error("Unknown error");
      setState({
        data: null,
        isLoading: false,
        error: errorObj,
        isSuccess: false,
        isError: true,
      });
    }
  }, [fetchFn, staleTime]);

  // Initial fetch and key change handling
  useEffect(() => {
    if (!enabled) {
      setState({
        data: null,
        isLoading: false,
        error: null,
        isSuccess: false,
        isError: false,
      });
      return;
    }

    fetchData();
  }, [enabled, key, fetchData]);

  return state;
};

// Main dashboard KPIs hook
export const useDashboardKPIs = (params?: Record<string, string | number>) => {
  // Memoize the params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => {
    if (!params) return undefined;
    // Create a stable reference for the params object
    return params;
  }, [params]);

  const key = `dashboard-kpis-${getStableKey(memoizedParams)}`;

  const fetchFn = useCallback(() => {
    return dashboardAPI.getKPIs(memoizedParams);
  }, [memoizedParams]);

  return useFetch(key, fetchFn, {
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Recent activity hook
export const useRecentActivity = (limit = 10) => {
  const key = `recent-activity-${limit}`;

  const fetchFn = useCallback(() => {
    return dashboardAPI.getRecentActivity({ limit });
  }, [limit]);

  return useFetch(key, fetchFn, {
    staleTime: 10 * 60 * 1000, // 10 minute
  });
};

// Action items hook
export const useActionItems = (limit = 20) => {
  const key = `action-items-${limit}`;

  const fetchFn = useCallback(() => {
    return dashboardAPI.getActionItems({ limit });
  }, [limit]);

  return useFetch(key, fetchFn, {
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// District Analytics hook
export const useDistrictAnalytics = (params?: {
  status?: string;
  fund?: string;
  timeRange?: string;
  contractorName?: string;
}) => {
  const key = `district-analytics-${getStableKey(params)}`;

  const fetchFn = useCallback(() => {
    return dashboardAPI.getDistrictAnalytics(params);
  }, [params]);

  return useFetch(key, fetchFn, {
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Workload Distribution hook
export const useWorkloadDistribution = (params?: {
  groupBy?: "user" | "district" | "status" | "fund" | "contractor";
  limit?: number;
}) => {
  const key = `workload-distribution-${getStableKey(params)}`;

  const fetchFn = useCallback(() => {
    return dashboardAPI.getWorkloadDistribution(params);
  }, [params]);

  return useFetch(key, fetchFn, {
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
