"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  DollarSign,
  Info,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface CombinedProgressUpdateRequest {
  progress?: number;
  newBillAmount?: number;
  remarks?: string;
  billDetails?: {
    billNumber?: string;
    billDate?: string;
    billDescription?: string;
  };
  supportingFiles?: File[];
}

interface CombinedProgressUpdateResponse {
  success: boolean;
  message: string;
  data: {
    project: DbProject;
    updatesApplied: string[];
    filesUploaded: {
      count: number;
      totalSize: number;
    };
  };
  metadata: {
    updatedAt: string;
    updatedBy: unknown;
    isFullyComplete: boolean;
  };
}

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  maxFiles?: number;
}

function FileUploadZone({
  files,
  onFilesChange,
  error,
  maxFiles = 10,
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
    const totalFiles = files.length + newFiles.length;
    const filesToAdd =
      totalFiles > maxFiles
        ? newFiles.slice(0, maxFiles - files.length)
        : newFiles;

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
    }
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
            ? "border-purple-400 bg-purple-50"
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
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          validateAndAddFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("combined-file-input")?.click()}
      >
        <div className="flex justify-center gap-2 mb-2">
          <BarChart3 className="h-6 w-6 text-teal-500" />
          <DollarSign className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {dragActive
            ? "Drop files here"
            : "Drag files here or click to upload"}
        </p>
        <p className="text-xs text-gray-500">
          PDF, Word, Excel, Images (Max 10MB per file, {maxFiles} files max)
        </p>
        <input
          id="combined-file-input"
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

interface CombinedProgressIndicatorProps {
  currentPhysical: number;
  targetPhysical?: number;
  currentBillAmount: number;
  targetBillAmount?: number;
  totalBudget: number;
  className?: string;
}

