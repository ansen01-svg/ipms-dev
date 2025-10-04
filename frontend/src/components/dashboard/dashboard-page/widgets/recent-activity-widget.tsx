import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentActivity } from "@/hooks/useDashboardData";
import {
  Activity,
  CheckCircle,
  Clock,
  FileText,
  FolderPlus,
  IndianRupee,
} from "lucide-react";
import React from "react";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "status_change":
      return <CheckCircle className="h-4 w-4" />;
    case "progress_update":
      return <Activity className="h-4 w-4" />;
    case "financial_update":
      return <IndianRupee className="h-4 w-4" />;
    case "project_created":
      return <FolderPlus className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getActivityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-orange-600 bg-orange-50";
    case "low":
      return "text-blue-600 bg-blue-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

type ActivityItem = {
  id: string;
  type: string;
  priority: string;
  projectName: string;
  description: string;
  timeAgo: string;
};

export const RecentActivityWidget: React.FC = () => {
  const { data, isLoading } = useRecentActivity(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = data?.data?.activities || [];

  return (
    <Card className="border-0 shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            activities.map(
              (activity: ActivityItem, index: number): React.ReactElement => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className={`p-2 rounded-full ${getActivityColor(
                      activity.priority
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.projectName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {activity.timeAgo}
                      </span>
                      <Badge
                        variant={
                          activity.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
