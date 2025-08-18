import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { Calendar, Eye, MapPin } from "lucide-react";

interface SubProjectsTabProps {
  project: DbProject;
}

function SubProjectsTab({ project }: SubProjectsTabProps) {
  const getStatusColor = (status: string = "PENDING") => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "APPROVED":
        return "bg-yellow-500";
      case "PENDING":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getProgressColor = (progress: number = 0) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    const end = new Date(endDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    return `${start} - ${end}`;
  };

  const getDurationInMonths = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    return months;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-gray-900">Sub-Projects</h3>
        <span className="text-lg text-gray-500">
          {project.subProjects.length}
        </span>
      </div>

      {/* Sub-projects cards */}
      <div className="space-y-3">
        {project.subProjects.map((subProject) => (
          <div
            key={subProject.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Left section with dot indicator and content */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Status indicator dot */}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(
                    subProject.status
                  )}`}
                />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Project name */}
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    {subProject.name}
                  </h4>

                  {/* Progress percentage or status */}
                  {subProject.progress !== undefined &&
                  subProject.progress > 0 ? (
                    <div
                      className={`text-sm font-medium mb-3 ${getProgressColor(
                        subProject.progress
                      )}`}
                    >
                      {subProject.progress}% Complete
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-3">
                      {subProject.natureOfWork}
                    </div>
                  )}

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Type of Work</span>
                      <div className="text-gray-900 font-medium">
                        {subProject.typeOfWork}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Sub-Type</span>
                      <div className="text-gray-900 font-medium">
                        {subProject.subTypeOfWork}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Amount</span>
                      <div className="text-gray-900 font-medium">
                        {formatCurrency(subProject.estimatedAmount)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration</span>
                      <div className="text-gray-900 font-medium">
                        {getDurationInMonths(
                          subProject.projectStartDate,
                          subProject.projectEndDate
                        )}{" "}
                        months
                      </div>
                    </div>
                  </div>

                  {/* Timeline and location */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDateRange(
                          subProject.projectStartDate,
                          subProject.projectEndDate
                        )}
                      </span>
                    </div>
                    {project.district && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{project.district}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right section with view button */}
              <div className="flex-shrink-0 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border border-teal-600 text-teal-600 hover:text-teal-700 rounded-full h-10 w-10 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span>{project.status}</span>
          <span>{project.status}</span>
        </div>
        <div className="font-medium">
          Total Budget:{" "}
          {formatCurrency(
            project.subProjects.reduce(
              (total, sp) => total + sp.estimatedAmount,
              0
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default SubProjectsTab;
