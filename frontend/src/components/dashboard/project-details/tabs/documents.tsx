import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbProject } from "@/types/projects.types";
import { Download, Eye, FileText } from "lucide-react";

interface TabProps {
  project: DbProject;
}

export default function DocumentsTab({ project }: TabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <Badge variant="outline" className="text-xs">
          {project.uploadedFiles.length} Files
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.uploadedFiles.map((doc, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>

            <h4 className="font-medium text-gray-900 text-sm mb-1">File 1</h4>
            <p className="text-xs text-gray-500 mb-3">
              pdf • 20kb •{" "}
              {/* {new Date(doc.uploadedAt).toLocaleDateString("en-IN")} */}
            </p>

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
    </div>
  );
}
