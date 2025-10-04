"use client";

import {
  fetchDropdownOptions,
  getSubFundsForMainFund,
  type DropdownOptions,
} from "@/actions/create-project/fetchDropDownOptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  EditProjectFormValues,
  editProjectSchema,
} from "@/schema/edit-project/edit-project.schema";
import { DbProject, SubProject } from "@/types/projects.types";
import {
  getCurrentPosition,
  type GeoLocationData,
} from "@/utils/create-project/getCurrentPosition";
import { fetchProjectById } from "@/utils/projects/fetchAllProjects";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  Info,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  RefreshCw,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StepProgress } from "./step-progress";

// ============= INTERFACES =============
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

interface FormLabelWithTooltipProps {
  children: React.ReactNode;
  tooltip?: string;
  required?: boolean;
}

interface EditProjectFormProps {
  projectId: string;
}

type FormStep = "form" | "review" | "submit";

const apiUrl = process.env.NEXT_PUBLIC_PROD_API_URL;
// const apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

// ============= TOOLTIPS AND LABELS =============
const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg max-w-xs w-max bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const FormLabelWithTooltip = ({
  children,
  tooltip,
  required = false,
}: FormLabelWithTooltipProps) => {
  return (
    <FormLabel className="flex items-center gap-2">
      <span>{children}</span>
      {tooltip && (
        <Tooltip content={tooltip}>
          <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </Tooltip>
      )}
      {required && <span className="text-red-500">*</span>}
    </FormLabel>
  );
};

