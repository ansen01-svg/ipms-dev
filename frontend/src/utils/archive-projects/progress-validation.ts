// frontend/src/utils/archive-projects/progress-validation.ts
// Updated validation utilities with financial progress support

export const validateProgressUpdate = (
  currentProgress: number,
  newProgress: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // Basic progress validation
  if (newProgress < 0 || newProgress > 100) {
    errors.progress = "Progress must be between 0 and 100";
    return errors;
  }

  const progressDiff = newProgress - currentProgress;

  // Backward progress check (max 5% decrease)
  if (progressDiff < 0 && Math.abs(progressDiff) > 5) {
    errors.progress =
      "Significant backward progress not allowed. Maximum 5% decrease per update for corrections.";
  }

  // Progress jump check (max 50% increase)
  if (progressDiff > 50) {
    errors.progress =
      "Progress increase exceeds reasonable limits. Maximum 50% increase per update.";
  }

  // Completion requires documents
  if (newProgress === 100 && files.length === 0) {
    errors.files =
      "Project completion (100% progress) requires at least one supporting document";
  }

  // File size validation (10MB max per file)
  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    errors.files = `Files exceed 10MB limit: ${oversizedFiles
      .map((f) => f.name)
      .join(", ")}`;
  }

  return errors;
};

// NEW: Financial Progress Validation
export const validateFinancialProgressUpdate = (
  currentBillAmount: number,
  newBillAmount: number,
  workValue: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // Basic bill amount validation
  if (newBillAmount < 0) {
    errors.billAmount = "Bill amount cannot be negative";
    return errors;
  }

  if (newBillAmount > workValue) {
    errors.billAmount = "Bill amount cannot exceed work value";
    return errors;
  }

  const amountDiff = newBillAmount - currentBillAmount;
  const workValuePercentage =
    workValue > 0 ? (Math.abs(amountDiff) / workValue) * 100 : 0;

  // Backward financial progress check (max 5% of work value decrease)
  if (amountDiff < 0 && workValuePercentage > 5) {
    errors.billAmount =
      "Significant backward financial progress not allowed. Maximum 5% of work value decrease per update for corrections.";
  }

  // Financial progress jump check (max 50% of work value increase)
  if (amountDiff > 0 && workValuePercentage > 50) {
    errors.billAmount =
      "Financial progress increase exceeds reasonable limits. Maximum 50% of work value per update.";
  }

  // Calculate new financial progress percentage
  const newFinancialProgress =
    workValue > 0 ? (newBillAmount / workValue) * 100 : 0;

  // Financial completion requires documents
  if (newFinancialProgress >= 100 && files.length === 0) {
    errors.files =
      "Financial completion (100% progress) requires at least one supporting document";
  }

  // File size validation (10MB max per file)
  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    errors.files = `Files exceed 10MB limit: ${oversizedFiles
      .map((f) => f.name)
      .join(", ")}`;
  }

  return errors;
};

// NEW: Combined Progress Validation
export const validateCombinedProgressUpdate = (
  currentProgress: number,
  newProgress: number | undefined,
  currentBillAmount: number,
  newBillAmount: number | undefined,
  workValue: number,
  files: File[]
) => {
  const errors: Record<string, string> = {};

  // At least one progress type must be provided
  if (newProgress === undefined && newBillAmount === undefined) {
    errors.general =
      "At least one progress update (physical or financial) must be provided";
    return errors;
  }

  // Validate physical progress if provided
  if (newProgress !== undefined) {
    const physicalErrors = validateProgressUpdate(
      currentProgress,
      newProgress,
      []
    );
    Object.assign(errors, physicalErrors);
  }

  // Validate financial progress if provided
  if (newBillAmount !== undefined) {
    const financialErrors = validateFinancialProgressUpdate(
      currentBillAmount,
      newBillAmount,
      workValue,
      []
    );

    // Prefix financial errors to avoid conflicts
    Object.entries(financialErrors).forEach(([key, value]) => {
      if (key !== "files") {
        errors[`financial_${key}`] = value;
      } else {
        // For files, combine with existing files error if any
        errors.files = errors.files ? `${errors.files}; ${value}` : value;
      }
    });
  }

  // Combined completion requires documents
  const isPhysicallyComplete = newProgress === 100;
  const isFinanciallyComplete =
    newBillAmount !== undefined &&
    workValue > 0 &&
    newBillAmount / workValue >= 1;

  if ((isPhysicallyComplete || isFinanciallyComplete) && files.length === 0) {
    errors.files =
      "Completion (100% progress) requires at least one supporting document";
  }

  // File size validation
  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    errors.files = `Files exceed 10MB limit: ${oversizedFiles
      .map((f) => f.name)
      .join(", ")}`;
  }

  return errors;
};

