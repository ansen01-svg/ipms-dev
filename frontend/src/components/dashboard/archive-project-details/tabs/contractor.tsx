import { Badge } from "@/components/ui/badge";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { Building2 } from "lucide-react";

// Archive Contractor Tab
interface ArchiveContractorTabProps {
  project: DbArchiveProject;
}

function ArchiveContractorTab({ project }: ArchiveContractorTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Contractor Details
        </h3>
        <Badge variant="outline" className="text-xs">
          {project.location}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {project.nameOfContractor}
            </h4>
            <p className="text-sm text-gray-500">Primary Contractor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Contract Value
              </label>
              <div className="text-lg font-semibold text-gray-900">
                ₹{(project.workValue / 100000).toFixed(1)}L
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                FWO Number
              </label>
              <div className="text-sm text-gray-600 font-mono">
                {project.FWONumberAndDate}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="text-sm text-gray-600">{project.location}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Bill Submitted
              </label>
              <div className="text-lg font-semibold text-gray-900">
                ₹{(project.billSubmittedAmount / 100000).toFixed(1)}L
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                FWO Date
              </label>
              <div className="text-sm text-gray-600">
                {formatDate(project.FWODate)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Progress
              </label>
              <div className="text-sm font-semibold text-green-600">
                {project.progress}% ({project.progressStatus})
              </div>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        {project.billNumber && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h5 className="font-medium text-gray-900 mb-3">Bill Information</h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bill Number</span>
                <span className="text-sm font-medium font-mono">
                  {project.billNumber}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium">
                  ₹{(project.billSubmittedAmount / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchiveContractorTab;
