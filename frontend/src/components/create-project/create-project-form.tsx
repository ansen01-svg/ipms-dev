"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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
import InstructionsCard from "./instructions-card";
import TabNavigation from "./tab-navigation";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

interface FormLabelWithTooltipProps {
  children: React.ReactNode;
  tooltip?: string;
  required?: boolean;
}

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

// ============= SCHEMA DEFINITIONS =============
const subProjectSchema = z
  .object({
    name: z
      .string()
      .min(3, "Sub-project name must be at least 3 characters")
      .max(200, "Sub-project name must be less than 200 characters"),
    estimatedAmount: z
      .string()
      .min(1, "Estimated amount is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
    typeOfWork: z.string().min(1, "Type of work is required"),
    subTypeOfWork: z.string().min(1, "Sub-type of work is required"),
    natureOfWork: z.string().min(1, "Nature of work is required"),
    projectStartDate: z
      .string()
      .min(1, "Start date is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(date);
        return startDate >= today;
      }, "Start date cannot be in the past"),
    projectEndDate: z
      .string()
      .min(1, "End date is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        return endDate >= today;
      }, "End date cannot be in the past"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.projectStartDate);
      const endDate = new Date(data.projectEndDate);
      return startDate < endDate;
    },
    {
      message: "End date must be after start date",
      path: ["projectEndDate"],
    }
  );

