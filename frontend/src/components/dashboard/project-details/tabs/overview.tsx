import { Badge } from "@/components/ui/badge";
import { DbProject } from "@/types/projects.types";

interface OverviewTabProps {
  project: DbProject;
}

function OverviewTab({ project }: OverviewTabProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
        Project Overview
      </h3>

      {/* Simple info card similar to contact info */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Description */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Description
            </span>
            <div className="text-right ml-4">
              <p className="text-sm text-gray-600 text-left max-w-md ml-auto">
                {project.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Current Stage */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Current Status
            </span>
            <span className="text-sm text-gray-600">{project.status}</span>
          </div>
        </div>

        {/* Date of Work Order Issue */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Work Order Date
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(project.dateOfIssueOfWorkOrder)}
            </span>
          </div>
        </div>

        {/* Type of Work */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Type of Work
            </span>
            <Badge variant="outline" className="text-xs">
              {project.typeOfWork}
            </Badge>
          </div>
        </div>

        {/* Fund Source */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Fund Source
            </span>
            <span className="text-sm text-gray-600">{project.fund}</span>
          </div>
        </div>

        {/* Budget Head */}
        {project.budgetHead && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Budget Head
              </span>
              <span className="text-sm text-gray-600">
                {project.budgetHead}
              </span>
            </div>
          </div>
        )}

        {/* Sub-Projects */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Has Sub-Projects
            </span>
            <span className="text-sm text-gray-600 font-medium">
              {project.hasSubProjects
                ? `Yes (${project.subProjects.length})`
                : "No"}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                {project.progressPercentage}%
              </span>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-teal-500 rounded-full"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extension Period */}
        {project.extensionPeriodForCompletion && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Extension Period
              </span>
              <span className="text-sm text-gray-600">
                {formatDate(project.extensionPeriodForCompletion)}
              </span>
            </div>
          </div>
        )}

        {/* Last Modified */}
        {project.lastModifiedBy && (
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Last Modified By
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {project.createdBy.name} ({project.createdBy.role})
                </p>
                {project.lastModifiedBy.modifiedAt && (
                  <p className="text-xs text-gray-500">
                    {formatDate(project.lastModifiedBy.modifiedAt.toString())}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OverviewTab;
