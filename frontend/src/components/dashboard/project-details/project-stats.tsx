import { Card, CardContent } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { BarChart3, Building, Clock, DollarSign } from "lucide-react";

interface ProjectStatsProps {
  project: DbProject;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  // Calculate days remaining
  const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining(project.projectEndDate);

  // Mock budget utilization since it's not in the interface yet
  // In a real scenario, this would come from the backend or be calculated
  const mockBudgetUtilized =
    project.estimatedCost * (project.progressPercentage / 100) * 0.8; // Estimate
  const budgetPercentage = (mockBudgetUtilized / project.estimatedCost) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.progressPercentage}%
              </div>
              <div className="text-sm text-cyan-100 transition-all duration-300 group-hover:text-white">
                Overall progress
              </div>
            </div>
            <BarChart3 className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-cyan-100 group-hover:text-white transition-colors duration-300">
              <span>Completed</span>
              <span className="font-medium">{project.progressPercentage}%</span>
            </div>
            <div className="w-full bg-cyan-300 group-hover:bg-cyan-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-cyan-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-cyan-100 group-hover:text-white transition-colors duration-300">
              {daysRemaining} days remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Utilization Card */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                ₹{(mockBudgetUtilized / 10000000).toFixed(1)}Cr
              </div>
              <div className="text-sm text-blue-100 transition-all duration-300 group-hover:text-white">
                Budget utilized
              </div>
            </div>
            <DollarSign className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Utilized</span>
              <span className="font-medium">
                ₹{(mockBudgetUtilized / 10000000).toFixed(1)}Cr
              </span>
            </div>
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Total budget</span>
              <span className="font-medium">
                ₹{(project.estimatedCost / 10000000).toFixed(1)}Cr
              </span>
            </div>
            <div className="w-full bg-blue-300 group-hover:bg-blue-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-blue-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {daysRemaining}
              </div>
              <div className="text-sm text-pink-100 transition-all duration-300 group-hover:text-white">
                Days remaining
              </div>
            </div>
            <Clock className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>Start date</span>
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
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>End date</span>
              <span className="font-medium">
                {new Date(project.projectEndDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-Projects & Status Card */}
      <Card className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.subProjects.length}
              </div>
              <div className="text-sm text-purple-100 transition-all duration-300 group-hover:text-white">
                Sub-projects
              </div>
            </div>
            <Building className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-purple-100 group-hover:text-white transition-colors duration-300">
              <span>Status</span>
              <span className="font-medium">{project.status}</span>
            </div>
            <div className="flex justify-between text-purple-100 group-hover:text-white transition-colors duration-300">
              <span>Work Type</span>
              <span className="font-medium text-xs">{project.typeOfWork}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
