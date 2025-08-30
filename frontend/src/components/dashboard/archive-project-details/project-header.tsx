// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { DbArchiveProject } from "@/types/archive-projects.types";
// import { User } from "@/types/user.types";
// import { formatCurrency } from "@/utils/archive-projects/format-helpers";
// import {
//   Building,
//   Building2,
//   Calendar,
//   Clock,
//   DollarSign,
//   FileText,
//   MapPin,
//   TrendingUp,
//   User as UserIcon,
// } from "lucide-react";

// interface ArchiveProjectHeaderProps {
//   project: DbArchiveProject;
//   user: User;
// }

// export function ArchiveProjectHeader({ project }: ArchiveProjectHeaderProps) {
//   const getStatusColor = (status: string) => {
//     const colors = {
//       "Not Started": "bg-gray-50 text-gray-600 border-gray-200",
//       "Just Started": "bg-blue-50 text-blue-600 border-blue-200",
//       "In Progress": "bg-yellow-50 text-yellow-600 border-yellow-200",
//       "Halfway Complete": "bg-orange-50 text-orange-600 border-orange-200",
//       "Near Completion": "bg-green-50 text-green-600 border-green-200",
//       Completed: "bg-green-50 text-green-600 border-green-200",
//     };
//     return (
//       colors[status as keyof typeof colors] ||
//       "bg-gray-50 text-gray-600 border-gray-200"
//     );
//   };

//   // Determine overall status based on both physical and financial progress
//   const isPhysicallyComplete = (project.progress || 0) === 100;
//   const isFinanciallyComplete = (project.financialProgress || 0) === 100;
//   const isFullyComplete = isPhysicallyComplete && isFinanciallyComplete;

//   const getOverallStatus = () => {
//     if (isFullyComplete)
//       return {
//         status: "Fully Complete",
//         color: "bg-emerald-50 text-emerald-600 border-emerald-200",
//       };
//     if (isPhysicallyComplete)
//       return {
//         status: "Physically Complete",
//         color: "bg-green-50 text-green-600 border-green-200",
//       };
//     if (isFinanciallyComplete)
//       return {
//         status: "Financially Complete",
//         color: "bg-blue-50 text-blue-600 border-blue-200",
//       };
//     return {
//       status: project.progressStatus || "In Progress",
//       color: getStatusColor(project.progressStatus || "In Progress"),
//     };
//   };

//   const overallStatus = getOverallStatus();

//   return (
//     <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
//       <CardHeader className="py-5 bg-teal-600 rounded-tl-xl rounded-tr-xl">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-lg sm:text-xl font-semibold text-white">
//                 {project.nameOfWork}
//               </h1>
//             </div>
//             <p className="text-gray-200 text-sm mb-1">
//               AA Number: {project.AANumber}
//             </p>
//             <p className="text-white/90 text-sm leading-relaxed max-w-4xl">
//               Financial Year: {project.financialYear} • Work Value:{" "}
//               {formatCurrency(project.workValue)}
//             </p>
//           </div>

//           <div className="flex flex-col gap-2 items-end">
//             <Badge
//               className={`${overallStatus.color} font-medium px-3 py-1 text-xs`}
//             >
//               {overallStatus.status}
//             </Badge>
//             {/* Progress indicators */}
//             <div className="flex gap-1">
//               <Badge className="bg-white/20 text-white text-xs px-2 py-1">
//                 P: {project.progress || 0}%
//               </Badge>
//               <Badge className="bg-white/20 text-white text-xs px-2 py-1">
//                 F: {project.financialProgress || 0}%
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="p-6">
//         {/* Enhanced Key Metrics Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div className="bg-red-100 rounded-lg p-4">
//             <div className="text-3xl font-bold text-gray-900 mb-2">
//               {formatCurrency(project.AAAmount)}
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <DollarSign className="h-4 w-4 text-red-500" />
//             </div>
//             <p className="text-sm text-gray-600 leading-tight">
//               AA Amount
//               <br />
//               Sanctioned
//             </p>
//           </div>

