"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DbProject } from "@/types/projects.types";
import { AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react";
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

  const getActionDetails = () => {
    if (action === "approve") {
      return {
        title: "Approve Project",
        description: `You are about to approve this project. The status will be changed to "Ongoing".`,
        icon: <CheckCircle className="h-6 w-6 text-green-600" />,
        buttonClass: "bg-green-600 hover:bg-green-700",
        newStatus: "Ongoing",
        buttonText: "Approve Project",
      };
    } else {
      return {
        title: "Reject Project",
        description: `You are about to reject this project. Please provide a detailed reason for rejection.`,
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        buttonClass: "bg-red-600 hover:bg-red-700",
        newStatus: `Rejected by ${role}`,
        buttonText: "Reject Project",
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

      // Success - show success toast
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

      // Reset form
      setRemarks("");
      setRejectionReason("");

      // Notify parent component to refresh data
      onStatusUpdate(actionDetails.newStatus);

      // Close modal
      onClose();
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
      onClose();
    }
  };

  if (!action) return null;

  const actionDetails = getActionDetails();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {actionDetails.icon}
            {actionDetails.title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {actionDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Information Card */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-3">
              Project Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Project ID:</span>
                <span className="text-gray-900">{project.projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  Current Status:
                </span>
                <span className="text-gray-900 font-medium">
                  {project.status}
                </span>
              </div>
              <div className="col-span-full">
                <span className="text-gray-600 font-medium">Project Name:</span>
                <div className="text-gray-900 mt-1">{project.projectName}</div>
              </div>
            </div>
          </div>

          {/* Status Change Preview */}
          <div
            className={`p-4 rounded-lg border ${
              action === "approve"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                action === "approve" ? "text-green-900" : "text-red-900"
              }`}
            >
              Status Change Preview
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">From:</span>
              <span className="px-2 py-1 bg-gray-200 rounded text-gray-800 font-medium">
                {project.status}
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-2 py-1 rounded font-medium ${
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
            <Label htmlFor="remarks" className="text-sm font-medium">
              Remarks {action === "approve" ? "(Optional)" : "(Optional)"}
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
              className="min-h-[80px] resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {remarks.length}/500 characters
            </div>
          </div>

          {/* Rejection Reason Field (only for rejections) */}
          {action === "reject" && (
            <div className="space-y-2">
              <Label
                htmlFor="rejectionReason"
                className="text-sm font-medium text-red-700"
              >
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Provide a detailed reason for rejecting this project. This will help the submitter understand what needs to be corrected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                maxLength={1000}
                className="min-h-[120px] resize-none border-red-200 focus:border-red-400 focus:ring-red-400"
                required
              />
              <div className="text-xs text-gray-500 text-right">
                {rejectionReason.length}/1000 characters (minimum 10 required)
              </div>
              {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                <div className="text-xs text-red-600">
                  Please provide at least {10 - rejectionReason.length} more
                  characters
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-red-800 font-medium text-sm">Error</div>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning for rejection */}
          {action === "reject" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-amber-800 font-medium text-sm">
                    Important
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Rejecting this project will require the submitter to address
                    your concerns and resubmit for approval. Please provide
                    clear, actionable feedback.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={`${actionDetails.buttonClass} min-w-[140px]`}
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (action === "reject" && rejectionReason.length < 10)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {action === "approve" ? "Approving..." : "Rejecting..."}
              </>
            ) : (
              <>
                {actionDetails.icon}
                {actionDetails.buttonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
