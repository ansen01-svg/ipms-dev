// import { CreateProjectFormValues } from "@/schema/create-project/create-projects.schema";

// export interface ProjectPDFData extends CreateProjectFormValues {
//   projectId?: string;
//   createdAt?: string;
//   status?: string;
// }

// export const generateProjectPDF = async (
//   projectData: ProjectPDFData,
//   uploadedFiles: File[] = []
// ): Promise<void> => {
//   try {
//     // Import jsPDF dynamically to avoid SSR issues
//     const jsPDFModule = await import("jspdf");
//     const doc = new jsPDFModule.default();

//     // Set up document styling
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const margin = 20;
//     let yPosition = margin;

//     // Helper function to add new page if needed
//     const checkNewPage = (requiredHeight: number) => {
//       if (yPosition + requiredHeight > pageHeight - margin) {
//         doc.addPage();
//         yPosition = margin;
//       }
//     };

//     // Helper function to format currency - fixed to avoid encoding issues
//     const formatCurrency = (amount: number) => {
//       return (
//         new Intl.NumberFormat("en-IN", {
//           style: "decimal",
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(amount) + " INR"
//       );
//     };

//     // Helper function to format date
//     const formatDate = (dateString: string) => {
//       return new Date(dateString).toLocaleDateString("en-IN", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     };

//     // Helper function to format geo location - updated to show separate latitude and longitude
//     const formatGeoLocationEntries = (geoLocation?: {
//       latitude?: number | "";
//       longitude?: number | "";
//     }) => {
//       if (!geoLocation || (!geoLocation.latitude && !geoLocation.longitude)) {
//         return [["Geo Location:", "Not specified"]];
//       }

//       const entries = [];
//       if (geoLocation.latitude) {
//         entries.push(["Latitude:", geoLocation.latitude.toString()]);
//       }
//       if (geoLocation.longitude) {
//         entries.push(["Longitude:", geoLocation.longitude.toString()]);
//       }

//       return entries.length > 0
//         ? entries
//         : [["Geo Location:", "Not specified"]];
//     };

//     // Title
//     doc.setFontSize(20);
//     doc.setFont("helvetica", "bold");
//     doc.text("PROJECT DETAILS REPORT", pageWidth / 2, yPosition, {
//       align: "center",
//     });
//     yPosition += 15;