//           <div className="bg-orange-100 rounded-lg p-4">
//             <div className="text-3xl font-bold text-gray-900 mb-2">
//               {formatCurrency(project.workValue)}
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <Clock className="h-4 w-4 text-orange-500" />
//             </div>
//             <p className="text-sm text-gray-600 leading-tight">
//               Work Value
//               <br />
//               Contract Amount
//             </p>
//           </div>

//           <div className="bg-green-100 rounded-lg p-4">
//             <div className="text-3xl font-bold text-gray-900 mb-2">
//               {project.progress || 0}%
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <Building className="h-4 w-4 text-green-500" />
//             </div>
//             <p className="text-sm text-gray-600 leading-tight">
//               Physical
//               <br />
//               Progress
//             </p>
//           </div>

//           <div className="bg-blue-100 rounded-lg p-4">
//             <div className="text-3xl font-bold text-gray-900 mb-2">
//               {project.financialProgress || 0}%
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <TrendingUp className="h-4 w-4 text-blue-500" />
//             </div>
//             <p className="text-sm text-gray-600 leading-tight">
//               Financial
//               <br />
//               Progress
//             </p>
//           </div>

//           <div className="bg-purple-100 rounded-lg p-4">
//             <div className="text-3xl font-bold text-gray-900 mb-2">
//               {project.location}
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <MapPin className="h-4 w-4 text-purple-500" />
//             </div>
//             <p className="text-sm text-gray-600 leading-tight">
//               Project
//               <br />
//               Location
//             </p>
//           </div>
//         </div>

//         {/* Progress Visualization */}
//         <div className="mb-8 bg-gray-50 rounded-lg p-4">
//           <h3 className="text-sm font-medium text-gray-900 mb-4">
//             Progress Overview
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Physical Progress */}
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">
//                   Physical Progress
//                 </span>
//                 <span className="text-sm font-semibold text-green-600">
//                   {project.progress || 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//                 <div
//                   className="bg-green-500 h-3 rounded-full transition-all duration-700"
//                   style={{ width: `${Math.min(project.progress || 0, 100)}%` }}
//                 />
//               </div>
//               <div className="flex justify-between text-xs text-gray-600">
//                 <span>{project.progressStatus || "Not Started"}</span>
//                 <span>{project.totalProgressUpdates || 0} updates</span>
//               </div>
//             </div>

//             {/* Financial Progress */}
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">
//                   Financial Progress
//                 </span>
//                 <span className="text-sm font-semibold text-blue-600">
//                   {project.financialProgress || 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//                 <div
//                   className="bg-blue-500 h-3 rounded-full transition-all duration-700"
//                   style={{
//                     width: `${Math.min(project.financialProgress || 0, 100)}%`,
//                   }}
//                 />
//               </div>
//               <div className="flex justify-between text-xs text-gray-600">
//                 <span>
//                   {formatCurrency(project.billSubmittedAmount || 0)} submitted
//                 </span>
//                 <span>
//                   {project.totalFinancialProgressUpdates || 0} updates
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Progress Gap Alert */}
//           {Math.abs(
//             (project.progress || 0) - (project.financialProgress || 0)
//           ) > 15 && (
//             <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                 <span className="text-sm font-medium text-orange-700">
//                   Progress Gap Alert
//                 </span>
//               </div>
//               <div className="text-xs text-orange-600 mt-1">
//                 {Math.abs(
//                   (project.progress || 0) - (project.financialProgress || 0)
//                 ).toFixed(1)}
//                 % difference between physical and financial progress
//               </div>
//             </div>
//           )}

