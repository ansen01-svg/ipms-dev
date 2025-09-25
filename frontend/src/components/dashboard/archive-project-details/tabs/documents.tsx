"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbArchiveProject } from "@/types/archive-projects.types";
import {
  ArchiveDocumentInfo,
  ArchiveProjectDocumentsResponse,
  downloadArchiveDocument,
  formatArchiveDate,
  formatArchiveDateTime,
  getArchiveCategoryColor,
  getArchiveFileTypeColor,
  getArchiveProjectDocuments,
  getArchiveSubcategoryColor,
  previewArchiveDocument,
} from "@/utils/archive-projects/documents";
import {
  Archive,
  Download,
  Eye,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  HardDrive,
  ImageIcon,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ArchiveDocumentsTabProps {
  project: DbArchiveProject;
}

// Helper function to get file type icon
const getFileTypeIcon = (fileType: string, fileExtension: string) => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "svg", "bmp"];
  const documentTypes = ["doc", "docx"];
  const spreadsheetTypes = ["xls", "xlsx", "csv"];

  if (imageTypes.includes(fileExtension.toLowerCase())) {
    return <ImageIcon className="h-6 w-6 text-purple-600" />;
  }
  if (fileType === "pdf" || fileExtension === "pdf") {
    return <FileText className="h-6 w-6 text-red-600" />;
  }
  if (documentTypes.includes(fileExtension.toLowerCase())) {
    return <FileText className="h-6 w-6 text-blue-600" />;
  }
  if (spreadsheetTypes.includes(fileExtension.toLowerCase())) {
    return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
  }
  return <FileIcon className="h-6 w-6 text-gray-600" />;
};

// Helper function to get icon for document category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Project Document":
      return <FolderOpen className="h-5 w-5 text-blue-600" />;
    case "Progress Document":
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    case "Query Document":
      return <Users className="h-5 w-5 text-orange-600" />;
    default:
      return <FileIcon className="h-5 w-5 text-gray-600" />;
  }
};