// ============= SUCCESS SCREEN COMPONENT =============
const ProjectUpdateSuccessScreen = ({
  projectName,
  onViewProject,
  onGoToProjects,
}: {
  projectId: string;
  projectName: string;
  onViewProject: () => void;
  onGoToProjects: () => void;
}) => {
  return (
    <div className="w-full rounded-xl">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Success Header */}
          <div className="bg-teal-600 text-white p-8 text-center rounded-t-lg">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-xl font-md mb-2">
              Project updated successfully
            </h1>
            <div className="bg-white text-teal-600 px-4 py-1 rounded-lg inline-block font-semibold text-base">
              Project: {projectName}
            </div>
          </div>

          {/* Success Message */}
          <div className="p-8 bg-gray-50 text-center rounded-b-lg">
            <p className="text-gray-700 mb-8">
              The project has been updated successfully. All changes have been
              saved and logged.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                onClick={onGoToProjects}
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Go To Projects
              </Button>

              <Button
                onClick={onViewProject}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Eye className="w-4 h-4" />
                View Updated Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============= PREVIEW COMPONENT =============
const ProjectEditPreview = ({
  formData,
  uploadedFiles,
  existingFiles,
  onEdit,
}: {
  formData: EditProjectFormValues;
  uploadedFiles: File[];
  existingFiles: { fileName: string; fileSize: number }[];
  onEdit: () => void;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const InfoItem = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: string | React.ReactNode;
    className?: string;
  }) => (
    <div className={`space-y-1 ${className}`}>
      <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      <div className="text-gray-900 font-medium">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div>
            <h3 className="font-semibold text-orange-800">Review Changes</h3>
            <p className="text-sm text-orange-700">
              Please review all changes carefully before updating the project.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Edit className="w-4 h-4" />
          Edit Details
        </Button>
      </div>

      {/* Project Summary Card */}
      <Card className="border-2 border-teal-600 shadow-sm">
        <CardHeader className="bg-teal-600 rounded-tl-lg rounded-tr-lg">
          <CardTitle className="text-xl text-white">
            {formData.projectName}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge
              variant={formData.hasSubProjects ? "default" : "secondary"}
              className="bg-white text-teal-600"
            >
              {formData.hasSubProjects ? "Has Sub-Projects" : "Single Project"}
            </Badge>
            <span className="text-white font-semibold text-lg">
              {formatCurrency(formData.estimatedCost)}
            </span>
            <span className="text-white">
              {formatDate(formData.projectStartDate)} -{" "}
              {formatDate(formData.projectEndDate)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-700 leading-relaxed">
            {formData.description || "No description provided"}
          </p>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            label="Date of Issue of Work Order"
            value={formatDate(formData.dateOfIssueOfWorkOrder)}
          />
          <InfoItem
            label="Work Order Number"
            value={formData.workOrderNumber}
          />
          <InfoItem
            label="Beneficiary"
            value={formData.beneficiary || "Not specified"}
          />
          <InfoItem
            label="Executing Department"
            value={formData.executingDepartment}
          />
        </CardContent>
      </Card>

      {/* Contractor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Contractor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Contractor Name" value={formData.contractorName} />
          <InfoItem
            label="Phone Number"
            value={formData.contractorPhoneNumber}
          />
          <InfoItem
            label="Address"
            value={formData.contractorAddress}
            className="md:col-span-2"
          />
        </CardContent>
      </Card>

      {/* Work Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Work Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Type of Work" value={formData.typeOfWork} />
          <InfoItem
            label="Sanctioning Department"
            value={formData.sanctioningDepartment}
          />
        </CardContent>
      </Card>

      {/* Financial Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Fund" value={formData.fund} />
          <InfoItem label="Sub Fund" value={formData.subFund} />
          <InfoItem
            label="Budget Head"
            value={formData.budgetHead || "Not specified"}
          />
          <InfoItem
            label="Estimated Cost"
            value={
              <span className="text-xl font-bold text-teal-600">
                {formatCurrency(formData.estimatedCost)}
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="District" value={formData.district} />
          <InfoItem label="Block" value={formData.block || "Not specified"} />
          <InfoItem
            label="Gram Panchayat"
            value={formData.gramPanchayat || "Not specified"}
          />
          <InfoItem
            label="Geo Location"
            value={
              <div className="space-y-1">
                <div>
                  <span className="text-sm text-gray-500">Latitude:</span>{" "}
                  {formData.geoLocation?.latitude || "Not specified"}
                </div>
                <div>
                  <span className="text-sm text-gray-500">Longitude:</span>{" "}
                  {formData.geoLocation?.longitude || "Not specified"}
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Sub-projects */}
      {formData.hasSubProjects &&
        formData.subProjects &&
        formData.subProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sub-project Details</CardTitle>
              <CardDescription>
                {formData.subProjects.length} sub-project
                {formData.subProjects.length > 1 ? "s" : ""} configured
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.subProjects.map((subProject, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-gray-800">
                      Sub-project {index + 1}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-teal-600 border-teal-300"
                    >
                      {formatCurrency(subProject.estimatedAmount)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Name" value={subProject.projectName} />
                    <InfoItem
                      label="Type of Work"
                      value={subProject.typeOfWork}
                    />
                    <InfoItem
                      label="Duration"
                      value={`${formatDate(
                        subProject.projectStartDate
                      )} - ${formatDate(subProject.projectEndDate)}`}
                      className="md:col-span-2"
                    />
                    {subProject.extensionPeriodForCompletion && (
                      <InfoItem
                        label="Extension Period"
                        value={formatDate(
                          subProject.extensionPeriodForCompletion
                        )}
                        className="md:col-span-2"
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-teal-600">
                    Total Sub-project Cost:
                  </span>
                  <span className="text-xl font-bold text-teal-600">
                    {formatCurrency(
                      formData.subProjects.reduce(
                        (total, sub) => total + sub.estimatedAmount,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Document Files */}
      {(existingFiles.length > 0 || uploadedFiles.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
            <CardDescription>
              {existingFiles.length + uploadedFiles.length} document
              {existingFiles.length + uploadedFiles.length > 1 ? "s" : ""} total
              {uploadedFiles.length > 0 && (
                <span className="text-teal-600 font-medium">
                  {" "}
                  ({uploadedFiles.length} new file
                  {uploadedFiles.length > 1 ? "s" : ""} to be added)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">
                    Existing Files ({existingFiles.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {existingFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        {getFileIcon(file.fileName)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB •{" "}
                            Existing
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h5 className="font-medium text-teal-600 mb-3">
                    New Files ({uploadedFiles.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 border border-teal-200 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                      >
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-teal-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • New
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Update Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              {`All changes will be tracked and logged. The project's edit history
              will reflect this update. New files will be added to existing
              documents.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============
export default function EditProjectForm({ projectId }: EditProjectFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);
  const [existingProject, setExistingProject] = useState<DbProject | null>(
    null
  );

  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] =
    useState<DropdownOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [availableSubFunds, setAvailableSubFunds] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      dateOfIssueOfWorkOrder: new Date().toISOString().split("T")[0],
      projectName: "",
      description: "",
      hasSubProjects: false,
      fund: "",
      subFund: "",
      sanctioningDepartment: "",
      budgetHead: "",
      executingDepartment: "APTDCL",
      beneficiary: "",
      workOrderNumber: "",
      contractorName: "",
      contractorAddress: "",
      contractorPhoneNumber: "",
      estimatedCost: 0,
      typeOfWork: "",
      projectStartDate: "",
      projectEndDate: "",
      extensionPeriodForCompletion: "",
      district: "",
      block: "",
      gramPanchayat: "",
      geoLocation: {
        latitude: "",
        longitude: "",
      },
      subProjects: [],
      uploadedFiles: [],
    },
  });

  // Populate form with existing project data
  const populateForm = useCallback(
    (project: DbProject) => {
      // Format dates for input fields
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
      };

      // Set form values
      form.setValue(
        "dateOfIssueOfWorkOrder",
        formatDateForInput(project.dateOfIssueOfWorkOrder)
      );
      form.setValue("projectName", project.projectName || "");
      form.setValue("description", project.description || "");
      form.setValue("hasSubProjects", Boolean(project.hasSubProjects));
      form.setValue("fund", project.fund || "");
      form.setValue("subFund", project.subFund || "");
      form.setValue(
        "sanctioningDepartment",
        project.sanctioningDepartment || ""
      );
      form.setValue("budgetHead", project.budgetHead || "");
      form.setValue(
        "executingDepartment",
        project.executingDepartment || "APTDCL"
      );
      form.setValue("beneficiary", project.beneficiary || "");
      form.setValue("workOrderNumber", project.workOrderNumber || "");
      form.setValue("contractorName", project.contractorName || "");
      form.setValue("contractorAddress", project.contractorAddress || "");
      form.setValue(
        "contractorPhoneNumber",
        project.contractorPhoneNumber || ""
      );
      form.setValue("estimatedCost", project.estimatedCost || 0);
      form.setValue("typeOfWork", project.typeOfWork || "");
      form.setValue(
        "projectStartDate",
        formatDateForInput(project.projectStartDate)
      );
      form.setValue(
        "projectEndDate",
        formatDateForInput(project.projectEndDate)
      );
      form.setValue(
        "extensionPeriodForCompletion",
        formatDateForInput(project.extensionPeriodForCompletion as string)
      );
      form.setValue("district", project.district || "");
      form.setValue("block", project.block || "");
      form.setValue("gramPanchayat", project.gramPanchayat || "");

      // Handle geo location
      if (project.geoLocation && project.geoLocation.coordinates) {
        const [longitude, latitude] = project.geoLocation.coordinates;
        form.setValue("geoLocation", {
          latitude: latitude?.toString() || "",
          longitude: longitude?.toString() || "",
        });
      }

      // Handle sub-projects
      if (project.subProjects && Array.isArray(project.subProjects)) {
        const formattedSubProjects = project.subProjects.map(
          (sub: SubProject) => ({
            projectName: sub.projectName || "",
            estimatedAmount: sub.estimatedAmount || 0,
            typeOfWork: sub.typeOfWork || "",
            projectStartDate: formatDateForInput(sub.projectStartDate),
            projectEndDate: formatDateForInput(sub.projectEndDate),
            extensionPeriodForCompletion: formatDateForInput(
              sub.extensionPeriodForCompletion as string
            ),
          })
        );
        form.setValue("subProjects", formattedSubProjects);
      }
    },
    [form]
  );

  // Fetch dropdown options and project data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingOptions(true);
        setIsLoadingProject(true);

        // Load dropdown options and project data in parallel
        const [optionsResult, projectResult] = await Promise.allSettled([
          fetchDropdownOptions(),
          fetchProjectById(projectId),
        ]);

        // Handle dropdown options
        if (optionsResult.status === "fulfilled") {
          setDropdownOptions(optionsResult.value);
        } else {
          setOptionsError("Failed to load form options");
        }

        // Handle project data
        if (projectResult.status === "fulfilled") {
          const project = projectResult.value;
          setExistingProject(project);
          populateForm(project);
        } else {
          setProjectLoadError("Failed to load project data");
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setOptionsError("Failed to load required data");
        setProjectLoadError("Failed to load project");
      } finally {
        setIsLoadingOptions(false);
        setIsLoadingProject(false);
      }
    };

    if (projectId) {
      loadData();
    }
  }, [projectId, populateForm]);

  // Watch for fund changes to populate sub funds
  const selectedFund = form.watch("fund");
  const selectedSubFund = form.watch("subFund");

  // Update sub funds when main fund changes
  useEffect(() => {
    if (selectedFund && dropdownOptions?.funds) {
      const subFunds = getSubFundsForMainFund(
        dropdownOptions.funds,
        selectedFund
      );
      setAvailableSubFunds(subFunds);

      // Reset sub fund if the current selection is not valid for the new main fund
      if (
        selectedSubFund &&
        !subFunds.some((sf) => sf.name === selectedSubFund)
      ) {
        form.setValue("subFund", "");
      }
    } else {
      setAvailableSubFunds([]);
      form.setValue("subFund", "");
    }
  }, [selectedFund, dropdownOptions?.funds, selectedSubFund, form]);

  // Handle getting current geo location
  const handleGetCurrentLocation = async () => {
    try {
      setIsFetchingLocation(true);
      const geoData: GeoLocationData = await getCurrentPosition();

      form.setValue("geoLocation", {
        latitude: geoData.latitude,
        longitude: geoData.longitude,
      });

      toast.success("Location retrieved successfully!");
    } catch (error: unknown) {
      console.error("Error getting location:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to get current location");
      } else {
        toast.error("Failed to get current location");
      }
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Handle going back to project view
  const handleViewProject = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  // Handle cancel
  const handleCancel = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const watchHasSubProjects = form.watch("hasSubProjects");
  const watchedValues = form.watch();

  // Function to check if form has changes compared to original
  const hasChanges = () => {
    if (!existingProject) return false;

    const formValues = form.getValues();

    // Compare key fields (you can extend this as needed)
    const fieldsToCheck = [
      "projectName",
      "description",
      "contractorName",
      "contractorAddress",
      "contractorPhoneNumber",
      "estimatedCost",
      "beneficiary",
      "budgetHead",
      "block",
      "gramPanchayat",
    ];

    for (const field of fieldsToCheck) {
      const formValue = formValues[field as keyof typeof formValues];
      const projectValue = existingProject[field as keyof DbProject];

      if (formValue !== projectValue) {
        return true;
      }
    }

    // Check if new files were added
    if (uploadedFiles.length > 0) {
      return true;
    }

    return false;
  };

  // Function to check if all required fields are filled
  const isFormValid = () => {
    try {
      const basicFields = [
        "dateOfIssueOfWorkOrder",
        "projectName",
        "fund",
        "subFund",
        "sanctioningDepartment",
        "workOrderNumber",
        "contractorName",
        "contractorAddress",
        "contractorPhoneNumber",
        "typeOfWork",
        "projectStartDate",
        "projectEndDate",
        "district",
      ];

      for (const field of basicFields) {
        const value = watchedValues[field as keyof typeof watchedValues];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return false;
        }
      }

      // Check estimated cost
      const estimatedCost = watchedValues.estimatedCost;
      if (
        estimatedCost === undefined ||
        estimatedCost === null ||
        estimatedCost <= 0 ||
        isNaN(Number(estimatedCost))
      ) {
        return false;
      }

      if (watchedValues.hasSubProjects) {
        const subProjects = watchedValues.subProjects;
        if (subProjects.length === 0) {
          return false;
        }

        for (const subProject of subProjects) {
          const requiredSubFields = [
            "projectName",
            "typeOfWork",
            "projectStartDate",
            "projectEndDate",
          ];

          for (const field of requiredSubFields) {
            const value = subProject[field as keyof typeof subProject];
            if (!value || (typeof value === "string" && value.trim() === "")) {
              return false;
            }
          }

          const estimatedAmount = subProject.estimatedAmount;
          if (
            estimatedAmount === undefined ||
            estimatedAmount === null ||
            estimatedAmount <= 0 ||
            isNaN(Number(estimatedAmount))
          ) {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  };

  const formIsValid = isFormValid();

  // Handle adding a new sub-project
  const handleAddSubProject = () => {
    const currentSubProjects = form.getValues("subProjects");
    form.setValue("subProjects", [
      ...currentSubProjects,
      {
        projectName: "",
        estimatedAmount: 0,
        typeOfWork: "",
        projectStartDate: "",
        projectEndDate: "",
        extensionPeriodForCompletion: "",
      },
    ]);
  };

  // Handle removing a sub-project
  const handleRemoveSubProject = (index: number) => {
    const currentSubProjects = form.getValues("subProjects");
    form.setValue(
      "subProjects",
      currentSubProjects.filter((_, i) => i !== index)
    );
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types - ONLY PDF and Images
    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
    const invalidFiles = files.filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      return !allowedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file types. Only PDF and image files (JPG, PNG) are allowed: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Validate file sizes (10MB max)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error(
        `Files too large (max 10MB): ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Simulate upload progress
    files.forEach((file, index) => {
      const fileId = `${file.name}_${Date.now()}_${index}`;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[fileId] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: current + 10 };
        });
      }, 100);
    });

    setUploadedFiles((prev) => [...prev, ...files]);

    const fileNames = files.map((file) => file.name);
    const currentFiles = form.getValues("uploadedFiles");
    form.setValue("uploadedFiles", [...currentFiles, ...fileNames]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      Object.keys(newProgress).forEach((key) => {
        if (key.startsWith(fileToRemove.name)) {
          delete newProgress[key];
        }
      });
      return newProgress;
    });

    const currentFiles = form.getValues("uploadedFiles");
    form.setValue(
      "uploadedFiles",
      currentFiles.filter((_, i) => i !== index)
    );
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (fileInputRef.current) {
      const dt = new DataTransfer();
      files.forEach((file) => dt.items.add(file));
      fileInputRef.current.files = dt.files;

      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  // Step navigation functions
  const handleNextStep = async () => {
    if (currentStep === "form") {
      const isValid = await form.trigger();
      if (isValid && formIsValid) {
        setCurrentStep("review");
      } else {
        toast.error("Please fill all required fields correctly");
      }
    } else if (currentStep === "review") {
      setCurrentStep("submit");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "review") {
      setCurrentStep("form");
    } else if (currentStep === "submit") {
      setCurrentStep("review");
    }
  };

  const handleEditFromPreview = () => {
    setCurrentStep("form");
  };

  const onSubmit = async (values: EditProjectFormValues) => {
    try {
      setIsSubmittingForm(true);
      const token = getAuthToken();

      // Create FormData object for multipart upload
      const formData = new FormData();

      // Append only changed fields (you could implement more sophisticated change detection)
      const fieldsToUpdate = [
        "dateOfIssueOfWorkOrder",
        "projectName",
        "description",
        "hasSubProjects",
        "fund",
        "subFund",
        "sanctioningDepartment",
        "budgetHead",
        "beneficiary",
        "workOrderNumber",
        "contractorName",
        "contractorAddress",
        "contractorPhoneNumber",
        "estimatedCost",
        "typeOfWork",
        "projectStartDate",
        "projectEndDate",
        "extensionPeriodForCompletion",
        "district",
        "block",
        "gramPanchayat",
      ];

      fieldsToUpdate.forEach((field) => {
        const value = values[field as keyof EditProjectFormValues];
        if (value !== undefined && value !== null) {
          if (field === "hasSubProjects") {
            formData.append(field, value.toString());
          } else if (field === "estimatedCost") {
            formData.append(field, value.toString());
          } else {
            formData.append(field, value as string);
          }
        }
      });

      // Handle geoLocation object
      if (values.geoLocation?.latitude && values.geoLocation?.longitude) {
        const geoLocationData = {
          latitude: Number(values.geoLocation.latitude),
          longitude: Number(values.geoLocation.longitude),
        };
        formData.append("geoLocation", JSON.stringify(geoLocationData));
      }

      // Handle subProjects array
      if (values.subProjects && values.subProjects.length > 0) {
        formData.append("subProjects", JSON.stringify(values.subProjects));
      }

      // Append new files
      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append("projectFiles", file);
        });
      }

      if (!apiUrl) {
        throw new Error("API configuration is missing");
      }

      const response = await fetch(`${apiUrl}/project/${projectId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));

        const errorMessage =
          errorData.message ||
          (response.status === 400
            ? "Invalid project data provided"
            : response.status === 401
            ? "Authentication required"
            : response.status === 403
            ? "Permission denied"
            : response.status === 404
            ? "Project not found"
            : response.status === 409
            ? "Duplicate project information"
            : response.status === 500
            ? "Server error occurred"
            : "Failed to update project");

        throw new Error(errorMessage);
      }

      const apiResult = await response.json();
      console.log("Project update successful:", apiResult);

      toast.success("Project updated successfully!");
      setShowSuccessScreen(true);
    } catch (error) {
      console.error("Error updating project:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update project. Please check your information and try again.";

      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Show loading state
  if (isLoadingProject || isLoadingOptions) {
    return (
      <div className="w-full py-3 sm:py-6 space-y-4 sm:space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Project Data
            </h3>
            <p className="text-gray-600 text-center">
              Please wait while we load the project details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error states
  if (projectLoadError || optionsError) {
    return (
      <div className="w-full py-3 sm:py-6 space-y-4 sm:space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Failed to Load Project
              </h3>
              <p className="text-red-600 mb-4">
                {projectLoadError || optionsError}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Show Success Screen */}
      {showSuccessScreen ? (
        <ProjectUpdateSuccessScreen
          projectId={projectId}
          projectName={existingProject?.projectName || "Project"}
          onViewProject={handleViewProject}
          onGoToProjects={() => router.push("/dashboard/projects")}
        />
      ) : (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .dark-border input,
              .dark-border textarea,
              .dark-border button[role="combobox"] {
                border-color: #e5e5e5 !important;
                border-width: 1px !important;
                width: 100% !important;
              }

              .dark-border input:focus,
              .dark-border textarea:focus,
              .dark-border button[role="combobox"]:focus {
                border-color: #0d9488 !important;
                border-width: 1.5px !important;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
              }

              .dark-border input::placeholder,
              .dark-border textarea::placeholder {
                color: #6b7280 !important;
                opacity: 1 !important;
              }
            `,
            }}
          />

          {/* Step Progress */}
          <StepProgress currentStep={currentStep} />

          <Form {...form}>
            <div className="space-y-6">
              {/* STEP 1: FORM */}
              {currentStep === "form" && (
                <>
                  {/* Show changes indicator */}
                  {hasChanges() && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Changes Detected
                          </h4>
                          <p className="text-sm text-blue-700">
                            {`You have made changes to this project. Don't forget
                            to save your changes.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Project Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Project Information</CardTitle>
                      <CardDescription>
                        Edit the fundamental details of your project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="dateOfIssueOfWorkOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the date when the work order was issued"
                              required
                            >
                              Date of Issue of Work Order
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="date"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter a descriptive project title"
                              required
                            >
                              Project Name
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter project name"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workOrderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the official work order number"
                              required
                            >
                              Work Order Number
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter work order number"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Provide comprehensive project details including objectives, scope, and expected outcomes">
                              Description
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Textarea
                                  placeholder="Provide a detailed description of the project"
                                  className="min-h-[100px] w-full"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasSubProjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>This project has Sub Projects</FormLabel>
                            <div className="flex gap-4 sm:gap-6">
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => field.onChange(true)}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    field.value === true
                                      ? "border-blue-600 bg-blue-600"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {field.value === true && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  Yes
                                </span>
                              </div>
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => field.onChange(false)}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    field.value === false
                                      ? "border-blue-600 bg-blue-600"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {field.value === false && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  No
                                </span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Contractor Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Contractor Information
                      </CardTitle>
                      <CardDescription>
                        Update contractor details for this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="contractorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the full name of the contractor"
                              required
                            >
                              Contractor Name
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter contractor name"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contractorPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter a valid Indian phone number (10 digits starting with 6-9)"
                              required
                            >
                              Phone Number
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter phone number (e.g., 9876543210)"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contractorAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the complete address of the contractor"
                              required
                            >
                              Address
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Textarea
                                  placeholder="Enter complete contractor address"
                                  className="min-h-[80px] w-full"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Financial and Administrative Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Financial and Administrative Details
                      </CardTitle>
                      <CardDescription>
                        Update budget allocation and administrative information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <FormField
                          control={form.control}
                          name="fund"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelWithTooltip
                                tooltip="Select the source of funding for this project"
                                required
                              >
                                Fund
                              </FormLabelWithTooltip>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <div className="dark-border">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select fund" />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent>
                                  {dropdownOptions?.funds.map((fund) => (
                                    <SelectItem
                                      key={fund.name}
                                      value={fund.name}
                                    >
                                      {fund.name} ({fund.code})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subFund"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelWithTooltip
                                tooltip="Select the sub fund based on the selected main fund"
                                required
                              >
                                Sub Fund
                              </FormLabelWithTooltip>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={
                                  !selectedFund ||
                                  availableSubFunds.length === 0
                                }
                              >
                                <FormControl>
                                  <div className="dark-border">
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={
                                          !selectedFund
                                            ? "Select fund first"
                                            : availableSubFunds.length === 0
                                            ? "No sub funds available"
                                            : "Select sub fund"
                                        }
                                      />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent>
                                  {availableSubFunds.map((subFund) => (
                                    <SelectItem
                                      key={subFund.name}
                                      value={subFund.name}
                                    >
                                      {subFund.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="sanctioningDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the sanctioning department"
                              required
                            >
                              Sanctioning Department
                            </FormLabelWithTooltip>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <div className="dark-border">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {dropdownOptions?.sanctionAndDepartment.map(
                                  (dept) => (
                                    <SelectItem key={dept} value={dept}>
                                      {dept}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budgetHead"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Enter budget head classification">
                              Budget Head
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter budget head"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="executingDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Department responsible for executing the project">
                              Executing Department
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input {...field} disabled />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="beneficiary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Specify the target beneficiaries">
                              Beneficiary
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter beneficiary"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter total project cost in rupees"
                              required
                            >
                              Estimated Cost (₹)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Enter estimated cost"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  value={field.value || ""}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Work Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Details</CardTitle>
                      <CardDescription>
                        Update project implementation details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="typeOfWork"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the primary category of work"
                              required
                            >
                              Type of Work
                            </FormLabelWithTooltip>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <div className="dark-border">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {dropdownOptions?.typeOfWork.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the planned commencement date"
                              required
                            >
                              Project Start Date
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Choose the expected completion date"
                              required
                            >
                              Project End Date
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="extensionPeriodForCompletion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Optional extension period if needed">
                              Extension Period for Completion
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Location Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Location Details
                      </CardTitle>
                      <CardDescription>
                        Update project location and geographical details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select district where the project is located"
                              required
                            >
                              District
                            </FormLabelWithTooltip>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <div className="dark-border">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {dropdownOptions?.districts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Enter block name">
                              Block
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input placeholder="Enter block" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gramPanchayat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Enter gram panchayat name">
                              Gram Panchayat
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter gram panchayat"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Geo Location */}
                      <div className="space-y-4">
                        <FormLabelWithTooltip tooltip="Optional: Enter GPS coordinates or click to get current location">
                          Geo Location
                        </FormLabelWithTooltip>

                        <div className="flex flex-col lg:flex-row gap-4">
                          <FormField
                            control={form.control}
                            name="geoLocation.latitude"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                  <div className="dark-border">
                                    <Input
                                      type="number"
                                      step="any"
                                      min="-90"
                                      max="90"
                                      placeholder="Enter latitude"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || ""
                                        )
                                      }
                                      value={field.value || ""}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="geoLocation.longitude"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                  <div className="dark-border">
                                    <Input
                                      type="number"
                                      step="any"
                                      min="-180"
                                      max="180"
                                      placeholder="Enter longitude"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || ""
                                        )
                                      }
                                      value={field.value || ""}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex flex-col lg:justify-end lg:mt-[30px] lg:pb-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGetCurrentLocation}
                              disabled={isFetchingLocation}
                              className="flex items-center gap-2 w-full lg:w-auto whitespace-nowrap"
                            >
                              {isFetchingLocation ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Navigation className="w-4 h-4" />
                              )}
                              {isFetchingLocation
                                ? "Getting..."
                                : "Get Current Location"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Documents</CardTitle>
                      <CardDescription>
                        Add new supporting documents (PDF and Image files only).
                        Existing documents will be preserved.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-teal-600 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            Drag and drop new files here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports: PDF, JPG, PNG (Max 10MB each)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-3 sm:mt-4 w-full sm:w-auto text-teal-600 hover:text-teal-700 border-teal-600 hover:border-teal-700"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose Files
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Existing Files Info */}
                      {existingProject?.uploadedFiles &&
                        existingProject.uploadedFiles.length > 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                              Existing Documents (
                              {existingProject.uploadedFiles.length})
                            </h5>
                            <p className="text-sm text-gray-600">
                              Your existing{" "}
                              {existingProject.uploadedFiles.length} document
                              {existingProject.uploadedFiles.length > 1
                                ? "s"
                                : ""}{" "}
                              will be preserved. Any new files you upload will
                              be added to these existing documents.
                            </p>
                          </div>
                        )}

                      {/* New Uploaded Files */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">
                            New Files to be Added ({uploadedFiles.length})
                          </h5>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => {
                              const fileId = `${
                                file.name
                              }_${Date.now()}_${index}`;
                              const progress = uploadProgress[fileId] || 100;

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-teal-50 p-4 rounded-lg border border-teal-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    {getFileIcon(file.name)}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-teal-600">
                                        {formatFileSize(file.size)} • New
                                      </p>
                                      {progress < 100 && (
                                        <div className="mt-1">
                                          <div className="bg-gray-200 rounded-full h-1.5">
                                            <div
                                              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                                              style={{
                                                width: `${progress}%`,
                                              }}
                                            />
                                          </div>
                                          <p className="text-xs text-gray-500 mt-1">
                                            {progress}% uploaded
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {progress >= 100 && (
                                      <CheckCircle className="w-4 h-4 text-teal-500" />
                                    )}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveFile(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sub-projects */}
                  {watchHasSubProjects && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Sub-project Details</CardTitle>
                            <CardDescription>
                              Manage individual sub-projects within this main
                              project
                            </CardDescription>
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddSubProject}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add sub project
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {form.watch("subProjects").length === 0 ? (
                          <div className="text-center py-8 sm:py-12 text-gray-500">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            </div>
                            <p className="text-base sm:text-lg font-medium mb-2">
                              No sub-projects configured
                            </p>
                            <p className="text-sm text-gray-400 mb-4">
                              {`Click "Add sub project" to get started`}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4 sm:space-y-6">
                            {form.watch("subProjects").map((_, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                  <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                                    Sub-project {index + 1}
                                  </h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveSubProject(index)
                                    }
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 self-end sm:self-auto"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.projectName`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Enter descriptive name for this sub-project">
                                          Project Name
                                        </FormLabelWithTooltip>
                                        <FormControl>
                                          <div className="dark-border">
                                            <Input
                                              placeholder="Enter project name"
                                              {...field}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.estimatedAmount`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Enter cost for this sub-project">
                                          Estimated Amount (₹)
                                        </FormLabelWithTooltip>
                                        <FormControl>
                                          <div className="dark-border">
                                            <Input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              placeholder="Enter amount"
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(
                                                  parseFloat(e.target.value) ||
                                                    0
                                                )
                                              }
                                              value={field.value || ""}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.typeOfWork`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Select the work category for this specific sub-project">
                                          Type of Work
                                        </FormLabelWithTooltip>
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                        >
                                          <FormControl>
                                            <div className="dark-border">
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                              </SelectTrigger>
                                            </div>
                                          </FormControl>
                                          <SelectContent>
                                            {dropdownOptions?.typeOfWork.map(
                                              (type) => (
                                                <SelectItem
                                                  key={type}
                                                  value={type}
                                                >
                                                  {type}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.projectStartDate`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Select start date for this sub-project">
                                          Project Start Date
                                        </FormLabelWithTooltip>
                                        <FormControl>
                                          <div className="dark-border">
                                            <Input type="date" {...field} />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.projectEndDate`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Choose completion date for this sub-project">
                                          Project End Date
                                        </FormLabelWithTooltip>
                                        <FormControl>
                                          <div className="dark-border">
                                            <Input type="date" {...field} />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`subProjects.${index}.extensionPeriodForCompletion`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabelWithTooltip tooltip="Optional extension period for this sub-project">
                                          Extension Period for Completion
                                        </FormLabelWithTooltip>
                                        <FormControl>
                                          <div className="dark-border">
                                            <Input type="date" {...field} />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* STEP 2: REVIEW */}
              {currentStep === "review" && (
                <Card>
                  <CardHeader className="w-full">
                    <CardTitle>Review Changes</CardTitle>
                    <CardDescription>
                      Review all project changes and ensure everything is
                      correct before updating
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectEditPreview
                      formData={form.getValues()}
                      uploadedFiles={uploadedFiles}
                      existingFiles={existingProject?.uploadedFiles || []}
                      onEdit={handleEditFromPreview}
                    />
                  </CardContent>
                </Card>
              )}

              {/* STEP 3: SUBMIT */}
              {currentStep === "submit" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Update Project
                    </CardTitle>
                    <CardDescription>
                      You are ready to save your changes to this project. All
                      modifications will be tracked and logged.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-teal-600 border border-teal-600 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div>
                          <h4 className="font-medium text-white">
                            Ready to Update
                          </h4>
                          <p className="text-sm text-white mt-1">
                            {hasChanges()
                              ? "Your changes have been validated and are ready to be saved."
                              : "No changes detected. You can still update to refresh the project's modification timestamp."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <Save className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Project Update Ready
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Click the button below to save all your changes to this
                        project. The edit will be logged in the project history.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Button
                          type="button"
                          disabled={isSubmittingForm}
                          onClick={() => form.handleSubmit(onSubmit)()}
                          className="flex-1 sm:flex-none px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white min-w-[200px]"
                          size="lg"
                        >
                          {isSubmittingForm ? (
                            <>
                              <Loader2 className="animate-spin mr-2 w-5 h-5" />
                              Updating Project...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 w-5 h-5" />
                              Update Project
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="mt-6 text-sm text-gray-500 space-y-1">
                        <p>• All changes will be tracked in the edit history</p>
                        <p>• New files will be added to existing documents</p>
                        <p>• The project status will remain unchanged</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    currentStep === "form" ? handleCancel : handlePrevStep
                  }
                  disabled={isSubmittingForm}
                  className="flex items-center gap-2 border-teal-600 text-teal-600 hover:bg-gray-100 hover:text-teal-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentStep === "form" ? "Cancel" : "Previous"}
                </Button>

                {currentStep !== "submit" && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      isSubmittingForm ||
                      (currentStep === "form" && !formIsValid)
                    }
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {currentStep === "form"
                      ? "Review Changes"
                      : "Update Project"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}
