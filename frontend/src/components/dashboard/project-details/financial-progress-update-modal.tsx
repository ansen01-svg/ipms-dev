"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { updateFinancialProgress } from "@/utils/projects/progress";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  ImageIcon,
  IndianRupeeIcon,
  Info,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface FinancialProgressUpdateRequest {
  newBillAmount: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  supportingFiles?: File[];
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    validateAndAddFiles(event.target.files);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
    return <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />;
  };

  const getFileTypeDisplay = (mimeType: string) => {
    const type = mimeType.split("/")[1];
    return type ? type.toUpperCase() : "Unknown";
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleZoneClick}
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
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length}/{maxFiles})
          </h5>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} •{" "}
                    {getFileTypeDisplay(file.type)}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Count Warning */}
      {files.length >= maxFiles && (
        <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
          Maximum file limit reached ({maxFiles} files)
        </div>
      )}
    </div>
  );
}

interface FinancialProgressIndicatorProps {
  currentAmount: number;
  targetAmount: number;
  totalBudget: number;
  className?: string;
}

function FinancialProgressIndicator({
  currentAmount,
  targetAmount,
  totalBudget,
  className = "",
}: FinancialProgressIndicatorProps) {
  const currentPercentage =
    totalBudget > 0 ? (currentAmount / totalBudget) * 100 : 0;
  const targetPercentage =
    totalBudget > 0 ? (targetAmount / totalBudget) * 100 : 0;
  const difference = targetAmount - currentAmount;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Current: {formatCurrency(currentAmount)} (
          {currentPercentage.toFixed(1)}%)
        </span>
        <span className="text-gray-600">
          Target: {formatCurrency(targetAmount)} ({targetPercentage.toFixed(1)}
          %)
        </span>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(currentPercentage, 100)}%` }}
          />
        </div>

        {difference !== 0 && (
          <div
            className={`absolute top-0 h-3 w-1 ${
              difference > 0 ? "bg-green-500" : "bg-orange-500"
            } transition-all duration-500`}
            style={{ left: `${Math.min(targetPercentage, 100)}%` }}
          />
        )}
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          Total Budget: {formatCurrency(totalBudget)}
        </span>
        {difference !== 0 && (
          <span
            className={`font-medium ${
              difference > 0 ? "text-green-600" : "text-orange-600"
            }`}
          >
            {difference > 0 ? "+" : ""}
            {formatCurrency(difference)} change
          </span>
        )}
      </div>
    </div>
  );
}

interface FinancialProgressUpdateModalProps {
  project: DbProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbProject) => void;
}

export function FinancialProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: FinancialProgressUpdateModalProps) {
  const [formData, setFormData] = useState<FinancialProgressUpdateRequest>({
    newBillAmount: 0,
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

  // Get current financial values - using fallbacks for compatibility
  const currentBillAmount = (project as DbProject).billSubmittedAmount || 0;
  const currentFinancialProgress =
    (project as DbProject).financialProgress || 0;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        newBillAmount: currentBillAmount,
        remarks: "",
        billDetails: {
          billNumber: "",
          billDate: new Date().toISOString().split("T")[0],
          billDescription: "",
        },
      });
      setFiles([]);
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen, currentBillAmount]);

  const validateFinancialUpdate = useCallback(() => {
    const validationErrors: Record<string, string> = {};

    if (formData.newBillAmount < 0) {
      validationErrors.newBillAmount = "Bill amount cannot be negative";
    }

    if (formData.newBillAmount > project.estimatedCost) {
      validationErrors.newBillAmount =
        "Bill amount cannot exceed estimated cost";
    }

    const amountDifference = formData.newBillAmount - currentBillAmount;
    if (amountDifference < 0) {
      const decreasePercentage =
        Math.abs(amountDifference / project.estimatedCost) * 100;
      if (decreasePercentage > 5) {
        validationErrors.newBillAmount =
          "Cannot decrease bill amount by more than 5% of estimated cost (contact admin)";
      }
    }

    const increasePercentage = (amountDifference / project.estimatedCost) * 100;
    if (increasePercentage > 50) {
      validationErrors.newBillAmount =
        "Cannot increase bill amount by more than 50% of estimated cost in one update";
    }

    const newFinancialProgress =
      project.estimatedCost > 0
        ? (formData.newBillAmount / project.estimatedCost) * 100
        : 0;

    if (newFinancialProgress === 100 && files.length === 0) {
      validationErrors.files =
        "Financial completion (100% progress) requires at least one supporting document";
    }

    if (newFinancialProgress === 100 && !formData.billDetails?.billNumber) {
      validationErrors.billNumber =
        "Bill number is required when completing financial progress";
    }

    return validationErrors;
  }, [formData, files.length, currentBillAmount, project.estimatedCost]);

  const handleBillAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, newBillAmount: numValue }));
    setErrors((prev) => ({ ...prev, newBillAmount: "", submit: "" }));
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
    const validationErrors = validateFinancialUpdate();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidation()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await updateFinancialProgress(project._id!, {
        ...formData,
        supportingFiles: files,
      });

      setShowSuccess(true);

      setTimeout(() => {
        onSuccess(response.data.project);
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update financial progress";
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountDifference = formData.newBillAmount - currentBillAmount;
  const hasAmountChange = Math.abs(amountDifference) >= 0.01;

  const newFinancialProgress =
    project.estimatedCost > 0
      ? Math.round((formData.newBillAmount / project.estimatedCost) * 100)
      : 0;

  const currentErrors = validateFinancialUpdate();
  const isFormValid =
    Object.keys(currentErrors).length === 0 && hasAmountChange;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Financial Progress
            </CardTitle>
            <p className="text-blue-100 mt-1 text-sm">{project.projectName}</p>
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
                  The bill amount and financial progress have been saved.
                </p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Current Financial Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Bill Amount:</span>
                <div className="font-semibold text-lg text-gray-900">
                  ₹{(currentBillAmount / 100000).toFixed(1)}L
                </div>
              </div>
              <div>
                <span className="text-gray-600">Financial Progress:</span>
                <div className="font-semibold text-lg text-gray-900">
                  {currentFinancialProgress.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Estimated Cost:</span>
                <div className="font-semibold text-lg text-gray-900">
                  ₹{(project.estimatedCost / 100000).toFixed(1)}L
                </div>
              </div>
              <div>
                <span className="text-gray-600">Remaining Budget:</span>
                <div className="font-semibold text-lg text-gray-900">
                  ₹
                  {(
                    (project.estimatedCost - currentBillAmount) /
                    100000
                  ).toFixed(1)}
                  L
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Financial Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Bill Amount (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.newBillAmount}
                  onChange={(e) => handleBillAmountChange(e.target.value)}
                  onBlur={handleValidation}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold ${
                    errors.newBillAmount || currentErrors.newBillAmount
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter bill amount"
                  disabled={isSubmitting}
                />
                {(errors.newBillAmount || currentErrors.newBillAmount) && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.newBillAmount || currentErrors.newBillAmount}
                  </div>
                )}
              </div>

              {/* Financial Progress Indicator */}
              {hasAmountChange && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Financial Progress Preview
                  </h5>
                  <FinancialProgressIndicator
                    currentAmount={currentBillAmount}
                    targetAmount={formData.newBillAmount}
                    totalBudget={project.estimatedCost}
                  />
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium text-blue-600">
                      New Progress: {newFinancialProgress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Bill Details */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Bill Details
                </h5>

                <div className="space-y-2">
                  <label className="block text-xs text-gray-600">
                    Bill Number
                    {newFinancialProgress === 100 && (
                      <span className="text-red-500 ml-1">
                        * Required for completion
                      </span>
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
                        : "border-gray-300"
                    }`}
                    placeholder="Enter bill number"
                    disabled={isSubmitting}
                  />
                  {(errors.billNumber || currentErrors.billNumber) && (
                    <div className="flex items-center gap-2 text-red-600 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.billNumber || currentErrors.billNumber}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs text-gray-600">
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
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-gray-600">
                    Bill Description (Optional)
                  </label>
                  <textarea
                    value={formData.billDetails?.billDescription || ""}
                    onChange={(e) =>
                      handleBillDetailsChange("billDescription", e.target.value)
                    }
                    rows={2}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief description of bill items..."
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {formData.billDetails?.billDescription?.length || 0}/200
                    characters
                  </div>
                </div>
              </div>

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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Add any comments about this financial update..."
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 text-right">
                  {formData.remarks?.length || 0}/500 characters
                </div>
              </div>
            </div>

            {/* Right Column - File Upload & Rules */}
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
                  maxFiles={10}
                />
              </div>

              {/* Validation Rules Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-900 mb-3">
                  Financial Update Rules
                </h5>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Bill amount cannot exceed estimated cost</span>
                  </div>
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
                    <span>
                      Completion (100%) requires bill number and documents
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Only Junior Engineers can update progress</span>
                  </div>
                </div>
              </div>

              {/* Budget Analysis */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Budget Analysis
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-medium">
                      ₹{(project.estimatedCost / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Bill Amount:</span>
                    <span className="font-medium">
                      ₹{(formData.newBillAmount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilization:</span>
                    <span className="font-medium">
                      {project.estimatedCost > 0
                        ? (
                            (formData.newBillAmount / project.estimatedCost) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Remaining Budget:</span>
                    <span className="font-medium">
                      ₹
                      {(
                        (project.estimatedCost - formData.newBillAmount) /
                        100000
                      ).toFixed(1)}
                      L
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating Financial Progress...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated Successfully!
                </>
              ) : (
                <>
                  <IndianRupeeIcon className="h-4 w-4 mr-2" />
                  Update Financial Progress
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
          {!hasAmountChange && !isSubmitting && (
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
