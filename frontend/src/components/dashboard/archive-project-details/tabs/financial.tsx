"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { formatCurrency } from "@/utils/archive-projects/format-helpers";
import { Clock, DollarSign, FileText, TrendingUp } from "lucide-react";
import { FinancialProgressHistory } from "../financial-progress-history";

interface ArchiveFinancialTabProps {
  project: DbArchiveProject;
}

export default function ArchiveFinancialTab({
  project,
}: ArchiveFinancialTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Financial Details & History
        </h3>
        <div className="flex gap-2">
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
            {project.financialProgress || 0}% Financial Progress
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs ${
              (project.financialProgress || 0) === 100
                ? "border-green-500 text-green-700"
                : "border-orange-500 text-orange-700"
            }`}
          >
            {formatCurrency(
              (project.workValue || 0) - (project.billSubmittedAmount || 0)
            )}{" "}
            Remaining
          </Badge>
        </div>
      </div>

      {/* Current Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Work Value Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm">Work Value</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(project.workValue)}
              </div>
              <div className="text-xs text-gray-600">Contract Amount</div>
            </div>
          </CardContent>
        </Card>

        {/* AA Amount Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm">AA Amount</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(project.AAAmount)}
              </div>
              <div className="text-xs text-gray-600">Sanctioned Amount</div>
            </div>
          </CardContent>
        </Card>

        {/* Bill Submitted Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-sm">Bill Submitted</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatCurrency(project.billSubmittedAmount || 0)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(project.financialProgress || 0, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {project.financialProgress || 0}% Submitted
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Update Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-sm">Last Update</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600 mb-2">
                {project.lastFinancialProgressUpdate
                  ? new Date(
                      project.lastFinancialProgressUpdate
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "Never"}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {project.totalFinancialProgressUpdates || 0} total updates
              </div>
              <Badge variant="outline" className="text-xs">
                {project.financialProgressUpdatesEnabled !== false
                  ? "Updates Enabled"
                  : "Updates Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Breakdown Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Amounts */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    AA Amount
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(project.AAAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    Work Value
                  </span>
                  <span className="text-sm font-semibold text-blue-900">
                    {formatCurrency(project.workValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-700">
                    Bill Submitted
                  </span>
                  <span className="text-sm font-semibold text-purple-900">
                    {formatCurrency(project.billSubmittedAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <span className="text-sm font-bold text-orange-700">
                    Remaining Work Value
                  </span>
                  <span className="text-sm font-bold text-orange-900">
                    {formatCurrency(
                      (project.workValue || 0) -
                        (project.billSubmittedAmount || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Progress & Status */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">
                  Financial Progress
                </h5>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {project.financialProgress || 0}%
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Bill Utilization
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          project.financialProgress || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <Badge
                  className={`w-full justify-center text-xs ${
                    (project.financialProgress || 0) === 100
                      ? "bg-green-50 text-green-600 border-green-200"
                      : (project.financialProgress || 0) > 0
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {project.financialProgressStatus ||
                    project.progressStatus ||
                    "Not Started"}
                </Badge>
              </div>

              {/* Bill Information */}
              {project.billNumber && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Current Bill Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bill Number:</span>
                      <span className="font-medium font-mono text-gray-900">
                        {project.billNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(project.billSubmittedAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
  );
}
