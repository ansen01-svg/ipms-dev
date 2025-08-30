"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CombinedProgressUpdateRequest,
  DbArchiveProject,
} from "@/types/archive-projects.types";
import { formatCurrency } from "@/utils/archive-projects/format-helpers";
import {
  updateCombinedProgress,
  validateCombinedProgressUpdate,
} from "@/utils/archive-projects/progress";
import { AlertCircle, CheckCircle, Info, TrendingUp, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileUploadZone } from "./file-upload-zone";

interface CombinedProgressUpdateModalProps {
  project: DbArchiveProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbArchiveProject) => void;
}

export function CombinedProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: CombinedProgressUpdateModalProps) {
  const [formData, setFormData] = useState<CombinedProgressUpdateRequest>({
    progress: project.progress || 0,
    newBillAmount: project.billSubmittedAmount || 0,
    remarks: "",
    billDetails: {
      billNumber: "",
      billDate: "",
      billDescription: "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updatePhysical, setUpdatePhysical] = useState(false);
  const [updateFinancial, setUpdateFinancial] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        progress: project.progress || 0,
        newBillAmount: project.billSubmittedAmount || 0,
        remarks: "",
        billDetails: {
          billNumber: "",
          billDate: "",
          billDescription: "",
        },
      });
      setFiles([]);
      setErrors({});
      setShowSuccess(false);
      setUpdatePhysical(false);
      setUpdateFinancial(false);
    }
  }, [isOpen, project.progress, project.billSubmittedAmount]);

  const validateForm = useCallback(() => {
    // Only validate what user wants to update
    const progressToValidate = updatePhysical ? formData.progress : undefined;
    const billAmountToValidate = updateFinancial
      ? formData.newBillAmount
      : undefined;

    const validationErrors = validateCombinedProgressUpdate(
      project.progress || 0,
      progressToValidate,
      project.billSubmittedAmount || 0,
      billAmountToValidate,
      project.workValue,
      files
    );
    return validationErrors;
  }, [formData, files, project, updatePhysical, updateFinancial]);

  const handlePhysicalProgressChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      setFormData((prev) => ({
        ...prev,
        progress: isNaN(numValue) ? 0 : numValue,
      }));
      setErrors((prev) => ({ ...prev, progress: "", submit: "" }));
    }
  };

  const handleBillAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      setFormData((prev) => ({
        ...prev,
        newBillAmount: isNaN(numValue) ? 0 : numValue,
      }));
      setErrors((prev) => ({ ...prev, newBillAmount: "", submit: "" }));
    }
  };

  const handleBillDetailsChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      billDetails: {
        ...prev.billDetails,
        [field]: value,
      },
    }));
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setErrors((prev) => ({ ...prev, files: "", submit: "" }));
  };

  const handleValidation = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!updatePhysical && !updateFinancial) {
      setErrors({
        general: "Please select at least one type of progress to update",
      });
      return;
    }

    if (!handleValidation()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const requestData: CombinedProgressUpdateRequest = {
        remarks: formData.remarks,
        files,
      };

      // Only include progress types that user wants to update
      if (updatePhysical) {
        requestData.progress = formData.progress;
      }

      if (updateFinancial) {
        requestData.newBillAmount = formData.newBillAmount;
        requestData.billDetails = formData.billDetails;
      }

      const response = await updateCombinedProgress(project._id, requestData);

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

  const currentProgress = project.progress || 0;
  const currentBillAmount = project.billSubmittedAmount || 0;
  const currentFinancialProgress = project.financialProgress || 0;

  const physicalProgressDiff = (formData.progress || 0) - currentProgress;
  const billAmountDiff = (formData.newBillAmount || 0) - currentBillAmount;
  const newFinancialProgress =
    project.workValue > 0
      ? Math.round(((formData.newBillAmount || 0) / project.workValue) * 100)
      : 0;
  // const financialProgressDiff = newFinancialProgress - currentFinancialProgress;

  const hasPhysicalChange = Math.abs(physicalProgressDiff) >= 0.1;
  const hasBillAmountChange = Math.abs(billAmountDiff) >= 0.01;

  // Check if form is valid without setting state
  const currentErrors = validateForm();
  const isFormValid =
    Object.keys(currentErrors).length === 0 &&
    ((updatePhysical && hasPhysicalChange) ||
      (updateFinancial && hasBillAmountChange));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Combined Progress
            </CardTitle>
            <p className="text-purple-100 mt-1 text-sm">{project.nameOfWork}</p>
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
                  Combined Progress Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  The progress updates have been saved.
                </p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-500" />
              Current Progress Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  Physical Progress
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {currentProgress}%
                </div>
                <div className="text-xs text-gray-600">
                  Status: {project.progressStatus || "Not Started"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  Financial Progress
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {currentFinancialProgress}%
                </div>
                <div className="text-xs text-gray-600">
                  Bill: {formatCurrency(currentBillAmount)} /{" "}
                  {formatCurrency(project.workValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Type Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              Select Progress Types to Update
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="updatePhysical"
                  checked={updatePhysical}
                  onChange={(e) => setUpdatePhysical(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="updatePhysical"
                  className="text-sm font-medium text-gray-700"
                >
                  Update Physical Progress
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="updateFinancial"
                  checked={updateFinancial}
                  onChange={(e) => setUpdateFinancial(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="updateFinancial"
                  className="text-sm font-medium text-gray-700"
                >
                  Update Financial Progress
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Progress Updates */}
            <div className="space-y-6">
              {/* Physical Progress Section */}
              {updatePhysical && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-medium text-green-900">
                    Physical Progress Update
                  </h5>

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
                      onChange={(e) =>
                        handlePhysicalProgressChange(e.target.value)
                      }
                      onBlur={handleValidation}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold ${
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

                  {hasPhysicalChange && (
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <div className="text-sm text-green-700 mb-2">
                        Physical Progress Preview
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {currentProgress}% → {formData.progress}%
                      </div>
                      <div className="text-sm text-green-600">
                        {physicalProgressDiff > 0 ? "+" : ""}
                        {physicalProgressDiff.toFixed(1)}% change
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Financial Progress Section */}
              {updateFinancial && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-medium text-blue-900">
                    Financial Progress Update
                  </h5>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Bill Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={project.workValue}
                      step="0.01"
                      value={formData.newBillAmount}
                      onChange={(e) => handleBillAmountChange(e.target.value)}
                      onBlur={handleValidation}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold ${
                        errors.newBillAmount || currentErrors.newBillAmount
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={`Enter amount (Max: ${formatCurrency(
                        project.workValue
                      )})`}
                      disabled={isSubmitting}
                    />
                    {(errors.newBillAmount || currentErrors.newBillAmount) && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.newBillAmount || currentErrors.newBillAmount}
                      </div>
                    )}
                  </div>

                  {hasBillAmountChange && (
                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-700 mb-2">
                        Financial Progress Preview
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {currentFinancialProgress}% → {newFinancialProgress}%
                      </div>
                      <div className="text-sm text-blue-600">
                        {formatCurrency(currentBillAmount)} →{" "}
                        {formatCurrency(formData.newBillAmount || 0)}
                      </div>
                    </div>
                  )}

                  {/* Bill Details */}
                  <div className="space-y-3">
                    <h6 className="text-sm font-medium text-blue-700">
                      Bill Details (Optional)
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.billDetails?.billNumber || ""}
                        onChange={(e) =>
                          handleBillDetailsChange("billNumber", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bill number"
                        disabled={isSubmitting}
                      />
                      <input
                        type="date"
                        value={formData.billDetails?.billDate || ""}
                        onChange={(e) =>
                          handleBillDetailsChange("billDate", e.target.value)
                        }
                        max={new Date().toISOString().split("T")[0]}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                    <textarea
                      value={formData.billDetails?.billDescription || ""}
                      onChange={(e) =>
                        handleBillDetailsChange(
                          "billDescription",
                          e.target.value
                        )
                      }
                      maxLength={200}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Brief description (optional)"
                      disabled={isSubmitting}
                    />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Add any comments about this combined progress update..."
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 text-right">
                  {formData.remarks?.length || 0}/500 characters
                </div>
              </div>
            </div>

            {/* Right Column - File Upload and Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Documents
                  {((updatePhysical && formData.progress === 100) ||
                    (updateFinancial && newFinancialProgress === 100)) && (
                    <span className="text-red-500 ml-1">
                      * Required for completion
                    </span>
                  )}
                </label>
                <FileUploadZone
                  files={files}
                  onFilesChange={handleFilesChange}
                  required={
                    (updatePhysical && formData.progress === 100) ||
                    (updateFinancial && newFinancialProgress === 100)
                  }
                  error={errors.files || currentErrors.files}
                  maxFiles={10}
                />
              </div>

              {/* Validation Rules Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-purple-900 mb-3">
                  Combined Update Rules
                </h5>
                <div className="space-y-2 text-xs text-purple-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Select at least one progress type to update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>
                      Physical: Maximum 5% decrease, 50% increase per update
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Financial: Amount cannot exceed work value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Completion (100%) requires supporting documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Only Junior Engineers can update progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {(errors.submit || errors.general) && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Update Failed
                </p>
                <p className="text-sm text-red-700">
                  {errors.submit || errors.general}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update Combined Progress
                </>
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
          {!updatePhysical && !updateFinancial && !isSubmitting && (
            <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2">
              <Info className="h-3 w-3 inline mr-1" />
              Select at least one progress type to enable update
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
