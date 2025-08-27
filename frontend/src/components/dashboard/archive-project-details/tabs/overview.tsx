import { Badge } from "@/components/ui/badge";
import { DbArchiveProject } from "@/types/archive-projects.types";

// Archive Overview Tab
interface ArchiveOverviewTabProps {
  project: DbArchiveProject;
}

function ArchiveOverviewTab({ project }: ArchiveOverviewTabProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
        Archive Project Overview
      </h3>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Work Description */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900">
              Name of Work
            </span>
            <div className="text-right ml-4 max-w-md">
              <p className="text-sm text-gray-600 text-left">
                {project.nameOfWork}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Year */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Financial Year
            </span>
            <Badge variant="outline" className="text-xs">
              {project.financialYear}
            </Badge>
          </div>
        </div>

        {/* AA Number */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">AA Number</span>
            <span className="text-sm text-gray-600 font-mono">
              {project.AANumber}
            </span>
          </div>
        </div>

        {/* Work Value */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Work Value
            </span>
            <span className="text-sm text-gray-600 font-semibold">
              {formatCurrency(project.workValue)}
            </span>
          </div>
        </div>

        {/* Progress Status */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Progress Status
            </span>
            <Badge
              className={`text-xs ${
                project.progressStatus === "Completed"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : project.progressStatus === "In Progress"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-yellow-50 text-yellow-600 border-yellow-200"
              }`}
            >
              {project.progressStatus}
            </Badge>
          </div>
        </div>

        {/* Remarks */}
        {project.remarks && (
          <div className="px-4 py-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-900">Remarks</span>
              <div className="text-right ml-4 max-w-md">
                <p className="text-sm text-gray-600 text-left">
                  {project.remarks}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchiveOverviewTab;
