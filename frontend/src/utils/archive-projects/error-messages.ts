interface ProgressErrorDetails {
  providedValue?: number;
  currentRole?: string;
}

export const getProgressErrorMessage = (
  errorCode: string,
  details?: ProgressErrorDetails
) => {
  const errorMessages: Record<string, string> = {
    INVALID_PROJECT_ID: "Invalid project ID format",
    PROGRESS_REQUIRED: "Progress percentage is required",
    INVALID_PROGRESS_VALUE: "Progress must be a number between 0 and 100",
    UNAUTHORIZED_USER: "Only Junior Engineers (JE) can update project progress",
    PROJECT_NOT_FOUND: "Archive project not found",
    PROGRESS_UPDATES_DISABLED: "Progress updates are disabled for this project",
    BACKWARD_PROGRESS_NOT_ALLOWED:
      "Significant backward progress is not allowed. Maximum 5% decrease per update.",
    UNREALISTIC_PROGRESS_JUMP:
      "Progress increase exceeds reasonable limits. Maximum 50% increase per update.",
    COMPLETION_REQUIRES_DOCUMENTS:
      "Project completion (100%) requires at least one supporting document",
  };

  let message = errorMessages[errorCode] || "An unexpected error occurred";

  // Add specific details if available
  if (details) {
    if (errorCode === "INVALID_PROGRESS_VALUE" && details.providedValue) {
      message += ` (provided: ${details.providedValue})`;
    }
    if (errorCode === "UNAUTHORIZED_USER" && details.currentRole) {
      message += ` (current role: ${details.currentRole})`;
    }
  }

  return message;
};

export const formatProgressError = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
};
