import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { Calendar, Clock, IndianRupee, MapPin, TrendingUp } from "lucide-react";

interface SubProjectsTabProps {
  project: DbProject;
}

function SubProjectsTab({ project }: SubProjectsTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    const end = new Date(endDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    return `${start} - ${end}`;
  };

  const getDurationInMonths = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    return months;
  };

  const getDurationInDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Sub-Projects</h3>
          <p className="text-sm text-gray-500 mt-1">
            {project.subProjects.length > 0
              ? `${project.subProjects.length} sub-project${
                  project.subProjects.length > 1 ? "s" : ""
                } under this project`
              : "No sub-projects found"}
          </p>
        </div>
        {project.subProjects.length > 0 && (
          <div className="flex gap-3">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-sm font-medium px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {project.subProjects.length} Total
            </Badge>
            <Badge className="bg-green-50 text-green-700 border-green-200 text-sm font-medium px-4 py-2">
              <IndianRupee className="h-4 w-4 mr-2" />
              {formatCurrency(
                project.subProjects.reduce(
                  (total, sp) => total + sp.estimatedAmount,
                  0
                )
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Show message if no sub-projects */}
      {!project.hasSubProjects || project.subProjects.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              No Sub-Projects
            </h4>
            <p className="text-gray-600 max-w-md mx-auto">
              This project does not have any sub-projects. Sub-projects will
              appear here when they are added to the main project.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Sub-projects cards */}
          <div className="space-y-4">
            {project.subProjects.map((subProject, index) => (
              <Card
                key={subProject._id || index}
                className="border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <CardContent className="p-6">
                  {/* Header with Project Name and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          {subProject.projectName}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-5">
                        {subProject.typeOfWork}
                      </p>
                    </div>
                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Estimated Amount */}
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">
                          Estimated Amount
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-900">
                        {formatCurrency(subProject.estimatedAmount)}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">
                          Duration
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-900">
                        {getDurationInMonths(
                          subProject.projectStartDate,
                          subProject.projectEndDate
                        )}{" "}
                        months
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        (
                        {getDurationInDays(
                          subProject.projectStartDate,
                          subProject.projectEndDate
                        )}{" "}
                        days)
                      </div>
                    </div>

                    {/* Parent Project */}
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-medium">
                          Parent Project
                        </span>
                      </div>
                      <div className="text-sm font-bold text-purple-900">
                        {project.projectId}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">
                      Project Details
                    </h5>

                    {/* Timeline */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">
                          Project Timeline
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDateRange(
                            subProject.projectStartDate,
                            subProject.projectEndDate
                          )}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Start: </span>
                            {formatDate(subProject.projectStartDate)}
                          </div>
                          <div>
                            <span className="font-medium">End: </span>
                            {formatDate(subProject.projectEndDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    {project.district && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-600 mb-1">
                            Location
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.district}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Extension Period */}
                    {subProject.extensionPeriodForCompletion && (
                      <div className="flex items-start gap-3 bg-orange-50 -mx-4 -mb-3 p-3 rounded-b-lg border-t border-orange-200">
                        <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-orange-700 mb-1 font-medium">
                            Extension Period
                          </div>
                          <div className="text-sm font-semibold text-orange-900">
                            Extended until:{" "}
                            {formatDate(
                              subProject.extensionPeriodForCompletion
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Footer */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-900">
                    Sub-Projects Summary
                  </h5>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Total Projects:</span>{" "}
                      {project.subProjects.length}
                    </div>
                    <div>
                      <span className="font-medium">Parent Status:</span>{" "}
                      {project.status}
                    </div>
                    <div>
                      <span className="font-medium">Parent Progress:</span>{" "}
                      {project.progressPercentage}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">
                    Combined Budget
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(
                      project.subProjects.reduce(
                        (total, sp) => total + sp.estimatedAmount,
                        0
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default SubProjectsTab;
