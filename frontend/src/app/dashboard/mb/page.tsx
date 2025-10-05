"use client";

import { MBFilterProvider, MBFilters } from "@/components/dashboard/mb/filters";
import { MBTable } from "@/components/dashboard/mb/table";
import { MBDetailDialog } from "@/components/dashboard/mb/view-mb-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { DbMeasurementBook, MBListResponse } from "@/types/mb.types";
import { mbApiService } from "@/utils/mb/api-service";
import { generateMBCSV, generateMBPDF } from "@/utils/mb/pdf-csv-helpers";
import {
  AlertTriangle,
  Archive,
  FileText,
  FolderOpen,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MeasurementBooksPage() {
  const router = useRouter();
  const [measurementBooks, setMeasurementBooks] = useState<DbMeasurementBook[]>(
    []
  );
  const [pagination, setPagination] = useState<
    MBListResponse["data"]["pagination"] | null
  >(null);
  const [summary, setSummary] = useState<
    MBListResponse["data"]["summary"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [searchingProject, setSearchingProject] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMB, setSelectedMB] = useState<DbMeasurementBook | null>(null);

  const { user } = useAuth();

  const loadAllMeasurementBooks = useCallback(
    async (isRefresh = false, page = 1) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const data = await mbApiService.getAllMBs({
          page,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setMeasurementBooks(data.measurementBooks || []);
        setPagination(data.pagination || null);
        setSummary(data.summary || null);
        setCurrentProjectId("");
      } catch (err) {
        console.error("Error loading measurement books:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load measurement books";
        setError(errorMessage);
        toast.error(errorMessage);
        setMeasurementBooks([]);
        setPagination(null);
        setSummary(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const loadProjectMeasurementBooks = useCallback(
    async (projectId: string, page = 1) => {
      try {
        setSearchingProject(true);
        setError(null);

        const data = await mbApiService.getMBsByProject(projectId, {
          page,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setMeasurementBooks(data.measurementBooks || []);
        setPagination(data.pagination || null);
        setSummary(data.summary || null);
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

        if (
          err instanceof Error &&
          (err.message.includes("not found") || err.message.includes("Invalid"))
        ) {
          loadAllMeasurementBooks();
        } else {
          setMeasurementBooks([]);
          setPagination(null);
          setSummary(null);
        }
      } finally {
        setSearchingProject(false);
      }
    },
    [loadAllMeasurementBooks]
  );

  useEffect(() => {
    loadAllMeasurementBooks();
  }, [loadAllMeasurementBooks]);

  const handleProjectSearch = useCallback(
    (projectId: string) => {
      if (projectId.trim()) {
        loadProjectMeasurementBooks(projectId.trim());
      }
    },
    [loadProjectMeasurementBooks]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (currentProjectId) {
      loadProjectMeasurementBooks(currentProjectId, page);
    } else {
      loadAllMeasurementBooks(false, page);
    }
  };

  const handleViewMB = (mb: DbMeasurementBook) => {
    setSelectedMB(mb);
    setShowDetailDialog(true);
  };

  const handleDownloadMB = async (
    mb: DbMeasurementBook,
    format: "pdf" | "csv"
  ) => {
    try {
      if (format === "pdf") {
        await generateMBPDF(mb);
        toast.success("PDF downloaded successfully");
      } else {
        generateMBCSV(mb);
        toast.success("CSV downloaded successfully");
      }
    } catch (error) {
      console.error("Error downloading MB:", error);
      toast.error(`Failed to download ${format.toUpperCase()}`);
    }
  };

  const handleRefresh = () => {
    if (currentProjectId) {
      loadProjectMeasurementBooks(currentProjectId, currentPage);
    } else {
      loadAllMeasurementBooks(true, currentPage);
    }
  };

  const handleShowAllMBs = () => {
    loadAllMeasurementBooks();
    setCurrentPage(1);
  };

  const handleNewMB = () => {
    router.push("/dashboard/mb/new");
  };

  const totalMBs = summary?.total || 0;
  const projectMBs = summary?.byProjectType?.Project || 0;
  const archiveMBs = summary?.byProjectType?.ArchiveProject || 0;

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MBs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalMBs}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Project MBs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {projectMBs}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Archive MBs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {archiveMBs}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Archive className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <MBFilterProvider>
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
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
              onDownloadMB={handleDownloadMB}
              pagination={pagination ?? undefined}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </div>
      </MBFilterProvider>

      {/* Detail View Dialog */}
      {showDetailDialog && selectedMB && (
        <MBDetailDialog
          mb={selectedMB}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </div>
  );
}