//     // Project ID and Date (if available)
//     if (projectData.projectId || projectData.createdAt) {
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       if (projectData.projectId) {
//         doc.text(`Project ID: ${projectData.projectId}`, margin, yPosition);
//       }
//       if (projectData.createdAt) {
//         doc.text(
//           `Generated: ${formatDate(projectData.createdAt)}`,
//           pageWidth - margin,
//           yPosition,
//           { align: "right" }
//         );
//       }
//       yPosition += 15;
//     }

//     // Basic Project Information
//     checkNewPage(60);
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("BASIC PROJECT INFORMATION", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const basicInfo = [
//       [`Project Name:`, projectData.projectName],
//       [`Date of Proposal:`, formatDate(projectData.dateOfProposal)],
//       [`Description:`, projectData.description],
//       [
//         `Has Sub-Projects:`,
//         projectData.hasSubProjects === "yes" ? "Yes" : "No",
//       ],
//       [`Beneficiary:`, projectData.beneficiary],
//       [`Letter Reference:`, projectData.letterReference || "Not specified"],
//     ];

//     basicInfo.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");

//       // Handle long text wrapping
//       const lines = doc.splitTextToSize(value, pageWidth - margin - 80);
//       doc.text(lines, margin + 80, yPosition);
//       yPosition += lines.length * 5 + 3;
//     });

//     yPosition += 10;

//     // Financial Details
//     checkNewPage(50);
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("FINANCIAL DETAILS", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const financialInfo = [
//       [`Fund:`, projectData.fund],
//       [`Function:`, projectData.function],
//       [`Budget Head:`, projectData.budgetHead],
//       [`Scheme:`, projectData.scheme],
//       [`Sub Scheme:`, projectData.subScheme],
//       [`Estimated Cost:`, formatCurrency(projectData.estimatedCost)],
//     ];

//     financialInfo.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(value, margin + 80, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 10;

//     // Department Information
//     checkNewPage(30);
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("DEPARTMENT INFORMATION", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const deptInfo = [
//       [`Owning Department:`, projectData.owningDepartment],
//       [`Executing Department:`, projectData.executingDepartment],
//     ];

//     deptInfo.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(value, margin + 80, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 10;

//     // Work Details
//     checkNewPage(60);
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("WORK DETAILS", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const workInfo = [
//       [`Type of Work:`, projectData.typeOfWork],
//       [`Sub-Type of Work:`, projectData.subTypeOfWork],
//       [`Nature of Work:`, projectData.natureOfWork],
//       [`Project Start Date:`, formatDate(projectData.projectStartDate)],
//       [`Project End Date:`, formatDate(projectData.projectEndDate)],
//       [`Mode of Execution:`, projectData.recommendedModeOfExecution],
//     ];

//     workInfo.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(value, margin + 80, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 10;

//     // Location Details
//     checkNewPage(50);
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("LOCATION DETAILS", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");

//     const locationInfo = [
//       [`Locality:`, projectData.locality],
//       [`Ward:`, projectData.ward],
//       [`ULB:`, projectData.ulb],
//     ];

//     // Add basic location info
//     locationInfo.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(value, margin + 80, yPosition);
//       yPosition += 8;
//     });

//     // Add geo location with separate latitude and longitude
//     const geoLocationEntries = formatGeoLocationEntries(
//       projectData.geoLocation
//     );
//     geoLocationEntries.forEach(([label, value]) => {
//       checkNewPage(8);
//       doc.setFont("helvetica", "bold");
//       doc.text(label, margin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(value, margin + 80, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 10;

//     // Sub-projects (if any)
//     if (
//       projectData.hasSubProjects === "yes" &&
//       projectData.subProjects &&
//       projectData.subProjects.length > 0
//     ) {
//       checkNewPage(30);
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text("SUB-PROJECT DETAILS", margin, yPosition);
//       yPosition += 10;

//       projectData.subProjects.forEach((subProject, index) => {
//         checkNewPage(50);
//         doc.setFontSize(12);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Sub-project ${index + 1}`, margin, yPosition);
//         yPosition += 8;

//         doc.setFontSize(10);
//         doc.setFont("helvetica", "normal");

//         const subProjectInfo = [
//           [`Name:`, subProject.name],
//           [`Estimated Amount:`, formatCurrency(subProject.estimatedAmount)],
//           [`Type of Work:`, subProject.typeOfWork],
//           [`Sub-Type:`, subProject.subTypeOfWork],
//           [`Nature:`, subProject.natureOfWork],
//           [`Start Date:`, formatDate(subProject.projectStartDate)],
//           [`End Date:`, formatDate(subProject.projectEndDate)],
//         ];

//         subProjectInfo.forEach(([label, value]) => {
//           checkNewPage(8);
//           doc.setFont("helvetica", "bold");
//           doc.text(label, margin + 10, yPosition);
//           doc.setFont("helvetica", "normal");
//           doc.text(value, margin + 80, yPosition); // Fixed: changed from margin + 90 to margin + 80
//           yPosition += 6;
//         });

//         yPosition += 5;
//       });

//       yPosition += 10;
//     }

//     // Uploaded Documents
//     if (uploadedFiles.length > 0) {
//       checkNewPage(30);
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text("SUPPORTING DOCUMENTS", margin, yPosition);
//       yPosition += 10;

//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");

//       uploadedFiles.forEach((file, index) => {
//         checkNewPage(8);
//         doc.text(
//           `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(
//             2
//           )} MB)`,
//           margin,
//           yPosition
//         );
//         yPosition += 6;
//       });
//       yPosition += 10;
//     }

//     // Footer
//     const pageCount = doc.internal.pages.length - 1;
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setFont("helvetica", "normal");
//       doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
//         align: "center",
//       });
//       doc.text(
//         `Generated on ${new Date().toLocaleDateString("en-IN")}`,
//         pageWidth - margin,
//         pageHeight - 10,
//         { align: "right" }
//       );
//     }

//     // Save the PDF
//     const fileName = `Project_${projectData.projectName.replace(
//       /[^a-z0-9]/gi,
//       "_"
//     )}_${new Date().toISOString().split("T")[0]}.pdf`;
//     doc.save(fileName);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     throw new Error("Failed to generate PDF. Please try again.");
//   }
// };

import logo from "@/assets/images/aptdcl-logo.jpg";
import { CreateProjectFormValues } from "@/schema/create-project/create-projects.schema";

export interface ProjectPDFData extends CreateProjectFormValues {
  projectId?: string;
  createdAt?: string;
  status?: string;
}

export const generateProjectPDF = async (
  projectData: ProjectPDFData,
  uploadedFiles: File[] = []
): Promise<void> => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const jsPDFModule = await import("jspdf");
    const doc = new jsPDFModule.default();

    // Set up document styling
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const headerHeight = 50; // Space reserved for header
    const footerHeight = 20; // Space reserved for footer
    let yPosition = margin + headerHeight; // Start after header

    // Load and convert logo to base64
    const loadImageAsBase64 = async (imagePath: string): Promise<string> => {
      try {
        const response = await fetch(imagePath);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn("Could not load logo image:", error);
        return "";
      }
    };

    // Load the logo
    const logoBase64 = await loadImageAsBase64(logo.src);

    // Helper function to add header to a page
    const addHeader = () => {
      const headerY = 15;
      const logoSize = 25;
      const logoX = margin;

      // Add logo if available
      if (logoBase64) {
        try {
          doc.addImage(logoBase64, "JPEG", logoX, headerY, logoSize, logoSize);
        } catch (error) {
          console.warn("Error adding logo to PDF:", error);
        }
      }

      // Add company name and subtitle
      const textStartX = logoBase64 ? logoX + logoSize + 10 : logoX;

      // Company name
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 50, 100); // Pinkish color similar to the website
      doc.text("ASSAM PLAINS TRIBES DEVELOPMENT", textStartX, headerY + 8);
      doc.text("CORPORATION LIMITED", textStartX, headerY + 16);

      // Subtitle
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150); // Gray color
      doc.text("A GOVERNMENT OF ASSAM UNDERTAKING", textStartX, headerY + 24);

      // Reset text color to black for content
      doc.setTextColor(0, 0, 0);

      // Add a line separator
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, headerY + 35, pageWidth - margin, headerY + 35);
    };

    // Helper function to add footer to a page
    const addFooter = (pageNumber: number, totalPages: number) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);

      // Page number
      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Generation date
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-IN")}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );

      // Reset text color
      doc.setTextColor(0, 0, 0);
    };

    // Helper function to add new page if needed
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - footerHeight - margin) {
        doc.addPage();
        yPosition = margin + headerHeight;
        return true;
      }
      return false;
    };

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
      return (
        new Intl.NumberFormat("en-IN", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + " INR"
      );
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Helper function to format geo location
    const formatGeoLocationEntries = (geoLocation?: {
      latitude?: number | "";
      longitude?: number | "";
    }) => {
      if (!geoLocation || (!geoLocation.latitude && !geoLocation.longitude)) {
        return [["Geo Location:", "Not specified"]];
      }

      const entries = [];
      if (geoLocation.latitude) {
        entries.push(["Latitude:", geoLocation.latitude.toString()]);
      }
      if (geoLocation.longitude) {
        entries.push(["Longitude:", geoLocation.longitude.toString()]);
      }

      return entries.length > 0
        ? entries
        : [["Geo Location:", "Not specified"]];
    };

    // Add header to first page
    addHeader();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT DETAILS REPORT", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    // Project ID and Date (if available)
    if (projectData.projectId || projectData.createdAt) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      if (projectData.projectId) {
        doc.text(`Project ID: ${projectData.projectId}`, margin, yPosition);
      }
      if (projectData.createdAt) {
        doc.text(
          `Generated: ${formatDate(projectData.createdAt)}`,
          pageWidth - margin,
          yPosition,
          { align: "right" }
        );
      }
      yPosition += 15;
    }

    // Basic Project Information
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("BASIC PROJECT INFORMATION", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const basicInfo = [
      [`Project Name:`, projectData.projectName],
      [`Date of Proposal:`, formatDate(projectData.dateOfProposal)],
      [`Description:`, projectData.description],
      [
        `Has Sub-Projects:`,
        projectData.hasSubProjects === "yes" ? "Yes" : "No",
      ],
      [`Beneficiary:`, projectData.beneficiary],
      [`Letter Reference:`, projectData.letterReference || "Not specified"],
    ];

    basicInfo.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");

      // Handle long text wrapping
      const lines = doc.splitTextToSize(value, pageWidth - margin - 80);
      doc.text(lines, margin + 80, yPosition);
      yPosition += lines.length * 5 + 3;
    });

    yPosition += 10;

    // Financial Details
    checkNewPage(50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("FINANCIAL DETAILS", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const financialInfo = [
      [`Fund:`, projectData.fund],
      [`Function:`, projectData.function],
      [`Budget Head:`, projectData.budgetHead],
      [`Scheme:`, projectData.scheme],
      [`Sub Scheme:`, projectData.subScheme],
      [`Estimated Cost:`, formatCurrency(projectData.estimatedCost)],
    ];

    financialInfo.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Department Information
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DEPARTMENT INFORMATION", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const deptInfo = [
      [`Owning Department:`, projectData.owningDepartment],
      [`Executing Department:`, projectData.executingDepartment],
    ];

    deptInfo.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Work Details
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("WORK DETAILS", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const workInfo = [
      [`Type of Work:`, projectData.typeOfWork],
      [`Sub-Type of Work:`, projectData.subTypeOfWork],
      [`Nature of Work:`, projectData.natureOfWork],
      [`Project Start Date:`, formatDate(projectData.projectStartDate)],
      [`Project End Date:`, formatDate(projectData.projectEndDate)],
      [`Mode of Execution:`, projectData.recommendedModeOfExecution],
    ];

    workInfo.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Location Details
    checkNewPage(50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LOCATION DETAILS", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const locationInfo = [
      [`Locality:`, projectData.locality],
      [`Ward:`, projectData.ward],
      [`ULB:`, projectData.ulb],
    ];

    // Add basic location info
    locationInfo.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    // Add geo location with separate latitude and longitude
    const geoLocationEntries = formatGeoLocationEntries(
      projectData.geoLocation
    );
    geoLocationEntries.forEach(([label, value]) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Sub-projects (if any)
    if (
      projectData.hasSubProjects === "yes" &&
      projectData.subProjects &&
      projectData.subProjects.length > 0
    ) {
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SUB-PROJECT DETAILS", margin, yPosition);
      yPosition += 10;

      projectData.subProjects.forEach((subProject, index) => {
        checkNewPage(50);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Sub-project ${index + 1}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const subProjectInfo = [
          [`Name:`, subProject.name],
          [`Estimated Amount:`, formatCurrency(subProject.estimatedAmount)],
          [`Type of Work:`, subProject.typeOfWork],
          [`Sub-Type:`, subProject.subTypeOfWork],
          [`Nature:`, subProject.natureOfWork],
          [`Start Date:`, formatDate(subProject.projectStartDate)],
          [`End Date:`, formatDate(subProject.projectEndDate)],
        ];

        subProjectInfo.forEach(([label, value]) => {
          checkNewPage(8);
          doc.setFont("helvetica", "bold");
          doc.text(label, margin + 10, yPosition);
          doc.setFont("helvetica", "normal");
          doc.text(value, margin + 80, yPosition);
          yPosition += 6;
        });

        yPosition += 5;
      });

      yPosition += 10;
    }

    // Uploaded Documents
    if (uploadedFiles.length > 0) {
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SUPPORTING DOCUMENTS", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      uploadedFiles.forEach((file, index) => {
        checkNewPage(8);
        doc.text(
          `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(
            2
          )} MB)`,
          margin,
          yPosition
        );
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Add headers and footers to all pages
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (i > 1) {
        addHeader();
      }
      addFooter(i, pageCount);
    }

    // Save the PDF
    const fileName = `Project_${projectData.projectName.replace(
      /[^a-z0-9]/gi,
      "_"
    )}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
