import { z } from "zod";

// Validation schemas for different parts of the project
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

export const createProjectSchema = z
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
  // Validation 1: Project start date cannot be before date of proposal
  .refine(
    (data) => {
      const proposalDate = new Date(data.dateOfProposal);
      const projectStartDate = new Date(data.projectStartDate);
      return projectStartDate >= proposalDate;
    },
    {
      message: "Project start date cannot be before the date of proposal",
      path: ["projectStartDate"],
    }
  )
  // Existing validation: Project end date must be after start date
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
  // Existing validation: Sub-projects required when enabled
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
  )
  // Validation 2: Sub project start dates cannot be before main project start date
  .refine(
    (data) => {
      if (!data.subProjects || data.subProjects.length === 0) {
        return true;
      }

      const mainProjectStartDate = new Date(data.projectStartDate);

      return data.subProjects.every((subProject) => {
        const subProjectStartDate = new Date(subProject.projectStartDate);
        return subProjectStartDate >= mainProjectStartDate;
      });
    },
    {
      message:
        "Sub-project start date cannot be before the main project start date",
      path: ["subProjects"],
    }
  )
  // Validation 3: Sub project end dates cannot be after main project end date
  .refine(
    (data) => {
      if (!data.subProjects || data.subProjects.length === 0) {
        return true;
      }

      const mainProjectEndDate = new Date(data.projectEndDate);

      return data.subProjects.every((subProject) => {
        const subProjectEndDate = new Date(subProject.projectEndDate);
        return subProjectEndDate <= mainProjectEndDate;
      });
    },
    {
      message: "Sub-project end date cannot be after the main project end date",
      path: ["subProjects"],
    }
  );

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
