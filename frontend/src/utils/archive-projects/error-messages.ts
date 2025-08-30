// Enhanced error handling for both physical and financial progress updates

interface ProgressErrorDetails {
  providedValue?: number;
  currentRole?: string;
  workValue?: number;
  currentAmount?: number;
  maxAllowed?: number;
}

// Physical Progress Error Messages
export const getProgressErrorMessage = (
  errorCode: string,
  details?: ProgressErrorDetails
) => {
  const errorMessages: Record<string, string> = {
    // General errors
    INVALID_PROJECT_ID: "Invalid project ID format",
    PROJECT_NOT_FOUND: "Archive project not found",
    UNAUTHORIZED_USER: "Only Junior Engineers (JE) can update project progress",

    // Physical progress specific errors
    PROGRESS_REQUIRED: "Progress percentage is required",
    INVALID_PROGRESS_VALUE: "Progress must be a number between 0 and 100",
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

// Financial Progress Error Messages
export const getFinancialProgressErrorMessage = (
  errorCode: string,
  details?: ProgressErrorDetails
) => {
  const errorMessages: Record<string, string> = {
    // General errors
    INVALID_PROJECT_ID: "Invalid project ID format",
    PROJECT_NOT_FOUND: "Archive project not found",
    UNAUTHORIZED_USER:
      "Only Junior Engineers (JE) can update financial progress",

    // Financial progress specific errors
    BILL_AMOUNT_REQUIRED: "New bill amount is required",
    INVALID_BILL_AMOUNT: "Bill amount must be a non-negative number",
    FINANCIAL_PROGRESS_UPDATES_DISABLED:
      "Financial progress updates are disabled for this project",
    BILL_AMOUNT_EXCEEDS_WORK_VALUE:
      "Bill amount cannot exceed the total work value",
    BACKWARD_FINANCIAL_PROGRESS_NOT_ALLOWED:
      "Significant backward financial progress is not allowed. Maximum 5% of work value decrease per update.",
    UNREALISTIC_FINANCIAL_PROGRESS_JUMP:
      "Financial progress increase exceeds reasonable limits. Maximum 50% of work value per update.",
    FINANCIAL_COMPLETION_REQUIRES_DOCUMENTS:
      "Financial completion (100% progress) requires at least one supporting document",
    FINAL_BILL_DETAILS_REQUIRED:
      "Final bill details are required when completing financial progress",
  };

  let message =
    errorMessages[errorCode] ||
    "An unexpected financial progress error occurred";

  // Add specific details if available
  if (details) {
    if (errorCode === "INVALID_BILL_AMOUNT" && details.providedValue) {
      message += ` (provided: ${details.providedValue})`;
    }
    if (
      errorCode === "BILL_AMOUNT_EXCEEDS_WORK_VALUE" &&
      details.workValue &&
      details.providedValue
    ) {
      message += ` (work value: ${details.workValue}, attempted: ${details.providedValue})`;
    }
    if (errorCode === "UNAUTHORIZED_USER" && details.currentRole) {
      message += ` (current role: ${details.currentRole})`;
    }
  }

  return message;
};

// Combined Progress Error Messages
export const getCombinedProgressErrorMessage = (errorCode: string) => {
  const errorMessages: Record<string, string> = {
    // General errors
    INVALID_PROJECT_ID: "Invalid project ID format",
    PROJECT_NOT_FOUND: "Archive project not found",
    UNAUTHORIZED_USER: "Only Junior Engineers (JE) can update progress",

    // Combined progress specific errors
    NO_PROGRESS_PROVIDED:
      "At least one progress update (physical or financial) must be provided",
    INVALID_PROGRESS_VALUE:
      "Physical progress must be a number between 0 and 100",
    INVALID_BILL_AMOUNT: "Bill amount must be a non-negative number",
    BILL_AMOUNT_EXCEEDS_WORK_VALUE:
      "Bill amount cannot exceed the total work value",
    BACKWARD_PROGRESS_NOT_ALLOWED:
      "Significant backward progress is not allowed",
    UNREALISTIC_PROGRESS_JUMP: "Progress increase exceeds reasonable limits",
    COMPLETION_REQUIRES_DOCUMENTS:
      "Completion (100% progress) requires at least one supporting document",
  };

  return (
    errorMessages[errorCode] || "An unexpected combined progress error occurred"
  );
};

// Generic error formatter for API responses
export const formatProgressError = (error: unknown) => {
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    // Try to extract specific error codes from the message
    const message = error.message;

    // Check for common backend error patterns
    if (message.includes("INVALID_PROJECT_ID")) {
      return getProgressErrorMessage("INVALID_PROJECT_ID");
    }
    if (message.includes("UNAUTHORIZED")) {
      return getProgressErrorMessage("UNAUTHORIZED_USER");
    }
    if (message.includes("PROJECT_NOT_FOUND")) {
      return getProgressErrorMessage("PROJECT_NOT_FOUND");
    }
    if (message.includes("PROGRESS_REQUIRED")) {
      return getProgressErrorMessage("PROGRESS_REQUIRED");
    }
    if (message.includes("INVALID_PROGRESS_VALUE")) {
      return getProgressErrorMessage("INVALID_PROGRESS_VALUE");
    }
    if (message.includes("BACKWARD_PROGRESS_NOT_ALLOWED")) {
      return getProgressErrorMessage("BACKWARD_PROGRESS_NOT_ALLOWED");
    }
    if (message.includes("UNREALISTIC_PROGRESS_JUMP")) {
      return getProgressErrorMessage("UNREALISTIC_PROGRESS_JUMP");
    }
    if (message.includes("COMPLETION_REQUIRES_DOCUMENTS")) {
      return getProgressErrorMessage("COMPLETION_REQUIRES_DOCUMENTS");
    }

    return message;
  }

  // Handle API error responses
  if (typeof error === "object" && error !== null) {
    const apiError = error as Record<string, unknown>;

    // Check for structured error response
    if (apiError.message) {
      return apiError.message;
    }

    // Check for validation errors array
    if (
      apiError.errors &&
      Array.isArray(apiError.errors) &&
      apiError.errors.length > 0
    ) {
      return apiError.errors
        .map((err: { message: string }) => err.message)
        .join(", ");
    }

    // Check for details
    if (
      apiError.details &&
      typeof apiError.details === "object" &&
      "message" in apiError.details
    ) {
      return (apiError.details as { message: string }).message;
    }
  }

  return "An unexpected error occurred";
};

// Financial progress specific error formatter
export const formatFinancialProgressError = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message;

    // Check for financial-specific error patterns
    if (message.includes("BILL_AMOUNT_REQUIRED")) {
      return getFinancialProgressErrorMessage("BILL_AMOUNT_REQUIRED");
    }
    if (message.includes("INVALID_BILL_AMOUNT")) {
      return getFinancialProgressErrorMessage("INVALID_BILL_AMOUNT");
    }
    if (message.includes("BILL_AMOUNT_EXCEEDS_WORK_VALUE")) {
      return getFinancialProgressErrorMessage("BILL_AMOUNT_EXCEEDS_WORK_VALUE");
    }
    if (message.includes("BACKWARD_FINANCIAL_PROGRESS_NOT_ALLOWED")) {
      return getFinancialProgressErrorMessage(
        "BACKWARD_FINANCIAL_PROGRESS_NOT_ALLOWED"
      );
    }
    if (message.includes("UNREALISTIC_FINANCIAL_PROGRESS_JUMP")) {
      return getFinancialProgressErrorMessage(
        "UNREALISTIC_FINANCIAL_PROGRESS_JUMP"
      );
    }
    if (message.includes("FINANCIAL_COMPLETION_REQUIRES_DOCUMENTS")) {
      return getFinancialProgressErrorMessage(
        "FINANCIAL_COMPLETION_REQUIRES_DOCUMENTS"
      );
    }
    if (message.includes("FINAL_BILL_DETAILS_REQUIRED")) {
      return getFinancialProgressErrorMessage("FINAL_BILL_DETAILS_REQUIRED");
    }

    return message;
  }

  return formatProgressError(error);
};

