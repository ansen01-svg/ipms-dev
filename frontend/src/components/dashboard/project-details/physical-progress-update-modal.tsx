"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ProgressUpdateRequest {
  progress: number;
  remarks?: string;
  supportingFiles?: File[];
}

interface ProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject;
    latestProgressUpdate: unknown;
    progressChange: {
      from: number;
      to: number;
      difference: number;
      changeType: "increase" | "decrease" | "no change";
    };
    filesUploaded: {
      count: number;
      totalSize: number;
      types: Record<string, number>;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: unknown;
    totalProgressUpdates: number;
  };
}

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

function FileUploadZone({
  files,
  onFilesChange,
  required = false,
  error,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
  ],
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateAndAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];

    for (const file of newFiles) {
      if (acceptedTypes.includes(file.type) && file.size <= maxFileSize) {
        validFiles.push(file);
      }
    }

    const totalFiles = files.length + validFiles.length;
    const filesToAdd =
      totalFiles > maxFiles
        ? validFiles.slice(0, maxFiles - files.length)
        : validFiles;

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-teal-400 bg-teal-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <p className="text-sm text-gray-600 mb-2">
          {dragActive
            ? "Drop files here"
            : "Drag files here or click to upload"}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className="text-xs text-gray-500">
          PDF, Word, Excel, PNG, JPEG, GIF (Max{" "}
          {Math.floor(maxFileSize / 1024 / 1024)}MB per file, {maxFiles} files
          max)
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif"
          onChange={(e) => validateAndAddFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length}/{maxFiles})
          </h5>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => removeFile(index)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProgressIndicatorProps {
  current: number;
  target: number;
  className?: string;
}

function ProgressIndicator({
  current,
  target,
  className = "",
}: ProgressIndicatorProps) {
  const difference = target - current;
  const isIncrease = difference > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Current: {current}%</span>
        <span className="text-gray-600">Target: {target}%</span>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${current}%` }}
          />
        </div>

        {difference !== 0 && (
          <div
            className={`absolute top-0 h-3 w-1 ${
              isIncrease ? "bg-green-500" : "bg-orange-500"
            } transition-all duration-500`}
            style={{ left: `${Math.min(target, 100)}%` }}
          />
        )}
      </div>

      {difference !== 0 && (
        <div
          className={`text-xs ${
            isIncrease
              ? "text-green-600"
              : difference < 0
              ? "text-orange-600"
              : "text-gray-600"
          }`}
        >
          {isIncrease ? "+" : ""}
          {difference.toFixed(1)}% change
        </div>
      )}
    </div>
  );
}

interface ProgressUpdateModalProps {
  project: DbProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbProject) => void;
}

export function ProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ProgressUpdateModalProps) {
  const [formData, setFormData] = useState<ProgressUpdateRequest>({
    progress: project.progressPercentage || 0,
    remarks: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        progress: project.progressPercentage || 0,
        remarks: "",
      });
      setFiles([]);
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen, project.progressPercentage]);

  const validateProgressUpdate = useCallback(() => {
    const validationErrors: Record<string, string> = {};
    const currentProgress = project.progressPercentage || 0;

    if (formData.progress < 0 || formData.progress > 100) {
      validationErrors.progress = "Progress must be between 0 and 100";
    }

    const progressDiff = formData.progress - currentProgress;
    if (progressDiff < -5) {
      validationErrors.progress =
        "Cannot decrease progress by more than 5% (contact admin for larger corrections)";
    }

    if (progressDiff > 50) {
      validationErrors.progress =
        "Cannot increase progress by more than 50% in one update";
    }

    if (formData.progress === 100 && files.length === 0) {
      validationErrors.files =
        "Completion (100% progress) requires at least one supporting document";
    }

    return validationErrors;
  }, [formData.progress, files.length, project.progressPercentage]);

  const handleProgressChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, progress: numValue }));
      setErrors((prev) => ({ ...prev, progress: "", submit: "" }));
    }
  };

  const handleValidation = () => {
    const validationErrors = validateProgressUpdate();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const updateProjectProgress = async (
    projectId: string,
    progressData: ProgressUpdateRequest
  ): Promise<ProgressUpdateResponse> => {
    const formData = new FormData();
    formData.append("progress", progressData.progress.toString());
    if (progressData.remarks) {
      formData.append("remarks", progressData.remarks);
    }
    if (progressData.supportingFiles) {
      progressData.supportingFiles.forEach((file) => {
        formData.append("supportingFiles", file);
      });
    }

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${projectId}/progress`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  const handleSubmit = async () => {
    if (!handleValidation()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await updateProjectProgress(project._id!, {
        ...formData,
        supportingFiles: files,
      });

      setShowSuccess(true);

      // Wait a bit before closing to show success state
      setTimeout(() => {
        onSuccess(response.data.project);
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update progress";
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressDifference =
    formData.progress - (project.progressPercentage || 0);
  const hasProgressChange = Math.abs(progressDifference) >= 0.1;

  const currentErrors = validateProgressUpdate();
  const isFormValid =
    Object.keys(currentErrors).length === 0 && hasProgressChange;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Project Progress
            </CardTitle>
            <p className="text-teal-100 mt-1 text-sm">{project.projectName}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">
                  Progress Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  The project progress has been saved.
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Current Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Progress:</span>
                <div className="font-semibold text-xl text-gray-900">
                  {project.progressPercentage || 0}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium text-gray-900">
                  {project.status}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Updates:</span>
                <div className="font-medium text-gray-900">
                  {project.totalProgressUpdates || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Progress Percentage *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.progress}
                  onChange={(e) => handleProgressChange(e.target.value)}
                  onBlur={handleValidation}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-semibold ${
                    errors.progress || currentErrors.progress
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter progress percentage (0-100)"
                  disabled={isSubmitting}
                />
                {(errors.progress || currentErrors.progress) && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.progress || currentErrors.progress}
                  </div>
                )}
              </div>

              {hasProgressChange && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Progress Change Preview
                  </h5>
                  <ProgressIndicator
                    current={project.progressPercentage || 0}
                    target={formData.progress}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Remarks (Optional)
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Add any comments about this progress update..."
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 text-right">
                  {formData.remarks?.length || 0}/500 characters
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Documents
                  {formData.progress === 100 && (
                    <span className="text-red-500 ml-1">
                      * Required for completion
                    </span>
                  )}
                </label>
                <FileUploadZone
                  files={files}
                  onFilesChange={setFiles}
                  required={formData.progress === 100}
                  error={errors.files || currentErrors.files}
                  maxFiles={5}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-900 mb-3">
                  Progress Update Rules
                </h5>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Maximum 5% decrease allowed (for corrections)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Maximum 50% increase per single update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Completion (100%) requires supporting documents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Update Failed
                </p>
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating Progress...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated Successfully!
                </>
              ) : (
                "Update Progress"
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {!hasProgressChange && !isSubmitting && (
            <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2">
              <Info className="h-3 w-3 inline mr-1" />
              Change the progress value to enable update
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
