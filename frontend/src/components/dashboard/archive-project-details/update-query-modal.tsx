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
  QUERY_STATUSES,
  RaisedQuery,
  UpdateQueryRequest,
} from "@/types/query.types";
import {
  getCategoryColor,
  getPriorityColor,
  getStatusColor,
  updateQuery,
} from "@/utils/archive-projects/queries";
import {
  AlertCircle,
  AlertTriangle,
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Info,
  User,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UpdateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: RaisedQuery;
  onUpdateSuccess: () => void;
}

export default function UpdateQueryModal({
  isOpen,
  onClose,
  query,
  onUpdateSuccess,
}: UpdateQueryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateQueryRequest>(() => ({
    status: query.status || "Open",
    queryResponse: query.queryResponse || "",
    internalRemarks: "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle form field changes with useCallback
  const handleFieldChange = useCallback(
    (field: "status" | "queryResponse" | "internalRemarks", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

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
    if (formData.internalRemarks && formData.internalRemarks.trim()) {
      updateData.internalRemarks = formData.internalRemarks;
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
      await updateQuery(query.queryId, updateData);

      setShowSuccess(true);

      // Wait a bit before closing to show success state
      setTimeout(() => {
        onUpdateSuccess();
        toast.success("Query updated successfully");
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
    (formData.internalRemarks && formData.internalRemarks.trim());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <div>
            <CardTitle className="text-xl font-semibold">
              Update Query Status & Response
            </CardTitle>
            <p className="text-teal-100 mt-1 text-sm">
              {query.queryId} - Only status and response can be modified
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
                  The query status and response have been saved.
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
                      {QUERY_STATUSES.map((status) => (
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
                  <div className="flex justify-between text-xs text-gray-500">
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

                {/* Internal Remarks - Editable */}
                <div className="space-y-2">
                  <Label htmlFor="internalRemarks">
                    Internal Remarks (Add New)
                  </Label>
                  <Textarea
                    id="internalRemarks"
                    value={formData.internalRemarks}
                    onChange={(e) =>
                      handleFieldChange("internalRemarks", e.target.value)
                    }
                    placeholder="Add internal remarks about this update"
                    rows={3}
                    maxLength={1000}
                    className={`border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none ${
                      errors.internalRemarks ? "border-red-500 bg-red-50" : ""
                    }`}
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>These remarks will be appended with timestamp</span>
                    <span>{formData.internalRemarks?.length || 0}/1000</span>
                  </div>
                  {errors.internalRemarks && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.internalRemarks}
                    </div>
                  )}
                </div>

                {/* Update Rules Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Query Update Rules
                  </h5>
                  <div className="space-y-2 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>
                        Only status and response fields can be modified
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>
                        Adding a response automatically resolves the query
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Internal remarks are appended with timestamp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Only Junior Engineers can update queries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Internal Remarks (Read-only) */}
            {query.internalRemarks && (
              <div className="space-y-2 mt-6">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Existing Internal Remarks
                </Label>
                <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">
                    {query.internalRemarks}
                  </pre>
                </div>
              </div>
            )}

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
                  "Update Query"
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
                Make changes to the status or response to enable update
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
