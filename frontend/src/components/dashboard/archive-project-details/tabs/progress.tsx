import { Badge } from "@/components/ui/badge";
import { DbArchiveProject } from "@/types/archive-projects.types";

// Archive Progress Tab
interface ArchiveProgressTabProps {
  project: DbArchiveProject;
}

function ArchiveProgressTab({ project }: ArchiveProgressTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Progress Details
        </h3>
        <div className="flex gap-2">
          <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
            {project.progress}% Physical
          </Badge>
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
            {project.financialProgress}% Financial
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physical Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Physical Progress</h4>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {project.progress}%
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="text-center">
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

        {/* Financial Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Financial Progress</h4>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {project.financialProgress}%
            </div>
            <div className="text-sm text-gray-500">Bill Utilization</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${project.financialProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 text-center">
            ₹{(project.billSubmittedAmount / 100000).toFixed(1)}L / ₹
            {(project.workValue / 100000).toFixed(1)}L
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Progress Summary</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Work Value</span>
            <span className="text-sm font-medium">
              ₹{(project.workValue / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Bill Submitted</span>
            <span className="text-sm font-medium">
              ₹{(project.billSubmittedAmount / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Remaining Work</span>
            <span className="text-sm font-medium">
              ₹{(project.remainingWorkValue / 100000).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchiveProgressTab;
