// src/utils/pdf-download.utils.ts

import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";

export interface PDFDownloadOptions {
  includeProgressHistory?: boolean;
  includeFinancialHistory?: boolean;
  maxProgressUpdates?: number;
  maxFinancialUpdates?: number;
}

export interface PDFGenerationOptions {
  projectInfo: {
    id: string;
    name: string;
    projectId: string;
    contractor: string;
    financialYear: string;
  };
  availableOptions: {
    includeProgressHistory: {
      available: boolean;
      count: number;
      maxRecommended: number;
      maxAllowed: number;
    };
    includeFinancialHistory: {
      available: boolean;
      count: number;
      maxRecommended: number;
      maxAllowed: number;
    };
  };
  estimatedPdfSize: {
    baseSections: string;
    withProgressHistory: string;
    withFinancialHistory: string;
  };
  lastUpdated: {
    physicalProgress: string | null;
    financialProgress: string | null;
    projectData: string;
  };
}

export const downloadProjectPDF = async (
  projectId: string,
  options: PDFDownloadOptions = {}
): Promise<void> => {
  const token = getAuthToken();

  const {
    includeProgressHistory = true,
    includeFinancialHistory = true,
    maxProgressUpdates = 10,
    maxFinancialUpdates = 10,
  } = options;

  const params = new URLSearchParams({
    includeProgressHistory: includeProgressHistory.toString(),
    includeFinancialHistory: includeFinancialHistory.toString(),
    maxProgressUpdates: maxProgressUpdates.toString(),
    maxFinancialUpdates: maxFinancialUpdates.toString(),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-projects/${projectId}/download-summary-pdf?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate PDF");
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/pdf")) {
    // Handle PDF blob response
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Project_Summary_${projectId}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    // Handle JSON response
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "PDF generation failed");
    }
    // PDF should download automatically via client-side jsPDF
  }
};

export const getPDFGenerationOptions = async (
  projectId: string
): Promise<PDFGenerationOptions | null> => {
  try {
    const response = await fetch(
      `/api/archive-projects/${projectId}/pdf-options`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch PDF options");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching PDF options:", error);
    return null;
  }
};

export const generateBulkProjectPDFs = async (
  projectIds: string[],
  options: PDFDownloadOptions = {}
): Promise<void> => {
  const response = await fetch(
    "/api/archive-projects/bulk/generate-summary-pdf",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectIds,
        options,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate bulk PDFs");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Bulk PDF generation failed");
  }

  return data.data;
};