export default function ArchiveDocumentsTab({
  project,
}: ArchiveDocumentsTabProps) {
  const [documentsData, setDocumentsData] =
    useState<ArchiveProjectDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents on component mount
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArchiveProjectDocuments(project.projectId);
      setDocumentsData(response);
    } catch (error) {
      console.error("Error fetching archive project documents:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch documents"
      );
      toast.error("Failed to fetch archive project documents");
    } finally {
      setLoading(false);
    }
  }, [project.projectId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle document download
  const handleDownload = useCallback(async (document: ArchiveDocumentInfo) => {
    try {
      await downloadArchiveDocument(
        document.downloadURL,
        document.originalName
      );
      toast.success(`Downloading ${document.originalName}`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  }, []);

  // Handle document preview
  const handlePreview = useCallback(async (document: ArchiveDocumentInfo) => {
    try {
      await previewArchiveDocument(
        document.downloadURL,
        document.originalName,
        document.fileExtension
      );
    } catch (error) {
      console.error("Error previewing document:", error);
      toast.error("Failed to preview document");
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Archive Project Documents
            </h3>
          </div>
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-blue-200 rounded-full"></div>
          </div>
        </div>

        {/* Loading Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="text-right">
                    <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Content */}
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading documents...</p>
              <p className="text-gray-500 text-sm mt-1">
                Please wait while we fetch your documents
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Archive Project Documents
            </h3>
          </div>
        </div>

        <Card className="border-2 border-dashed border-red-300 bg-red-50">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <FileIcon className="h-8 w-8 text-red-400" />
            </div>
            <h4 className="text-xl font-semibold text-red-900 mb-3">
              Failed to Load Documents
            </h4>
            <p className="text-red-700 max-w-md mx-auto mb-4">{error}</p>
            <Button
              onClick={fetchDocuments}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!documentsData) {
    return null;
  }

  const { documentGroups, summary } = documentsData.data;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Archive className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Archive Project Documents
          </h3>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-sm font-medium px-3 py-1">
            {summary.totalDocuments} Total Files
          </Badge>
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-sm font-medium px-3 py-1">
            <HardDrive className="h-3 w-3 mr-1" />
            {summary.formattedTotalFileSize}
          </Badge>
          <Badge className="bg-green-50 text-green-700 border-green-200 text-sm font-medium px-3 py-1">
            {documentsData.data.projectInfo.financialYear}
          </Badge>
        </div>
      </div>

      {/* Document Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Documents Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm">Total Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {summary.totalDocuments}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="text-xs text-gray-600">All file types</div>
            </div>
          </CardContent>
        </Card>

        {/* Images Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-sm">Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {summary.documentsByType.images}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      summary.totalDocuments > 0
                        ? (summary.documentsByType.images /
                            summary.totalDocuments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">JPG, PNG, etc.</div>
            </div>
          </CardContent>
        </Card>

        {/* PDFs Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              <CardTitle className="text-sm">PDF Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {summary.documentsByType.pdfs}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      summary.totalDocuments > 0
                        ? (summary.documentsByType.pdfs /
                            summary.totalDocuments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">PDF files</div>
            </div>
          </CardContent>
        </Card>

        {/* Other Documents Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm">Other Files</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {summary.documentsByType.documents +
                  summary.documentsByType.spreadsheets +
                  summary.documentsByType.others}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      summary.totalDocuments > 0
                        ? ((summary.documentsByType.documents +
                            summary.documentsByType.spreadsheets +
                            summary.documentsByType.others) /
                            summary.totalDocuments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">DOC, XLS, etc.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Groups */}
      {summary.totalDocuments === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Archive className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              No Documents Found
            </h4>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              No documents have been uploaded for this archive project yet.
              Documents will appear here as they are added to different parts of
              the project.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* General Project Documents */}
          {documentGroups.projectDocuments.count > 0 && (
            <DocumentSection
              title={documentGroups.projectDocuments.label}
              description={documentGroups.projectDocuments.description}
              count={documentGroups.projectDocuments.count}
              documents={documentGroups.projectDocuments.documents}
              category="Project Document"
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          )}

          {/* Physical Progress Documents */}
          {documentGroups.physicalProgressDocuments.count > 0 && (
            <DocumentSection
              title={documentGroups.physicalProgressDocuments.label}
              description={documentGroups.physicalProgressDocuments.description}
              count={documentGroups.physicalProgressDocuments.count}
              documents={documentGroups.physicalProgressDocuments.documents}
              category="Progress Document"
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          )}

          {/* Financial Progress Documents */}
          {documentGroups.financialProgressDocuments.count > 0 && (
            <DocumentSection
              title={documentGroups.financialProgressDocuments.label}
              description={
                documentGroups.financialProgressDocuments.description
              }
              count={documentGroups.financialProgressDocuments.count}
              documents={documentGroups.financialProgressDocuments.documents}
              category="Progress Document"
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          )}

          {/* Query Documents */}
          {documentGroups.queryDocuments.count > 0 && (
            <DocumentSection
              title={documentGroups.queryDocuments.label}
              description={documentGroups.queryDocuments.description}
              count={documentGroups.queryDocuments.count}
              documents={documentGroups.queryDocuments.documents}
              category="Query Document"
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Document Section Component
interface DocumentSectionProps {
  title: string;
  description: string;
  count: number;
  documents: ArchiveDocumentInfo[];
  category: string;
  onDownload: (document: ArchiveDocumentInfo) => void;
  onPreview: (document: ArchiveDocumentInfo) => void;
}

function DocumentSection({
  title,
  description,
  count,
  documents,
  category,
  onDownload,
  onPreview,
}: DocumentSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getCategoryIcon(category)}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <Badge
          className={`${getArchiveCategoryColor(
            category
          )} text-sm font-medium px-3 py-1`}
        >
          {count} files
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <ArchiveDocumentCard
            key={doc.id}
            document={doc}
            onDownload={onDownload}
            onPreview={onPreview}
          />
        ))}
      </div>
    </div>
  );
}

// Archive Document Card Component
interface ArchiveDocumentCardProps {
  document: ArchiveDocumentInfo;
  onDownload: (document: ArchiveDocumentInfo) => void;
  onPreview: (document: ArchiveDocumentInfo) => void;
}

function ArchiveDocumentCard({
  document,
  onDownload,
  onPreview,
}: ArchiveDocumentCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(document);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    try {
      await onPreview(document);
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <Card className="border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-3">
          {getFileTypeIcon(document.fileType, document.fileExtension)}
        </div>

        <h4
          className="font-medium text-gray-900 text-sm mb-1 truncate"
          title={document.originalName}
        >
          {document.originalName}
        </h4>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge
            className={`text-xs ${getArchiveFileTypeColor(
              document.fileExtension
            )}`}
          >
            {document.fileExtension.toUpperCase()}
          </Badge>
          <Badge
            className={`text-xs ${getArchiveSubcategoryColor(
              document.subcategory
            )}`}
          >
            {document.subcategory}
          </Badge>
          <span className="text-xs text-gray-500">
            {document.formattedFileSize}
          </span>
        </div>

        <div className="text-xs text-gray-500 mb-3 space-y-1">
          <div>
            Uploaded by:{" "}
            {document.uploadedBy?.name ||
              document.uploadedBy?.userName ||
              "System"}
          </div>
          <div title={formatArchiveDateTime(document.uploadedAt)}>
            {formatArchiveDate(document.uploadedAt)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={handlePreview}
            disabled={isPreviewing}
          >
            {isPreviewing ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Eye className="h-3 w-3 mr-1" />
            )}
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
