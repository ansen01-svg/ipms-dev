import {
  ProgressHistoryResponse,
  ProgressUpdateRequest,
  ProgressUpdateResponse,
} from "@/types/archive-projects.types";

export const updateProjectProgress = async (
  projectId: string,
  progressData: ProgressUpdateRequest
): Promise<ProgressUpdateResponse> => {
  const formData = new FormData();

  formData.append("progress", progressData.progress.toString());
  if (progressData.remarks) {
    formData.append("remarks", progressData.remarks);
  }

  // FIXED: Use "supportingFiles" field name instead of "files"
  if (progressData.files && progressData.files.length > 0) {
    progressData.files.forEach((file) => {
      formData.append("supportingFiles", file);
    });
  }

  // Debug FormData contents (remove in production)
  console.log("FormData contents:");
  formData.forEach((value, key) => {
    if (value instanceof File) {
      console.log(`${key}:`, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(`${key}:`, value);
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/progress`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update progress");
  }

  return response.json();
};

export const getProgressHistory = async (
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<ProgressHistoryResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/progress/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch progress history");
  }

  return response.json();
};
