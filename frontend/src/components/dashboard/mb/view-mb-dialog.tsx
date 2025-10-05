"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { DbMeasurementBook } from "@/types/mb.types";
import { DbProject } from "@/types/projects.types";
import { Download, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";

interface MBDetailDialogProps {
  mb: DbMeasurementBook;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MBDetailDialog({
  mb,
  open,
  onOpenChange,
}: MBDetailDialogProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const getProjectName = (project: DbProject | DbArchiveProject): string => {
    if ("projectName" in project) {
      return project.projectName;
    }
    if ("nameOfWork" in project) {
      return project.nameOfWork;
    }
    return "Unknown Project";
  };

  const getProjectId = (project: DbProject | DbArchiveProject) => {
    if (typeof project === "object") {
      return project?.projectId || "N/A";
    }
    return project || "N/A";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Measurement Book Details
          </DialogTitle>
          <DialogDescription>
            Complete information about measurement book {mb.mbId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* MB Basic Info */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold text-teal-900 mb-3">MB Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">MB ID:</span>
                <div className="mt-1 font-semibold text-teal-600">
                  {mb.mbId}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">MB No.:</span>
                <div className="mt-1">{mb.mbNo}</div>
              </div>
            </div>
          </div>

          {/* MB Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Work Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">
                  (1) Name of Work:
                </span>
                <div className="mt-1">{mb.nameOfWork}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">(2) Location:</span>
                <div className="mt-1">{mb.location}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  (3) Contractor:
                </span>
                <div className="mt-1">{mb.contractor}</div>
              </div>
              {mb.tenderAgreement && (
                <div>
                  <span className="font-medium text-gray-700">
                    (4) Tender Agreement:
                  </span>
                  <div className="mt-1">{mb.tenderAgreement}</div>
                </div>
              )}
              {mb.aaOrFsNo && (
                <div>
                  <span className="font-medium text-gray-700">
                    (6) A.A. or F.S. No.:
                  </span>
                  <div className="mt-1">
                    {mb.aaOrFsNo}
                    {mb.aaOrFsDate && ` - ${formatDate(mb.aaOrFsDate)}`}
                  </div>
                </div>
              )}
              {mb.slNoOfBill && (
                <div>
                  <span className="font-medium text-gray-700">
                    (7) SL No. of Bill:
                  </span>
                  <div className="mt-1">{mb.slNoOfBill}</div>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">
                  (8) Date of Commencement:
                </span>
                <div className="mt-1">{formatDate(mb.dateOfCommencement)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  (9) Date of Completion:
                </span>
                <div className="mt-1">{formatDate(mb.dateOfCompletion)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  (10) Date of Measurement:
                </span>
                <div className="mt-1">{formatDate(mb.dateOfMeasurement)}</div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">
              Project Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Project Type:</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    {mb.projectType}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Project ID:</span>
                <div className="mt-1">
                  {getProjectId(mb.project as DbProject | DbArchiveProject)}
                </div>
              </div>
              {typeof mb.project === "object" && mb.project && (
                <>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">
                      Project Name:
                    </span>
                    <div className="mt-1">{getProjectName(mb.project)}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Measurements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">
                Measurements ({mb.measurements?.length || 0})
              </h4>
            </div>
            <div className="space-y-3">
              {mb.measurements && mb.measurements.length > 0 ? (
                mb.measurements.map((measurement, index) => (
                  <div
                    key={measurement.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {measurement.id}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {measurement.description}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Unit:</span>{" "}
                          {measurement.unit}
                        </div>
                      </div>
                    </div>

                    {/* File Information */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {measurement.uploadedFile.originalName}
                          </span>
                          <span className="text-xs text-gray-500">
                            (
                            {(
                              measurement.uploadedFile.fileSize /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleViewFile(
                                measurement.uploadedFile.downloadURL
                              )
                            }
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownloadFile(
                                measurement.uploadedFile.downloadURL,
                                measurement.uploadedFile.originalName
                              )
                            }
                            className="text-teal-600 hover:text-teal-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No measurements available
                </div>
              )}
            </div>
          </div>

          {/* Creation Information */}
          <div className="pt-4 border-t text-xs text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Created by:</span>{" "}
                {mb.createdBy.name} ({mb.createdBy.role}) on{" "}
                {formatDate(mb.createdAt)}
              </div>
              {mb.lastModifiedBy && (
                <div>
                  <span className="font-medium">Last modified by:</span>{" "}
                  {mb.lastModifiedBy.name} on{" "}
                  {formatDate(mb.lastModifiedBy.modifiedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
