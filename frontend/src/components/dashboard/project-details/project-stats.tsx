import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/projects.types";
import { BarChart3, Building, Clock, DollarSign } from "lucide-react";

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const budgetPercentage = (project.budgetUtilized / project.budget) * 100;

  return (
    // Design 1
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.progress}%
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
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-cyan-300 group-hover:bg-cyan-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-cyan-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-xs text-cyan-100 group-hover:text-white transition-colors duration-300">
              {project.daysRemaining} days remaining
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
                ₹{(project.budgetUtilized / 10000000).toFixed(1)}Cr
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
                ₹{(project.budgetUtilized / 10000000).toFixed(1)}Cr
              </span>
            </div>
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Total budget</span>
              <span className="font-medium">
                ₹{(project.budget / 10000000).toFixed(1)}Cr
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
                {project.daysRemaining}
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

      {/* Sub-Projects & Issues Card */}
      <Card className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.subProjects}
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
              <span className="font-medium">
                {project.currentStage.replace("_", " ")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    // Design 2
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    //   {/* Overall Progress Card */}
    //   <Card className="bg-blue-300 shadow-sm rounded-xl hover:shadow-lg transition-shadow duration-300">
    //     <CardContent className="p-6">
    //       <div className="flex items-start justify-between mb-4">
    //         <div>
    //           <div className="text-3xl font-bold text-gray-900 mb-1">
    //             {project.progress}%
    //           </div>
    //           <div className="text-sm text-gray-600">Overall progress</div>
    //         </div>
    //         <span className="p-3 rounded-full bg-gray-200">
    //           <BarChart3 className="h-5 w-5" />
    //         </span>
    //       </div>

    //       <div className="space-y-2">
    //         <div className="flex justify-between text-sm">
    //           <span className="text-gray-500">Completed</span>
    //           <span className="font-medium">{project.progress}%</span>
    //         </div>
    //         <div className="w-full bg-gray-100 rounded-full h-[6px]">
    //           <div
    //             className="bg-blue-700 h-[6px] rounded-full transition-all duration-500"
    //             style={{ width: `${project.progress}%` }}
    //           />
    //         </div>
    //         <div className="text-xs text-gray-500">
    //           {project.daysRemaining} days remaining
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Budget Utilization Card */}
    //   <Card className="bg-green-300 shadow-sm rounded-xl hover:shadow-lg transition-shadow duration-300">
    //     <CardContent className="p-6">
    //       <div className="flex items-start justify-between mb-4">
    //         <div>
    //           <div className="text-3xl font-bold text-gray-900 mb-1">
    //             ₹{(project.budgetUtilized / 10000000).toFixed(1)}Cr
    //           </div>
    //           <div className="text-sm text-gray-600">Budget utilized</div>
    //         </div>
    //         <span className="p-3 rounded-full bg-gray-200">
    //           <DollarSign className="h-5 w-5" />
    //         </span>
    //       </div>

    //       <div className="space-y-2">
    //         <div className="flex justify-between text-sm">
    //           <span className="text-gray-500">Utilized</span>
    //           <span className="font-medium">
    //             ₹{(project.budgetUtilized / 10000000).toFixed(1)}Cr
    //           </span>
    //         </div>
    //         <div className="flex justify-between text-sm">
    //           <span className="text-gray-500">Total budget</span>
    //           <span className="font-medium">
    //             ₹{(project.budget / 10000000).toFixed(1)}Cr
    //           </span>
    //         </div>
    //         <div className="w-full bg-gray-100 rounded-full h-[6px]">
    //           <div
    //             className="bg-blue-700 h-[6px] rounded-full transition-all duration-500"
    //             style={{ width: `${budgetPercentage}%` }}
    //           />
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Timeline Card */}
    //   <Card className="bg-violet-300 shadow-sm rounded-xl hover:shadow-lg transition-shadow duration-300">
    //     <CardContent className="p-6">
    //       <div className="flex items-start justify-between mb-4">
    //         <div>
    //           <div className="text-3xl font-bold text-gray-900 mb-1">
    //             {project.daysRemaining}
    //           </div>
    //           <div className="text-sm text-gray-600">Days remaining</div>
    //         </div>
    //         <span className="p-3 rounded-full bg-gray-200">
    //           <Clock className="h-5 w-5" />
    //         </span>
    //       </div>

    //       <div className="space-y-2 text-sm">
    //         <div className="flex justify-between">
    //           <span className="text-gray-500">Start date</span>
    //           <span className="font-medium">
    //             {new Date(project.projectStartDate).toLocaleDateString(
    //               "en-IN",
    //               {
    //                 day: "2-digit",
    //                 month: "short",
    //                 year: "2-digit",
    //               }
    //             )}
    //           </span>
    //         </div>
    //         <div className="flex justify-between">
    //           <span className="text-gray-500">End date</span>
    //           <span className="font-medium">
    //             {new Date(project.projectEndDate).toLocaleDateString("en-IN", {
    //               day: "2-digit",
    //               month: "short",
    //               year: "2-digit",
    //             })}
    //           </span>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Sub-Projects & Issues Card */}
    //   <Card className="bg-orange-300 shadow-sm rounded-xl hover:shadow-lg transition-shadow duration-300">
    //     <CardContent className="p-6">
    //       <div className="flex items-start justify-between mb-4">
    //         <div>
    //           <div className="text-3xl font-bold text-gray-900 mb-1">
    //             {project.subProjects}
    //           </div>
    //           <div className="text-sm text-gray-600">Sub-projects</div>
    //         </div>
    //         <span className="p-3 rounded-full bg-gray-200">
    //           {project.activeIssues > 0 ? (
    //             <AlertTriangle className="h-5 w-5" />
    //           ) : (
    //             <Building className="h-5 w-5" />
    //           )}
    //         </span>
    //       </div>

    //       <div className="space-y-2 text-sm">
    //         <div className="flex justify-between">
    //           <span className="text-gray-500">Active issues</span>
    //           <span className={`font-medium`}>{project.activeIssues}</span>
    //         </div>
    //         <div className="flex justify-between">
    //           <span className="text-gray-500">Status</span>
    //           <span className={`font-medium`}>
    //             {project.activeIssues > 0 ? "Attention needed" : "All clear"}
    //           </span>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
