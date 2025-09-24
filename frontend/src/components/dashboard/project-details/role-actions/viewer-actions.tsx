"use client";

import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import { DbProject } from "@/types/projects.types";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RaisedQueryModal, {
  QueryFormData,
} from "../../archive-project-details/raisedQueryModal";
import { getRoleLabel } from "./higher-authority-actions";

interface ViewerActionsProps {
  project: DbProject;
  role: string;
}

export function ViewerActions({ project, role }: ViewerActionsProps) {
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          {getRoleLabel(role)} Actions
        </h4>
        <p className="text-sm text-gray-700 mb-4">
          View-only access for transparency and public oversight
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
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

        <div className="mt-3 text-xs text-gray-600">
          💡 Read-only access - No modification permissions
        </div>
      </div>

      {/* Raised Query Modal */}
      <RaisedQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSubmit={handleQuerySubmit}
        isLoading={isSubmitting}
        title="Raise Query"
        subtitle="Submit a new query for this project"
      />
    </div>
  );
}