// Bill details validation
export const validateBillDetails = (
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  },
  isCompletion: boolean = false
) => {
  const errors: Record<string, string> = {};

  if (isCompletion && (!billDetails || !billDetails.billNumber)) {
    errors.billNumber = "Bill number is required for completion";
  }

  if (billDetails?.billDate) {
    const billDate = new Date(billDetails.billDate);
    const today = new Date();

    if (billDate > today) {
      errors.billDate = "Bill date cannot be in the future";
    }

    // Check if bill date is too far in the past (more than 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    if (billDate < twoYearsAgo) {
      errors.billDate = "Bill date seems too old (more than 2 years ago)";
    }
  }

  if (
    billDetails?.billDescription &&
    billDetails.billDescription.length > 200
  ) {
    errors.billDescription = "Bill description cannot exceed 200 characters";
  }

  return errors;
};

// File type validation for different update types
export const validateFileTypes = (
  files: File[],
  updateType: "physical" | "financial" | "combined"
) => {
  const errors: string[] = [];

  files.forEach((file, index) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} (${file.name}): Invalid file type`);
    }

    // File size check (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      errors.push(`File ${index + 1} (${file.name}): Exceeds 10MB size limit`);
    }

    // Empty file check
    if (file.size === 0) {
      errors.push(`File ${index + 1} (${file.name}): File is empty`);
    }
  });

  // Specific recommendations based on update type
  if (updateType === "financial" && files.length > 0) {
    const hasDocumentFiles = files.some(
      (file) =>
        file.type === "application/pdf" ||
        file.type.includes("document") ||
        file.type.includes("spreadsheet")
    );

    if (!hasDocumentFiles) {
      errors.push(
        "Financial updates should include document files (PDF, Word, Excel) such as bills or receipts"
      );
    }
  }

  return errors;
};

export const getProgressChangeDescription = (from: number, to: number) => {
  const diff = to - from;
  if (diff > 0) {
    return `Increased by ${diff.toFixed(1)}%`;
  } else if (diff < 0) {
    return `Decreased by ${Math.abs(diff).toFixed(1)}%`;
  }
  return "No change";
};

export const getFinancialProgressChangeDescription = (
  fromAmount: number,
  toAmount: number,
  workValue: number
) => {
  const amountDiff = toAmount - fromAmount;
  const fromPercentage = workValue > 0 ? (fromAmount / workValue) * 100 : 0;
  const toPercentage = workValue > 0 ? (toAmount / workValue) * 100 : 0;
  const percentageDiff = toPercentage - fromPercentage;

  if (amountDiff > 0) {
    return `Increased by ₹${(amountDiff / 100000).toFixed(
      1
    )}L (${percentageDiff.toFixed(1)}%)`;
  } else if (amountDiff < 0) {
    return `Decreased by ₹${(Math.abs(amountDiff) / 100000).toFixed(
      1
    )}L (${Math.abs(percentageDiff).toFixed(1)}%)`;
  }
  return "No change";
};

// Validation warning system (non-blocking warnings)
export const getProgressUpdateWarnings = (
  currentProgress: number,
  newProgress: number,
  files: File[]
) => {
  const warnings: string[] = [];

  const progressDiff = newProgress - currentProgress;

  // Large progress jumps (not errors, just warnings)
  if (progressDiff > 25) {
    warnings.push(
      `Large progress increase of ${progressDiff.toFixed(
        1
      )}%. Please ensure this is accurate.`
    );
  }

  // Progress without supporting evidence
  if (progressDiff > 10 && files.length === 0) {
    warnings.push(
      "Significant progress update without supporting documents. Consider adding photos or reports."
    );
  }

  // Near completion without final documents
  if (newProgress > 90 && newProgress < 100 && files.length === 0) {
    warnings.push(
      "Project is near completion. Consider uploading completion-related documents."
    );
  }

  return warnings;
};

export const getFinancialProgressUpdateWarnings = (
  currentAmount: number,
  newAmount: number,
  workValue: number,
  files: File[],
  billDetails?: { billNumber?: string }
) => {
  const warnings: string[] = [];

  const amountDiff = newAmount - currentAmount;
  const workValuePercentage =
    workValue > 0 ? (amountDiff / workValue) * 100 : 0;

  // Large financial progress jumps
  if (workValuePercentage > 25) {
    warnings.push(
      `Large bill amount increase of ₹${(amountDiff / 100000).toFixed(
        1
      )}L. Please verify accuracy.`
    );
  }

  // Financial progress without bills
  if (amountDiff > 0 && files.length === 0) {
    warnings.push(
      "Bill amount increased without supporting documents. Consider uploading bills or receipts."
    );
  }

  // Missing bill number for significant amounts
  if (
    newAmount > workValue * 0.5 &&
    (!billDetails || !billDetails.billNumber)
  ) {
    warnings.push("Consider adding bill number for better financial tracking.");
  }

  // Near financial completion
  const newFinancialProgress =
    workValue > 0 ? (newAmount / workValue) * 100 : 0;
  if (
    newFinancialProgress > 90 &&
    newFinancialProgress < 100 &&
    files.length === 0
  ) {
    warnings.push(
      "Financial progress is near completion. Consider uploading final bills or completion certificates."
    );
  }

  return warnings;
};
