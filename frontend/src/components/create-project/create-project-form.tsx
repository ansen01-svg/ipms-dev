"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import InstructionsCard from "./instructions-card";
import { StepProgress } from "./step-progress";
import {
  CreateProjectFormValues,
  createProjectSchema,
} from "@/lib/create-project/validations";
import {
  fundOptions,
  functionOptions,
  budgetHeadOptions,
  departmentOptions,
  typeOfWorkOptions,
  subTypeOfWorkOptions,
  natureOfWorkOptions,
  modeOfExecutionOptions,
} from "@/utils/create-project/constants";
import {
  Loader2,
  Plus,
  X,
  Upload,
  MapPin,
  FileText,
  CheckCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Edit,
  Send,
  AlertCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

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

// ============= PREVIEW COMPONENT =============
const ProjectPreview = ({
  formData,
  uploadedFiles,
  onEdit,
}: {
  formData: CreateProjectFormValues;
  uploadedFiles: File[];
  onEdit: () => void;
}) => {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num);
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
            <h3 className="font-semibold text-orange-800">
              Review & Corrections
            </h3>
            <p className="text-sm text-orange-700">
              {`Please review your project details carefully. You can make
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

      {/* Project Summary Card */}
      <Card className="border-2 border-blue-200 shadow-sm">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl text-blue-800">
            {formData.projectName}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge
              variant={
                formData.hasSubProjects === "yes" ? "default" : "secondary"
              }
            >
              {formData.hasSubProjects === "yes"
                ? "Has Sub-Projects"
                : "Single Project"}
            </Badge>
            <span className="text-blue-700 font-semibold text-lg">
              {formatCurrency(formData.estimatedCost)}
            </span>
            <span className="text-blue-600">
              {formatDate(formData.projectStartDate)} -{" "}
              {formatDate(formData.projectEndDate)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-700 leading-relaxed">
            {formData.description}
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
            label="Date of Proposal"
            value={formatDate(formData.dateOfProposal)}
          />
          <InfoItem
            label="Letter Reference"
            value={formData.letterReference || "Not specified"}
          />
          <InfoItem label="Beneficiary" value={formData.beneficiary} />
          <InfoItem
            label="Departments"
            value={
              <div className="space-y-1">
                <div>
                  <span className="text-sm text-gray-500">Owning:</span>{" "}
                  {formData.owningDepartment}
                </div>
                <div>
                  <span className="text-sm text-gray-500">Executing:</span>{" "}
                  {formData.executingDepartment}
                </div>
              </div>
            }
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
          <InfoItem label="Sub-Type of Work" value={formData.subTypeOfWork} />
          <InfoItem label="Nature of Work" value={formData.natureOfWork} />
          <InfoItem
            label="Mode of Execution"
            value={formData.recommendedModeOfExecution}
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
          <InfoItem label="Function" value={formData.function} />
          <InfoItem label="Budget Head" value={formData.budgetHead} />
          <InfoItem
            label="Estimated Cost"
            value={
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(formData.estimatedCost)}
              </span>
            }
          />
          <InfoItem label="Scheme" value={formData.scheme} />
          <InfoItem label="Sub Scheme" value={formData.subScheme} />
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
          <InfoItem label="Locality" value={formData.locality} />
          <InfoItem label="Ward" value={formData.ward} />
          <InfoItem label="ULB" value={formData.ulb} />
          {formData.geoLocation && (
            <InfoItem label="Geo Location" value={formData.geoLocation} />
          )}
        </CardContent>
      </Card>

      {/* Sub-projects */}
      {formData.hasSubProjects === "yes" &&
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
                      className="text-blue-600 border-blue-300"
                    >
                      {formatCurrency(subProject.estimatedAmount)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Name" value={subProject.name} />
                    <InfoItem
                      label="Type of Work"
                      value={subProject.typeOfWork}
                    />
                    <InfoItem
                      label="Sub-Type"
                      value={subProject.subTypeOfWork}
                    />
                    <InfoItem label="Nature" value={subProject.natureOfWork} />
                    <InfoItem
                      label="Duration"
                      value={`${formatDate(
                        subProject.projectStartDate
                      )} - ${formatDate(subProject.projectEndDate)}`}
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">
                    Total Sub-project Cost:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(
                      formData.subProjects
                        .reduce(
                          (total, sub) =>
                            total + parseFloat(sub.estimatedAmount),
                          0
                        )
                        .toString()
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              Once you submit this project, you will not be able to modify the
              details. Please ensure all information is accurate and complete
              before proceeding to submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type FormStep = "form" | "preview" | "submit";

// ============= MAIN COMPONENT =============
export default function CreateProjectForm({
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      dateOfProposal: new Date().toISOString().split("T")[0],
      projectName: "",
      description: "",
      hasSubProjects: "no",
      fund: "",
      function: "",
      budgetHead: "",
      scheme: "",
      subScheme: "",
      owningDepartment: "",
      executingDepartment: "",
      beneficiary: "",
      letterReference: "",
      estimatedCost: "",
      typeOfWork: "",
      subTypeOfWork: "",
      natureOfWork: "",
      projectStartDate: "",
      projectEndDate: "",
      recommendedModeOfExecution: "",
      locality: "",
      ward: "",
      ulb: "",
      geoLocation: "",
      subProjects: [],
      uploadedFiles: [],
    },
  });

  const watchHasSubProjects = form.watch("hasSubProjects");
  const watchedValues = form.watch();

  // Function to check if all required fields are filled
  const isFormValid = () => {
    try {
      const basicFields = [
        "dateOfProposal",
        "projectName",
        "description",
        "fund",
        "function",
        "budgetHead",
        "scheme",
        "subScheme",
        "owningDepartment",
        "executingDepartment",
        "beneficiary",
        "estimatedCost",
        "typeOfWork",
        "subTypeOfWork",
        "natureOfWork",
        "projectStartDate",
        "projectEndDate",
        "recommendedModeOfExecution",
        "locality",
        "ward",
        "ulb",
      ];

      for (const field of basicFields) {
        const value = watchedValues[field as keyof typeof watchedValues];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return false;
        }
      }

      if (watchedValues.hasSubProjects === "yes") {
        const subProjects = watchedValues.subProjects || [];
        if (subProjects.length === 0) {
          return false;
        }

        for (const subProject of subProjects) {
          const requiredSubFields = [
            "name",
            "estimatedAmount",
            "typeOfWork",
            "subTypeOfWork",
            "natureOfWork",
            "projectStartDate",
            "projectEndDate",
          ];

          for (const field of requiredSubFields) {
            const value = subProject[field as keyof typeof subProject];
            if (!value || (typeof value === "string" && value.trim() === "")) {
              return false;
            }
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
    const currentSubProjects = form.getValues("subProjects") || [];
    form.setValue("subProjects", [
      ...currentSubProjects,
      {
        name: "",
        estimatedAmount: "",
        typeOfWork: "",
        subTypeOfWork: "",
        natureOfWork: "",
        projectStartDate: "",
        projectEndDate: "",
      },
    ]);
  };

  // Handle removing a sub-project
  const handleRemoveSubProject = (index: number) => {
    const currentSubProjects = form.getValues("subProjects") || [];
    form.setValue(
      "subProjects",
      currentSubProjects.filter((_, i) => i !== index)
    );
  };

  // Handle file upload (RESTRICTED TO PDF AND IMAGES ONLY)
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
    const currentFiles = form.getValues("uploadedFiles") || [];
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

    const currentFiles = form.getValues("uploadedFiles") || [];
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
      // Validate form before moving to preview
      const isValid = await form.trigger();
      if (isValid && formIsValid) {
        setCurrentStep("preview");
      } else {
        toast.error("Please fill all required fields correctly");
      }
    } else if (currentStep === "preview") {
      setCurrentStep("submit");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "preview") {
      setCurrentStep("form");
    } else if (currentStep === "submit") {
      setCurrentStep("preview");
    }
  };

  const handleEditFromPreview = () => {
    setCurrentStep("form");
  };

  // Final form submission
  const onSubmit = async (values: CreateProjectFormValues) => {
    try {
      setIsSubmittingForm(true);

      // API submission logic here
      const apiPayload = {
        ...values,
        estimatedCost: parseFloat(values.estimatedCost),
        subProjects:
          values.subProjects?.map((subProject) => ({
            ...subProject,
            estimatedAmount: parseFloat(subProject.estimatedAmount),
          })) || [],
      };

      const response = await fetch(
        "http://localhost:3000/api/v1/projects/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      toast.success("Project created successfully!");

      // Reset form
      form.reset();
      setUploadedFiles([]);
      setUploadProgress({});
      setCurrentStep("form");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const RadioOption = ({
    value,
    currentValue,
    onChange,
    label,
  }: {
    value: string;
    currentValue: string;
    onChange: (value: string) => void;
    label: string;
  }) => (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onChange(value)}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          currentValue === value
            ? "border-blue-600 bg-blue-600"
            : "border-gray-300 bg-white"
        }`}
      >
        {currentValue === value && (
          <div className="w-2 h-2 rounded-full bg-white"></div>
        )}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );

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

  return (
    <div className="w-full max-w-none sm:max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .dark-border input,
          .dark-border textarea,
          .dark-border button[role="combobox"] {
            border-color: #4a5568 !important;
            border-width: 1.5px !important;
            width: 100% !important;
          }
          
          .dark-border input:focus,
          .dark-border textarea:focus,
          .dark-border button[role="combobox"]:focus {
            border-color: #2563eb !important;
            border-width: 2px !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
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

      {/* Instructions Card */}
      {currentStep === "form" && <InstructionsCard />}

      <Form {...form}>
        <div className="space-y-6">
          {/* STEP 1: FORM */}
          {currentStep === "form" && (
            <>
              {/* Basic Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Project Information</CardTitle>
                  <CardDescription>
                    Enter the fundamental details of your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="dateOfProposal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Select a date. Past dates are not allowed for new proposals"
                          required
                        >
                          Date of Proposal
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input type="date" {...field} className="w-full" />
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Provide comprehensive project details including objectives, scope, and expected outcomes"
                          required
                        >
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
                          <RadioOption
                            value="yes"
                            currentValue={field.value}
                            onChange={field.onChange}
                            label="Yes"
                          />
                          <RadioOption
                            value="no"
                            currentValue={field.value}
                            onChange={field.onChange}
                            label="No"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Financial Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                  <CardDescription>
                    Budget allocation and financial planning information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
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
                            {fundOptions.map((fund) => (
                              <SelectItem key={fund} value={fund}>
                                {fund}
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
                    name="function"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Choose the functional classification that best describes your project's purpose"
                          required
                        >
                          Function
                        </FormLabelWithTooltip>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="dark-border">
                              <SelectTrigger>
                                <SelectValue placeholder="Select function" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {functionOptions.map((func) => (
                              <SelectItem key={func} value={func}>
                                {func}
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
                    name="budgetHead"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Select appropriate budget head classification"
                          required
                        >
                          Budget Head
                        </FormLabelWithTooltip>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="dark-border">
                              <SelectTrigger>
                                <SelectValue placeholder="Select budget head" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {budgetHeadOptions.map((head) => (
                              <SelectItem key={head} value={head}>
                                {head}
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
                    name="scheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Enter the name of the government scheme under which this project falls"
                          required
                        >
                          Scheme
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input placeholder="Enter scheme" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subScheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Specify the sub-scheme or component name if applicable to your project"
                          required
                        >
                          Sub Scheme
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input placeholder="Enter sub scheme" {...field} />
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
                          tooltip="Enter total project cost in rupees using decimal format"
                          required
                        >
                          Estimated Cost (₹)
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input
                              placeholder="Enter estimated cost"
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

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Detailed information about the project implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="owningDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Select the department that will own and oversee this project"
                          required
                        >
                          Owning Department
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
                            {departmentOptions.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
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
                    name="executingDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Choose the department responsible for implementing and executing the project work"
                          required
                        >
                          Executing Department
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
                            {departmentOptions.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
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
                    name="beneficiary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Specify the target beneficiaries"
                          required
                        >
                          Beneficiary
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input placeholder="Enter beneficiary" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="letterReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip tooltip="Enter official reference number if available">
                          Letter Reference/Implementation Number
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input
                              placeholder="Enter reference number"
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
                            {typeOfWorkOptions.map((type) => (
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
                    name="subTypeOfWork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Choose the specific type of work"
                          required
                        >
                          Sub-Type of Work
                        </FormLabelWithTooltip>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="dark-border">
                              <SelectTrigger>
                                <SelectValue placeholder="Select sub-type" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {subTypeOfWorkOptions.map((subType) => (
                              <SelectItem key={subType} value={subType}>
                                {subType}
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
                    name="natureOfWork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Indicate whether this is new work, ongoing work, maintenance, or emergency work"
                          required
                        >
                          Nature of Work
                        </FormLabelWithTooltip>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="dark-border">
                              <SelectTrigger>
                                <SelectValue placeholder="Select nature" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {natureOfWorkOptions.map((nature) => (
                              <SelectItem key={nature} value={nature}>
                                {nature}
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
                    name="recommendedModeOfExecution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithTooltip
                          tooltip="Select how the project should be executed"
                          required
                        >
                          Recommended Mode of Execution
                        </FormLabelWithTooltip>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="dark-border">
                              <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            {modeOfExecutionOptions.map((mode) => (
                              <SelectItem key={mode} value={mode}>
                                {mode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </h4>

                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabelWithTooltip
                            tooltip="Enter the specific area or locality name"
                            required
                          >
                            Locality
                          </FormLabelWithTooltip>
                          <FormControl>
                            <div className="dark-border">
                              <Input placeholder="Enter locality" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabelWithTooltip
                            tooltip="Provide the ward number or name"
                            required
                          >
                            Ward
                          </FormLabelWithTooltip>
                          <FormControl>
                            <div className="dark-border">
                              <Input placeholder="Enter ward" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ulb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabelWithTooltip
                            tooltip="Enter the Urban Local Body name"
                            required
                          >
                            ULB
                          </FormLabelWithTooltip>
                          <FormControl>
                            <div className="dark-border">
                              <Input placeholder="Enter ULB" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="geoLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabelWithTooltip tooltip="Optional: Enter GPS coordinates">
                            Geo Location
                          </FormLabelWithTooltip>
                          <FormControl>
                            <div className="dark-border">
                              <Input
                                placeholder="Enter coordinates"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      Relevant Documents
                    </h4>
                    <h5 className="font-semibold text-sm text-gray-900">
                      Upload supporting documents (PDF and Image files only)
                    </h5>

                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-blue-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports: PDF, JPG, PNG (Max 10MB each)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 sm:mt-4 w-full sm:w-auto"
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

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900">
                          Uploaded Files ({uploadedFiles.length})
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
                                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                              >
                                <div className="flex items-center space-x-3">
                                  {getFileIcon(file.name)}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.size)}
                                    </p>
                                    {progress < 100 && (
                                      <div className="mt-1">
                                        <div className="bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
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
                                    <CheckCircle className="w-4 h-4 text-green-500" />
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
                  </div>
                </CardContent>
              </Card>

              {/* Sub-projects */}
              {watchHasSubProjects === "yes" && (
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
                    {form.watch("subProjects")?.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-gray-500">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <p className="text-base sm:text-lg font-medium mb-2">
                          No sub-projects added yet
                        </p>
                        <p className="text-sm text-gray-400 mb-4">
                          {`Click "Add sub project" to get started`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {form.watch("subProjects")?.map((_, index) => (
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
                                onClick={() => handleRemoveSubProject(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 self-end sm:self-auto"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                              <FormField
                                control={form.control}
                                name={`subProjects.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabelWithTooltip tooltip="Enter descriptive name for this sub-project">
                                      Name of the Work
                                    </FormLabelWithTooltip>
                                    <FormControl>
                                      <div className="dark-border">
                                        <Input
                                          placeholder="Enter work name"
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
                                    <FormLabelWithTooltip tooltip="Enter cost for this sub-project in decimal format">
                                      Estimated Amount (₹)
                                    </FormLabelWithTooltip>
                                    <FormControl>
                                      <div className="dark-border">
                                        <Input
                                          placeholder="Enter amount"
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
                                        {typeOfWorkOptions.map((type) => (
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
                                name={`subProjects.${index}.subTypeOfWork`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabelWithTooltip tooltip="Choose specific sub-category">
                                      Sub-Type of Work
                                    </FormLabelWithTooltip>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <div className="dark-border">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select sub-type" />
                                          </SelectTrigger>
                                        </div>
                                      </FormControl>
                                      <SelectContent>
                                        {subTypeOfWorkOptions.map((subType) => (
                                          <SelectItem
                                            key={subType}
                                            value={subType}
                                          >
                                            {subType}
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
                                name={`subProjects.${index}.natureOfWork`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabelWithTooltip tooltip="Indicate if this sub-project is new, ongoing, maintenance, or emergency work">
                                      Nature of Work
                                    </FormLabelWithTooltip>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <div className="dark-border">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select nature" />
                                          </SelectTrigger>
                                        </div>
                                      </FormControl>
                                      <SelectContent>
                                        {natureOfWorkOptions.map((nature) => (
                                          <SelectItem
                                            key={nature}
                                            value={nature}
                                          >
                                            {nature}
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

          {/* STEP 2: PREVIEW & REVIEW */}
          {currentStep === "preview" && (
            <Card>
              <CardHeader>
                <CardTitle>Project Preview & Review</CardTitle>
                <CardDescription>
                  Review all project details and make corrections if needed
                  before final submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectPreview
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
                  <Send className="w-5 h-5 text-green-500" />
                  Final Submission
                </CardTitle>
                <CardDescription>
                  You are ready to submit your project. Click the button below
                  to create the project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">
                        Ready for Submission
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        All required fields have been completed and validated.
                        Your project is ready to be created.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Project Ready for Submission
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click the button below to create your project and submit it
                    for processing.
                  </p>

                  <Button
                    type="button"
                    disabled={isSubmittingForm}
                    onClick={form.handleSubmit(onSubmit)}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    {isSubmittingForm ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-5 h-5" />
                        Creating Project...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Submit Project
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
              onClick={currentStep === "form" ? onCancel : handlePrevStep}
              disabled={isSubmittingForm}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === "form" ? "Cancel" : "Previous"}
            </Button>

            {currentStep !== "submit" && (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={
                  isSubmittingForm || (currentStep === "form" && !formIsValid)
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === "form" ? "Preview & Review" : "Final Submit"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