const createProjectSchema = z
  .object({
    // Basic Project Information
    dateOfProposal: z
      .string()
      .min(1, "Date of proposal is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const proposalDate = new Date(date);
        return proposalDate >= today;
      }, "Date of proposal cannot be in the past"),
    projectName: z
      .string()
      .min(3, "Project name must be at least 3 characters")
      .max(200, "Project name must be less than 200 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters"),
    hasSubProjects: z.enum(["yes", "no"]),

    // Financial Details
    fund: z.string().min(1, "Fund is required"),
    function: z.string().min(1, "Function is required"),
    budgetHead: z.string().min(1, "Budget head is required"),
    scheme: z
      .string()
      .min(3, "Scheme name must be at least 3 characters")
      .max(200, "Scheme name must be less than 200 characters"),
    subScheme: z
      .string()
      .min(3, "Sub scheme name must be at least 3 characters")
      .max(200, "Sub scheme name must be less than 200 characters"),

    // Department Information
    owningDepartment: z.string().min(1, "Owning department is required"),
    executingDepartment: z.string().min(1, "Executing department is required"),
    beneficiary: z
      .string()
      .min(3, "Beneficiary name must be at least 3 characters")
      .max(200, "Beneficiary name must be less than 200 characters"),
    letterReference: z.string(),
    estimatedCost: z
      .string()
      .min(1, "Estimated cost is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),

    // Work Details
    typeOfWork: z.string().min(1, "Type of work is required"),
    subTypeOfWork: z.string().min(1, "Sub-type of work is required"),
    natureOfWork: z.string().min(1, "Nature of work is required"),
    projectStartDate: z
      .string()
      .min(1, "Project start date is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(date);
        return startDate >= today;
      }, "Project start date cannot be in the past"),
    projectEndDate: z
      .string()
      .min(1, "Project end date is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        return endDate >= today;
      }, "Project end date cannot be in the past"),
    recommendedModeOfExecution: z
      .string()
      .min(1, "Recommended mode is required"),

    // Location Details
    locality: z
      .string()
      .min(3, "Locality name must be at least 3 characters")
      .max(200, "Locality name must be less than 200 characters"),
    ward: z.string().min(1, "Ward is required"),
    ulb: z.string().min(1, "ULB is required"),
    geoLocation: z.string(),

    // Sub-projects (conditional)
    subProjects: z.array(subProjectSchema).optional(),

    // Documents
    uploadedFiles: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.projectStartDate);
      const endDate = new Date(data.projectEndDate);
      return startDate < endDate;
    },
    {
      message: "Project end date must be after start date",
      path: ["projectEndDate"],
    }
  )
  .refine(
    (data) => {
      if (data.hasSubProjects === "yes") {
        return data.subProjects && data.subProjects.length > 0;
      }
      return true;
    },
    {
      message:
        "At least one sub-project is required when sub-projects are enabled",
      path: ["subProjects"],
    }
  );

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateProjectForm({
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "financial" | "subProjects"
  >("details");
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

  // Watch all form values to determine if form is valid for submission
  const watchedValues = form.watch();

  // Function to check if all required fields are filled
  const isFormValid = () => {
    try {
      // Check basic required fields
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

      // If sub-projects are enabled, check if at least one sub-project exists and is valid
      if (watchedValues.hasSubProjects === "yes") {
        const subProjects = watchedValues.subProjects || [];
        if (subProjects.length === 0) {
          return false;
        }

        // Check if all sub-projects have required fields filled
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
    } catch (error) {
      console.log(error);
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

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = [
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png",
      ".xls",
      ".xlsx",
    ];
    const invalidFiles = files.filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      return !allowedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      alert(
        `Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

    // Validate file sizes (10MB max)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert(
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

      // Simulate progress
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

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    // Remove from progress tracking
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
      // Create a new FileList-like object
      const dt = new DataTransfer();
      files.forEach((file) => dt.items.add(file));
      fileInputRef.current.files = dt.files;

      // Trigger the change event
      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  // Helper function for date validation
  const validateDate = (
    dateString: string,
    fieldName: string
  ): string | null => {
    if (!dateString) return `${fieldName} is required`;

    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return `${fieldName} cannot be in the past`;
    }

    return null;
  };

  const validateDateRange = (
    startDate: string,
    endDate: string,
    prefix: string = "Project"
  ): string | null => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj >= endDateObj) {
      return `${prefix} end date must be after start date`;
    }

    return null;
  };

  // onSubmit function
  const onSubmit = async (values: CreateProjectFormValues) => {
    try {
      setIsSubmittingForm(true);

      // 1. Validate Date of Proposal
      const proposalDateError = validateDate(
        values.dateOfProposal,
        "Date of proposal"
      );
      if (proposalDateError) {
        throw new Error(proposalDateError);
      }

      // 2. Validate Project Start and End Dates
      const projectStartDateError = validateDate(
        values.projectStartDate,
        "Project start date"
      );
      if (projectStartDateError) {
        throw new Error(projectStartDateError);
      }

      const projectEndDateError = validateDate(
        values.projectEndDate,
        "Project end date"
      );
      if (projectEndDateError) {
        throw new Error(projectEndDateError);
      }

      // 3. Validate Project Date Range
      const projectDateRangeError = validateDateRange(
        values.projectStartDate,
        values.projectEndDate
      );
      if (projectDateRangeError) {
        throw new Error(projectDateRangeError);
      }

      // 4. Validate Sub-projects if enabled
      if (values.hasSubProjects === "yes") {
        if (!values.subProjects || values.subProjects.length === 0) {
          throw new Error(
            "At least one sub-project is required when sub-projects are enabled"
          );
        }

        // Validate each sub-project
        for (let i = 0; i < values.subProjects.length; i++) {
          const subProject = values.subProjects[i];
          const subProjectPrefix = `Sub-project ${i + 1}`;

          // Check if all required fields are filled
          if (!subProject.name.trim()) {
            throw new Error(`${subProjectPrefix}: Name is required`);
          }
          if (!subProject.estimatedAmount.trim()) {
            throw new Error(
              `${subProjectPrefix}: Estimated amount is required`
            );
          }
          if (!subProject.typeOfWork) {
            throw new Error(`${subProjectPrefix}: Type of work is required`);
          }
          if (!subProject.subTypeOfWork) {
            throw new Error(
              `${subProjectPrefix}: Sub-type of work is required`
            );
          }
          if (!subProject.natureOfWork) {
            throw new Error(`${subProjectPrefix}: Nature of work is required`);
          }

          // Validate sub-project start date
          const subStartDateError = validateDate(
            subProject.projectStartDate,
            `${subProjectPrefix} start date`
          );
          if (subStartDateError) {
            throw new Error(subStartDateError);
          }

          // Validate sub-project end date
          const subEndDateError = validateDate(
            subProject.projectEndDate,
            `${subProjectPrefix} end date`
          );
          if (subEndDateError) {
            throw new Error(subEndDateError);
          }

          // Validate sub-project date range
          const subDateRangeError = validateDateRange(
            subProject.projectStartDate,
            subProject.projectEndDate,
            subProjectPrefix
          );
          if (subDateRangeError) {
            throw new Error(subDateRangeError);
          }

          // Validate estimated amount format
          if (!/^\d+(\.\d{1,2})?$/.test(subProject.estimatedAmount)) {
            throw new Error(
              `${subProjectPrefix}: Invalid amount format. Use decimal format (e.g., 150000.50)`
            );
          }
        }
      }

      // 5. Validate estimated cost format
      if (!/^\d+(\.\d{1,2})?$/.test(values.estimatedCost)) {
        throw new Error(
          "Invalid estimated cost format. Use decimal format (e.g., 500000.50)"
        );
      }

      // 6. Additional validations
      if (values.projectName.trim().length < 3) {
        throw new Error("Project name must be at least 3 characters long");
      }

      if (values.description.trim().length < 10) {
        throw new Error(
          "Project description must be at least 10 characters long"
        );
      }

      // 7. Prepare data for API call
      const apiPayload = {
        ...values,
        // Convert string amounts to numbers if needed
        estimatedCost: parseFloat(values.estimatedCost),
        subProjects:
          values.subProjects?.map((subProject) => ({
            ...subProject,
            estimatedAmount: parseFloat(subProject.estimatedAmount),
          })) || [],
      };

      // 8. Make API call
      const response = await fetch(
        "http://localhost:3000/api/v1/projects/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // "Authorization": `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(apiPayload),
        }
      );

      // 9. Handle API response
      if (!response.ok) {
        let errorMessage = "Failed to create project";

        try {
          const errorData = await response.json();

          // Handle different types of API errors
          if (response.status === 400) {
            errorMessage = errorData.message || "Invalid project data provided";
          } else if (response.status === 401) {
            errorMessage = "Authentication required. Please login again.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to create projects";
          } else if (response.status === 409) {
            errorMessage = "A project with this name already exists";
          } else if (response.status === 422) {
            // Handle validation errors from server
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = errorData.errors.join(", ");
            } else {
              errorMessage = errorData.message || "Validation failed";
            }
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage =
              errorData.message ||
              `Request failed with status ${response.status}`;
          }
        } catch (parseError) {
          console.log(parseError);
          // If we can't parse the error response, use status-based message
          if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (response.status === 404) {
            errorMessage =
              "API endpoint not found. Please contact administrator.";
          }
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // 10. Handle successful response
      const responseData = await response.json();
      toast.success("A new project has been created.");

      // Reset form after successful submission
      form.reset({
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
      });

      setUploadedFiles([]);
      setUploadProgress({});
      setActiveTab("details");

      // Show success message
      alert(
        `Project created successfully! Project ID: ${
          responseData.data?.id || "N/A"
        }`
      );

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating project:", error);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        alert(
          "Network error: Unable to connect to server. Please check your internet connection."
        );
      } else {
        toast.error(
          `Error: ${
            error instanceof Error ? error.message : "Something went wrong"
          }`
        );
      }
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
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="w-5 h-5 text-green-500" />;
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
          
          @media (max-width: 640px) {
            .space-y-6 > * + * {
              margin-top: 1rem !important;
            }
            
            .space-y-4 > * + * {
              margin-top: 0.75rem !important;
            }
          }
        `,
        }}
      />

      {/* Instructions Card */}
      <InstructionsCard />

      <Form {...form}>
        <div className="space-y-6">
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
                      tooltip="Enter a descriptive project title. Example: 'Rural Road Construction - Village ABC to XYZ'"
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

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            watchHasSubProjects={watchHasSubProjects}
          />

          {/* Project Details Tab */}
          {activeTab === "details" && (
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
                        tooltip="Select the department that will own and oversee this project from the dropdown list"
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
                        tooltip="Specify the target beneficiaries - e.g., 'Rural Population of Village XYZ', 'School Students'"
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
                      <FormLabelWithTooltip tooltip="Enter official reference number if available - e.g., 'REF/2024/PWD/001'. Leave blank if not applicable">
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
                  name="estimatedCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelWithTooltip
                        tooltip="Enter total project cost in rupees using decimal format - e.g., 500000"
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
                        tooltip="Choose the specific type of work based on your project requirements"
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
                          tooltip="Enter the specific area or locality name where the project will be implemented"
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
                          tooltip="Provide the ward number or name for precise location identification"
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
                          tooltip="Enter the Urban Local Body name - Municipality/Corporation for the project location"
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
                        <FormLabelWithTooltip tooltip="Optional: Enter GPS coordinates in format 'Latitude, Longitude' - e.g., 26.1445, 91.7362">
                          Geo Location
                        </FormLabelWithTooltip>
                        <FormControl>
                          <div className="dark-border">
                            <Input placeholder="Enter coordinates" {...field} />
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
                    Upload supporting documents. Include project proposals,
                    approvals, site photos, etc.
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
                        Supports: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 10MB
                        each)
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
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
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
                          const fileId = `${file.name}_${Date.now()}_${index}`;
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
          )}

          {/* Financial Details Tab */}
          {activeTab === "financial" && (
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
              </CardContent>
            </Card>
          )}

          {/* Sub-project Details Tab */}
          {activeTab === "subProjects" && watchHasSubProjects === "yes" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Sub-project Details</CardTitle>
                    <CardDescription>
                      Manage individual sub-projects within this main project
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
                      {`Click "Add Line Item" to get started`}
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
                                <FormLabelWithTooltip tooltip="Enter descriptive name for this sub-project component">
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
                                <FormLabelWithTooltip tooltip="Enter cost for this sub-project in decimal format - e.g., 150000">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmittingForm}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              disabled={isSubmittingForm || !formIsValid}
              onClick={form.handleSubmit(onSubmit)}
              className={`w-full sm:w-auto px-6 sm:px-8 text-white ${
                formIsValid && !isSubmittingForm
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-orange-400 cursor-not-allowed hover:bg-gray-400"
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
