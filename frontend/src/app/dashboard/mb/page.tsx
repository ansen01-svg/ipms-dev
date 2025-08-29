"use client";

import { MBFilterProvider, MBFilters } from "@/components/dashboard/mb/filters";
import { MBForm } from "@/components/dashboard/mb/mb-form";
import { MBTable } from "@/components/dashboard/mb/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArchiveProjectsForSelection } from "@/hooks/useArchiveProjects";
import {
  CreateMBData,
  MBPaginationData,
  MBStatistics,
  MeasurementBook,
  UpdateMBData,
} from "@/types/mb.types";
import { mbApiService } from "@/utils/mb/api-service";
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  FileText,
  FolderOpen,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MeasurementBooksPage() {
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useArchiveProjectsForSelection();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [measurementBooks, setMeasurementBooks] = useState<MeasurementBook[]>(
    []
  );
  const [statistics, setStatistics] = useState<MBStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMB, setEditingMB] = useState<MeasurementBook | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Detail view states
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMB, setSelectedMB] = useState<MeasurementBook | null>(null);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingMB, setDeletingMB] = useState<MeasurementBook | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadMeasurementBooks = useCallback(
    async (isRefresh = false) => {
      if (!selectedProjectId) return;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const data: MBPaginationData = await mbApiService.getMBsForProject(
          selectedProjectId,
          {
            limit: 100, // Load all for client-side filtering
          }
        );

        setMeasurementBooks(data.measurementBooks);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load measurement books";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedProjectId]
  );

  // console.log(projects);

  // const loadStatistics = useCallback(async () => {
  //   if (!selectedProjectId) return;

  //   try {
  //     const stats = await mbApiService.getMBStatistics(selectedProjectId);
  //     setStatistics(stats);
  //   } catch (err) {
  //     console.error("Error loading statistics:", err);
  //     // Don't show error for statistics as it's not critical
  //   }
  // }, [selectedProjectId]);

  // Load MBs when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      loadMeasurementBooks();
      // loadStatistics();
    } else {
      setMeasurementBooks([]);
      setStatistics(null);
    }
  }, [selectedProjectId, loadMeasurementBooks]);

  const handleCreateMB = async (data: CreateMBData) => {
    try {
      setFormLoading(true);
      await mbApiService.createMB(data);
      toast.success("Measurement book created successfully");
      setShowCreateForm(false);
      loadMeasurementBooks(true);
      // loadStatistics();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create measurement book";
      toast.error(errorMessage);
      throw err; // Re-throw to prevent dialog from closing
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMB = async (data: UpdateMBData) => {
    if (!editingMB) return;

    try {
      setFormLoading(true);
      await mbApiService.updateMB(editingMB._id, data);
      toast.success("Measurement book updated successfully");
      setShowEditForm(false);
      setEditingMB(null);
      loadMeasurementBooks(true);
      // loadStatistics();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update measurement book";
      toast.error(errorMessage);
      throw err; // Re-throw to prevent dialog from closing
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMB = async () => {
    if (!deletingMB) return;

    try {
      setDeleteLoading(true);
      await mbApiService.deleteMB(deletingMB._id);
      toast.success("Measurement book deleted successfully");
      setShowDeleteDialog(false);
      setDeletingMB(null);
      loadMeasurementBooks(true);
      // loadStatistics();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete measurement book";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportMBs = async () => {
    if (!selectedProjectId) return;

    try {
      await mbApiService.exportMBData(selectedProjectId);
      toast.success("Export started successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export data";
      toast.error(errorMessage);
    }
  };

  const handleViewMB = (mb: MeasurementBook) => {
    setSelectedMB(mb);
    setShowDetailDialog(true);
  };

  const handleEditMB = (mb: MeasurementBook) => {
    setEditingMB(mb);
    setShowEditForm(true);
  };

  const handleDeleteClick = (mb: MeasurementBook) => {
    setDeletingMB(mb);
    setShowDeleteDialog(true);
  };

  interface ProjectOption {
    id: string;
    name: string;
    workOrderNumber: string;
    location?: string;
  }

  const selectedProject: ProjectOption | undefined = projects.find(
    (p: ProjectOption) => p.id === selectedProjectId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Measurement Books
          </h1>
          <p className="text-gray-600">
            Manage measurement books for your construction projects
          </p>
        </div>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
          <CardDescription>
            Choose a project to view and manage its measurement books
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={projectsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      projectsLoading
                        ? "Loading projects..."
                        : projectsError
                        ? "Error loading projects"
                        : "Select a project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project, index) => (
                    // <SelectItem key={project.id} value={project.id}>
                    <SelectItem key={index} value={project.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-sm text-gray-500">
                          {project.location} • {project.workOrderNumber}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `/dashboard/archived-projects/${selectedProject.id}`,
                    "_blank"
                  )
                }
                className="whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {selectedProjectId && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total MBs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {statistics.overview.totalMBs}
              </div>
              <p className="text-xs text-muted-foreground">
                All measurement books
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statistics.overview.statusBreakdown.Approved || 0}
              </div>
              <p className="text-xs text-muted-foreground">Approved MBs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Under Review
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.overview.statusBreakdown["Under Review"] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <FolderOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {statistics.overview.statusBreakdown.Draft || 0}
              </div>
              <p className="text-xs text-muted-foreground">Draft MBs</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {selectedProjectId ? (
        <MBFilterProvider>
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Measurement Books ({measurementBooks.length})
                </h2>
                {selectedProject && (
                  <span className="text-sm text-gray-500">
                    • {selectedProject.name}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMeasurementBooks(true)}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>

                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New MB
                </Button>
              </div>
            </div>

            {/* Filters */}
            <MBFilters
              measurementBooks={measurementBooks}
              onExport={handleExportMBs}
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
                      onClick={() => loadMeasurementBooks(true)}
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
                onEditMB={handleEditMB}
                onDeleteMB={handleDeleteClick}
                isLoading={loading}
              />
            )}
          </div>
        </MBFilterProvider>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
              <p className="text-sm">
                Please select a project above to view and manage its measurement
                books.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form Dialog */}
      {showCreateForm && (
        <MBForm
          mode="create"
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateMB}
          projectOptions={projects.map((p) => ({
            id: p.id,
            name: p.name,
            workOrderNumber: p.workOrderNumber,
          }))}
          isLoading={formLoading}
        />
      )}

      {/* Edit Form Dialog */}
      {showEditForm && editingMB && (
        <MBForm
          mode="edit"
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingMB(null);
          }}
          onSubmit={handleUpdateMB}
          measurementBook={editingMB}
          isLoading={formLoading}
        />
      )}

      {/* Detail View Dialog */}
      {showDetailDialog && selectedMB && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMB.title}</DialogTitle>
              <DialogDescription>Measurement Book Details</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">MB Number:</span>
                  <div className="mt-1">{selectedMB.mbNumber}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        selectedMB.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : selectedMB.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : selectedMB.status === "Under Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedMB.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Measurement Date:
                  </span>
                  <div className="mt-1">
                    {new Date(selectedMB.measurementDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Contractor:</span>
                  <div className="mt-1">
                    {selectedMB.contractorName || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Work Order:</span>
                  <div className="mt-1">
                    {selectedMB.workOrderNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">File:</span>
                  <div className="mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedMB.fileUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {selectedMB.uploadedFile.originalName}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedMB.description}
                </div>
              </div>

              {selectedMB.remarks && (
                <div>
                  <span className="font-medium text-gray-600">Remarks:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedMB.remarks}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-xs text-gray-500">
                <div>
                  Created by {selectedMB.createdBy.name} on{" "}
                  {new Date(selectedMB.createdAt).toLocaleString()}
                </div>
                {selectedMB.lastModifiedBy && (
                  <div className="mt-1">
                    Last modified by {selectedMB.lastModifiedBy.name} on{" "}
                    {new Date(
                      selectedMB.lastModifiedBy.modifiedAt
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deletingMB && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Delete Measurement Book
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this measurement book? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium">{deletingMB.title}</div>
              <div className="text-sm text-gray-500">{deletingMB.mbNumber}</div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteMB}
                disabled={deleteLoading}
              >
                {deleteLoading && (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
