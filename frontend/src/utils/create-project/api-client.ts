// utils/api-client.ts
import {
  CreateProjectFormValues,
  ApiResponse,
  CreateProjectResponse,
} from "@/types/create-project";

export class ProjectApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = "http://localhost:3000/api/v1") {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP Error: ${response.status}`,
          errors: data.errors || [],
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("API Request failed:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Network error occurred",
        statusCode: 0,
      };
    }
  }

  async createProject(
    projectData: CreateProjectFormValues
  ): Promise<ApiResponse<CreateProjectResponse>> {
    // Transform form data to API format
    const apiPayload = {
      ...projectData,
      estimatedCost: parseFloat(projectData.estimatedCost),
      subProjects:
        projectData.subProjects?.map((subProject) => ({
          ...subProject,
          estimatedAmount: parseFloat(subProject.estimatedAmount),
        })) || [],
    };

    return this.makeRequest<CreateProjectResponse>("/projects/create", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });
  }

  async uploadFile(
    file: File,
    projectId?: string
  ): Promise<ApiResponse<{ fileId: string; url: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    if (projectId) {
      formData.append("projectId", projectId);
    }

    return this.makeRequest("/files/upload", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async validateProject(
    projectData: Partial<CreateProjectFormValues>
  ): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
    return this.makeRequest("/projects/validate", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async saveDraft(
    projectData: Partial<CreateProjectFormValues>
  ): Promise<ApiResponse<{ draftId: string }>> {
    return this.makeRequest("/projects/draft", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async getDraft(
    draftId: string
  ): Promise<ApiResponse<CreateProjectFormValues>> {
    return this.makeRequest(`/projects/draft/${draftId}`, {
      method: "GET",
    });
  }

  async getProjects(): Promise<ApiResponse<CreateProjectResponse[]>> {
    return this.makeRequest("/projects", {
      method: "GET",
    });
  }

  async getProject(
    projectId: string
  ): Promise<ApiResponse<CreateProjectResponse>> {
    return this.makeRequest(`/projects/${projectId}`, {
      method: "GET",
    });
  }

  async updateProject(
    projectId: string,
    projectData: Partial<CreateProjectFormValues>
  ): Promise<ApiResponse<CreateProjectResponse>> {
    return this.makeRequest(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/projects/${projectId}`, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const projectApiClient = new ProjectApiClient();
