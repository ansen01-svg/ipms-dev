import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import {
  CreateMBData,
  MBPaginationData,
  MeasurementBook,
  UpdateMBData,
} from "@/types/mb.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

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

    // Append form fields to match backend expectations
    formData.append("project", mbData.project);
    formData.append("description", mbData.description);

    if (mbData.remarks) {
      formData.append("remarks", mbData.remarks);
    }

    // Append file with the correct field name expected by backend
    formData.append("mbFile", mbData.mbFile);

    const response = await fetch(`${API_BASE_URL}/mb`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<MeasurementBook>(response);
  }

  /**
   * Get all measurement books across all projects with filters
   */
  async getAllMBs(
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      hasRemarks?: string;
      isApproved?: string;
      projectId?: string;
    } = {}
  ): Promise<MBPaginationData> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.search) searchParams.append("search", params.search);
    if (params.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params.hasRemarks && params.hasRemarks !== "all") {
      searchParams.append("hasRemarks", params.hasRemarks);
    }
    if (params.isApproved && params.isApproved !== "all") {
      searchParams.append("isApproved", params.isApproved);
    }
    if (params.projectId) searchParams.append("projectId", params.projectId);

    const url = `${API_BASE_URL}/mb/all?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<MBPaginationData>(response);
  }

  /**
   * Get measurement books for a specific project
   */
  async getMBsForProject(
    projectId: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      hasRemarks?: string;
      isApproved?: string;
    } = {}
  ): Promise<MBPaginationData> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.search) searchParams.append("search", params.search);
    if (params.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params.hasRemarks && params.hasRemarks !== "all") {
      searchParams.append("hasRemarks", params.hasRemarks);
    }
    if (params.isApproved && params.isApproved !== "all") {
      searchParams.append("isApproved", params.isApproved);
    }

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
   * Get Firebase download URL for file
   */
  getFileDownloadUrl(mb: MeasurementBook): string {
    return mb.uploadedFile.downloadURL;
  }
}

// Export singleton instance
export const mbApiService = new MeasurementBookApiService();
