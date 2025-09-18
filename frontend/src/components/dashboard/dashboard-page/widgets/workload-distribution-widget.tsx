import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkloadDistribution } from "@/hooks/useDashboardData";
import {
  Activity,
  Building,
  CheckCircle,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";

interface WorkloadDistributionProps {
  groupBy?: "user" | "district" | "status" | "fund" | "contractor";
  limit?: number;
}

interface WorkloadItem {
  projectCount: number;
  totalValue: number;
  completionRate: number;
  avgProgress: number;
  workload: "Light" | "Medium" | "Heavy";
  user?: {
    userId: string;
    userName: string;
    userRole: string;
  };
  district?: string;
  status?: string;
  fund?: string;
  contractor?: string;
}

interface WorkloadCounts {
  Light: number;
  Medium: number;
  Heavy: number;
}

export const WorkloadDistributionWidget: React.FC<
  WorkloadDistributionProps
> = ({ groupBy = "user" }) => {
  const { data, isLoading, error } = useWorkloadDistribution();
  const [selectedWorkload, setSelectedWorkload] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workload Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-20 rounded-lg"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-32 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load workload distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const distribution = data?.data?.distribution || [];
  const summary = data?.data?.summary || {};

  const workloadCounts: WorkloadCounts = {
    Light: distribution.filter(
      (item: WorkloadItem) => item.workload === "Light"
    ).length,
    Medium: distribution.filter(
      (item: WorkloadItem) => item.workload === "Medium"
    ).length,
    Heavy: distribution.filter(
      (item: WorkloadItem) => item.workload === "Heavy"
    ).length,
  };

  const filteredDistribution: WorkloadItem[] = selectedWorkload
    ? distribution.filter(
        (item: WorkloadItem) => item.workload === selectedWorkload
      )
    : distribution;

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case "Light":
        return "text-green-500";
      case "Medium":
        return "text-orange-500";
      case "Heavy":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getWorkProgressColor = (workload: string) => {
    switch (workload) {
      case "Light":
        return "bg-green-500";
      case "Medium":
        return "bg-orange-500";
      case "Heavy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getWorkloadBgColor = (workload: string) => {
    switch (workload) {
      case "Light":
        return "bg-gradient-to-br from-green-50 via-green-100 to-green-200";
      case "Medium":
        return "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200";
      case "Heavy":
        return "bg-gradient-to-br from-red-50 via-red-100 to-red-200";
      default:
        return "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200";
    }
  };

  const getGroupIcon = (groupBy: string) => {
    switch (groupBy) {
      case "user":
        return Users;
      case "district":
        return MapPin;
      case "contractor":
        return Building;
      case "status":
        return CheckCircle;
      case "fund":
        return DollarSign;
      default:
        return Activity;
    }
  };

  const getItemLabel = (item: WorkloadItem) => {
    if (item.user) {
      return item.user.userName;
    }
    return (
      item.district || item.contractor || item.status || item.fund || "Unknown"
    );
  };

  const getItemSubtitle = (item: WorkloadItem) => {
    if (item.user) {
      return item.user.userRole;
    }
    return `${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const GroupIcon = getGroupIcon(groupBy);

  return (
    <Card className="border-0 shadow-sm rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Workload Distribution
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-white" />
              <div>
                <div className="text-lg font-semibold text-white">
                  {summary.totalProjects || 0}
                </div>
                <div className="text-sm text-blue-100">Total Projects</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 via-green-400 to-green-300 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-white" />
              <div>
                <div className="text-lg font-semibold text-white">
                  {summary.avgCompletionRate || 0}%
                </div>
                <div className="text-sm text-green-100">Avg Completion</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <GroupIcon className="h-6 w-6 text-white" />
              <div>
                <div className="text-lg font-semibold text-white">
                  {summary.totalEntries || 0}
                </div>
                <div className="text-sm text-purple-100">{`Total Engineers`}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-white" />
              <div>
                <div className="text-lg font-semibold text-white">
                  {workloadCounts.Heavy}
                </div>
                <div className="text-sm text-orange-100">Heavy Workload</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            Filter by workload:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedWorkload(null)}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                selectedWorkload === null
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({distribution.length})
            </button>
            {Object.entries(workloadCounts).map(([workload, count]) => (
              <button
                key={workload}
                onClick={() => setSelectedWorkload(workload)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  selectedWorkload === workload
                    ? `${getWorkProgressColor(workload)} text-white`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {workload} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Workload Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDistribution.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${getWorkloadBgColor(
                item.workload
              )} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GroupIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {getItemLabel(item)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getItemSubtitle(item)}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${getWorkloadColor(
                    item.workload
                  )}`}
                >
                  {item.workload}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projects:</span>
                  <span className="font-medium text-gray-900">
                    {item.projectCount}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(item.totalValue)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(item.completionRate)}%
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Progress:</span>
                  <span className="font-medium text-gray-900">
                    {item.avgProgress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getWorkProgressColor(
                        item.workload
                      )}`}
                      style={{ width: `${Math.min(item.avgProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDistribution.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {selectedWorkload} Workload Found
            </h3>
            <p className="text-gray-500">
              Try selecting a different workload filter.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
