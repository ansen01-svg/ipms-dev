"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FinancialProgressHistoryResponse,
  FinancialProgressUpdate,
} from "@/types/projects.types";
import { formatCurrency } from "@/utils/projects/format-helpers";
import { getFinancialProgressHistory } from "@/utils/projects/progress";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DocumentViewer } from "./docs-viewer";

interface FinancialProgressHistoryProps {
  projectId: string;
  currentBillAmount: number;
  workValue: number;
}

export function FinancialProgressHistory({
  projectId,
}: FinancialProgressHistoryProps) {
  const [historyData, setHistoryData] = useState<
    FinancialProgressHistoryResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getFinancialProgressHistory(projectId, page, 10);
        setHistoryData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load financial progress history"
        );
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchHistory(currentPage);
  }, [projectId, currentPage, fetchHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAmountChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <DollarSign className="h-4 w-4 text-gray-400" />;
  };

  const getAmountChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (loading && !historyData) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <Button
          onClick={() => fetchHistory(currentPage)}
          size="sm"
          className="mt-2 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!historyData || historyData.history.updates.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No financial progress updates found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {historyData.summary.totalUpdates}
              </div>
              <div className="text-xs text-gray-500">Total Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                +{formatCurrency(historyData.summary.totalAmountIncrease)}
              </div>
              <div className="text-xs text-gray-500">Total Increase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {historyData.summary.avgAmountChange >= 0 ? "+" : ""}
                {formatCurrency(historyData.summary.avgAmountChange)}
              </div>
              <div className="text-xs text-gray-500">Avg Change</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {historyData.summary.totalFilesUploaded}
              </div>
              <div className="text-xs text-gray-500">Files Uploaded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-600">
                {historyData.summary.avgProgressChange.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Avg Progress Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Progress Updates List */}
      <div className="space-y-4">
        {historyData.history.updates.map((update: FinancialProgressUpdate) => (
          <Card key={update._id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getAmountChangeIcon(update.amountDifference)}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Financial Progress Update
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatDate(
                        typeof update.createdAt === "string"
                          ? update.createdAt
                          : update.createdAt.toISOString()
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${getAmountChangeColor(
                      update.amountDifference
                    )}`}
                  >
                    {formatCurrency(update.previousBillAmount)} →{" "}
                    {formatCurrency(update.newBillAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {update.previousFinancialProgress}% →{" "}
                    {update.newFinancialProgress}%
                  </div>
                  <div
                    className={`text-xs ${getAmountChangeColor(
                      update.amountDifference
                    )}`}
                  >
                    {update.amountDifference > 0 ? "+" : ""}
                    {formatCurrency(update.amountDifference)} (
                    {update.progressDifference > 0 ? "+" : ""}
                    {update.progressDifference.toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Updated By */}
              <div className="mb-4 text-sm text-gray-600">
                Updated by:{" "}
                <span className="font-medium">{update.updatedBy.userName}</span>
                ({update.updatedBy.userDesignation})
              </div>

              {/* Bill Details */}
              {(update.billDetails?.billNumber ||
                update.billDetails?.billDate ||
                update.billDetails?.billDescription) && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3">
                    Bill Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {update.billDetails.billNumber && (
                      <div>
                        <span className="text-blue-700 font-medium">
                          Bill Number:
                        </span>
                        <div className="text-blue-800 font-mono">
                          {update.billDetails.billNumber}
                        </div>
                      </div>
                    )}
                    {update.billDetails.billDate && (
                      <div>
                        <span className="text-blue-700 font-medium">
                          Bill Date:
                        </span>
                        <div className="text-blue-800">
                          {new Date(
                            update.billDetails.billDate
                          ).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                    )}
                    {update.billDetails.billDescription && (
                      <div className="md:col-span-1">
                        <span className="text-blue-700 font-medium">
                          Description:
                        </span>
                        <div className="text-blue-800">
                          {update.billDetails.billDescription}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Remarks */}
              {update.remarks && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </h5>
                  <p className="text-sm text-gray-700">{update.remarks}</p>
                </div>
              )}

              {/* Supporting Documents */}
              {update.supportingDocuments &&
                update.supportingDocuments.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Supporting Documents ({update.supportingDocuments.length})
                    </h5>
                    <DocumentViewer documents={update.supportingDocuments} />
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {historyData.history.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={!historyData.history.hasPrevPage || loading}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            Page {historyData.history.currentPage} of{" "}
            {historyData.history.totalPages}
          </span>

          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!historyData.history.hasNextPage || loading}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
