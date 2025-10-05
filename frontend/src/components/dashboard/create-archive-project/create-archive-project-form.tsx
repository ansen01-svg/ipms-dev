"use client";

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
  CreateArchiveProjectFormValues,
  createArchiveProjectSchema,
  generateFinancialYearOptions,
} from "@/schema/create-archive-project/create-archive-project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Calculator,
  CheckCircle,
  Edit,
  FileCheck,
  FileText,
  Info,
  Loader2,
  Plus,
  Send,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArchiveProjectStepProgress } from "./step-progress";

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

interface ArchiveProjectData {
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
const ArchiveProjectSuccessScreen = ({
  projectData,
  onCreateNewProject,
  onGoToArchives,
}: {
  projectData: ArchiveProjectData;
  onCreateNewProject: () => void;
  onGoToArchives: () => void;
}) => {
  return (
    <div className="w-full rounded-xl">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Success Header */}
          <div className="bg-teal-600 text-white p-8 text-center rounded-t-lg">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-xl font-md mb-2">
              Archive project record created successfully
            </h1>
            <div className="bg-white text-teal-600 px-4 py-1 rounded-lg inline-block font-semibold text-base">
              Archive Record ID: {projectData.projectId}
            </div>
          </div>

          {/* Success Message */}
          <div className="p-8 bg-gray-50 text-center rounded-b-lg">
            <p className="text-gray-700 mb-8">
              Historical project record has been successfully created and added
              to the archive system for future reference and viewing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                onClick={onGoToArchives}
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                View All Archives
              </Button>

              <Button
                variant="outline"
                onClick={onCreateNewProject}
                className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
                Add Another Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============= PREVIEW COMPONENT =============
const ArchiveProjectPreview = ({
  formData,
  uploadedFiles,
  onEdit,
}: {
  formData: CreateArchiveProjectFormValues;
  uploadedFiles: File[];
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

  const getProgressStatus = (progress: number) => {
    if (!progress) return "Not Started";
    if (progress < 25) return "Just Started";
    if (progress < 50) return "In Progress";
    if (progress < 75) return "Halfway Complete";
    if (progress < 100) return "Near Completion";
    return "Completed";
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
            <h3 className="font-semibold text-orange-800">
              Review & Corrections
            </h3>
            <p className="text-sm text-orange-700">
              {`Please review your archive project details carefully. You can make
              corrections by clicking "Edit Details".`}
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

      {/* Archive Project Summary Card */}
      <Card className="border-2 border-teal-600 shadow-sm">
        <CardHeader className="bg-teal-600 rounded-tl-lg rounded-tr-lg">
          <CardTitle className="text-xl text-white">
            {formData.nameOfWork}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge className="bg-white text-teal-600">
              FY: {formData.financialYear}
            </Badge>
            <Badge className="bg-white text-teal-600">
              Progress: {formData.progress}%
            </Badge>
            <span className="text-white font-semibold text-lg">
              {formatCurrency(formData.workValue)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Contractor" value={formData.nameOfContractor} />
            <InfoItem label="Location" value={formData.location} />
            <InfoItem
              label="Progress Status"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.progress === 100
                      ? "bg-green-100 text-green-800"
                      : formData.progress >= 50
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getProgressStatus(formData.progress)}
                </span>
              }
            />
            <InfoItem
              label="Bill Submitted"
              value={formatCurrency(formData.billSubmittedAmount)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Administrative Approval Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Administrative Approval Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="A.A Number" value={formData.AANumber} />
          <InfoItem
            label="A.A Amount"
            value={
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(formData.AAAmount)}
              </span>
            }
          />
          <InfoItem label="A.A Date" value={formatDate(formData.AADated)} />
        </CardContent>
      </Card>

      {/* Work Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Work Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            label="FWO Number & Date"
            value={formData.FWONumberAndDate}
          />
          <InfoItem label="FWO Date" value={formatDate(formData.FWODate)} />
          <InfoItem
            label="Work Value"
            value={
              <span className="text-xl font-bold text-teal-600">
                {formatCurrency(formData.workValue)}
              </span>
            }
            className="md:col-span-2"
          />
        </CardContent>
      </Card>

      {/* Financial Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            Financial Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem
              label="Work Value"
              value={formatCurrency(formData.workValue)}
            />
            <InfoItem
              label="Bill Submitted"
              value={formatCurrency(formData.billSubmittedAmount)}
            />
            <InfoItem
              label="Remaining Value"
              value={
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(
                    formData.workValue - formData.billSubmittedAmount
                  )}
                </span>
              }
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {formData.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${formData.progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            Administrative Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Bill Number" value={formData.billNumber} />
          <InfoItem
            label="Concerned Engineer"
            value={formData.concernedEngineer}
          />
          {formData.remarks && (
            <InfoItem
              label="Remarks"
              value={formData.remarks}
              className="md:col-span-2"
            />
          )}
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
            <CardDescription>
              {uploadedFiles.length} document
              {uploadedFiles.length > 1 ? "s" : ""} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {file.type.split("/")[1].toUpperCase()}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Once you submit this archive project, you will not be able to
              modify the details. Please ensure all information is accurate and
              complete before proceeding to submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============
export default function CreateArchiveProjectForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submittedProjectData, setSubmittedProjectData] =
    useState<ArchiveProjectData | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const financialYearOptions = generateFinancialYearOptions();

  const form = useForm<CreateArchiveProjectFormValues>({
    resolver: zodResolver(createArchiveProjectSchema),
    defaultValues: {
      financialYear: "",
      AANumber: "",
      AAAmount: 0,
      AADated: "",
      nameOfWork: "",
      nameOfContractor: "",
      workValue: 0,
      FWONumberAndDate: "",
      FWODate: "",
      progress: 0,
      billSubmittedAmount: 0,
      location: "",
      billNumber: "",
      concernedEngineer: "",
      remarks: "",
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();

  // Function to check if all required fields are filled
  const isFormValid = () => {
    try {
      const requiredFields = [
        "financialYear",
        "AANumber",
        "AADated",
        "nameOfWork",
        "nameOfContractor",
        "FWONumberAndDate",
        "FWODate",
        "location",
        "billNumber",
        "concernedEngineer",
      ];

      for (const field of requiredFields) {
        const value = watchedValues[field as keyof typeof watchedValues];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return false;
        }
      }

      // Check numeric fields
      const numericFields = ["AAAmount", "workValue"];
      for (const field of numericFields) {
        const value = watchedValues[
          field as keyof typeof watchedValues
        ] as number;
        if (
          value === undefined ||
          value === null ||
          value <= 0 ||
          isNaN(Number(value))
        ) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  };

  const formIsValid = isFormValid();

  // Handle creating a new archive project (reset form and show it again)
  const handleCreateNewProject = () => {
    form.reset();
    setUploadedFiles([]);
    setSubmittedProjectData(null);
    setShowSuccessScreen(false);
    setCurrentStep("form");
    toast.success("Ready to create a new archive project!");
  };

  // Handle cancel with router navigation
  const handleCancel = () => {
    router.push("/dashboard/archived-projects");
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

  // Final form submission
  const onSubmit = async (values: CreateArchiveProjectFormValues) => {
    try {
      setIsSubmittingForm(true);
      const token = getAuthToken();

      const response = await fetch(`${apiUrl}/archive-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
        // credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to create archive project";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status-based messages
          switch (response.status) {
            case 400:
              errorMessage = "Invalid project data. Please check your inputs.";
              break;
            case 401:
              errorMessage = "Authentication required. Please log in.";
              break;
            case 403:
              errorMessage = "You don't have permission to create projects.";
              break;
            case 409:
              errorMessage = "A project with this information already exists.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Request failed with status: ${response.status}`;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Archive project created:", data);

      if (!data || !data.data.projectId) {
        throw new Error("Invalid response from server. Missing project ID.");
      }

      // Success flow
      setSubmittedProjectData(data.data.projectId);
      toast.success("Archive project created successfully!");
      setShowSuccessScreen(true);
    } catch (error) {
      console.error("Error creating archive project:", error);

      // Handle different error types
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Network error
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error instanceof Error) {
        // API or validation error with custom message
        toast.error(error.message);
      } else {
        // Unexpected error
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="w-full py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Show Success Screen after successful submission */}
      {showSuccessScreen && submittedProjectData ? (
        <ArchiveProjectSuccessScreen
          projectData={submittedProjectData}
          onCreateNewProject={handleCreateNewProject}
          onGoToArchives={handleCancel}
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
          <ArchiveProjectStepProgress currentStep={currentStep} />

          <Form {...form}>
            <div className="space-y-6">
              {/* STEP 1: FORM */}
              {currentStep === "form" && (
                <>
                  {/* Administrative Approval Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Administrative Approval Information
                      </CardTitle>
                      <CardDescription>
                        Enter the administrative approval details for this
                        archive project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="financialYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the financial year (April to March) when the project was approved"
                              required
                            >
                              Financial Year
                            </FormLabelWithTooltip>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <div className="dark-border">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select financial year" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {financialYearOptions.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
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
                        name="AANumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the Administrative Approval reference number"
                              required
                            >
                              A.A Number
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter A.A number"
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
                        name="AAAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the approved amount in the administrative approval"
                              required
                            >
                              A.A Amount (₹)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Enter A.A amount"
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

                      <FormField
                        control={form.control}
                        name="AADated"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the date when administrative approval was granted"
                              required
                            >
                              A.A Date
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
                    </CardContent>
                  </Card>

                  {/* Project Work Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Project Work Details
                      </CardTitle>
                      <CardDescription>
                        Information about the work and contractor details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="nameOfWork"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter a detailed description of the work/project"
                              required
                            >
                              Name of Work
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter detailed description of the work"
                                  className="w-full"
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
                        name="nameOfContractor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the name of the contractor who executed the work"
                              required
                            >
                              Name of Contractor
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
                        name="workValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the total contracted value of the work"
                              required
                            >
                              Work Value (₹)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Enter work value"
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

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the location where the work was executed"
                              required
                            >
                              Location
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter location"
                                  {...field}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Work Order Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Work Order Details
                      </CardTitle>
                      <CardDescription>
                        First Work Order and execution timeline information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="FWONumberAndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the First Work Order number and date details"
                              required
                            >
                              FWO Number and Date
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter FWO number and date details"
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
                        name="FWODate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Select the date when the First Work Order was issued"
                              required
                            >
                              FWO Date
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
                    </CardContent>
                  </Card>

                  {/* Progress and Financial Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Progress and Financial Information
                      </CardTitle>
                      <CardDescription>
                        Current progress status and bill submission details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="progress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Enter the current progress percentage (0-100)">
                              Progress (%)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  placeholder="Enter progress percentage"
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

                      <FormField
                        control={form.control}
                        name="billSubmittedAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Enter the total amount of bills submitted so far">
                              Bill Submitted Amount (₹)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Enter bill submitted amount"
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

                  {/* Administrative Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Administrative Details
                      </CardTitle>
                      <CardDescription>
                        Bill information and administrative contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="billNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the unique bill number for this project"
                              required
                            >
                              Bill Number
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter bill number"
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
                        name="concernedEngineer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip
                              tooltip="Enter the name of the engineer responsible for this project"
                              required
                            >
                              Concerned Engineer
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Input
                                  placeholder="Enter concerned engineer name"
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
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelWithTooltip tooltip="Add any additional remarks or notes about this project">
                              Remarks (Optional)
                            </FormLabelWithTooltip>
                            <FormControl>
                              <div className="dark-border">
                                <Textarea
                                  placeholder="Enter any additional remarks"
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
                </>
              )}

              {/* STEP 2: REVIEW */}
              {currentStep === "review" && (
                <Card>
                  <CardHeader className="w-full">
                    <CardTitle>Archive Project Review</CardTitle>
                    <CardDescription>
                      Review all archive project details and make corrections if
                      needed before final submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ArchiveProjectPreview
                      formData={form.getValues()}
                      uploadedFiles={uploadedFiles}
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
                      Create Archive Record
                    </CardTitle>
                    <CardDescription>
                      You are ready to create your archive project record. Click
                      the button below to add this historical project to the
                      archive system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-teal-600 border border-teal-600 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div>
                          <h4 className="font-medium text-white">
                            Ready for Archive Creation
                          </h4>
                          <p className="text-sm text-white mt-1">
                            All required fields have been completed and
                            validated. Your archive project record is ready to
                            be created and stored in the system.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Archive Record Ready for Creation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Click the button below to create your historical project
                        record and add it to the archive system for future
                        reference.
                      </p>

                      <Button
                        type="button"
                        disabled={isSubmittingForm}
                        onClick={form.handleSubmit(onSubmit)}
                        className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white"
                        size="lg"
                      >
                        {isSubmittingForm ? (
                          <>
                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                            Creating Archive Record...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-5 h-5" />
                            Create Archive Record
                          </>
                        )}
                      </Button>
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
                    {currentStep === "form" ? "Review Details" : "Final Submit"}
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