function CombinedProgressIndicator({
  currentPhysical,
  targetPhysical = currentPhysical,
  currentBillAmount,
  targetBillAmount = currentBillAmount,
  totalBudget,
  className = "",
}: CombinedProgressIndicatorProps) {
  const currentFinancialPercentage =
    totalBudget > 0 ? (currentBillAmount / totalBudget) * 100 : 0;
  const targetFinancialPercentage =
    totalBudget > 0 ? (targetBillAmount / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Physical Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-teal-600 font-medium flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Physical Progress
          </span>
          <span className="text-teal-600">
            {currentPhysical}% → {targetPhysical}%
            {targetPhysical !== currentPhysical && (
              <span
                className={
                  targetPhysical > currentPhysical
                    ? "text-green-600 ml-1"
                    : "text-orange-600 ml-1"
                }
              >
                ({targetPhysical > currentPhysical ? "+" : ""}
                {(targetPhysical - currentPhysical).toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentPhysical}%` }}
            />
          </div>
          {targetPhysical !== currentPhysical && (
            <div
              className="absolute top-0 h-3 w-1 bg-green-500 transition-all duration-500"
              style={{ left: `${Math.min(targetPhysical, 100)}%` }}
            />
          )}
        </div>
      </div>

      {/* Financial Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-600 font-medium flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Financial Progress
          </span>
          <span className="text-blue-600">
            {formatCurrency(currentBillAmount)} →{" "}
            {formatCurrency(targetBillAmount)}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(currentFinancialPercentage, 100)}%` }}
            />
          </div>
          {targetBillAmount !== currentBillAmount && (
            <div
              className="absolute top-0 h-3 w-1 bg-green-500 transition-all duration-500"
              style={{ left: `${Math.min(targetFinancialPercentage, 100)}%` }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Current: {currentFinancialPercentage.toFixed(1)}%</span>
          <span>Target: {targetFinancialPercentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* Progress Alignment */}
      <div className="bg-gray-50 rounded p-3">
        <div className="text-xs text-gray-600 mb-1">Progress Alignment</div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Gap:</span>
          <span
            className={`text-xs font-medium ${
              Math.abs(targetPhysical - targetFinancialPercentage) <= 10
                ? "text-green-600"
                : "text-orange-600"
            }`}
          >
            {Math.abs(targetPhysical - targetFinancialPercentage).toFixed(1)}%
            {Math.abs(targetPhysical - targetFinancialPercentage) <= 10
              ? " (Aligned)"
              : " (Gap)"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CombinedProgressUpdateModalProps {
  project: DbProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: DbProject) => void;
}

export function CombinedProgressUpdateModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: CombinedProgressUpdateModalProps) {
  const [formData, setFormData] = useState<CombinedProgressUpdateRequest>({
    progress: project.progressPercentage || 0,
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
  const [activeUpdates, setActiveUpdates] = useState<{
    physical: boolean;
    financial: boolean;
  }>({ physical: false, financial: false });

  // Get current values
  const currentBillAmount = (project as DbProject).billSubmittedAmount || 0;
  const currentFinancialProgress =
    (project as DbProject).financialProgress || 0;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        progress: project.progressPercentage || 0,
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
      setActiveUpdates({ physical: false, financial: false });
    }
  }, [isOpen, project.progressPercentage, currentBillAmount]);

  const validateCombinedUpdate = useCallback(() => {
    const validationErrors: Record<string, string> = {};

    // Only validate if updates are active
    if (!activeUpdates.physical && !activeUpdates.financial) {
      validationErrors.general =
        "Please enable at least one update type (Physical or Financial)";
    }

    // Physical progress validation
    if (activeUpdates.physical) {
      const currentProgress = project.progressPercentage || 0;

      if (formData.progress! < 0 || formData.progress! > 100) {
        validationErrors.progress = "Progress must be between 0 and 100";
      }

      const progressDiff = formData.progress! - currentProgress;
      if (progressDiff < -5) {
        validationErrors.progress = "Cannot decrease progress by more than 5%";
      }
      if (progressDiff > 50) {
        validationErrors.progress =
          "Cannot increase progress by more than 50% in one update";
      }
    }

    // Financial progress validation
    if (activeUpdates.financial) {
      if (formData.newBillAmount! < 0) {
        validationErrors.newBillAmount = "Bill amount cannot be negative";
      }
      if (formData.newBillAmount! > project.estimatedCost) {
        validationErrors.newBillAmount =
          "Bill amount cannot exceed estimated cost";
      }

      const amountDifference = formData.newBillAmount! - currentBillAmount;
      if (amountDifference < 0) {
        const decreasePercentage =
          Math.abs(amountDifference / project.estimatedCost) * 100;
        if (decreasePercentage > 5) {
          validationErrors.newBillAmount =
            "Cannot decrease bill amount by more than 5% of estimated cost";
        }
      }

      const increasePercentage =
        (amountDifference / project.estimatedCost) * 100;
      if (increasePercentage > 50) {
        validationErrors.newBillAmount =
          "Cannot increase bill amount by more than 50% of estimated cost";
      }
    }

    // Completion requirements
    const physicalComplete =
      activeUpdates.physical && formData.progress === 100;
    const financialComplete =
      activeUpdates.financial &&
      project.estimatedCost > 0 &&
      (formData.newBillAmount! / project.estimatedCost) * 100 === 100;

    if ((physicalComplete || financialComplete) && files.length === 0) {
      validationErrors.files =
        "Completion (100% progress) requires at least one supporting document";
    }

    if (financialComplete && !formData.billDetails?.billNumber) {
      validationErrors.billNumber =
        "Bill number is required when completing financial progress";
    }

    return validationErrors;
  }, [formData, files.length, activeUpdates, project, currentBillAmount]);

  const handleValidation = () => {
    const validationErrors = validateCombinedUpdate();
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const updateCombinedProgress = async (
    projectId: string,
    combinedData: CombinedProgressUpdateRequest
  ): Promise<CombinedProgressUpdateResponse> => {
    const formData = new FormData();

    if (activeUpdates.physical && combinedData.progress !== undefined) {
      formData.append("progress", combinedData.progress.toString());
    }

    if (activeUpdates.financial && combinedData.newBillAmount !== undefined) {
      formData.append("newBillAmount", combinedData.newBillAmount.toString());
    }

    if (combinedData.remarks) {
      formData.append("remarks", combinedData.remarks);
    }

    if (combinedData.billDetails) {
      formData.append("billDetails", JSON.stringify(combinedData.billDetails));
    }

    if (combinedData.supportingFiles) {
      combinedData.supportingFiles.forEach((file) => {
        formData.append("supportingFiles", file);
      });
    }

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${projectId}/progress/combined`,
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
      const response = await updateCombinedProgress(project._id!, {
        ...formData,
        supportingFiles: files,
      });

      setShowSuccess(true);

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

  const hasChanges =
    (activeUpdates.physical &&
      Math.abs((formData.progress || 0) - (project.progressPercentage || 0)) >=
        0.1) ||
    (activeUpdates.financial &&
      Math.abs((formData.newBillAmount || 0) - currentBillAmount) >= 0.01);

  const currentErrors = validateCombinedUpdate();
  const isFormValid = Object.keys(currentErrors).length === 0 && hasChanges;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Combined Progress Update
            </CardTitle>
            <p className="text-purple-100 mt-1 text-sm">
              {project.projectName}
            </p>
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
                  Combined Progress Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  Both physical and financial progress have been updated.
                </p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-500" />
              Current Project Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Physical Progress:</span>
                <div className="font-semibold text-lg text-gray-900">
                  {project.progressPercentage || 0}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Bill Amount:</span>
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
            </div>
          </div>

          {/* Update Type Selectors */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-3">
              Select Update Types
            </h5>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeUpdates.physical}
                  onChange={(e) =>
                    setActiveUpdates((prev) => ({
                      ...prev,
                      physical: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <BarChart3 className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-700">
                  Physical Progress
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeUpdates.financial}
                  onChange={(e) =>
                    setActiveUpdates((prev) => ({
                      ...prev,
                      financial: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Financial Progress
                </span>
              </label>
            </div>
            {errors.general && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="h-4 w-4" />
                {errors.general}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Progress Inputs */}
            <div className="space-y-6">
              {/* Physical Progress */}
              {activeUpdates.physical && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-teal-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Physical Progress Update
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Progress Percentage
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.progress}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            progress: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.progress || currentErrors.progress
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter progress percentage"
                        disabled={isSubmitting}
                      />
                      {(errors.progress || currentErrors.progress) && (
                        <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.progress || currentErrors.progress}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Progress */}
              {activeUpdates.financial && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Progress Update
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Bill Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.newBillAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newBillAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.newBillAmount || currentErrors.newBillAmount
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter bill amount"
                        disabled={isSubmitting}
                      />
                      {(errors.newBillAmount ||
                        currentErrors.newBillAmount) && (
                        <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.newBillAmount || currentErrors.newBillAmount}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Bill Number
                        </label>
                        <input
                          type="text"
                          value={formData.billDetails?.billNumber || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              billDetails: {
                                ...prev.billDetails,
                                billNumber: e.target.value,
                              },
                            }))
                          }
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            errors.billNumber || currentErrors.billNumber
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Bill number"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Bill Date
                        </label>
                        <input
                          type="date"
                          value={formData.billDetails?.billDate || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              billDetails: {
                                ...prev.billDetails,
                                billDate: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    {(errors.billNumber || currentErrors.billNumber) && (
                      <div className="flex items-center gap-2 text-red-600 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        {errors.billNumber || currentErrors.billNumber}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combined Progress Preview */}
              {(activeUpdates.physical || activeUpdates.financial) &&
                hasChanges && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Progress Preview
                    </h5>
                    <CombinedProgressIndicator
                      currentPhysical={project.progressPercentage || 0}
                      targetPhysical={
                        activeUpdates.physical
                          ? formData.progress
                          : project.progressPercentage || 0
                      }
                      currentBillAmount={currentBillAmount}
                      targetBillAmount={
                        activeUpdates.financial
                          ? formData.newBillAmount || 0
                          : currentBillAmount
                      }
                      totalBudget={project.estimatedCost}
                    />
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Add any comments about this combined update..."
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
                  {((activeUpdates.physical && formData.progress === 100) ||
                    (activeUpdates.financial &&
                      project.estimatedCost > 0 &&
                      ((formData.newBillAmount || 0) / project.estimatedCost) *
                        100 ===
                        100)) && (
                    <span className="text-red-500 ml-1">
                      * Required for completion
                    </span>
                  )}
                </label>
                <FileUploadZone
                  files={files}
                  onFilesChange={setFiles}
                  error={errors.files || currentErrors.files}
                  maxFiles={15}
                />
              </div>

              {/* Combined Rules */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-purple-900 mb-3">
                  Combined Update Rules
                </h5>
                <div className="space-y-2 text-xs text-purple-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>At least one update type must be enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Maximum 5% decrease allowed for corrections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Maximum 50% increase per single update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Completion (100%) requires documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Financial completion requires bill number</span>
                  </div>
                </div>
              </div>

              {/* Progress Alignment Info */}
              {activeUpdates.physical && activeUpdates.financial && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Progress Alignment
                  </h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Keeping physical and financial progress aligned is
                      recommended for project health.
                    </div>
                    <div>Gaps larger than 10% may indicate project issues.</div>
                  </div>
                </div>
              )}
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating Combined Progress...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated Successfully!
                </>
              ) : (
                "Update Combined Progress"
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
          {(!hasChanges ||
            (!activeUpdates.physical && !activeUpdates.financial)) &&
            !isSubmitting && (
              <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2">
                <Info className="h-3 w-3 inline mr-1" />
                {!activeUpdates.physical && !activeUpdates.financial
                  ? "Select at least one update type to enable submission"
                  : "Make changes to progress values to enable update"}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
