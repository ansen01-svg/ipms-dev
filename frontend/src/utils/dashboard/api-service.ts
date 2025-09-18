import { useAuth } from "@/contexts/auth-context";
import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle authentication errors
  if (response.status === 401) {
    console.error("Authentication failed - clearing stored data");
    clearAuthData();
    window.location.replace("/login");
    throw new Error("Authentication expired");
  }

  return response;
};

// Helper function to build query string
const buildQueryString = (params?: Record<string, string | number>) => {
  if (!params) return "";
  return `?${new URLSearchParams(params as Record<string, string>)}`;
};

/**
 * Get dashboard KPIs
 * GET /api/dashboard/kpis
 */
export const getDashboardKPIs = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/kpis${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch KPIs");
  }

  return response.json();
};

/**
 * Get recent activity
 * GET /api/dashboard/recent-activity
 */
export const getRecentActivity = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/recent-activity${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch recent activity");
  }

  return response.json();
};

/**
 * Get action items
 * GET /api/dashboard/action-items
 */
export const getActionItems = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/action-items${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch action items");
  }

  return response.json();
};

/**
 * Get query KPIs
 * GET /api/dashboard/query-kpis
 */
export const getQueryKPIs = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/query-kpis${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch query KPIs");
  }

  return response.json();
};

/**
 * Get performance monitoring data
 * GET /api/dashboard/performance-monitoring
 */
export const getPerformanceMonitoring = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/performance-monitoring${buildQueryString(
      params
    )}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch performance data");
  }

  return response.json();
};

/**
 * Get project analytics
 * GET /api/dashboard/project-analytics
 */
export const getProjectAnalytics = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/project-analytics${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch project analytics");
  }

  return response.json();
};

/**
 * Get financial health data
 * GET /api/dashboard/financial-health
 */
export const getFinancialHealth = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/financial-health${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch financial health");
  }

  return response.json();
};

/**
 * Get archive comparison data
 * GET /api/dashboard/archive-comparison
 */
export const getArchiveComparison = async (
  params?: Record<string, string | number>
) => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/archive-comparison${buildQueryString(params)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch archive comparison");
  }

  return response.json();
};

/**
 * Refresh dashboard cache
 * POST /api/dashboard/refresh
 */
export const refreshDashboardCache = async (
  sections?: string[]
): Promise<{
  success: boolean;
  message: string;
  refreshedSections: string[];
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/dashboard/refresh`,
    {
      method: "POST",
      body: JSON.stringify({ sections }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to refresh dashboard cache");
  }

  return response.json();
};

// Validation helpers
export const validateDashboardParams = (
  params?: Record<string, string | number>
) => {
  const errors: Record<string, string> = {};

  if (!params) return errors;

  // Validate date ranges if present
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);

    if (start > end) {
      errors.dateRange = "Start date cannot be after end date";
    }

    if (start > new Date()) {
      errors.startDate = "Start date cannot be in the future";
    }
  }

  // Validate limit parameters
  if (params.limit) {
    const limit = Number(params.limit);
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      errors.limit = "Limit must be between 1 and 1000";
    }
  }

  // Validate page parameters
  if (params.page) {
    const page = Number(params.page);
    if (isNaN(page) || page < 1) {
      errors.page = "Page must be a positive number";
    }
  }

  return errors;
};

// Helper functions for data formatting
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getActivityTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    project_created: "green",
    project_updated: "blue",
    progress_updated: "orange",
    financial_updated: "purple",
    milestone_reached: "gold",
    issue_reported: "red",
    user_activity: "cyan",
  };

  return colorMap[type] || "gray";
};

export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    high: "red",
    medium: "orange",
    low: "green",
    urgent: "purple",
  };

  return colorMap[priority.toLowerCase()] || "gray";
};

// React Query Hooks

// Main dashboard KPIs hook
export const useDashboardKPIs = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["dashboard-kpis", params],
    queryFn: () => getDashboardKPIs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Recent activity hook
export const useRecentActivity = (limit = 10) => {
  return useQuery({
    queryKey: ["recent-activity", limit],
    queryFn: () => getRecentActivity({ limit }),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
};

// Action items hook
export const useActionItems = (limit = 20) => {
  return useQuery({
    queryKey: ["action-items", limit],
    queryFn: () => getActionItems({ limit }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Query KPIs hook
export const useQueryKPIs = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["query-kpis", params],
    queryFn: () => getQueryKPIs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
};

// Performance monitoring hook
export const usePerformanceMonitoring = (refresh = false) => {
  return useQuery({
    queryKey: ["performance-monitoring", refresh],
    queryFn: () => getPerformanceMonitoring({ refresh: Number(refresh) }),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 3 * 60 * 1000,
  });
};

// Project analytics hook
export const useProjectAnalytics = (
  params?: Record<string, string | number>
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["project-analytics", user?.role, params],
    queryFn: () => getProjectAnalytics(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!user && ["AEE", "CE", "MD"].includes(user.role),
  });
};

// Financial health hook
export const useFinancialHealth = (
  params?: Record<string, string | number>
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["financial-health", user?.role, params],
    queryFn: () => getFinancialHealth(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!user && ["AEE", "CE", "MD"].includes(user.role),
  });
};

// Archive comparison hook
export const useArchiveComparison = () => {
  return useQuery({
    queryKey: ["archive-comparison"],
    queryFn: () => getArchiveComparison(),
    staleTime: 30 * 60 * 1000, // 30 minutes (archive data changes slowly)
  });
};

// Custom hook for refreshing all dashboard data
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  const refreshAll = async () => {
    try {
      // Refresh server-side cache first
      await refreshDashboardCache();

      // Then invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["action-items"] });
      queryClient.invalidateQueries({ queryKey: ["query-kpis"] });
      queryClient.invalidateQueries({ queryKey: ["performance-monitoring"] });
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
      throw error;
    }
  };

  const refreshKPIs = async () => {
    try {
      // Refresh specific sections
      await refreshDashboardCache([
        "kpis",
        "project-analytics",
        "financial-health",
      ]);

      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["financial-health"] });
    } catch (error) {
      console.error("Failed to refresh KPIs:", error);
      throw error;
    }
  };

  const refreshSection = async (section: string) => {
    try {
      await refreshDashboardCache([section]);
      queryClient.invalidateQueries({ queryKey: [section] });
    } catch (error) {
      console.error(`Failed to refresh ${section}:`, error);
      throw error;
    }
  };

  return { refreshAll, refreshKPIs, refreshSection };
};
