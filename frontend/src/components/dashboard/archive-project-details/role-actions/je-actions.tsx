import { Button } from "@/components/ui/button";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface ArchiveJEActionsProps {
  project: DbArchiveProject;
}

function ArchiveJEActions({ project }: ArchiveJEActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProgress, setNewProgress] = useState(project.progress.toString());

  const handleUpdateProgress = async () => {
    setLoading("Update Progress");

    // Simulate API call
    setTimeout(() => {
      setLoading(null);
      setIsModalOpen(false);
      alert(`Progress updated to ${newProgress}%!`);
    }, 1500);
  };

  const canUpdateProgress = project.progress < 100;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-medium text-teal-900 mb-2">
          Junior Engineer Actions
        </h4>
        <p className="text-sm text-teal-700 mb-4">
          You can update the progress for archive projects
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!canUpdateProgress || loading === "Update Progress"}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <TrendingUp className="h-4 w-4 transition-transform duration-200" />
            {loading === "Update Progress" ? "Updating..." : "Update Progress"}
          </Button>
        </div>

        <div className="mt-3 text-xs text-teal-600">
          Current Progress: {project.progress}% • Status:{" "}
          {project.progressStatus}
          {!canUpdateProgress && " (Completed)"}
        </div>
      </div>

      {/* Progress Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Project Progress
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter progress percentage"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>Current: {project.progress}%</p>
                <p>Status: {project.progressStatus}</p>
                <p>Work Value: ₹{(project.workValue / 100000).toFixed(1)}L</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleUpdateProgress}
                disabled={
                  loading === "Update Progress" ||
                  !newProgress ||
                  parseInt(newProgress) < 0 ||
                  parseInt(newProgress) > 100
                }
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {loading === "Update Progress"
                  ? "Updating..."
                  : "Update Progress"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewProgress(project.progress.toString());
                }}
                variant="outline"
                className="flex-1"
                disabled={loading === "Update Progress"}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchiveJEActions;
