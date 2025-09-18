import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionItems } from "@/hooks/useDashboardData";
import {
  AlertCircle,
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
} from "lucide-react";
import React from "react";

const getActionIcon = (type: string) => {
  switch (type) {
    case "pending_approval":
      return <CheckSquare className="h-4 w-4" />;
    case "overdue_project":
      return <Clock className="h-4 w-4" />;
    case "open_query":
    case "overdue_query":
      return <FileText className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "low":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

interface ActionItem {
  id?: string;
  type: string;
  projectId: string;
  projectName: string;
  description: string;
  actionRequired: string;
  priority: string;
  daysOverdue?: number;
  daysWaiting?: number;
}

export const ActionItemsWidget: React.FC = () => {
  const { data, isLoading } = useActionItems(15);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const actionItems = data?.data?.actionItems || [];
  const summary = data?.data?.summary || {};

  return (
    <Card className="border-0 shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {actionItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No action items</p>
              <p className="text-xs text-gray-400 mt-1">
                {`You're all caught up!`}
              </p>
            </div>
          ) : (
            actionItems.map((item: ActionItem) => (
              <div
                key={item.id || `${item.type}-${item.projectId}`}
                className={`p-3 rounded-lg border ${getPriorityColor(
                  item.priority
                )} hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-0.5">{getActionIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.projectName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.actionRequired}
                      </p>

                      {/* Show relevant timing info */}
                      {item.daysOverdue && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">
                            {item.daysOverdue} days overdue
                          </span>
                        </div>
                      )}

                      {item.daysWaiting && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            Waiting {item.daysWaiting} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => {
                      // Navigate to project or action item
                      window.location.href = `/dashboard/projects/${item.projectId}`;
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {summary.total > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">High Priority</p>
                <p className="text-sm font-semibold text-red-600">
                  {summary.byPriority?.high || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Medium Priority</p>
                <p className="text-sm font-semibold text-orange-600">
                  {summary.byPriority?.medium || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Low Priority</p>
                <p className="text-sm font-semibold text-blue-600">
                  {summary.byPriority?.low || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
