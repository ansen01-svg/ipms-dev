import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { Download, Eye, FileText, ImageIcon } from "lucide-react";

interface TabProps {
  project: DbProject;
}

export default function DocumentsTab({ project }: TabProps) {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    const imageTypes = ["jpg", "jpeg", "png"];
    if (imageTypes.includes(fileType.toLowerCase())) {
      return <ImageIcon className="h-6 w-6 text-blue-600" />;
    }
    return <FileText className="h-6 w-6 text-blue-600" />;
  };

  // Get file type color
  const getFileTypeColor = (fileType: string) => {
    const colorMap: { [key: string]: string } = {
      pdf: "bg-red-50 text-red-600 border-red-200",
      jpg: "bg-green-50 text-green-600 border-green-200",
      jpeg: "bg-green-50 text-green-600 border-green-200",
      png: "bg-blue-50 text-blue-600 border-blue-200",
    };
    return (
      colorMap[fileType.toLowerCase()] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <Badge variant="outline" className="text-xs">
          {project.uploadedFiles.length} Files
        </Badge>
      </div>

      {project.uploadedFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-sm">
            No documents have been uploaded for this project yet.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.uploadedFiles.map((doc, index) => (
            <div
              key={doc._id || index}
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-3">
                {getFileIcon(doc.fileType)}
              </div>

              <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                {doc.fileName}
              </h4>

              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className={`text-xs ${getFileTypeColor(doc.fileType)}`}
                >
                  {doc.fileType.toUpperCase()}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatFileSize(doc.fileSize)}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <div>Uploaded by: {doc.uploadedBy.name}</div>
                <div>
                  {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
