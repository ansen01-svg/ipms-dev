import { Card, CardContent } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { formatCurrency } from "@/utils/archive-projects/format-helpers";
import { BarChart3, FileText, Phone, TrendingUp, User } from "lucide-react";

interface ProjectStatsProps {
  project: DbProject;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  // Calculate progress gap for visual indicator
  const progressGap = Math.abs(
    (project.progressPercentage || 0) - (project.financialProgress || 0)
  );
  const isBalanced = progressGap <= 10; // Within 10% is considered balanced

  // Determine overall completion status
  const isPhysicallyComplete = (project.progressPercentage || 0) === 100;
  const isFinanciallyComplete = (project.financialProgress || 0) === 100;
  const isFullyComplete = isPhysicallyComplete && isFinanciallyComplete;

  // Calculate remaining budget
  const remainingBudget =
    (project.estimatedCost || 0) - (project.billSubmittedAmount || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Physical Progress Card */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.progressPercentage || 0}%
              </div>
              <div className="text-sm text-cyan-100 transition-all duration-300 group-hover:text-white">
                Physical progress
              </div>
            </div>
            <BarChart3 className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-cyan-100 group-hover:text-white transition-colors duration-300">
              <span>Status</span>
              <span className="font-medium">
                {project.progressStatus || "Not Started"}
              </span>
            </div>
            <div className="w-full bg-cyan-300 group-hover:bg-cyan-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-cyan-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{
                  width: `${Math.min(project.progressPercentage || 0, 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-cyan-100 group-hover:text-white transition-colors duration-300">
              {project.totalProgressUpdates || 0} updates • Last:{" "}
              {project.lastProgressUpdate
                ? new Date(project.lastProgressUpdate).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short" }
                  )
                : "Never"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Progress Card */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.financialProgress.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-blue-100 transition-all duration-300 group-hover:text-white">
                Financial progress
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Bill Submitted</span>
              <span className="font-medium">
                {formatCurrency(project.billSubmittedAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Estimated Cost</span>
              <span className="font-medium">
                {formatCurrency(project.estimatedCost)}
              </span>
            </div>
            <div className="w-full bg-blue-300 group-hover:bg-blue-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-blue-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{
                  width: `${Math.min(project.financialProgress || 0, 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-blue-100 group-hover:text-white transition-colors duration-300">
              {project.totalFinancialProgressUpdates || 0} updates • Remaining:{" "}
              {formatCurrency(remainingBudget)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractor Details Card */}
      <Card className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 leading-tight">
                {project.contractorName?.split(" ").slice(0, 2).join(" ") ||
                  "No Contractor"}
              </div>
              <div className="text-sm text-pink-100 transition-all duration-300 group-hover:text-white">
                Contractor
              </div>
            </div>
            <User className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            {project.contractorPhoneNumber && (
              <div className="flex items-center text-pink-100 group-hover:text-white transition-colors duration-300">
                <Phone className="h-3 w-3 mr-2" />
                <span className="font-medium">
                  {project.contractorPhoneNumber}
                </span>
              </div>
            )}
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>Work Order</span>
              <span className="font-medium text-xs">
                {project.workOrderNumber}
              </span>
            </div>
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>Start Date</span>
              <span className="font-medium">
                {new Date(project.projectStartDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  }
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Status Card */}
      <Card
        className={`bg-gradient-to-br border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 cursor-pointer group ${
          isFullyComplete
            ? "from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600"
            : isBalanced
            ? "from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600"
            : "from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {isFullyComplete
                  ? "Complete"
                  : isBalanced
                  ? "Balanced"
                  : "Gap Alert"}
              </div>
              <div
                className={`text-sm transition-all duration-300 group-hover:text-white ${
                  isFullyComplete
                    ? "text-emerald-100"
                    : isBalanced
                    ? "text-purple-100"
                    : "text-orange-100"
                }`}
              >
                Overall Status
              </div>
            </div>
            <FileText className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            <div
              className={`flex justify-between transition-colors duration-300 group-hover:text-white ${
                isFullyComplete
                  ? "text-emerald-100"
                  : isBalanced
                  ? "text-purple-100"
                  : "text-orange-100"
              }`}
            >
              <span>Progress Gap</span>
              <span className="font-medium">{progressGap.toFixed(1)}%</span>
            </div>
            <div
              className={`flex justify-between transition-colors duration-300 group-hover:text-white ${
                isFullyComplete
                  ? "text-emerald-100"
                  : isBalanced
                  ? "text-purple-100"
                  : "text-orange-100"
              }`}
            >
              <span>Average</span>
              <span className="font-medium">
                {Math.round(
                  ((project.progressPercentage || 0) +
                    (project.financialProgress || 0)) /
                    2
                )}
                %
              </span>
            </div>

            {/* Progress Gap Indicator */}
            <div className="mt-3">
              <div
                className={`w-full rounded-full h-2 transition-colors duration-300 ${
                  isFullyComplete
                    ? "bg-emerald-300 group-hover:bg-emerald-200"
                    : isBalanced
                    ? "bg-purple-300 group-hover:bg-purple-200"
                    : "bg-orange-300 group-hover:bg-orange-200"
                }`}
              >
                <div
                  className="bg-white group-hover:bg-opacity-90 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                  style={{
                    width: `${Math.min(
                      Math.round(
                        ((project.progressPercentage || 0) +
                          (project.financialProgress || 0)) /
                          2
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs opacity-75">
                <span>P: {project.progressPercentage || 0}%</span>
                <span>F: {project.financialProgress.toFixed(1) || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
