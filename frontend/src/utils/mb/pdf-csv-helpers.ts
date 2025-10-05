import { DbArchiveProject } from "@/types/archive-projects.types";
import { DbMeasurementBook } from "@/types/mb.types";
import { DbProject } from "@/types/projects.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF type to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

/**
 * Format date for display
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Get project name from project object
 */
const getProjectName = (project: DbProject | DbArchiveProject): string => {
  if ("projectName" in project) {
    return project.projectName;
  }
  if ("nameOfWork" in project) {
    return project.nameOfWork;
  }
  return "Unknown Project";
};

/**
 * Get project ID from project object
 */
const getProjectId = (project: DbProject | DbArchiveProject): string => {
  if (typeof project === "object") {
    return project?.projectId || "N/A";
  }
  return project || "N/A";
};

/**
 * Generate PDF for Measurement Book (Professional Format)
 */
export const generateMBPDF = async (mb: DbMeasurementBook): Promise<void> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;

  // Helper function to check if we need a new page
  const checkAddPage = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 20) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // ==================== HEADER ====================
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MEASUREMENT BOOK", pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  // MB ID and Number
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`MB ID: ${mb.mbId}`, margin, currentY);
  doc.text(`(11) M.B. No: ${mb.mbNo}`, pageWidth - margin - 50, currentY);
  currentY += 8;

  // Horizontal line
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // ==================== MB DETAILS TABLE ====================
  const mbDetailsData = [
    ["(1) Name of Work:", mb.nameOfWork],
    ["(2) Location:", mb.location],
    ["(3) Name of Contractor:", mb.contractor],
    ["(4) Tender Agreement:", mb.tenderAgreement || ""],
    ["(5) Work Order No:", ""], // Not in schema, leave empty
    [
      "(6) A.A. or F.S. No. and Date:",
      `${mb.aaOrFsNo || ""}${
        mb.aaOrFsDate ? " - " + formatDate(mb.aaOrFsDate) : ""
      }`,
    ],
    ["(7) SL No. of Bill:", mb.slNoOfBill || ""],
    ["(8) Date of Commencement:", formatDate(mb.dateOfCommencement)],
    ["(9) Date of Completion:", formatDate(mb.dateOfCompletion)],
    ["(10) Date of Measurement:", formatDate(mb.dateOfMeasurement)],
  ];

  autoTable(doc, {
    startY: currentY,
    body: mbDetailsData,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: {
        cellWidth: 60,
        fillColor: [245, 245, 245],
      },
      1: {
        cellWidth: pageWidth - margin * 2 - 60,
      },
    },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // ==================== PROJECT INFORMATION ====================
  checkAddPage(30);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Project Information", margin, currentY);
  currentY += 6;

  const projectData = [
    ["Project Type:", mb.projectType],
    ["Project ID:", getProjectId(mb.project as DbProject | DbArchiveProject)],
    [
      "Project Name:",
      getProjectName(mb.project as DbProject | DbArchiveProject),
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    body: projectData,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: {
        cellWidth: 40,
        fontStyle: "bold",
        fillColor: [240, 248, 255],
      },
      1: {
        cellWidth: pageWidth - margin * 2 - 40,
      },
    },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // ==================== MEASUREMENTS SECTION ====================
  if (mb.measurements && mb.measurements.length > 0) {
    checkAddPage(40);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Description of Items", margin, currentY);
    doc.text("Unit", pageWidth - margin - 30, currentY);
    currentY += 6;

    // Draw each measurement
    mb.measurements.forEach((measurement, index) => {
      checkAddPage(35);

      // Measurement description row
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      // Draw border for description area
      doc.setLineWidth(0.1);
      doc.rect(margin, currentY, pageWidth - margin * 2 - 35, 8);
      doc.rect(pageWidth - margin - 35, currentY, 35, 8);

      // Description text
      const descText = `${index + 1}. ${measurement.description}`;
      const splitDesc = doc.splitTextToSize(
        descText,
        pageWidth - margin * 2 - 40
      );
      doc.text(splitDesc, margin + 2, currentY + 5);

      // Unit text
      doc.text(measurement.unit, pageWidth - margin - 32, currentY + 5);

      currentY += 8;

      // Measurement details table
      const measurementRows = [
        [
          "File:",
          measurement.uploadedFile.originalName,
          "Size:",
          `${(measurement.uploadedFile.fileSize / (1024 * 1024)).toFixed(
            2
          )} MB`,
          "Type:",
          measurement.uploadedFile.fileType,
        ],
      ];

      autoTable(doc, {
        startY: currentY,
        body: measurementRows,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 15, fontStyle: "bold", fillColor: [250, 250, 250] },
          1: { cellWidth: 50 },
          2: { cellWidth: 15, fontStyle: "bold", fillColor: [250, 250, 250] },
          3: { cellWidth: 25 },
          4: { cellWidth: 15, fontStyle: "bold", fillColor: [250, 250, 250] },
          5: { cellWidth: 25 },
        },
      });

      currentY = doc.lastAutoTable.finalY + 5;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No measurements available", margin, currentY);
    currentY += 10;
  }

  // ==================== FOOTER ====================
  checkAddPage(25);

  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Created by: ${mb.createdBy.name} (${mb.createdBy.role}) on ${formatDate(
      mb.createdAt
    )}`,
    margin,
    currentY
  );

  if (mb.lastModifiedBy) {
    currentY += 4;
    doc.text(
      `Last modified by: ${mb.lastModifiedBy.name} on ${formatDate(
        mb.lastModifiedBy.modifiedAt
      )}`,
      margin,
      currentY
    );
  }

  // ==================== PAGE NUMBERS ====================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });

    // Add generation date
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth - margin - 30,
      pageHeight - 10
    );
  }

  // Save the PDF
  const fileName = `MB_${mb.mbId}_${mb.mbNo.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
};

/**
 * Generate CSV for Measurement Book
 */
export const generateMBCSV = (mb: DbMeasurementBook): void => {
  const csvRows: string[] = [];

  // Header
  csvRows.push("MEASUREMENT BOOK");
  csvRows.push("");

  // MB Basic Info
  csvRows.push(`MB ID,${mb.mbId}`);
  csvRows.push(`MB No,${mb.mbNo}`);
  csvRows.push("");

  // MB Details
  csvRows.push("MB DETAILS");
  csvRows.push(`(1) Name of Work,${escapeCSV(mb.nameOfWork)}`);
  csvRows.push(`(2) Location,${escapeCSV(mb.location)}`);
  csvRows.push(`(3) Name of Contractor,${escapeCSV(mb.contractor)}`);
  csvRows.push(
    `(4) Tender Agreement,${escapeCSV(mb.tenderAgreement || "N/A")}`
  );
  csvRows.push(`(6) A.A. or F.S. No.,${escapeCSV(mb.aaOrFsNo || "N/A")}`);
  if (mb.aaOrFsDate) {
    csvRows.push(`(6) A.A. or F.S. Date,${formatDate(mb.aaOrFsDate)}`);
  }
  csvRows.push(`(7) SL No. of Bill,${escapeCSV(mb.slNoOfBill || "N/A")}`);
  csvRows.push(`(8) Date of Commencement,${formatDate(mb.dateOfCommencement)}`);
  csvRows.push(`(9) Date of Completion,${formatDate(mb.dateOfCompletion)}`);
  csvRows.push(`(10) Date of Measurement,${formatDate(mb.dateOfMeasurement)}`);
  csvRows.push("");

  // Project Information
  csvRows.push("PROJECT INFORMATION");
  csvRows.push(`Project Type,${mb.projectType}`);
  csvRows.push(
    `Project ID,${getProjectId(mb.project as DbProject | DbArchiveProject)}`
  );
  csvRows.push(
    `Project Name,${escapeCSV(
      getProjectName(mb.project as DbProject | DbArchiveProject)
    )}`
  );
  csvRows.push("");

  // Measurements
  csvRows.push(`MEASUREMENTS (${mb.measurements?.length || 0})`);
  csvRows.push(
    "#,Measurement ID,Description,Unit,File Name,File Size (MB),File Type"
  );

  if (mb.measurements && mb.measurements.length > 0) {
    mb.measurements.forEach((m, index) => {
      const fileSizeMB = (m.uploadedFile.fileSize / (1024 * 1024)).toFixed(2);
      csvRows.push(
        `${index + 1},${escapeCSV(m.id)},${escapeCSV(
          m.description
        )},${escapeCSV(m.unit)},${escapeCSV(
          m.uploadedFile.originalName
        )},${fileSizeMB},${m.uploadedFile.fileType}`
      );
    });
  }

  csvRows.push("");
  csvRows.push("");

  // Footer
  csvRows.push("CREATION INFORMATION");
  csvRows.push(
    `Created by,${mb.createdBy.name} (${mb.createdBy.role}) on ${formatDate(
      mb.createdAt
    )}`
  );

  if (mb.lastModifiedBy) {
    csvRows.push(
      `Last modified by,${mb.lastModifiedBy.name} on ${formatDate(
        mb.lastModifiedBy.modifiedAt
      )}`
    );
  }

  // Join all rows
  const csvContent = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `MB_${mb.mbId}_${mb.mbNo.replace(/\//g, "-")}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Escape CSV field values
 */
const escapeCSV = (value: string): string => {
  if (!value) return "";

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

/**
 * Generate CSV for multiple MBs
 */
export const generateMultipleMBsCSV = (mbs: DbMeasurementBook[]): void => {
  const csvRows: string[] = [];

  // Header
  csvRows.push(
    "MB ID,MB No,Name of Work,Location,Contractor,Project Type,Project ID,Created By,Created Date,Total Measurements"
  );

  // Data rows
  mbs.forEach((mb) => {
    const row = [
      escapeCSV(mb.mbId),
      escapeCSV(mb.mbNo),
      escapeCSV(mb.nameOfWork),
      escapeCSV(mb.location),
      escapeCSV(mb.contractor),
      mb.projectType,
      getProjectId(mb.project as DbProject | DbArchiveProject),
      escapeCSV(mb.createdBy.name),
      formatDate(mb.createdAt),
      (mb.measurements?.length || 0).toString(),
    ];
    csvRows.push(row.join(","));
  });

  // Create and download
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Measurement_Books_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
