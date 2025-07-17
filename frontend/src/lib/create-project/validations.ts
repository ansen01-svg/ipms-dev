import { z } from "zod";

// Validation schemas for different parts of the project
export const projectBasicInfoSchema = z.object({
  dateOfProposal: z.string().min(1, "Date of proposal is required"),
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(200, "Project name must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  hasSubProjects: z.enum(["yes", "no"]),
});

export const projectFinancialSchema = z.object({
  fund: z.string().min(1, "Fund is required"),
  function: z.string().min(1, "Function is required"),
  budgetHead: z.string().min(1, "Budget head is required"),
  scheme: z.string().min(1, "Scheme is required"),
  subScheme: z.string().min(1, "Sub-scheme is required"),
  estimatedCost: z
    .string()
    .min(1, "Estimated cost is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
});

export const projectDetailsSchema = z.object({
  owningDepartment: z.string().min(1, "Owning department is required"),
  executingDepartment: z.string().min(1, "Executing department is required"),
  beneficiary: z.string().min(1, "Beneficiary is required"),
  letterReference: z.string().optional(),
  typeOfWork: z.string().min(1, "Type of work is required"),
  subTypeOfWork: z.string().min(1, "Sub-type of work is required"),
  natureOfWork: z.string().min(1, "Nature of work is required"),
  projectStartDate: z.string().min(1, "Project start date is required"),
  projectEndDate: z.string().min(1, "Project end date is required"),
  recommendedModeOfExecution: z.string().min(1, "Recommended mode is required"),
});

export const projectLocationSchema = z.object({
  locality: z.string().min(1, "Locality is required"),
  ward: z.string().min(1, "Ward is required"),
  ulb: z.string().min(1, "ULB is required"),
  geoLocation: z.string().optional(),
});

export const subProjectSchema = z.object({
  name: z.string().min(1, "Sub-project name is required"),
  estimatedAmount: z
    .string()
    .min(1, "Estimated amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  typeOfWork: z.string().min(1, "Type of work is required"),
  subTypeOfWork: z.string().min(1, "Sub-type of work is required"),
  natureOfWork: z.string().min(1, "Nature of work is required"),
  projectStartDate: z.string().min(1, "Start date is required"),
  projectEndDate: z.string().min(1, "End date is required"),
});

// Complete project schema
export const createProjectSchema = projectBasicInfoSchema
  .merge(projectFinancialSchema)
  .merge(projectDetailsSchema)
  .merge(projectLocationSchema)
  .extend({
    subProjects: z.array(subProjectSchema).optional(),
    uploadedFiles: z.array(z.string()).optional(),
  })
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
  );

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
