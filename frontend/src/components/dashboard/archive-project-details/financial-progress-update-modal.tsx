"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DbArchiveProject,
  FinancialProgressUpdateRequest,
} from "@/types/archive-projects.types";
import { formatCurrency } from "@/utils/archive-projects/format-helpers";
import {
  getFinancialProgressChangeDescription,
  updateFinancialProgress,
  validateFinancialProgressUpdate,
} from "@/utils/archive-projects/progress";
import { AlertCircle, CheckCircle, IndianRupee, Info, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileUploadZone } from "./file-upload-zone";

interface FinancialProgressUpdateModalProps {
  project: DbArchiveProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbArchiveProject) => void;
}

export function FinancialProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: FinancialProgressUpdateModalProps) {
  const [formData, setFormData] = useState<FinancialProgressUpdateRequest>({
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
    }
  }, [isOpen, project.billSubmittedAmount]);

  // Calculate if this is a financial completion
  const isFinancialCompletion =
    Math.abs(formData.newBillAmount - project.workValue) < 0.01;
  const newFinancialProgress =
    project.workValue > 0
      ? Math.round((formData.newBillAmount / project.workValue) * 100)
      : 0;

  const validateForm = useCallback(() => {
    const baseValidationErrors = validateFinancialProgressUpdate(
      project.billSubmittedAmount || 0,
      formData.newBillAmount,
      project.workValue,
      files
    );

    // Add bill number validation for financial completion
    if (isFinancialCompletion && !formData.billDetails?.billNumber?.trim()) {
      baseValidationErrors.billNumber =
        "Bill number is required for financial completion";
    }

    return baseValidationErrors;
  }, [
    formData.newBillAmount,
    formData.billDetails?.billNumber,
    files,
    project.billSubmittedAmount,
    project.workValue,
    isFinancialCompletion,
  ]);

  const handleBillAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      setFormData((prev) => ({
        ...prev,
        newBillAmount: isNaN(numValue) ? 0 : numValue,
      }));

      // Clear previous errors when user changes input
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

    // Clear bill number error when user types
    if (field === "billNumber") {
      setErrors((prev) => ({ ...prev, billNumber: "", submit: "" }));
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
      const response = await updateFinancialProgress(project._id, {
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update financial progress";
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentBillAmount = project.billSubmittedAmount || 0;
  const billAmountDifference = formData.newBillAmount - currentBillAmount;
  const hasBillAmountChange = Math.abs(billAmountDifference) >= 0.01; // At least 1 paise change

  const currentFinancialProgress = project.financialProgress || 0;
  const financialProgressDiff = newFinancialProgress - currentFinancialProgress;

  // Check if form is valid without setting state
  const currentErrors = validateForm();
  const isFormValid =
    Object.keys(currentErrors).length === 0 && hasBillAmountChange;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Financial Progress
            </CardTitle>
            <p className="text-blue-100 mt-1 text-sm">{project.nameOfWork}</p>
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
                  Financial Progress Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  The financial progress has been saved.
                </p>
              </div>
            </div>
          )}

          {/* Financial Completion Notice */}
          {isFinancialCompletion && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Financial Completion Notice
                  </h4>
                  <p className="text-emerald-800 text-sm mb-3">
                    You are submitting the final bill that matches the work
                    value. This will:
                  </p>
                  <div className="space-y-2 text-sm text-emerald-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Set financial progress to 100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium">
                        Require bill number for proper documentation
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Mark this project as financially complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Current Financial Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Work Value:</span>
                <div className="font-semibold text-xl text-gray-900">
                  {formatCurrency(project.workValue)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Bill Submitted:</span>
                <div className="font-semibold text-xl text-gray-900">
                  {formatCurrency(currentBillAmount)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Financial Progress:</span>
                <div className="font-semibold text-xl text-gray-900">
                  {currentFinancialProgress}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Bill Amount and Details */}
            <div className="space-y-4">
              {/* Bill Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Bill Amount (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={project.workValue}
                  step="1"
                  value={formData.newBillAmount}
                  onChange={(e) => handleBillAmountChange(e.target.value)}
                  onBlur={handleValidation}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold ${
                    errors.newBillAmount || currentErrors.newBillAmount
                      ? "border-red-500 bg-red-50"
                      : isFinancialCompletion
                      ? "border-emerald-500 bg-emerald-50"
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

              {/* Financial Progress Preview */}
              {hasBillAmountChange && (
                <div
                  className={`border rounded-lg p-4 ${
                    isFinancialCompletion
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h5
                    className={`text-sm font-medium mb-3 ${
                      isFinancialCompletion
                        ? "text-emerald-700"
                        : "text-gray-700"
                    }`}
                  >
                    Financial Progress Preview
                    {isFinancialCompletion}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Current: {currentFinancialProgress}%
                      </span>
                      <span className="text-gray-600">
                        New: {newFinancialProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isFinancialCompletion
                            ? "bg-gradient-to-r from-emerald-500 to-green-600"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(newFinancialProgress, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <span
                        className={`text-sm font-medium ${
                          isFinancialCompletion
                            ? "text-emerald-600"
                            : financialProgressDiff > 0
                            ? "text-green-600"
                            : financialProgressDiff < 0
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        {getFinancialProgressChangeDescription(
                          currentBillAmount,
                          formData.newBillAmount,
                          project.workValue
                        )}
                        {isFinancialCompletion}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Details */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Bill Details{" "}
                  {isFinancialCompletion
                    ? "(Required for Completion)"
                    : "(Optional)"}
                </h5>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Bill Number
                    {isFinancialCompletion && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.billDetails?.billNumber || ""}
                    onChange={(e) =>
                      handleBillDetailsChange("billNumber", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.billNumber || currentErrors.billNumber
                        ? "border-red-500 bg-red-50"
                        : isFinancialCompletion
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-300"
                    }`}
                    placeholder={
                      isFinancialCompletion
                        ? "Enter final bill number (required)"
                        : "Enter bill number"
                    }
                    disabled={isSubmitting}
                  />
                  {(errors.billNumber || currentErrors.billNumber) && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.billNumber || currentErrors.billNumber}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={formData.billDetails?.billDate || ""}
                    onChange={(e) =>
                      handleBillDetailsChange("billDate", e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Bill Description
                  </label>
                  <textarea
                    value={formData.billDetails?.billDescription || ""}
                    onChange={(e) =>
                      handleBillDetailsChange("billDescription", e.target.value)
                    }
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={
                      isFinancialCompletion
                        ? "Describe the final bill for project completion"
                        : "Brief description of the bill"
                    }
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {(formData.billDetails?.billDescription || "").length}/200
                    characters
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Remarks {isFinancialCompletion && "(Final Summary)"}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={
                    isFinancialCompletion
                      ? "Add final remarks about the financial completion of this project..."
                      : "Add any comments about this financial progress update..."
                  }
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
                  {newFinancialProgress === 100 && (
                    <span className="text-red-500 ml-1">
                      * Required for completion
                    </span>
                  )}
                </label>
                <FileUploadZone
                  files={files}
                  onFilesChange={handleFilesChange}
                  required={newFinancialProgress === 100}
                  error={errors.files || currentErrors.files}
                  maxFiles={5}
                />
              </div>

              {/* Validation Rules Info */}
              <div
                className={`border rounded-lg p-4 ${
                  isFinancialCompletion
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <h5
                  className={`text-sm font-medium mb-3 ${
                    isFinancialCompletion ? "text-emerald-900" : "text-blue-900"
                  }`}
                >
                  {isFinancialCompletion
                    ? "Completion Requirements"
                    : "Financial Update Rules"}
                </h5>
                <div
                  className={`space-y-2 text-xs ${
                    isFinancialCompletion ? "text-emerald-700" : "text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isFinancialCompletion ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    ></div>
                    <span>Amount cannot exceed work value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isFinancialCompletion ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    ></div>
                    <span>Maximum 5% decrease allowed (for corrections)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isFinancialCompletion ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    ></div>
                    <span>Maximum 50% of work value increase per update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isFinancialCompletion ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    ></div>
                    <span
                      className={isFinancialCompletion ? "font-semibold" : ""}
                    >
                      Financial completion requires supporting documents
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isFinancialCompletion ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                    ></div>
                    <span
                      className={isFinancialCompletion ? "font-semibold" : ""}
                    >
                      {isFinancialCompletion
                        ? "Bill number is required for completion"
                        : "Only Junior Engineers can update progress"}
                    </span>
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
              className={`flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFinancialCompletion
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {isFinancialCompletion
                    ? "Completing Financially..."
                    : "Updating Financial Progress..."}
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated Successfully!
                </>
              ) : (
                <>
                  {isFinancialCompletion ? (
                    <IndianRupee className="h-4 w-4 mr-2" />
                  ) : (
                    <IndianRupee className="h-4 w-4 mr-2" />
                  )}
                  {isFinancialCompletion
                    ? "Complete Financially"
                    : "Update Financial Progress"}
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
          {!hasBillAmountChange && !isSubmitting && (
            <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2">
              <Info className="h-3 w-3 inline mr-1" />
              Change the bill amount to enable update
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
