"use client";

import { MBFilterProvider, MBFilters } from "@/components/dashboard/mb/filters";
import { MBTable } from "@/components/dashboard/mb/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { MBPaginationData, MeasurementBook } from "@/types/mb.types";
import { mbApiService } from "@/utils/mb/api-service";
import { AlertTriangle, Download, Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MeasurementBooksPage() {
  const router = useRouter();
  const [measurementBooks, setMeasurementBooks] = useState<MeasurementBook[]>(
    []
  );
  const [pagination, setPagination] = useState<
    MBPaginationData["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Project search states
  const [searchingProject, setSearchingProject] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");

  // Detail view states
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMB, setSelectedMB] = useState<MeasurementBook | null>(null);

  const { user } = useAuth();

  // Load all measurement books initially
  const loadAllMeasurementBooks = useCallback(
    async (isRefresh = false, page = 1) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const data: MBPaginationData = await mbApiService.getAllMBs({
          page,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        // Safely set data with fallbacks
        setMeasurementBooks(data.measurementBooks || []);
        setPagination(data.pagination || null);
        setCurrentProjectId("");
      } catch (err) {
        console.error("Error loading measurement books:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load measurement books";
        setError(errorMessage);
        toast.error(errorMessage);

        // Reset data on error
        setMeasurementBooks([]);
        setPagination(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Load measurement books for a specific project
  const loadProjectMeasurementBooks = useCallback(
    async (projectId: string, page = 1) => {
      try {
        setSearchingProject(true);
        setError(null);

        const data: MBPaginationData = await mbApiService.getMBsForProject(
          projectId,
          {
            page,
            limit: 20,
            sortBy: "createdAt",
            sortOrder: "desc",
          }
        );

        // Safely set data with fallbacks
        setMeasurementBooks(data.measurementBooks || []);
        setPagination(data.pagination || null);
        setCurrentProjectId(projectId);
        setCurrentPage(1);

        const mbCount = data.measurementBooks?.length || 0;
        if (mbCount === 0) {
          toast.info("No measurement books found for this project");
        } else {
          toast.success(`Found ${mbCount} measurement books for project`);
        }
      } catch (err) {
        console.error("Error loading project measurement books:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load measurement books for project";
        setError(errorMessage);
        toast.error(errorMessage);

        // If project not found or error, fall back to all MBs
        if (
          err instanceof Error &&
          (err.message.includes("not found") || err.message.includes("Invalid"))
        ) {
          loadAllMeasurementBooks();
        } else {
          // Reset data on other errors
          setMeasurementBooks([]);
          setPagination(null);
        }
      } finally {
        setSearchingProject(false);
      }
    },
    [loadAllMeasurementBooks]
  );

  // Initial load
  useEffect(() => {
    loadAllMeasurementBooks();
  }, [loadAllMeasurementBooks]);

  // Handle project search
  const handleProjectSearch = useCallback(
    (projectId: string) => {
      if (projectId.trim()) {
        loadProjectMeasurementBooks(projectId.trim());
      }
    },
    [loadProjectMeasurementBooks]
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (currentProjectId) {
      loadProjectMeasurementBooks(currentProjectId, page);
    } else {
      loadAllMeasurementBooks(false, page);
    }
  };

  // Handle view MB details
  const handleViewMB = (mb: MeasurementBook) => {
    setSelectedMB(mb);
    setShowDetailDialog(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (currentProjectId) {
      loadProjectMeasurementBooks(currentProjectId, currentPage);
    } else {
      loadAllMeasurementBooks(true, currentPage);
    }
  };

  // Reset to show all MBs
  const handleShowAllMBs = () => {
    loadAllMeasurementBooks();
    setCurrentPage(1);
  };

  // Navigate to new MB page
  const handleNewMB = () => {
    router.push("/dashboard/mb/new");
  };

  // Download file helper
  const handleDownloadFile = useCallback((mb: MeasurementBook) => {
    try {
      if (!mb || !mb.uploadedFile || !mb.uploadedFile.downloadURL) {
        toast.error("File download URL not available");
        return;
      }

      const downloadUrl = mb.uploadedFile.downloadURL;
      const fileName =
        mb.uploadedFile.originalName || mb.uploadedFile.fileName || "download";

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Measurement Books
          </h1>
          <p className="text-gray-600">
            View and manage measurement books across all projects
          </p>
        </div>
        {user?.role === "JE" && (
          <Button
            onClick={handleNewMB}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            New MB
          </Button>
        )}
      </div>

      {/* Main Content */}
      <MBFilterProvider>
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Measurement Books (
                {pagination?.totalCount || measurementBooks.length})
              </h2>
              {currentProjectId && (
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Project: {currentProjectId}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {currentProjectId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowAllMBs}
                  disabled={loading}
                >
                  Show All MBs
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <MBFilters
            measurementBooks={measurementBooks}
            onProjectIdSearch={handleProjectSearch}
            isSearching={searchingProject}
          />

          {/* Table */}
          {error ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-red-600">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Failed to load measurement books
                  </h3>
                  <p className="text-sm mb-4">{error}</p>
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <MBTable
              measurementBooks={measurementBooks}
              onViewMB={handleViewMB}
              // pagination={pagination}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </div>
      </MBFilterProvider>

      {/* Detail View Dialog */}
      {showDetailDialog && selectedMB && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Measurement Book Details</DialogTitle>
              <DialogDescription>
                Detailed information about the measurement book
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Project Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Project Information
                </h4>
                {selectedMB.project ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">
                        Project Name:
                      </span>
                      <div className="mt-1">
                        {selectedMB.project.projectName}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Work Order:
                      </span>
                      <div className="mt-1">
                        {selectedMB.project.workOrderNumber}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        District:
                      </span>
                      <div className="mt-1">{selectedMB.project.district}</div>
                    </div>
                    {selectedMB.project.state && (
                      <div>
                        <span className="font-medium text-gray-600">
                          State:
                        </span>
                        <div className="mt-1">{selectedMB.project.state}</div>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-600">
                        Estimated Cost:
                      </span>
                      <div className="mt-1">
                        ₹
                        {selectedMB.project.estimatedCost?.toLocaleString() ||
                          "N/A"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-yellow-50 rounded-lg">
                    Project information is not available for this measurement
                    book.
                  </div>
                )}
              </div>

              {/* MB Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedMB.description}
                </div>
              </div>

              {selectedMB.remarks && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Remarks</h4>
                  <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                    {selectedMB.remarks}
                  </div>
                </div>
              )}

              {/* File Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  File Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      File Name:
                    </span>
                    <div className="mt-1">
                      {selectedMB.uploadedFile.originalName}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      File Type:
                    </span>
                    <div className="mt-1 capitalize">
                      {selectedMB.uploadedFile.fileType}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      MIME Type:
                    </span>
                    <div className="mt-1">
                      {selectedMB.uploadedFile.mimeType}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      File Size:
                    </span>
                    <div className="mt-1">
                      {selectedMB.humanReadableFileSize ||
                        `${(
                          selectedMB.uploadedFile.fileSize /
                          (1024 * 1024)
                        ).toFixed(2)} MB`}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Uploaded:</span>
                    <div className="mt-1">
                      {formatDate(selectedMB.uploadedFile.uploadedAt)}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={() => handleDownloadFile(selectedMB)}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedMB.uploadedFile.downloadURL}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>

              {/* Creation Information */}
              <div className="pt-4 border-t text-xs text-gray-500">
                <div>
                  Created by {selectedMB.createdBy.name} (
                  {selectedMB.createdBy.role}) on{" "}
                  {formatDate(selectedMB.createdAt)}
                </div>
                {selectedMB.lastModifiedBy && (
                  <div className="mt-1">
                    Last modified by {selectedMB.lastModifiedBy.name} on{" "}
                    {formatDate(selectedMB.lastModifiedBy.modifiedAt)}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
