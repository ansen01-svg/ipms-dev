import { getAuthToken } from "@/lib/rbac-config/auth-local";

export interface DocumentInfo {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileExtension: string;
  fileSize: number;
  formattedFileSize: string;
  downloadURL: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy?: {
    userId?: string;
    name?: string;
    userName?: string;
    userDesignation?: string;
  };
  category: string;
  subcategory: string;
  documentIndex: number;
  additionalInfo: unknown;
}

export interface DocumentGroup {
  label: string;
  description: string;
  count: number;
  documents: DocumentInfo[];
}

export interface DocumentSummary {
  totalDocuments: number;
  totalFileSize: number;
  formattedTotalFileSize: string;
  documentsByCategory: {
    projectDocuments: number;
    physicalProgressDocuments: number;
    financialProgressDocuments: number;
    queryDocuments: number;
  };
  documentsByType: {
    images: number;
    documents: number;
    pdfs: number;
    spreadsheets: number;
    others: number;
  };
  oldestDocument: DocumentInfo | null;
  newestDocument: DocumentInfo | null;
}

export interface ProjectDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    projectInfo: {
      projectId: string;
      projectName: string;
      contractorName: string;
      district: string;
      status: string;
    };
    documentGroups: {
      projectDocuments: DocumentGroup;
      physicalProgressDocuments: DocumentGroup;
      financialProgressDocuments: DocumentGroup;
      queryDocuments: DocumentGroup;
    };
    summary: DocumentSummary;
  };
  metadata: {
    retrievedAt: string;
    projectId: string;
    totalProgressUpdates: number;
    totalFinancialUpdates: number;
    totalActiveQueries: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

/**
 * Fetch all documents for a specific project
 */
export async function getProjectDocuments(
  projectId: string
): Promise<ProjectDocumentsResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/project/${projectId}/documents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: ProjectDocumentsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project documents:", error);
    throw error;
  }
}

/**
 * Download a document
 */
export async function downloadDocument(
  downloadURL: string,
  fileName: string
): Promise<void> {
  try {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading document:", error);
    throw new Error("Failed to download document");
  }
}

/**
 * Preview/View a document
 */
export async function previewDocument(
  downloadURL: string,
  fileName: string,
  fileType: string
): Promise<void> {
  try {
    const imageTypes = ["jpg", "jpeg", "png", "gif", "svg", "bmp"];
    const previewableTypes = [...imageTypes, "pdf"];

    if (previewableTypes.includes(fileType.toLowerCase())) {
      // Open in new tab for preview
      window.open(downloadURL, "_blank", "noopener,noreferrer");
    } else {
      // For non-previewable files, trigger download
      await downloadDocument(downloadURL, fileName);
    }
  } catch (error) {
    console.error("Error previewing document:", error);
    throw new Error("Failed to preview document");
  }
}

/**
 * Get file type icon class
 */
export function getFileTypeColor(fileType: string): string {
  const colorMap: { [key: string]: string } = {
    pdf: "bg-red-50 text-red-600 border-red-200",
    doc: "bg-blue-50 text-blue-600 border-blue-200",
    docx: "bg-blue-50 text-blue-600 border-blue-200",
    xls: "bg-green-50 text-green-600 border-green-200",
    xlsx: "bg-green-50 text-green-600 border-green-200",
    csv: "bg-green-50 text-green-600 border-green-200",
    jpg: "bg-purple-50 text-purple-600 border-purple-200",
    jpeg: "bg-purple-50 text-purple-600 border-purple-200",
    png: "bg-purple-50 text-purple-600 border-purple-200",
    gif: "bg-purple-50 text-purple-600 border-purple-200",
    svg: "bg-purple-50 text-purple-600 border-purple-200",
    bmp: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    colorMap[fileType.toLowerCase()] ||
    "bg-gray-50 text-gray-600 border-gray-200"
  );
}

/**
 * Get category color for document category badges
 */
export function getCategoryColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    "Project Document": "bg-blue-50 text-blue-700 border-blue-200",
    "Progress Document": "bg-green-50 text-green-700 border-green-200",
    "Query Document": "bg-orange-50 text-orange-700 border-orange-200",
  };

  return colorMap[category] || "bg-gray-50 text-gray-600 border-gray-200";
}

/**
 * Get subcategory color for document subcategory badges
 */
export function getSubcategoryColor(subcategory: string): string {
  const colorMap: { [key: string]: string } = {
    General: "bg-blue-50 text-blue-600 border-blue-200",
    "Physical Progress": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Financial Progress": "bg-teal-50 text-teal-600 border-teal-200",
    Technical: "bg-purple-50 text-purple-600 border-purple-200",
    Financial: "bg-yellow-50 text-yellow-600 border-yellow-200",
    Administrative: "bg-indigo-50 text-indigo-600 border-indigo-200",
    Legal: "bg-red-50 text-red-600 border-red-200",
    Compliance: "bg-orange-50 text-orange-600 border-orange-200",
    Design: "bg-pink-50 text-pink-600 border-pink-200",
    Material: "bg-brown-50 text-brown-600 border-brown-200",
    Safety: "bg-red-50 text-red-600 border-red-200",
    Environmental: "bg-green-50 text-green-600 border-green-200",
    Other: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return colorMap[subcategory] || "bg-gray-50 text-gray-600 border-gray-200";
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