//           {/* Completion Status */}
//           {isFullyComplete && (
//             <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                 <span className="text-sm font-medium text-emerald-700">
//                   Project Fully Complete
//                 </span>
//               </div>
//               <div className="text-xs text-emerald-600 mt-1">
//                 Both physical work and financial settlement are complete
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Detailed Information Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Project Details */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//               Project Details
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <UserIcon className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Concerned Engineer</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {project.concernedEngineer}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <Calendar className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">AA Date</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {new Date(project.AADated).toLocaleDateString("en-IN")}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <Calendar className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">FWO Date</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {new Date(project.FWODate).toLocaleDateString("en-IN")}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contract Details */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//               Contract Details
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <Building2 className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Contractor</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {project.nameOfContractor}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <FileText className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">FWO Number</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {project.FWONumberAndDate}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <MapPin className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Location</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {project.location}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Financial Details */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//               Financial Details
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <DollarSign className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Bill Submitted</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {formatCurrency(project.billSubmittedAmount || 0)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <FileText className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Bill Number</p>
//                   <p className="text-sm font-medium text-gray-900 font-mono">
//                     {project.billNumber}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
//                 <span className="p-2 rounded-md">
//                   <DollarSign className="h-4 w-4 text-teal-600" />
//                 </span>
//                 <div>
//                   <p className="text-sm text-gray-500">Remaining Work Value</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     {formatCurrency(
//                       (project.workValue || 0) -
//                         (project.billSubmittedAmount || 0)
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { User } from "@/types/user.types";
import {
  Building,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Loader2,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

interface ArchiveProjectHeaderProps {
  project: DbArchiveProject;
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export function ArchiveProjectHeader({ project }: ArchiveProjectHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      "Not Started": "bg-gray-50 text-gray-600 border-gray-200",
      "Just Started": "bg-blue-50 text-blue-600 border-blue-200",
      "In Progress": "bg-yellow-50 text-yellow-600 border-yellow-200",
      "Halfway Complete": "bg-orange-50 text-orange-600 border-orange-200",
      "Near Completion": "bg-green-50 text-green-600 border-green-200",
      Completed: "bg-green-50 text-green-600 border-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const handleDownloadPDF = async () => {
    if (!project._id) {
      toast.error("Project ID not found");
      return;
    }

    try {
      setIsDownloading(true);
      const token = getAuthToken();

      // You can customize these parameters based on user preferences
      const params = new URLSearchParams({
        includeProgressHistory: "true",
        includeFinancialHistory: "true",
        maxProgressUpdates: "10",
        maxFinancialUpdates: "10",
      });

      const response = await fetch(
        `${API_BASE_URL}/archive-project/${project._id}/download-summary-pdf?${params}`,
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

      // Check if the response contains a PDF file or a JSON response
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/pdf")) {
        // If the response is a PDF file, create a download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Project_Summary_${project.projectId}_${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully");
      } else {
        // If the response is JSON (as per your current implementation)
        const data = await response.json();

        if (data.success) {
          toast.success("PDF generated successfully");
          // Note: Since your current backend implementation calls doc.save()
          // which triggers a client-side download, the PDF should download automatically
        } else {
          throw new Error(data.message || "PDF generation failed");
        }
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to download project summary PDF"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // const getPDFOptions = async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/archive-projects/${project._id}/pdf-options`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch PDF options");
  //     }

  //     const data = await response.json();
  //     return data.data;
  //   } catch (error) {
  //     console.error("Error fetching PDF options:", error);
  //     return null;
  //   }
  // };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="py-5 bg-teal-600 rounded-tl-xl rounded-tr-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                {project.nameOfWork}
              </h1>
            </div>
            <p className="text-gray-200 text-sm mb-1">
              AA Number: {project.AANumber}
            </p>
            <p className="text-white/90 text-sm leading-relaxed max-w-4xl">
              Financial Year: {project.financialYear} • Work Value:{" "}
              {formatCurrency(project.workValue)}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge
              className={`${getStatusColor(
                project.progressStatus
              )} font-medium px-3 py-1 text-xs`}
            >
              {project.progressStatus}
            </Badge>

            {/* Download PDF Button */}
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-200"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(project.AAAmount)}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              AA Amount
              <br />
              Sanctioned
            </p>
          </div>

          <div className="bg-orange-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(project.workValue)}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Work Value
              <br />
              Contract Amount
            </p>
          </div>

          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {project.progress}%
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Physical
              <br />
              Progress
            </p>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {project.location}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Project
              <br />
              Location
            </p>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <UserIcon className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Concerned Engineer</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.concernedEngineer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">AA Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(project.AADated).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">FWO Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(project.FWODate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              Contract Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Building2 className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Contractor</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.nameOfContractor}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <FileText className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">FWO Number</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.FWONumberAndDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <MapPin className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              Financial Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <DollarSign className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Bill Submitted</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(project.billSubmittedAmount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <FileText className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Bill Number</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {project.billNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <DollarSign className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Remaining Work Value</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(project.remainingWorkValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
