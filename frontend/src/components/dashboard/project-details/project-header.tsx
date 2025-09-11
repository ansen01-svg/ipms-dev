import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import { User } from "@/types/user.types";
import {
  Building,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Landmark,
  Map,
  MapPin,
  User as UserIcon,
  Users,
} from "lucide-react";

interface ProjectHeaderProps {
  project: DbProject;
  user: User;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      Draft: "bg-gray-50 text-gray-600 border-gray-200",
      "Submitted to AEE": "bg-blue-50 text-blue-600 border-blue-200",
      "Rejected by AEE": "bg-red-50 text-red-600 border-red-200",
      "Submitted to CE": "bg-yellow-50 text-yellow-600 border-yellow-200",
      "Rejected by CE": "bg-red-50 text-red-600 border-red-200",
      "Submitted to MD": "bg-purple-50 text-purple-600 border-purple-200",
      "Rejected by MD": "bg-red-50 text-red-600 border-red-200",
      "Submitted to Executing Department":
        "bg-orange-50 text-orange-600 border-orange-200",
      "Rejected by Executing Department":
        "bg-red-50 text-red-600 border-red-200",
      Approved: "bg-green-50 text-green-600 border-green-200",
      Ongoing: "bg-blue-50 text-blue-600 border-blue-200",
      Pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
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

  const daysRemaining = calculateDaysRemaining(project.projectEndDate);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="py-5 bg-teal-600 rounded-tl-xl rounded-tr-xl">
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
              {project.subProjects.length}
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
            <div className="text-3xl font-bold text-gray-900 mb-2">
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
