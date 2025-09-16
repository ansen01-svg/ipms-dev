"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { formatCurrency } from "@/utils/archive-projects/format-helpers";
import { BarChart3, FileText, IndianRupee, TrendingUp } from "lucide-react";
import { useState } from "react";
import { FinancialProgressHistory } from "../financial-progress-history";
import { ProgressHistory } from "../progress-history";

interface ArchiveProgressTabProps {
  project: DbArchiveProject;
}

type ProgressViewMode = "overview" | "physical" | "financial";

export default function ArchiveProgressTab({
  project,
}: ArchiveProgressTabProps) {
  const [viewMode, setViewMode] = useState<ProgressViewMode>("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Progress Overview & History
        </h3>
        <div className="flex gap-2">
          <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
            {project.progress || 0}% Physical
          </Badge>
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
            {project.financialProgress || 0}% Financial
          </Badge>
          {(project.progress || 0) === 100 &&
            (project.financialProgress || 0) === 100 && (
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">
                Fully Complete
              </Badge>
            )}
        </div>
      </div>

      {/* Progress View Mode Selector */}
      <div className="flex gap-2 border-b border-gray-200">
        <Button
          variant={viewMode === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("overview")}
          className="rounded-b-none"
        >
          Overview
        </Button>
        <Button
          variant={viewMode === "physical" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("physical")}
          className="rounded-b-none"
        >
          Physical Progress
        </Button>
        <Button
          variant={viewMode === "financial" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("financial")}
          className="rounded-b-none"
        >
          Financial Progress
        </Button>
      </div>

      {/* Overview Mode */}
      {viewMode === "overview" && (
        <>
          {/* Current Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Physical Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Physical Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {project.progress || 0}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(project.progress || 0, 100)}%`,
                      }}
                    />
                  </div>
                  <Badge
                    className={`text-xs ${
                      (project.progress || 0) === 100
                        ? "bg-green-50 text-green-600 border-green-200"
                        : (project.progress || 0) > 0
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    }`}
                  >
                    {project.progressStatus || "Not Started"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Financial Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm">Financial Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {project.financialProgress || 0}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          project.financialProgress || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatCurrency(project.billSubmittedAmount || 0)} /{" "}
                    {formatCurrency(project.workValue)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Progress Updates */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-sm">Physical Updates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {project.totalProgressUpdates || 0}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Total Updates
                  </div>
                  <div className="text-xs text-gray-500">
                    Last:{" "}
                    {project.lastProgressUpdate
                      ? new Date(project.lastProgressUpdate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )
                      : "Never"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Progress Updates */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-sm">Financial Updates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {project.totalFinancialProgressUpdates || 0}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Total Updates
                  </div>
                  <div className="text-xs text-gray-500">
                    Last:{" "}
                    {project.lastFinancialProgressUpdate
                      ? new Date(
                          project.lastFinancialProgressUpdate
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "Never"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Side-by-side Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-900">
                        Physical Progress
                      </h5>
                      <span className="text-lg font-semibold text-green-600">
                        {project.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(project.progress || 0, 100)}%`,
                        }}
                      >
                        {(project.progress || 0) > 10 && (
                          <span className="text-white text-xs font-medium">
                            {project.progress || 0}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Status: {project.progressStatus || "Not Started"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-900">
                        Financial Progress
                      </h5>
                      <span className="text-lg font-semibold text-blue-600">
                        {project.financialProgress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(
                            project.financialProgress || 0,
                            100
                          )}%`,
                        }}
                      >
                        {(project.financialProgress || 0) > 10 && (
                          <span className="text-white text-xs font-medium">
                            {project.financialProgress || 0}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Bill: {formatCurrency(project.billSubmittedAmount || 0)}
                    </div>
                  </div>
                </div>

                {/* Progress Gap Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Progress Analysis
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {Math.abs(
                          (project.progress || 0) -
                            (project.financialProgress || 0)
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-gray-600">Progress Gap</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {Math.round(
                          ((project.progress || 0) +
                            (project.financialProgress || 0)) /
                            2
                        )}
                        %
                      </div>
                      <div className="text-gray-600">Average Progress</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-semibold ${
                          (project.progress || 0) === 100 &&
                          (project.financialProgress || 0) === 100
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {(project.progress || 0) === 100 &&
                        (project.financialProgress || 0) === 100
                          ? "Complete"
                          : "In Progress"}
                      </div>
                      <div className="text-gray-600">Overall Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Physical Progress Mode */}
      {viewMode === "physical" && (
        <div className="space-y-6">
          {/* Physical Progress Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">
                  Physical Progress Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {project.progress || 0}%
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Current Progress
                  </div>
                  <Badge
                    className={`text-xs ${
                      (project.progress || 0) === 100
                        ? "bg-green-50 text-green-600 border-green-200"
                        : (project.progress || 0) > 0
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    }`}
                  >
                    {project.progressStatus || "Not Started"}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    {project.totalProgressUpdates || 0}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Total Updates
                  </div>
                  <div className="text-xs text-gray-600">
                    {project.lastProgressUpdate && (
                      <>
                        Last:{" "}
                        {new Date(
                          project.lastProgressUpdate
                        ).toLocaleDateString("en-IN")}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {(100 - (project.progress || 0)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Remaining Work
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      project.progressUpdatesEnabled !== false
                        ? "border-green-500 text-green-700"
                        : "border-red-500 text-red-700"
                    }`}
                  >
                    {project.progressUpdatesEnabled !== false
                      ? "Updates Enabled"
                      : "Updates Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Progress History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Physical Progress Update History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressHistory
                projectId={project._id}
                currentProgress={project.progress || 0}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Progress Mode */}
      {viewMode === "financial" && (
        <div className="space-y-6">
          {/* Financial Progress Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">
                  Financial Progress Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {project.financialProgress || 0}%
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Financial Progress
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatCurrency(project.billSubmittedAmount || 0)} /{" "}
                    {formatCurrency(project.workValue)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    {project.totalFinancialProgressUpdates || 0}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Financial Updates
                  </div>
                  <div className="text-xs text-gray-600">
                    {project.lastFinancialProgressUpdate && (
                      <>
                        Last:{" "}
                        {new Date(
                          project.lastFinancialProgressUpdate
                        ).toLocaleDateString("en-IN")}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {formatCurrency(
                      (project.workValue || 0) -
                        (project.billSubmittedAmount || 0)
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Remaining Amount
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      project.financialProgressUpdatesEnabled !== false
                        ? "border-green-500 text-green-700"
                        : "border-red-500 text-red-700"
                    }`}
                  >
                    {project.financialProgressUpdatesEnabled !== false
                      ? "Updates Enabled"
                      : "Updates Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Progress History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Financial Progress Update History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialProgressHistory
                projectId={project._id}
                currentBillAmount={project.billSubmittedAmount || 0}
                workValue={project.workValue}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
