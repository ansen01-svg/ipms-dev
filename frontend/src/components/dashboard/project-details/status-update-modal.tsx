"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DbProject } from "@/types/projects.types";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StatusUpdateModalProps {
  project: DbProject;
  role: string;
  action: "approve" | "reject" | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (newStatus: string) => void;
}

export function StatusUpdateModal({
  project,
  role,
  action,
  isOpen,
  onClose,
  onStatusUpdate,
}: StatusUpdateModalProps) {
  const [remarks, setRemarks] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getActionDetails = () => {
    if (action === "approve") {
      return {
        title: "Approve Project",
        description: `You are about to approve this project. The status will be changed to "Ongoing".`,
        icon: <CheckCircle className="h-6 w-6 text-green-600" />,
        buttonClass: "bg-green-600 hover:bg-green-700",
        newStatus: "Ongoing",
        buttonText: "Approve Project",
        headerColor: "from-green-500 to-green-600",
      };
    } else {
      return {
        title: "Reject Project",
        description: `You are about to reject this project. Please provide a detailed reason for rejection.`,
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        buttonClass: "bg-red-600 hover:bg-red-700",
        newStatus: `Rejected by ${role}`,
        buttonText: "Reject Project",
        headerColor: "from-red-500 to-red-600",
      };
    }
  };

  const validateForm = () => {
    if (action === "reject") {
      if (!rejectionReason.trim()) {
        setError("Rejection reason is required when rejecting a project.");
        return false;
      }
      if (rejectionReason.trim().length < 10) {
        setError("Rejection reason must be at least 10 characters long.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!action || !validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const actionDetails = getActionDetails();

      // Import and use the API utility function
      const { updateProjectStatus } = await import(
        "@/utils/projects/project-status"
      );

      // API call to update project status using the utility function
      const result = await updateProjectStatus(project._id as string, {
        newStatus: actionDetails.newStatus,
        remarks: remarks.trim() || undefined,
        rejectionReason:
          action === "reject" ? rejectionReason.trim() : undefined,
      });

      // Success - show success state
      setShowSuccess(true);
      console.log("Status updated successfully:", result);

      toast.success(
        `Project ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`,
        {
          description: `Status changed from "${result.data.project.previousStatus}" to "${result.data.project.currentStatus}"`,
          duration: 4000,
        }
      );

      // Wait a bit before closing to show success state
      setTimeout(() => {
        // Reset form
        setRemarks("");
        setRejectionReason("");
        setError(null);

        // Notify parent component to refresh data
        onStatusUpdate(actionDetails.newStatus);

        // Close modal
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating project status:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRemarks("");
      setRejectionReason("");
      setError(null);
      setShowSuccess(false);
      onClose();
    }
  };

  if (!action || !isOpen) return null;

  const actionDetails = getActionDetails();
  const isFormValid =
    action === "approve" ||
    (action === "reject" && rejectionReason.length >= 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader
          className={`flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r ${actionDetails.headerColor} text-white`}
        >
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              {actionDetails.icon}
              {actionDetails.title}
            </CardTitle>
            <p className="text-white/90 mt-1 text-sm">
              {actionDetails.description}
            </p>
          </div>
          <Button
            onClick={handleClose}
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
                  Status Updated Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  The project status has been updated.
                </p>
              </div>
            </div>
          )}

          {/* Project Information Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Project Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project ID:</span>
                <div className="font-semibold text-lg text-gray-900">
                  {project.projectId}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Current Status:</span>
                <div className="font-medium text-gray-900">
                  {project.status}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Progress:</span>
                <div className="font-medium text-gray-900">
                  {project.progressPercentage || 0}%
                </div>
              </div>
              <div className="col-span-full">
                <span className="text-gray-600">Project Name:</span>
                <div className="font-medium text-gray-900 mt-1">
                  {project.projectName}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Status Change Preview */}
              <div
                className={`p-4 rounded-lg border ${
                  action === "approve"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <h4
                  className={`font-semibold mb-3 ${
                    action === "approve" ? "text-green-900" : "text-red-900"
                  }`}
                >
                  Status Change Preview
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-800 font-medium">
                    {project.status}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${
                      action === "approve"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {actionDetails.newStatus}
                  </span>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remarks (Optional)
                </Label>
                <Textarea
                  id="remarks"
                  placeholder={
                    action === "approve"
                      ? "Add any additional comments about the approval..."
                      : "Add any additional comments..."
                  }
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 text-right">
                  {remarks.length}/500 characters
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Rejection Reason Field (only for rejections) */}
              {action === "reject" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="rejectionReason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Provide a detailed reason for rejecting this project. This will help the submitter understand what needs to be corrected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    maxLength={1000}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                      rejectionReason.length > 0 && rejectionReason.length < 10
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {rejectionReason.length}/1000 characters (minimum 10
                    required)
                  </div>
                  {rejectionReason.length > 0 &&
                    rejectionReason.length < 10 && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        Please provide at least {10 -
                          rejectionReason.length}{" "}
                        more characters
                      </div>
                    )}
                </div>
              )}

              {/* Warning/Info Box */}
              <div
                className={`rounded-lg p-4 ${
                  action === "reject"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <h5
                  className={`text-sm font-medium mb-3 ${
                    action === "reject" ? "text-amber-900" : "text-blue-900"
                  }`}
                >
                  {action === "reject"
                    ? "Important Notice"
                    : "Approval Guidelines"}
                </h5>
                <div
                  className={`space-y-2 text-xs ${
                    action === "reject" ? "text-amber-700" : "text-blue-700"
                  }`}
                >
                  {action === "reject" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>
                          Rejecting requires the submitter to address concerns
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>Provide clear, actionable feedback</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>Project will need to be resubmitted</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{`Approval will change status to "Ongoing"`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Project team will be notified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Progress tracking will begin</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Update Failed
                </p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`flex-1 ${actionDetails.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {action === "approve" ? "Approving..." : "Rejecting..."}
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated Successfully!
                </>
              ) : (
                <>
                  {action === "approve" ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {actionDetails.buttonText}
                </>
              )}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {action === "reject" &&
            rejectionReason.length < 10 &&
            !isSubmitting && (
              <div className="text-xs text-gray-500 text-center bg-gray-50 rounded p-2">
                <Info className="h-3 w-3 inline mr-1" />
                Provide at least 10 characters for rejection reason to enable
                submit
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
