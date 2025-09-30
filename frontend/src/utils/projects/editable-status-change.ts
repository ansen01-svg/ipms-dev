import { getAuthToken } from "@/lib/rbac-config/auth-local";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export interface UpdateEditableStatusRequest {
  isEditable: boolean;
  reason: string;
}

export interface UpdateEditableStatusResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    projectName: string;
    isProjectEditable: boolean;
    updatedBy: {
      name: string;
      role: string;
    };
    updatedAt: string;
    reason: string | null;
  };
}

export interface EditableStatusHistoryEntry {
  previousStatus: boolean;
  newStatus: boolean;
  changedBy: {
    userId: string;
    name: string;
    role: string;
  };
  reason: string;
  changedAt: string;
  _id: string;
}

export interface GetEditableStatusHistoryResponse {
  success: boolean;
  data: {
    projectId: string;
    projectName: string;
    currentStatus: boolean;
    history: EditableStatusHistoryEntry[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEntries: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

/**
 * Update the editable status of a project
 * @param projectId - The MongoDB _id of the project
 * @param isEditable - The new editable status
 * @param reason - The reason for changing the status
 * @returns Promise with the updated project data
 */
export async function updateProjectEditableStatus(
  projectId: string,
  isEditable: boolean,
  reason: string
): Promise<UpdateEditableStatusResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/editable-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isEditable,
          reason,
        }),
      }
    );

    // Parse response body
    const data = await response.json();

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage =
        data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update project editable status");
  }
}

/**
 * Get the editable status history of a project
 * @param projectId - The MongoDB _id of the project
 * @param page - The page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with the project's editable status history
 */
export async function getProjectEditableStatusHistory(
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetEditableStatusHistoryResponse> {
  try {
    const url = new URL(
      `${API_BASE_URL}/projects/${projectId}/editable-status/history`
    );
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    });

    // Parse response body
    const data = await response.json();

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage =
        data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch editable status history");
  }
}

/**
 * Utility function to get user-friendly status text
 */
export function getEditableStatusText(isEditable: boolean): string {
  return isEditable ? "Editable" : "Locked";
}

/**
 * Utility function to get status color classes
 */
export function getEditableStatusClasses(isEditable: boolean): string {
  return isEditable
    ? "text-green-600 bg-green-50 border-green-200"
    : "text-red-600 bg-red-50 border-red-200";
}
