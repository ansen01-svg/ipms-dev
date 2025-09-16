import { ApiResponse, UpdateProfileData, User } from "../../types/user.types";
import { getAuthToken } from "../rbac-config.ts/auth-local";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getAuthToken();

    // Adjust based on your auth implementation

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>("/user/profile");
  }

  async updateUserProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload avatar");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
