// components/dashboard/archive-project-details/progress-update-modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DbArchiveProject,
  ProgressUpdateRequest,
} from "@/types/archive-projects.types";
import { formatProgressError } from "@/utils/archive-projects/error-messages";
import { updateProjectProgress } from "@/utils/archive-projects/progress";
import { validateProgressUpdate } from "@/utils/archive-projects/progress-validation";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileUploadZone } from "./file-upload-zone";
import { ProgressIndicator } from "./progress-indicator";

interface ProgressUpdateModalProps {
  project: DbArchiveProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbArchiveProject) => void;
}

export function ProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ProgressUpdateModalProps) {
  const [formData, setFormData] = useState<ProgressUpdateRequest>({
    progress: project.progress,
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
        progress: project.progress,
        remarks: "",
      });
      setFiles([]);
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen, project.progress]);

  const validateForm = useCallback(() => {
    const validationErrors = validateProgressUpdate(
      project.progress,
      formData.progress,
      files
    );
    return validationErrors;
  }, [formData.progress, files, project.progress]);

  const handleProgressChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, progress: numValue }));

      // Clear previous errors when user changes input
      setErrors((prev) => ({ ...prev, progress: "", submit: "" }));
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    // Clear file errors when files change
    setErrors((prev) => ({ ...prev, files: "", submit: "" }));
  };

  const handleValidation = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate before submission
    if (!handleValidation()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await updateProjectProgress(project._id, {
        ...formData,
        files,
      });

      setShowSuccess(true);

      // Wait a bit before closing to show success state
      setTimeout(() => {
        onSuccess(response.data.project);
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage = formatProgressError(error);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressDifference = formData.progress - project.progress;
  const hasProgressChange = Math.abs(progressDifference) >= 0.1;

  // Check if form is valid without setting state
  const currentErrors = validateForm();
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
            <p className="text-teal-100 mt-1 text-sm">{project.nameOfWork}</p>
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
          {/* Success State */}
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

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Current Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Progress:</span>
                <div className="font-semibold text-xl text-gray-900">
                  {project.progress}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium text-gray-900">
                  {project.progressStatus}
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
            {/* Left Column - Progress Input */}
            <div className="space-y-4">
              {/* Progress Input */}
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

              {/* Progress Visual Indicator */}
              {hasProgressChange && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Progress Change Preview
                  </h5>
                  <ProgressIndicator
                    current={project.progress}
                    target={formData.progress}
                  />
                  <div className="mt-2 text-center">
                    <span
                      className={`text-sm font-medium ${
                        progressDifference > 0
                          ? "text-green-600"
                          : progressDifference < 0
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {progressDifference > 0 ? "+" : ""}
                      {progressDifference.toFixed(1)}% change
                    </span>
                  </div>
                </div>
              )}

              {/* Remarks */}
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

            {/* Right Column - File Upload */}
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
                  onFilesChange={handleFilesChange}
                  required={formData.progress === 100}
                  error={errors.files || currentErrors.files}
                  maxFiles={5}
                />
              </div>

              {/* Validation Rules Info */}
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
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Only Junior Engineers can update progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
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

          {/* Action Buttons */}
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

          {/* Submit Button Info */}
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
