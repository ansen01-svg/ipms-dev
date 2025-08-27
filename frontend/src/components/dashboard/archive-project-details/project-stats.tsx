import { Card, CardContent } from "@/components/ui/card";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { BarChart3, DollarSign, FileText, TrendingUp } from "lucide-react";

interface ArchiveProjectStatsProps {
  project: DbArchiveProject;
}

export function ArchiveProjectStats({ project }: ArchiveProjectStatsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Physical Progress Card */}
      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.progress}%
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
              <span className="font-medium">{project.progressStatus}</span>
            </div>
            <div className="w-full bg-cyan-300 group-hover:bg-cyan-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-cyan-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-xs text-cyan-100 group-hover:text-white transition-colors duration-300">
              Remaining: {formatCurrency(project.remainingWorkValue)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Progress Card */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.financialProgress}%
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
                {formatCurrency(project.billSubmittedAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
              <span>Work Value</span>
              <span className="font-medium">
                {formatCurrency(project.workValue)}
              </span>
            </div>
            <div className="w-full bg-blue-300 group-hover:bg-blue-200 rounded-full h-2 transition-colors duration-300">
              <div
                className="bg-white group-hover:bg-blue-50 h-2 rounded-full transition-all duration-700 ease-out group-hover:shadow-lg"
                style={{ width: `${project.financialProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Details Card */}
      <Card className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {formatCurrency(project.AAAmount)}
              </div>
              <div className="text-sm text-pink-100 transition-all duration-300 group-hover:text-white">
                AA Amount
              </div>
            </div>
            <DollarSign className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>AA Date</span>
              <span className="font-medium">
                {new Date(project.AADated).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between text-pink-100 group-hover:text-white transition-colors duration-300">
              <span>FWO Date</span>
              <span className="font-medium">
                {new Date(project.FWODate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Status Card */}
      <Card className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 border-0 shadow-sm rounded-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-120 hover:-translate-y-2 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110">
                {project.financialYear}
              </div>
              <div className="text-sm text-purple-100 transition-all duration-300 group-hover:text-white">
                Financial Year
              </div>
            </div>
            <FileText className="h-6 w-6 text-white opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-purple-100 group-hover:text-white transition-colors duration-300">
              <span>Status</span>
              <span className="font-medium">Archive</span>
            </div>
            <div className="flex justify-between text-purple-100 group-hover:text-white transition-colors duration-300">
              <span>Location</span>
              <span className="font-medium">{project.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
