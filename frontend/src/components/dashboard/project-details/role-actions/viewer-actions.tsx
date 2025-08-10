"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Share } from "lucide-react";
import { useState } from "react";

export function ViewerActions() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      alert(`${action} action completed!`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          Public Viewer Actions
        </h4>
        <p className="text-sm text-gray-700 mb-4">
          View-only access for transparency and public oversight
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAction("View Full Details")}
            disabled={loading === "View Full Details"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {loading === "View Full Details"
              ? "Loading..."
              : "View Full Details"}
          </Button>

          <Button
            onClick={() => handleAction("Download Report")}
            disabled={loading === "Download Report"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading === "Download Report"
              ? "Downloading..."
              : "Download Report"}
          </Button>

          <Button
            onClick={() => handleAction("Share Project")}
            disabled={loading === "Share Project"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            {loading === "Share Project" ? "Sharing..." : "Share Project"}
          </Button>

          <Button
            onClick={() => handleAction("Export Data")}
            disabled={loading === "Export Data"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {loading === "Export Data" ? "Exporting..." : "Export Data"}
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-600">
          💡 Read-only access - No modification permissions
        </div>
      </div>
    </div>
  );
}
