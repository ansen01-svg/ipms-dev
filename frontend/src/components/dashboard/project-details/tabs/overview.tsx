import { Badge } from "@/components/ui/badge";
import { MOCK_PROJECT } from "@/utils/project-details/constants";
interface OverviewTabProps {
  project: typeof MOCK_PROJECT;
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
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900">
              Description
            </span>
            <div className="flex-1 text-right ml-4">
              <p className="text-sm text-gray-600 text-left max-w-md ml-auto">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Current Stage */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Current Stage
            </span>
            <span className="text-sm text-gray-600">
              {project.currentStage}
            </span>
          </div>
        </div>

        {/* Date of Proposal */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Date of Proposal
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(project.dateOfProposal)}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Category</span>
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
          </div>
        </div>

        {/* Sub-Projects */}
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Sub-Projects
            </span>
            <span className="text-sm text-gray-600 font-medium">
              {project.subProjects} Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
