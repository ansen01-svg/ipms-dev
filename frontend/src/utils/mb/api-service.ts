import { getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  DbMeasurementBook,
  MBFilters,
  MBListResponse,
  MBSingleResponse,
  UpdateMBRequest,
} from "@/types/mb.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

class MBApiService {
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

    return data.data || data;
  }

  /**
   * Get all measurement books with filters
   */
  async getAllMBs(filters: MBFilters = {}): Promise<MBListResponse["data"]> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder)
      params.append("sortOrder", filters.sortOrder.toString());
    if (filters.projectType) params.append("projectType", filters.projectType);
    if (filters.mbId) params.append("mbId", filters.mbId);
    if (filters.mbNo) params.append("mbNo", filters.mbNo);
    if (filters.contractor) params.append("contractor", filters.contractor);
    if (filters.location) params.append("location", filters.location);
    if (filters.search) params.append("search", filters.search);
    if (filters.createdBy) params.append("createdBy", filters.createdBy);

    const response = await fetch(
      `${API_BASE_URL}/mb/all?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<MBListResponse["data"]>(response);
  }

  /**
   * Get measurement books for a specific project
   */
  async getMBsByProject(
    projectId: string,
    filters: MBFilters = {}
  ): Promise<MBListResponse["data"]> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder)
      params.append("sortOrder", filters.sortOrder.toString());
    if (filters.mbId) params.append("mbId", filters.mbId);
    if (filters.mbNo) params.append("mbNo", filters.mbNo);
    if (filters.contractor) params.append("contractor", filters.contractor);

    const response = await fetch(
      `${API_BASE_URL}/mb/project/${projectId}?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<MBListResponse["data"]>(response);
  }

  /**
   * Get a single measurement book by ID
   */
  async getMBById(id: string): Promise<DbMeasurementBook> {
    const response = await fetch(`${API_BASE_URL}/mb/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = await this.handleResponse<MBSingleResponse["data"]>(response);
    return data.measurementBook;
  }

  /**
   * Update measurement book basic information
   */
  async updateMB(
    id: string,
    updateData: UpdateMBRequest
  ): Promise<DbMeasurementBook> {
    const response = await fetch(`${API_BASE_URL}/mb/${id}`, {
      method: "PATCH",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await this.handleResponse<{
      measurementBook: DbMeasurementBook;
    }>(response);
    return data.measurementBook;
  }

  /**
   * Delete a measurement book
   */
  async deleteMB(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mb/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    await this.handleResponse(response);
  }

  /**
   * Get Firebase download URL for a measurement file
   */
  getFileDownloadUrl(measurement: {
    uploadedFile: { downloadURL: string };
  }): string {
    return measurement.uploadedFile.downloadURL;
  }
}

export const mbApiService = new MBApiService();
