import { clearAuthData, getAuthToken } from "@/lib/rbac-config/auth-local";
import { CreateProjectFormValues } from "@/schema/create-project/create-projects.schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Types for update project API
export interface UpdateProjectResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    projectId: string;
    projectName: string;
    workOrderNumber: string;
    fund: string;
    subFund: string;
    contractorName: string;
    contractorPhoneNumber: string;
    status: string;
    filesUploaded: {
      totalCount: number;
      newFilesAdded: number;
      totalSize: number;
      types: Record<string, number>;
    };
    lastModifiedAt: string;
  };
  changes: {
    fieldsUpdated: string[];
    filesAdded: number;
    totalFiles: number;
    subProjectsCount: number;
    updatedBy: {
      userId: string;
      name: string;
      role: string;
    };
  };
  metadata: {
    originalCreatedBy: {
      userId: string;
      name: string;
      role: string;
    };
    lastModifiedBy: {
      userId: string;
      name: string;
      role: string;
      modifiedAt: string;
    };
    statusHistory: number;
    firebaseStorage: {
      bucket: string;
      folder: string;
      newFilesUploaded: number;
    };
  };
}

export interface CanEditResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    canEdit: boolean;
    isOwner: boolean;
    currentStatus: string;
    userRole: string;
    restrictions: {
      statusRestricted: boolean;
      roleRestricted: boolean;
    };
  };
}

export interface EditHistoryResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
    editHistory: Array<{
      action: string;
      performedBy: {
        userId: string;
        name: string;
        role: string;
      };
      timestamp: string;
      details: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEntries: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Helper function to handle API errors
const handleApiError = (response: Response, errorText: string): never => {
  if (response.status === 401) {
    console.error("Authentication failed - clearing stored data");
    clearAuthData();
    window.location.replace("/login");
    throw new Error("Authentication expired");
  }
  throw new Error(`HTTP ${response.status}: ${errorText}`);
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Update project function
export const updateProject = async (
  projectId: string,
  values: CreateProjectFormValues,
  uploadedFiles: File[]
): Promise<UpdateProjectResponse> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Create FormData object for multipart upload
    const formData = new FormData();

    // Append basic form fields - only non-empty values
    const fieldsToUpdate = [
      "dateOfIssueOfWorkOrder",
      "projectName",
      "description",
      "hasSubProjects",
      "fund",
      "subFund",
      "sanctioningDepartment",
      "budgetHead",
      "beneficiary",
      "workOrderNumber",
      "contractorName",
      "contractorAddress",
      "contractorPhoneNumber",
      "estimatedCost",
      "typeOfWork",
      "projectStartDate",
      "projectEndDate",
      "extensionPeriodForCompletion",
      "district",
      "block",
      "gramPanchayat",
    ];

    fieldsToUpdate.forEach((field) => {
      const value = values[field as keyof CreateProjectFormValues];
      if (value !== undefined && value !== null) {
        if (field === "hasSubProjects") {
          formData.append(field, value.toString());
        } else if (field === "estimatedCost") {
          formData.append(field, value.toString());
        } else if (typeof value === "string" && value.trim() !== "") {
          formData.append(field, value);
        } else if (typeof value !== "string") {
          formData.append(field, value.toString());
        }
      }
    });

    // Handle geoLocation object
    if (values.geoLocation?.latitude && values.geoLocation?.longitude) {
      const geoLocationData = {
        latitude: Number(values.geoLocation.latitude),
        longitude: Number(values.geoLocation.longitude),
      };
      formData.append("geoLocation", JSON.stringify(geoLocationData));
    }

    // Handle subProjects array
    if (values.subProjects && values.subProjects.length > 0) {
      formData.append("subProjects", JSON.stringify(values.subProjects));
    }

    // Append new files
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(`Appending ${uploadedFiles.length} files to FormData`);
      uploadedFiles.forEach((file) => {
        formData.append("projectFiles", file);
      });
    }

    // Log FormData contents for debugging
    console.log("Update FormData contents:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    console.log(`Updating project ${projectId}...`);

    const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error occurred" }));

      const errorMessage =
        errorData.message ||
        (response.status === 400
          ? "Invalid project data provided"
          : response.status === 401
          ? "Authentication required"
          : response.status === 403
          ? "Permission denied"
          : response.status === 404
          ? "Project not found"
          : response.status === 409
          ? "Duplicate project information"
          : response.status === 500
          ? "Server error occurred"
          : "Failed to update project");

      throw new Error(errorMessage);
    }

    const result: UpdateProjectResponse = await response.json();
    console.log("Project update successful:", result);

    if (!result.success) {
      throw new Error(result.message || "API returned success: false");
    }

    return result;
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

// Check if user can edit project
export const checkCanEditProject = async (
  projectId: string
): Promise<boolean> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/can-edit`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      // If we get a 404 or 403, the user likely can't edit
      if (response.status === 404 || response.status === 403) {
        return false;
      }
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const result: CanEditResponse = await response.json();

    if (!result.success) {
      return false;
    }

    return result.data.canEdit;
  } catch (error) {
    console.error(
      `Error checking edit permission for project ${projectId}:`,
      error
    );
    return false;
  }
};

// Get detailed edit permission info
export const getEditPermissionDetails = async (
  projectId: string
): Promise<CanEditResponse["data"] | null> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/can-edit`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: CanEditResponse = await response.json();

    if (!result.success) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(
      `Error getting edit permission details for project ${projectId}:`,
      error
    );
    return null;
  }
};

