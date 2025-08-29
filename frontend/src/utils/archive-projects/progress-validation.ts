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

export const getProgressChangeDescription = (from: number, to: number) => {
  const diff = to - from;
  if (diff > 0) {
    return `Increased by ${diff.toFixed(1)}%`;
  } else if (diff < 0) {
    return `Decreased by ${Math.abs(diff).toFixed(1)}%`;
  }
  return "No change";
};
