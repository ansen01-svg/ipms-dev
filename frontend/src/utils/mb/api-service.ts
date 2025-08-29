import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import {
  BulkUpdateData,
  CreateMBData,
  MBPaginationData,
  MBStatistics,
  MeasurementBook,
  UpdateMBData,
} from "@/types/mb.types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

class MeasurementBookApiService {
  private getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {};

    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Operation failed");
    }

    return data.data;
  }

  /**
   * Create a new measurement book
   */
  async createMB(mbData: CreateMBData): Promise<MeasurementBook> {
    const formData = new FormData();

    // Append form fields
    formData.append("projectId", mbData.projectId);
    formData.append("title", mbData.title);
    formData.append("description", mbData.description);
    formData.append("mbNumber", mbData.mbNumber);
    formData.append("measurementDate", mbData.measurementDate);

    if (mbData.workOrderNumber) {
      formData.append("workOrderNumber", mbData.workOrderNumber);
    }
    if (mbData.contractorName) {
      formData.append("contractorName", mbData.contractorName);
    }
    if (mbData.remarks) {
      formData.append("remarks", mbData.remarks);
    }

    // Append file
    formData.append("mbFile", mbData.mbFile);

    const response = await fetch(`${API_BASE_URL}/mb`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<MeasurementBook>(response);
  }

  /**
   * Get all measurement books for a project
   */
  async getMBsForProject(
    projectId: string,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
    } = {}
  ): Promise<MBPaginationData> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.search) searchParams.append("search", params.search);

    const url = `${API_BASE_URL}/mb/project/${projectId}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<MBPaginationData>(response);
  }

  /**
   * Get a single measurement book by ID
   */
  async getMBById(mbId: string): Promise<MeasurementBook> {
    const response = await fetch(`${API_BASE_URL}/mb/${mbId}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<MeasurementBook>(response);
  }

  /**
   * Update a measurement book
   */
  async updateMB(
    mbId: string,
    updateData: UpdateMBData
  ): Promise<MeasurementBook> {
    const response = await fetch(`${API_BASE_URL}/mb/${mbId}`, {
      method: "PUT",
      headers: {
        ...this.getHeaders(true),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    return this.handleResponse<MeasurementBook>(response);
  }

  /**
   * Delete a measurement book
   */
  async deleteMB(mbId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mb/${mbId}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    await this.handleResponse(response);
  }

  /**
   * Get MB statistics for a project
   */
  async getMBStatistics(projectId: string): Promise<MBStatistics> {
    const response = await fetch(
      `${API_BASE_URL}/mb/project/${projectId}/statistics`,
      {
        method: "GET",
        headers: this.getHeaders(true),
      }
    );

    return this.handleResponse<MBStatistics>(response);
  }

  /**
   * Bulk update MB status
   */
  async bulkUpdateStatus(
    bulkData: BulkUpdateData
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/mb/bulk/status`, {
      method: "PUT",
      headers: {
        ...this.getHeaders(true),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bulkData),
    });

    return this.handleResponse<{ matchedCount: number; modifiedCount: number }>(
      response
    );
  }

  /**
   * Export MB data as CSV
   */
  async exportMBData(
    projectId: string,
    params: {
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<void> {
    const searchParams = new URLSearchParams();

    if (params.status) searchParams.append("status", params.status);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const url = `${API_BASE_URL}/mb/project/${projectId}/export?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    // Handle file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `measurement-books-${projectId}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Get file URL for display/download
   */
  getFileUrl(fileName: string): string {
    return `${API_BASE_URL}/mb-files/${fileName}`;
  }
}

// Export singleton instance
export const mbApiService = new MeasurementBookApiService();
