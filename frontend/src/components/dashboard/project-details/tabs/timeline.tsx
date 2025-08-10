import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface TimelineComment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  type: "approval" | "rejection" | "query" | "revision";
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
}

interface TimelineTabProps {
  project: {
    approvalSteps: TimelineStep[];
    currentApprovalLevel: string;
  };
}

export default function TimelineTab({ project }: TimelineTabProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

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

  // Mock data for demonstration
  const mockApprovalSteps: TimelineStep[] = [
    {
      id: "1",
      title: "Initial Proposal Submission",
      approver: "Rajesh Kumar",
      role: "JE",
      status: "completed",
      completedDate: "2025-01-15",
      comments: [
        {
          id: "c1",
          author: "Rajesh Kumar",
          role: "JE",
          content:
            "Project proposal submitted with all required documents and initial cost estimates. Technical feasibility confirmed.",
          timestamp: "15 Jan 25",
          type: "approval",
        },
      ],
    },
    {
      id: "2",
      title: "AEE Technical Review",
      approver: "Priya Sharma",
      role: "AEE",
      status: "completed",
      completedDate: "2025-01-22",
      comments: [
        {
          id: "c2",
          author: "Priya Sharma",
          role: "AEE",
          content:
            "Technical specifications reviewed and approved. Minor revisions needed in cost breakdown.",
          timestamp: "22 Jan 25",
          type: "approval",
        },
        {
          id: "c3",
          author: "Rajesh Kumar",
          role: "JE",
          content:
            "Cost breakdown revised as per AEE feedback. Updated documents submitted.",
          timestamp: "23 Jan 25",
          type: "revision",
        },
      ],
    },
    {
      id: "3",
      title: "CE Administrative Review",
      approver: "Dr. Amit Patel",
      role: "CE",
      status: "in_progress",
      isCurrentStep: true,
      comments: [
        {
          id: "c4",
          author: "Dr. Amit Patel",
          role: "CE",
          content:
            "Under review for environmental compliance and budget allocation. Expecting completion by end of week.",
          timestamp: "5 Aug 25",
          type: "query",
        },
      ],
    },
    {
      id: "4",
      title: "MD Final Approval",
      approver: "Mrs. Sunita Mehta",
      role: "MD",
      status: "pending",
      comments: [],
    },
    {
      id: "5",
      title: "Project Execution Assignment",
      approver: "Contractor Assignment",
      role: "Executor",
      status: "pending",
      comments: [],
    },
  ];

  const approvalSteps = project.approvalSteps || mockApprovalSteps;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Timeline
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {approvalSteps.filter((step) => step.status === "completed").length}{" "}
            of {approvalSteps.length} Steps Complete
          </Badge>
          {project.currentApprovalLevel && (
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
              Currently at: {project.currentApprovalLevel}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {approvalSteps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const hasComments = step.comments.length > 0;
          const isLastStep = index === approvalSteps.length - 1;

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
                      : "bg-gray-200"
                  }`}
                />
              )}

              {/* Rejection return line - shows when step had rejections */}
              {step.comments.some((comment) => comment.type === "rejection") &&
                !isLastStep && (
                  <div className="absolute left-8 top-12 w-0.5 h-16 bg-red-400 opacity-60" />
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
                            • Completed on{" "}
                            {new Date(step.completedDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </p>
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
                        {step.comments.length} comment
                        {step.comments.length !== 1 ? "s" : ""}
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
                                        : "bg-blue-50 text-blue-600 border-blue-200"
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
                          Currently under review
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Project is currently being reviewed at this level
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
              {approvalSteps.reduce(
                (total, step) => total + step.comments.length,
                0
              )}{" "}
              total comments across all stages
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
