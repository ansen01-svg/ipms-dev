import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import { DbProject } from "@/types/projects.types";
import { User } from "@/types/user.types";
import {
  Building,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Globe,
  Landmark,
  Loader2,
  Map,
  MapPin,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

interface ProjectHeaderProps {
  project: DbProject;
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      "Submitted for Approval": "bg-blue-50 text-blue-600 border-blue-200",
      "Resubmitted for Approval": "bg-blue-50 text-blue-600 border-blue-200",
      "Rejected by AEE": "bg-red-50 text-red-600 border-red-200",
      "Rejected by CE": "bg-red-50 text-red-600 border-red-200",
      "Rejected by MD": "bg-red-50 text-red-600 border-red-200",
      Ongoing: "bg-blue-50 text-blue-600 border-blue-200",
      Completed: "bg-green-50 text-green-600 border-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
        `${API_BASE_URL}/project/${project._id}/download-summary-pdf?${params}`,
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

  const daysRemaining = calculateDaysRemaining(project.projectEndDate);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="py-5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-tl-xl rounded-tr-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                {project.projectName}
              </h1>
            </div>
            <p className="text-gray-200 text-sm mb-1">
              Project ID: {project.projectId}
            </p>
            <p className="text-white/90 text-sm leading-relaxed max-w-4xl">
              {project.description || "No description available"}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge
              className={`${getStatusColor(
                project.status
              )} font-medium px-3 py-1 text-xs`}
            >
              {project.status}
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
              ₹{(project.estimatedCost / 10000000).toFixed(1)}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Estimated Cost
              <br />
              in Crores
            </p>
          </div>

          <div className="bg-orange-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.ceil(daysRemaining / 365)}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Project Duration
              <br />
              in Years
            </p>
          </div>

          <div className="bg-blue-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {project.subProjects?.length || 0}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Sub-Projects
              <br />
              Total Count
            </p>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {project.beneficiary || "Public"}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 leading-tight">
              Primary
              <br />
              Beneficiary
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
                  <p className="text-sm text-gray-500">Created by</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.createdBy.name} ({project.createdBy.role})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(project.projectStartDate).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Expected Completion</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(project.projectEndDate).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
              {project.extensionPeriodForCompletion && (
                <div className="flex items-center gap-3 bg-orange-50 p-2 rounded-md border border-orange-200">
                  <span className="p-2 rounded-md">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </span>
                  <div>
                    <p className="text-sm text-orange-600">Extension Period</p>
                    <p className="text-sm font-medium text-orange-700">
                      {new Date(
                        project.extensionPeriodForCompletion
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              Location Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Map className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.district}
                  </p>
                </div>
              </div>
              {project.block && (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                  <span className="p-2 rounded-md">
                    <MapPin className="h-4 w-4 text-teal-600" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Block</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.block}
                    </p>
                  </div>
                </div>
              )}
              {project.gramPanchayat && (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                  <span className="p-2 rounded-md">
                    <Globe className="h-4 w-4 text-teal-600" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Gram Panchayat</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.gramPanchayat}
                    </p>
                  </div>
                </div>
              )}
              {project.geoLocation && (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                  <span className="p-2 rounded-md">
                    <Landmark className="h-4 w-4 text-teal-600" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Coordinates</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">
                      Lat: {project.geoLocation.coordinates[1].toFixed(4)},
                      Long: {project.geoLocation.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Administration Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              Administration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Building2 className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Sanction Department</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.sanctioningDepartment}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Building className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Executing Department</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.executingDepartment}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <FileText className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Work Order Number</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {project.workOrderNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                <span className="p-2 rounded-md">
                  <Globe className="h-4 w-4 text-teal-600" />
                </span>
                <div>
                  <p className="text-sm text-gray-500">Fund Source</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.fund} ({project.subFund})
                  </p>
                </div>
              </div>
              {project.budgetHead && (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-md">
                  <span className="p-2 rounded-md">
                    <DollarSign className="h-4 w-4 text-teal-600" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Budget Head</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.budgetHead}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contractor Details */}
        {project.contractorName && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Contractor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {project.contractorName}
                </p>
              </div>
              {project.contractorAddress && (
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.contractorAddress}
                  </p>
                </div>
              )}
              {project.contractorPhoneNumber && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {project.contractorPhoneNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