// Validation error formatters for different contexts
export const formatValidationErrors = (
  errors: Array<{ field: string; message: string; value?: unknown }>
) => {
  if (!errors || errors.length === 0) {
    return "Validation failed";
  }

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `Validation failed: ${errors.map((err) => err.message).join(", ")}`;
};

// User-friendly error messages for common scenarios
export const getUserFriendlyErrorMessage = (
  error: unknown,
  context: "physical" | "financial" | "combined" = "physical"
) => {
  const baseMessage = formatProgressError(error);

  // Add context-specific suggestions
  const suggestions: Record<string, string> = {
    UNAUTHORIZED:
      "Please ensure you are logged in as a Junior Engineer (JE) to update progress.",
    PROJECT_NOT_FOUND:
      "The project may have been moved or deleted. Please refresh and try again.",
    UPDATES_DISABLED:
      "Progress updates have been disabled for this project. Contact your administrator if you need to make updates.",
    REQUIRES_DOCUMENTS:
      context === "financial"
        ? "Please upload supporting documents such as bills, receipts, or invoices when completing financial progress."
        : "Please upload supporting documents such as photos or completion certificates when marking progress as complete.",
    EXCEEDS_LIMITS:
      context === "financial"
        ? "The bill amount cannot exceed the project's work value. Please verify the amount."
        : "Progress changes are limited to prevent errors. For large corrections, please contact your administrator.",
    BACKWARD_PROGRESS:
      "Backward progress changes are restricted. If this is a legitimate correction, please contact your administrator.",
  };

  // Match error patterns to suggestions
  for (const [pattern, suggestion] of Object.entries(suggestions)) {
    if (String(baseMessage).toUpperCase().includes(pattern)) {
      return `${baseMessage} ${suggestion}`;
    }
  }

  return baseMessage;
};