// Get project edit history
export const getProjectEditHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<EditHistoryResponse> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/edit-history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      handleApiError(response, errorText);
    }

    const result: EditHistoryResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch edit history");
    }

    return result;
  } catch (error) {
    console.error(
      `Error fetching edit history for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Utility function to format project updates for display
export const formatProjectUpdate = (updateData: UpdateProjectResponse) => {
  const { data, changes } = updateData;

  return {
    id: data.id,
    projectId: data.projectId,
    name: data.projectName,
    workOrder: data.workOrderNumber,
    contractor: data.contractorName,
    status: data.status,
    lastModified: new Date(data.lastModifiedAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    changesCount: changes.fieldsUpdated.length,
    newFilesCount: changes.filesAdded,
    totalFilesCount: changes.totalFiles,
    updatedBy: changes.updatedBy.name,
    updatedByRole: changes.updatedBy.role,
  };
};

// Utility function to validate project data before update
export const validateProjectForUpdate = (
  values: CreateProjectFormValues
): string[] => {
  const errors: string[] = [];

  // Basic validation
  if (!values.projectName?.trim()) {
    errors.push("Project name is required");
  }

  if (!values.workOrderNumber?.trim()) {
    errors.push("Work order number is required");
  }

  if (!values.contractorName?.trim()) {
    errors.push("Contractor name is required");
  }

  if (!values.contractorPhoneNumber?.trim()) {
    errors.push("Contractor phone number is required");
  }

  if (!values.estimatedCost || values.estimatedCost <= 0) {
    errors.push("Valid estimated cost is required");
  }

  // Date validation
  if (values.projectStartDate && values.projectEndDate) {
    const startDate = new Date(values.projectStartDate);
    const endDate = new Date(values.projectEndDate);

    if (endDate <= startDate) {
      errors.push("Project end date must be after start date");
    }
  }

  // Sub-projects validation
  if (values.hasSubProjects) {
    if (!values.subProjects || values.subProjects.length === 0) {
      errors.push(
        "At least one sub-project is required when sub-projects are enabled"
      );
    } else {
      values.subProjects.forEach((subProject, index) => {
        if (!subProject.projectName?.trim()) {
          errors.push(`Sub-project ${index + 1}: Project name is required`);
        }
        if (!subProject.estimatedAmount || subProject.estimatedAmount <= 0) {
          errors.push(
            `Sub-project ${index + 1}: Valid estimated amount is required`
          );
        }
      });
    }
  }

  return errors;
};

// Export all functions
export { getAuthHeaders, handleApiError };
