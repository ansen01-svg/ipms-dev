// utils/project-details/progress-validation.ts

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validates physical progress update
 */
export function validateProgressUpdate(
  currentProgress: number,
  newProgress: number,
  files: File[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (newProgress < 0 || newProgress > 100) {
    errors.progress = "Progress must be between 0 and 100";
  }

  const progressDiff = newProgress - currentProgress;
  if (progressDiff < -5) {
    errors.progress =
      "Cannot decrease progress by more than 5% (contact admin for larger corrections)";
  }

  if (progressDiff > 50) {
    errors.progress = "Cannot increase progress by more than 50% in one update";
  }

  if (newProgress === 100 && files.length === 0) {
    errors.files =
      "Completion (100% progress) requires at least one supporting document";
  }

  return errors;
}

/**
 * Validates financial progress update
 */
export function validateFinancialProgressUpdate(
  currentBillAmount: number,
  newBillAmount: number,
  estimatedCost: number,
  files: File[],
  billNumber?: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (newBillAmount < 0) {
    errors.newBillAmount = "Bill amount cannot be negative";
  }

  if (newBillAmount > estimatedCost) {
    errors.newBillAmount = "Bill amount cannot exceed estimated cost";
  }

  const amountDifference = newBillAmount - currentBillAmount;
  if (amountDifference < 0) {
    const decreasePercentage = Math.abs(amountDifference / estimatedCost) * 100;
    if (decreasePercentage > 5) {
      errors.newBillAmount =
        "Cannot decrease bill amount by more than 5% of estimated cost (contact admin)";
    }
  }

  const increasePercentage = (amountDifference / estimatedCost) * 100;
  if (increasePercentage > 50) {
    errors.newBillAmount =
      "Cannot increase bill amount by more than 50% of estimated cost in one update";
  }

  const newFinancialProgress =
    estimatedCost > 0 ? (newBillAmount / estimatedCost) * 100 : 0;

  if (newFinancialProgress === 100 && files.length === 0) {
    errors.files =
      "Financial completion (100% progress) requires at least one supporting document";
  }

  if (newFinancialProgress === 100 && !billNumber) {
    errors.billNumber =
      "Bill number is required when completing financial progress";
  }

  return errors;
}

/**
 * Formats currency amount for display
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  return `₹${(amount / 100000).toFixed(1)}L`;
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Gets description for financial progress change
 */
export function getFinancialProgressChangeDescription(
  currentAmount: number,
  newAmount: number,
  estimatedCost: number
): string {
  const currentPercentage =
    estimatedCost > 0 ? (currentAmount / estimatedCost) * 100 : 0;
  const newPercentage =
    estimatedCost > 0 ? (newAmount / estimatedCost) * 100 : 0;
  const difference = newPercentage - currentPercentage;

  if (Math.abs(difference) < 0.1) {
    return "No significant change";
  }

  const amountDiff = newAmount - currentAmount;

  if (difference > 0) {
    return `+${difference.toFixed(1)}% (${formatCurrency(
      amountDiff
    )} increase)`;
  } else {
    return `${difference.toFixed(1)}% (${formatCurrency(
      Math.abs(amountDiff)
    )} decrease)`;
  }
}

/**
 * Validates combined progress update
 */
export function validateCombinedProgressUpdate(
  currentProgress: number,
  newProgress: number | undefined,
  currentBillAmount: number,
  newBillAmount: number | undefined,
  estimatedCost: number,
  files: File[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate physical progress if provided
  if (newProgress !== undefined) {
    const progressErrors = validateProgressUpdate(
      currentProgress,
      newProgress,
      files
    );
    Object.assign(errors, progressErrors);
  }

  // Validate financial progress if provided
  if (newBillAmount !== undefined) {
    const financialErrors = validateFinancialProgressUpdate(
      currentBillAmount,
      newBillAmount,
      estimatedCost,
      files
    );
    Object.assign(errors, financialErrors);
  }

  return errors;
}

/**
 * Gets file type icon based on MIME type
 */
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "🖼️";
  } else if (mimeType.includes("pdf")) {
    return "📄";
  } else if (mimeType.includes("word") || mimeType.includes("document")) {
    return "📝";
  } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
    return "📊";
  }
  return "📎";
}

/**
 * Checks if file type is accepted
 */
export function isFileTypeAccepted(
  file: File,
  acceptedTypes: string[]
): boolean {
  return acceptedTypes.includes(file.type);
}

/**
 * Checks if file size is within limit
 */
export function isFileSizeValid(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Progress status color mapping
 */
export function getProgressStatusColor(progress: number): {
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  if (progress >= 90) {
    return {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    };
  } else if (progress >= 70) {
    return {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    };
  } else if (progress >= 40) {
    return {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    };
  } else if (progress > 0) {
    return {
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    };
  }

  return {
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
  };
}
