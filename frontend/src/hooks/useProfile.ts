import { useState, useEffect } from "react";
import { User, UpdateProfileData, ApiResponse } from "../types/user.types";
import { apiService } from "../lib/profile/api";
import { toast } from "sonner";

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserProfile();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      // Filter out empty strings and undefined values
      const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key as keyof UpdateProfileData] = value;
        }
        return acc;
      }, {} as UpdateProfileData);

      if (Object.keys(filteredData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      const response = await apiService.updateUserProfile(filteredData);

      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Profile updated successfully");
        return { success: true };
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    updating,
    error,
    fetchProfile,
    updateProfile,
  };
};
