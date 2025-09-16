import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import { AlertCircle, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RaisedQueryModal, { QueryFormData } from "../raisedQueryModal";

interface ViewerActionsProps {
  projectId: string;
  projectName?: string;
}

function ViewerActions({ projectId }: ViewerActionsProps) {
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuerySubmit = async (formData: QueryFormData) => {
    setIsSubmitting(true);
    const token = getAuthToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/archive-project/${projectId}/queries`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/queries`,
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

  return (
    <div className="space-y-4">
      {/* Viewer Access Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="font-medium text-gray-900">Viewer Access</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You have read-only access to this archive project. You can view all
          project details and raise queries for clarification.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
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
      </div>

      {/* Additional Information Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-blue-900 mb-1">
              Query Management System
            </h5>
            <p className="text-sm text-blue-700 mb-3">
              Our role-based system ensures efficient query handling and
              resolution.
            </p>

            {/* Role-based instructions */}
            <div className="space-y-3 mb-4">
              {/* Query Raisers */}
              <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h6 className="font-medium text-blue-900 text-sm">
                    Query Raisers
                  </h6>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>
                    <strong>Roles:</strong> CE, MD, AEE, Viewer
                  </div>
                  <div>
                    <strong>Permissions:</strong> Can raise and view queries
                    only
                  </div>
                  <div>
                    <strong>Action:</strong>{" "}
                    {`Use the "Raise Query" button to
                    submit your questions or concerns`}
                  </div>
                </div>
              </div>

              {/* Query Resolver */}
              <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <h6 className="font-medium text-green-900 text-sm">
                    Query Resolver
                  </h6>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <div>
                    <strong>Role:</strong> JE (Junior Engineer)
                  </div>
                  <div>
                    <strong>Permissions:</strong> Can view, resolve, and manage
                    all queries
                  </div>
                  <div>
                    <strong>Responsibility:</strong> Investigate and provide
                    solutions to raised queries
                  </div>
                </div>
              </div>
            </div>
            {/* Instructions */}
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong>{" "}
                {`All queries must be raised through the
                system. Only JE personnel can mark queries as resolved. If you
                need immediate assistance, mark your query as "Urgent" when
                submitting.`}
              </p>
            </div>
          </div>
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

export default ViewerActions;
