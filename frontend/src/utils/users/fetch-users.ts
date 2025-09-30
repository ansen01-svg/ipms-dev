import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  roleId: string;
  departmentName: string;
  departmentId: string;
  designation: string;
  officeLocation: string;
  userId: string;
  avatar?: string;
  isFirstLogin: boolean;
  lastPasswordChange: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchUsersFilters {
  page?: number;
  limit?: number;
  designation?: string;
  departmentId?: string;
  departmentName?: string;
  roleId?: string;
  officeLocation?: string;
  isFirstLogin?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FetchUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
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

/**
 * Fetch all users with filters and pagination
 * GET /api/users
 */
export const fetchAllUsers = async (
  filters: FetchUsersFilters = {}
): Promise<FetchUsersResponse> => {
  const params = new URLSearchParams();

  // Add all filter parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/user?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }

  return response.json();
};

/**
 * Fetch single user by ID
 * GET /api/users/:id
 */
export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user");
  }

  const data = await response.json();
  return data.user;
};

/**
 * Get unique values for filters
 */
export const getUserFilterOptions = async (): Promise<{
  designations: string[];
  departments: string[];
  officeLocations: string[];
}> => {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/users/filter-options`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch filter options");
  }

  return response.json();
};

/**
 * Export users to CSV
 */
export const formatUserCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const formatDateForCsv = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const generateUsersCsvContent = (users: User[]): string => {
  const headers = [
    "S.No",
    "Full Name",
    "Username",
    "Email",
    "Phone Number",
    "User ID",
    "Designation",
    "Department",
    "Office Location",
    "First Login",
    "Last Password Change",
    "Created At",
  ];

  const csvRows = [
    headers.join(","),
    ...users.map((user, index) =>
      [
        formatUserCsvValue(index + 1),
        formatUserCsvValue(user.fullName),
        formatUserCsvValue(user.username),
        formatUserCsvValue(user.email),
        formatUserCsvValue(user.phoneNumber),
        formatUserCsvValue(user.userId),
        formatUserCsvValue(user.designation),
        formatUserCsvValue(user.departmentName),
        formatUserCsvValue(user.officeLocation),
        formatUserCsvValue(user.isFirstLogin ? "Yes" : "No"),
        formatUserCsvValue(formatDateForCsv(user.lastPasswordChange)),
        formatUserCsvValue(formatDateForCsv(user.createdAt)),
      ].join(",")
    ),
  ];

  return csvRows.join("\n");
};

export const downloadUsersCsv = (
  csvContent: string,
  filename: string
): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
