"use client";

import { Badge } from "@/components/ui/badge";
import { DbProject } from "@/types/projects.types";
import { getProjectStatusHistory } from "@/utils/projects/project-status";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TimelineComment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  type: "approval" | "rejection" | "query" | "revision" | "submission";
}

interface TimelineStep {
  id: string;
  title: string;
  approver: string;
  role: string;
  status: "completed" | "in_progress" | "pending" | "rejected";
  completedDate?: string;
  comments: TimelineComment[];
  isCurrentStep?: boolean;
  statusChange?: {
    from: string;
    to: string;
  };
}

interface TimelineTabProps {
  project: DbProject;
}

export default function TimelineTab({ project }: TimelineTabProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  interface StatusHistoryItem {
    newStatus: string;
    previousStatus: string;
    changedBy: {
      name: string;
      role: string;
    };
    createdAt: string;
    rejectionReason?: string;
    remarks?: string;
  }

  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch status history on component mount
  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProjectStatusHistory(
          project._id as string,
          1,
          50
        ); // Get all history
        console.log(response);
        setStatusHistory(response.data.statusHistory);
      } catch (err) {
        console.error("Error fetching status history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load status history"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (project._id) {
      fetchStatusHistory();
    }
  }, [project._id]);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
            Complete
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
            In Progress
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
    }
  };

  const getCommentType = (newStatus: string): TimelineComment["type"] => {
    if (newStatus.includes("Rejected")) return "rejection";
    if (newStatus === "Ongoing") return "approval";
    if (newStatus === "Resubmitted for Approval") return "revision";
    if (newStatus === "Completed") return "approval";
    return "submission";
  };

  const getStepStatus = (
    newStatus: string,
    isLatest: boolean
  ): TimelineStep["status"] => {
    if (newStatus.includes("Rejected")) return "rejected";
    if (newStatus === "Ongoing" && isLatest) return "in_progress";
    if (newStatus === "Completed") return "completed";
    if (
      isLatest &&
      (newStatus === "Submitted for Approval" ||
        newStatus === "Resubmitted for Approval")
    ) {
      return "in_progress";
    }
    return "completed";
  };

  const getStepTitle = (newStatus: string, previousStatus: string) => {
    console.log(previousStatus, "->", newStatus);
    if (newStatus === "Submitted for Approval")
      return "Initial Project Submission";
    if (newStatus === "Resubmitted for Approval") return "Project Resubmission";
    if (newStatus === "Ongoing") return "Project Approved";
    if (newStatus === "Completed") return "Project Completed";
    if (newStatus.includes("Rejected"))
      return `Rejected by ${newStatus.split(" by ")[1]}`;
    return `Status Changed to ${newStatus}`;
  };

  // Transform status history into timeline steps
  const transformToTimelineSteps = (): TimelineStep[] => {
    if (!statusHistory.length) return [];

    return statusHistory
      .map((historyItem, index) => {
        const isLatest = index === 0; // First item is the latest
        const commentType = getCommentType(historyItem.newStatus);
        const stepStatus = getStepStatus(historyItem.newStatus, isLatest);

        const comment: TimelineComment = {
          id: `comment-${index}`,
          author: historyItem.changedBy.name,
          role: historyItem.changedBy.role,
          content:
            historyItem.rejectionReason ||
            historyItem.remarks ||
            `Status changed to "${historyItem.newStatus}"`,
          timestamp: new Date(historyItem.createdAt).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }
          ),
          type: commentType,
        };

        return {
          id: `step-${index}`,
          title: getStepTitle(
            historyItem.newStatus,
            historyItem.previousStatus
          ),
          approver: historyItem.changedBy.name,
          role: historyItem.changedBy.role,
          status: stepStatus,
          completedDate: historyItem.createdAt,
          comments: [comment],
          isCurrentStep: isLatest && stepStatus === "in_progress",
          statusChange: {
            from: historyItem.previousStatus,
            to: historyItem.newStatus,
          },
        };
      })
      .reverse(); // Reverse to show chronological order
  };

  const timelineSteps = transformToTimelineSteps();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Project Timeline
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading project timeline...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Project Timeline
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">Failed to load timeline</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!timelineSteps.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Project Timeline
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              No timeline data available
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status changes will appear here as they occur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Timeline
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {timelineSteps.filter((step) => step.status === "completed").length}{" "}
            of {timelineSteps.length} Changes
          </Badge>
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
            Current: {project.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-1">
        {timelineSteps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const hasComments = step.comments.length > 0;
          const isLastStep = index === timelineSteps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Main connector line */}
              {!isLastStep && (
                <div
                  className={`absolute left-3 top-12 w-0.5 h-16 transition-colors duration-500 ${
                    step.status === "completed"
                      ? "bg-green-400"
                      : step.status === "in_progress"
                      ? "bg-blue-400"
                      : step.status === "rejected"
                      ? "bg-red-400"
                      : "bg-gray-200"
                  }`}
                />
              )}

              {/* Current step indicator */}
              {step.isCurrentStep && (
                <div className="absolute -left-2 top-4 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-600 animate-pulse">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              )}

              <div className="flex items-start gap-4 pb-6">
                {/* Step number and status icon */}
                <div className="flex items-center justify-center w-6 h-6 relative z-10">
                  {step.isCurrentStep ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  ) : step.status === "completed" ? (
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : step.status === "rejected" ? (
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-gray-500 text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {step.approver} • {step.role}
                        {step.completedDate && (
                          <span className="ml-2">
                            •{" "}
                            {new Date(step.completedDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        )}
                      </p>
                      {step.statusChange && (
                        <p className="text-xs text-gray-400 mt-1">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                            {step.statusChange.from}
                          </span>
                          {" → "}
                          <span
                            className={`px-2 py-0.5 rounded ${
                              step.statusChange.to.includes("Rejected")
                                ? "bg-red-100 text-red-600"
                                : step.statusChange.to === "Ongoing"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {step.statusChange.to}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  {/* Comments section */}
                  {hasComments && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Users className="h-4 w-4" />
                        View details
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-100">
                          {step.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-gray-900 text-sm">
                                    {comment.author}
                                  </h5>
                                  <Badge variant="outline" className="text-xs">
                                    {comment.role}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      comment.type === "approval"
                                        ? "bg-green-50 text-green-600 border-green-200"
                                        : comment.type === "rejection"
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : comment.type === "query"
                                        ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                        : comment.type === "revision"
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                    }`}
                                  >
                                    {comment.type}
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current step indicator text */}
                  {step.isCurrentStep && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Current Status
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        This is the current status of the project
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall status footer */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {timelineSteps.length} status change
              {timelineSteps.length !== 1 ? "s" : ""} recorded
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated:{" "}
            {timelineSteps.length > 0
              ? new Date(
                  timelineSteps[timelineSteps.length - 1].completedDate!
                ).toLocaleDateString("en-IN")
              : "Never"}
          </div>
        </div>
      </div>
    </div>
  );
}
