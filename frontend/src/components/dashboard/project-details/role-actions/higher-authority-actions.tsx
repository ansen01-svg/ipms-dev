"use client";

import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import { DbProject } from "@/types/projects.types";
import { PROJECT_STATUSES } from "@/utils/project-details/constants";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RaisedQueryModal, {
  QueryFormData,
} from "../../archive-project-details/raisedQueryModal";
import { StatusUpdateModal } from "../status-update-modal";

interface HigherAuthorityActionsProps {
  project: DbProject;
  role: string;
  onProjectUpdate?: () => void;
}

type ProjectStatus =
  | "Submitted for Approval"
  | "Resubmitted for Approval"
  | "Rejected by AEE"
  | "Rejected by CE"
  | "Rejected by MD"
  | "Ongoing"
  | "Completed";

export const getRoleLabel = (role: string) => {
  switch (role) {
    case "AEE":
      return "Assistant Executive Engineer";
    case "JE":
      return "Junior Engineer";
    case "CE":
      return "Chief Engineer";
    case "MD":
      return "Managing Director";
    case "VIEWER":
      return "Viewer";
    case "ADMIN":
      return "Admin";
    default:
      return "User";
  }
};

export function HigherAuthorityActions({
  project,
  role,
  onProjectUpdate,
}: HigherAuthorityActionsProps) {
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>(
    project.status as ProjectStatus
  );
  const [hasStatusChanged, setHasStatusChanged] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local status when project prop changes
  useEffect(() => {
    setCurrentStatus(project.status as ProjectStatus);
    setHasStatusChanged(false);
  }, [project.status]);

  const handleAction = (action: "approve" | "reject") => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleStatusUpdate = (newStatus: string) => {
    // Update local status state immediately
    setCurrentStatus(newStatus as ProjectStatus);
    setHasStatusChanged(true);

    // Call parent callback to refresh project data
    if (onProjectUpdate) {
      onProjectUpdate();
    }
  };

  const handleQuerySubmit = async (formData: QueryFormData) => {
    setIsSubmitting(true);
    const token = getAuthToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/project/${project._id}/queries`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${project._id}/queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            queryTitle: formData.queryTitle,
            queryDescription: formData.queryDescription,
            queryCategory: formData.queryCategory,
            priority: formData.priority,
            expectedResolutionDate: formData.expectedResolutionDate,
            assignedTo: formData.assignedTo || undefined,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Query raised successfully!");
        return { success: true };
      } else {
        toast.error(
          result.message || "Failed to raise query. Please try again."
        );
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error raising query:", error);
      toast.error("Network error. Please check your connection and try again.");
      return { success: false, message: "Network error occurred" };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current user can approve/reject based on current status
  const canApprove =
    (currentStatus === PROJECT_STATUSES.SUBMITTED_FOR_APPROVAL ||
      currentStatus === PROJECT_STATUSES.RESUBMITTED_FOR_APPROVAL) &&
    ["AEE", "CE", "MD"].includes(role) &&
    !hasStatusChanged;

  // Check if user has authority for status updates
  const hasStatusAuthority = ["AEE", "CE", "MD"].includes(role);

  if (!hasStatusAuthority) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">
            {getRoleLabel(role)} View
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            You have view-only access to this project.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            💡 Current Status: {currentStatus}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h4 className="font-medium text-green-900 mb-2">
            {getRoleLabel(role)} Actions
          </h4>
          <p className="text-sm text-green-700 mb-4">
            Review and approve projects for technical compliance
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleAction("approve")}
              disabled={!canApprove}
              className={`flex items-center gap-2 ${
                canApprove
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-600 opacity-50 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {hasStatusChanged && currentStatus === "Ongoing"
                ? "Approved"
                : "Approve"}
            </Button>

            <Button
              onClick={() => handleAction("reject")}
              disabled={!canApprove}
              className={`flex items-center gap-2 ${
                canApprove
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-600 opacity-50 cursor-not-allowed text-white"
              }`}
            >
              <XCircle className="h-4 w-4" />
              {hasStatusChanged && currentStatus.includes("Rejected")
                ? "Rejected"
                : "Reject"}
            </Button>

            <Button
              onClick={() => setIsQueryModalOpen(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">
                {isSubmitting ? "Submitting..." : "Raise Query"}
              </span>
            </Button>
          </div>

          <div className="mt-3 text-xs text-green-600">
            💡 Current Status: {currentStatus} -{" "}
            {canApprove
              ? "Ready for approval"
              : hasStatusChanged
              ? "Status updated"
              : "Not in approval stage"}
          </div>

          {/* Additional status information */}
          {!canApprove && hasStatusAuthority && !hasStatusChanged && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              {`⚠️ This project can only be approved when status is "Submitted for
              Approval" or "Resubmitted for Approval"`}
            </div>
          )}

          {/* Status change confirmation */}
          {hasStatusChanged && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
              {`✅ Status successfully updated to "${currentStatus}"`}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        project={project}
        role={role}
        action={modalAction}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Raised Query Modal */}
      <RaisedQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSubmit={handleQuerySubmit}
        isLoading={isSubmitting}
        title="Raise Query"
        subtitle="Submit a new query for this project"
      />
    </>
  );
}
