"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SupportingDocument } from "@/types/projects.types";
import { formatFileSize } from "@/utils/projects/format-helpers";
import { Download, Eye, FileText, ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface DocumentViewerProps {
  documents: SupportingDocument[];
  className?: string;
}

export function DocumentViewer({
  documents,
  className = "",
}: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] =
    useState<SupportingDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No supporting documents available
      </div>
    );
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-green-500" />;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "bg-blue-50 border-blue-200 text-blue-700";
    }
    return "bg-green-50 border-green-200 text-green-700";
  };

  // Fixed download handler
  const handleDownload = async (document: SupportingDocument) => {
    try {
      const downloadUrl = document.downloadURL;

      if (!downloadUrl) {
        throw new Error("Download URL not available");
      }

      // Fetch the file as blob
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.originalName || document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handlePreview = (document: SupportingDocument) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const canPreview = (mimeType: string) => {
    return mimeType.startsWith("image/") || mimeType === "application/pdf";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {documents.map((doc, index) => (
        <Card
          key={doc.originalName || doc.fileName || index}
          className="border border-gray-200"
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">{getFileIcon(doc.mimeType)}</div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.originalName || doc.fileName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getFileTypeColor(
                      doc.mimeType
                    )}`}
                  >
                    {(doc.fileType || doc.mimeType.split("/")[1]).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(doc.fileSize)}
                  </span>
                  {doc.uploadedAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {canPreview(doc.mimeType) && (
                  <Button
                    onClick={() => handlePreview(doc)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                )}

                <Button
                  onClick={() => handleDownload(doc)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-green-100"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-green-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Preview Modal */}
      {previewOpen && selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedDocument(null);
          }}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}

// Document Preview Modal Component
interface DocumentPreviewModalProps {
  document: SupportingDocument;
  onClose: () => void;
  onDownload: (doc: SupportingDocument) => void;
}

function DocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(document);

  // Get preview URL from either downloadURL or fileUrl
  const getPreviewUrl = () => {
    return document.downloadURL;
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError("Failed to load image");
  };

  const previewUrl = getPreviewUrl();

  // Validate that URL exists
  if (!previewUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Error</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center py-4">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-red-600">
              Download URL not available for this document
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            {document.mimeType.startsWith("image/") ? (
              <ImageIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-green-500" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {document.originalName || document.fileName}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(document.fileSize)} • {document.mimeType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onDownload(document)}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content - Increased height */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {document.mimeType.startsWith("image/") && (
            <div className="h-full flex items-center justify-center">
              {loading && !error && (
                <div className="animate-pulse bg-gray-200 rounded h-96 w-full"></div>
              )}
              {error ? (
                <div className="text-center text-red-600 p-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">{error}</p>
                  <Button
                    onClick={() => onDownload(document)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Instead
                  </Button>
                </div>
              ) : (
                // Using regular img tag instead of Next.js Image to avoid width/height requirements
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={
                    document.originalName ||
                    document.fileName ||
                    "Document preview"
                  }
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: loading ? "none" : "block" }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              )}
            </div>
          )}

          {document.mimeType === "application/pdf" && (
            <div className="h-full min-h-[75vh]">
              <iframe
                src={`${previewUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0 rounded"
                title={document.originalName || document.fileName}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError("Failed to load PDF");
                }}
              />
              {loading && (
                <div className="animate-pulse bg-gray-200 rounded h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">Loading PDF...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={() => onDownload(document)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          )}

          {!document.mimeType.startsWith("image/") &&
            document.mimeType !== "application/pdf" && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Preview not available for this file type
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supported for preview: Images (JPG, PNG, GIF, WebP) and PDF
                  files
                </p>
                <Button
                  onClick={() => onDownload(document)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
