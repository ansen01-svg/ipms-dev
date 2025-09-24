"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_FILES_PER_UPDATE,
  MAX_FILE_SIZE,
  QUERY_STATUSES,
  RaisedQuery,
  UpdateQueryRequest,
} from "@/types/query.types";
import { updateQuery as updateArchiveQuery } from "@/utils/archive-projects/queries";
import {
  formatFileSize,
  getCategoryColor,
  getFileTypeIcon,
  getPriorityColor,
  getStatusColor,
  updateQuery as updateProjectQuery,
  validateQueryFiles,
} from "@/utils/projects/queries";
import {
  AlertCircle,
  AlertTriangle,
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Info,
  Paperclip,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface UpdateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: RaisedQuery;
  onUpdateSuccess: () => void;
  isProject: boolean;
}

export default function UpdateQueryModal({
  isOpen,
  onClose,
  query,
  onUpdateSuccess,
  isProject,
}: UpdateQueryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateQueryRequest>(() => ({
    status: query.status || "Open",
    queryResponse: query.queryResponse || "",
    attachments: [],
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0); // For resetting file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form field changes with useCallback
  const handleFieldChange = useCallback(
    (field: keyof UpdateQueryRequest, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (files.length === 0) return;

      // Validate files
      const validation = validateQueryFiles(files);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, files: validation.errors.join(", ") }));
        return;
      }

      // Check total file count including existing files
      const currentFileCount = formData.attachments?.length || 0;
      if (currentFileCount + files.length > MAX_FILES_PER_UPDATE) {
        setErrors((prev) => ({
          ...prev,
          files: `Maximum ${MAX_FILES_PER_UPDATE} files allowed. You already have ${currentFileCount} file(s) selected.`,
        }));
        return;
      }

      // Clear file errors and add files
      setErrors((prev) => ({ ...prev, files: "" }));
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...files],
      }));

      // Reset file input
      setFileInputKey((prev) => prev + 1);
    },
    [formData.attachments]
  );

  // Remove file from selection
  const handleFileRemove = useCallback((indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments:
        prev.attachments?.filter((_, index) => index !== indexToRemove) || [],
    }));
  }, []);

  // Handle file input button click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create update object with only editable fields that have changed
    const updateData: UpdateQueryRequest = {};

    if (formData.status !== query.status) {
      updateData.status = formData.status;
    }
    if (formData.queryResponse !== (query.queryResponse || "")) {
      updateData.queryResponse = formData.queryResponse;
    }
    if (formData.attachments && formData.attachments.length > 0) {
      updateData.attachments = formData.attachments;
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      toast.error("No changes detected");
      return;
    }

    // Validate only the editable fields
    const validationErrors: Record<string, string> = {};

    if (
      updateData.queryResponse &&
      updateData.queryResponse.trim().length > 2000
    ) {
      validationErrors.queryResponse =
        "Query response cannot exceed 2000 characters";
    }

    if (
      updateData.internalRemarks &&
      updateData.internalRemarks.trim().length > 1000
    ) {
      validationErrors.internalRemarks =
        "Internal remarks cannot exceed 1000 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      let response;
      if (isProject) {
        response = await updateProjectQuery(query.queryId, updateData);
      } else {
        response = await updateArchiveQuery(query.queryId, updateData);
      }

      setShowSuccess(true);

      // Show success message with file upload info
      let successMessage = "Query updated successfully";
      if (
        response.data.fileUploadSummary &&
        response.data.fileUploadSummary.totalFilesUploaded > 0
      ) {
        successMessage += ` with ${response.data.fileUploadSummary.totalFilesUploaded} file(s) uploaded`;
      }

      // Wait a bit before closing to show success state
      setTimeout(() => {
        onUpdateSuccess();
        toast.success(successMessage);
      }, 1500);
    } catch (error) {
      console.error("Error updating query:", error);
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to update query",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if query is overdue
  const isOverdue =
    new Date(query.expectedResolutionDate) < new Date() &&
    !["Resolved", "Closed"].includes(query.status);

  // Check if there are changes
  const hasChanges =
    formData.status !== query.status ||
    formData.queryResponse !== (query.queryResponse || "") ||
    (formData.internalRemarks && formData.internalRemarks.trim()) ||
    (formData.attachments && formData.attachments.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Query Status & Response
            </CardTitle>
            <p className="text-teal-100 mt-1 text-sm">
              {query.queryId} - Update status, response, and attach files
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            disabled={loading}
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
                  Query Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  The query status, response, and attachments have been saved.
                </p>
              </div>
            </div>
          )}

          {/* Query Overview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Query Overview
            </h4>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <Badge
                className={`text-xs font-medium ${getStatusColor(
                  query.status
                )}`}
              >
                Current: {query.status}
              </Badge>
              <Badge
                className={`text-xs font-medium ${getPriorityColor(
                  query.priority
                )}`}
              >
                {query.priority}
              </Badge>
              <Badge
                className={`text-xs font-medium ${getCategoryColor(
                  query.queryCategory
                )}`}
              >
                {query.queryCategory}
              </Badge>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-800 border-red-300 text-xs font-medium">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
              {query.totalAttachments && query.totalAttachments > 0 && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs font-medium">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {query.totalAttachments} attachment(s)
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-700">Raised by:</span>
                  <span className="ml-2 text-gray-600">{query.raisedBy}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-700">Raised on:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(query.raisedDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-700">
                    Escalation Level:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {query.escalationLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Attachments */}
          {query.attachments && query.attachments.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Existing Attachments ({query.attachments.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {query.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-md"
                  >
                    <span className="text-lg">
                      {getFileTypeIcon(attachment.mimeType)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900 truncate">
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-blue-700">
                        {formatFileSize(attachment.fileSize)} •
                        {new Date(attachment.uploadedAt).toLocaleDateString()} •
                        {attachment.uploadedBy.userName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={() =>
                        window.open(attachment.downloadURL, "_blank")
                      }
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Read-only Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  Query Information (Read-only)
                </h4>

                {/* Query Title - Read Only */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Query Title
                  </Label>
                  <div className="p-3 bg-gray-50 border rounded-md text-gray-900 text-sm">
                    {query.queryTitle}
                  </div>
                </div>

                {/* Query Description - Read Only */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Query Description
                  </Label>
                  <div className="p-3 bg-gray-50 border rounded-md text-gray-900 min-h-[100px] text-sm">
                    {query.queryDescription}
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Assigned To
                    </Label>
                    <div className="p-3 bg-gray-50 border rounded-md text-gray-900 text-sm">
                      {query.assignedTo || "Not assigned"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Expected Resolution
                    </Label>
                    <div
                      className={`p-3 bg-gray-50 border rounded-md text-sm ${
                        isOverdue ? "text-red-600 font-medium" : "text-gray-900"
                      }`}
                    >
                      {new Date(
                        query.expectedResolutionDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Editable Fields */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  Update Query (Editable)
                </h4>

                {/* Status - Editable */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status || "Open"}
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUERY_STATUSES.filter((status) => {
                        // If current status is "In Progress", don't allow going back to "Open"
                        if (
                          query.status === "In Progress" &&
                          status.value === "Open"
                        ) {
                          return false;
                        }
                        return true;
                      }).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            {status.value === "Resolved" ||
                            status.value === "Closed" ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : status.value === "Escalated" ? (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-gray-600" />
                            )}
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.status}
                    </div>
                  )}
                </div>

                {/* Query Response - Editable */}
                <div className="space-y-2">
                  <Label htmlFor="queryResponse">Query Response</Label>
                  <Textarea
                    id="queryResponse"
                    value={formData.queryResponse}
                    onChange={(e) =>
                      handleFieldChange("queryResponse", e.target.value)
                    }
                    placeholder="Enter response to the query"
                    rows={4}
                    maxLength={2000}
                    className={`border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none ${
                      errors.queryResponse ? "border-red-500 bg-red-50" : ""
                    }`}
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-red-500">
                    <span>
                      Adding a response will automatically mark the query as
                      resolved
                    </span>
                    <span>{formData.queryResponse?.length || 0}/2000</span>
                  </div>
                  {errors.queryResponse && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.queryResponse}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4 mt-6 border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-teal-600" />
                Add Attachments (Optional)
              </h4>

              {/* File Upload Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    key={fileInputKey}
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileInputClick}
                    className="border-teal-300 text-teal-700 hover:bg-teal-50"
                    disabled={
                      loading ||
                      (formData.attachments?.length || 0) >=
                        MAX_FILES_PER_UPDATE
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <div className="text-sm text-gray-600">
                    Max {MAX_FILES_PER_UPDATE} files,{" "}
                    {formatFileSize(MAX_FILE_SIZE)} each
                  </div>
                </div>

                {/* File Validation Errors */}
                {errors.files && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.files}
                  </div>
                )}

                {/* Selected Files Preview */}
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Selected Files ({formData.attachments.length}/
                      {MAX_FILES_PER_UPDATE})
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-md"
                        >
                          <span className="text-lg">
                            {getFileTypeIcon(file.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-teal-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-teal-700">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFileRemove(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-xs text-yellow-800 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                      <span>
                        Supported: Images (JPG, PNG, WebP), Documents (PDF)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                      <span>
                        Files will be uploaded to secure cloud storage
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                      <span>Attachments cannot be removed after upload</span>
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
                type="submit"
                disabled={loading || !hasChanges}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Updating Query...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Updated Successfully!
                  </>
                ) : (
                  <>
                    Update Query
                    {formData.attachments &&
                      formData.attachments.length > 0 && (
                        <span className="ml-1 text-xs">
                          (+{formData.attachments.length} file
                          {formData.attachments.length !== 1 ? "s" : ""})
                        </span>
                      )}
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={loading}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>

            {/* Submit Button Info */}
            {!hasChanges && !loading && (
              <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                Make changes to status, response, or add files to enable update
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
