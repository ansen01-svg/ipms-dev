import { z } from "zod";

// Validation schemas for different parts of the project
const subProjectSchema = z
  .object({
    name: z
      .string()
      .min(3, "Sub-project name must be at least 3 characters")
      .max(200, "Sub-project name must be less than 200 characters"),
    estimatedAmount: z
      .number()
      .min(0.01, "Estimated amount must be greater than 0")
      .max(9999999999.99, "Estimated amount is too large"),
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
      .number()
      .min(0.01, "Estimated cost must be greater than 0")
      .max(9999999999.99, "Estimated cost is too large"),

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
    geoLocation: z
      .object({
        latitude: z.number().min(-90).max(90).optional().or(z.literal("")),
        longitude: z.number().min(-180).max(180).optional().or(z.literal("")),
      })
      .optional(),

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
  // Project end date must be after start date
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
  // Sub-projects required when enabled
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
  // FIXED: Sub project start dates cannot be before main project start date
  .superRefine((data, ctx) => {
    if (!data.subProjects || data.subProjects.length === 0) {
      return;
    }

    const mainProjectStartDate = new Date(data.projectStartDate);

    data.subProjects.forEach((subProject, index) => {
      const subProjectStartDate = new Date(subProject.projectStartDate);
      if (subProjectStartDate < mainProjectStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Sub-project start date cannot be before the main project start date",
          path: ["subProjects", index, "projectStartDate"],
        });
      }
    });
  })
  // FIXED: Sub project end dates cannot be after main project end date
  .superRefine((data, ctx) => {
    if (!data.subProjects || data.subProjects.length === 0) {
      return;
    }

    const mainProjectEndDate = new Date(data.projectEndDate);

    data.subProjects.forEach((subProject, index) => {
      const subProjectEndDate = new Date(subProject.projectEndDate);
      if (subProjectEndDate > mainProjectEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Sub-project end date cannot be after the main project end date",
          path: ["subProjects", index, "projectEndDate"],
        });
      }
    });
  });

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
