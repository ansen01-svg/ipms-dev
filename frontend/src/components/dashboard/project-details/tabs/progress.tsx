import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";

interface TabProps {
  project: DbProject;
}

export default function ProgressTab({ project }: TabProps) {
  // Calculate days remaining and elapsed
  const calculateTimeMetrics = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    const totalDuration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const elapsedDays = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeProgress = Math.min(
      Math.max((elapsedDays / totalDuration) * 100, 0),
      100
    );

    return {
      totalDuration,
      elapsedDays: Math.max(elapsedDays, 0),
      remainingDays: Math.max(remainingDays, 0),
      timeProgress: Math.round(timeProgress),
    };
  };

  const timeMetrics = calculateTimeMetrics(
    project.projectStartDate,
    project.projectEndDate
  );

  // Calculate progress status
  const getProgressStatus = (progress: number, timeProgress: number) => {
    if (progress >= timeProgress) {
      return {
        status: "On Track",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (progress >= timeProgress - 10) {
      return {
        status: "Slightly Behind",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    } else {
      return {
        status: "Behind Schedule",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
  };

  const progressStatus = getProgressStatus(
    project.progressPercentage,
    timeMetrics.timeProgress
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Progress
        </h3>
        <Badge
          className={`${progressStatus.bgColor} ${progressStatus.color} ${progressStatus.borderColor} text-xs`}
        >
          {project.progressPercentage}% Complete
        </Badge>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Overall Progress
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {project.progressPercentage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Progress */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Time Progress
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {timeMetrics.timeProgress}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${timeMetrics.timeProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Days Elapsed */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Days Elapsed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {timeMetrics.elapsedDays}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              of {timeMetrics.totalDuration} total days
            </p>
          </CardContent>
        </Card>

        {/* Days Remaining */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Days Remaining
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {timeMetrics.remainingDays}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              until{" "}
              {new Date(project.projectEndDate).toLocaleDateString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Analysis */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Progress Analysis
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress vs Time Chart */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Progress vs Timeline
              </h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Work Progress</span>
                    <span>{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time Progress</span>
                    <span>{timeMetrics.timeProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${timeMetrics.timeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Metrics */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Project Status
              </h5>
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-lg ${progressStatus.bgColor} ${progressStatus.borderColor} border`}
                >
                  <div
                    className={`font-medium text-sm ${progressStatus.color}`}
                  >
                    {progressStatus.status}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {project.progressPercentage >= timeMetrics.timeProgress
                      ? "Project is progressing as expected or ahead of schedule"
                      : `Project is ${
                          timeMetrics.timeProgress - project.progressPercentage
                        }% behind timeline`}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Key Metrics
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Current Status:</span>
                      <span className="font-medium">{project.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sub-Projects:</span>
                      <span className="font-medium">
                        {project.subProjects.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Duration:</span>
                      <span className="font-medium">
                        {Math.ceil(timeMetrics.totalDuration / 30)} months
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-Projects Progress (if any) */}
      {project.hasSubProjects && project.subProjects.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Sub-Projects Overview
            </h4>
            <div className="space-y-3">
              {project.subProjects.map((subProject, index) => (
                <div
                  key={subProject._id || index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {subProject.projectName}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {subProject.typeOfWork}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{(subProject.estimatedAmount / 100000).toFixed(1)}L
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(subProject.projectEndDate).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          year: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
