import { z } from "zod";

// Validation schema for sub-projects matching backend
const subProjectSchema = z
  .object({
    projectName: z
      .string()
      .min(3, "Sub-project name must be at least 3 characters")
      .max(200, "Sub-project name must be less than 200 characters"),
    estimatedAmount: z
      .number()
      .min(0.01, "Estimated amount must be greater than 0")
      .max(9999999999.99, "Estimated amount is too large"),
    typeOfWork: z.string().min(1, "Type of work is required"),
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
    extensionPeriodForCompletion: z.string().optional(),
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
    // Core project fields matching backend
    dateOfIssueOfWorkOrder: z
      .string()
      .min(1, "Date of issue of work order is required")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const orderDate = new Date(date);
        return orderDate >= today;
      }, "Date of issue cannot be in the past"),
    projectName: z
      .string()
      .min(5, "Project name must be at least 5 characters")
      .max(100, "Project name must be less than 100 characters"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional(),
    hasSubProjects: z.boolean(),
    fund: z.string().min(1, "Fund is required"),
    subFund: z.string().min(1, "Sub fund is required"), // NEW: Sub fund field
    sanctioningDepartment: z
      .string()
      .min(1, "Sanctioning Department is required"),
    budgetHead: z
      .string()
      .max(100, "Budget head must be less than 100 characters")
      .optional(),
    executingDepartment: z.string(),
    beneficiary: z
      .string()
      .max(200, "Beneficiary must be less than 200 characters")
      .optional(),
    workOrderNumber: z.string().min(1, "Work order number is required"),

    // NEW: Contractor fields
    contractorName: z
      .string()
      .min(2, "Contractor name must be at least 2 characters")
      .max(100, "Contractor name must be less than 100 characters"),
    contractorAddress: z
      .string()
      .min(10, "Contractor address must be at least 10 characters")
      .max(500, "Contractor address must be less than 500 characters"),
    contractorPhoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(
        /^(\+91[\s-]?)?[6-9]\d{9}$/,
        "Please enter a valid Indian phone number (10 digits starting with 6-9)"
      ),

    estimatedCost: z
      .number()
      .min(0.01, "Estimated cost must be greater than 0"),
    typeOfWork: z.string().min(1, "Type of work is required"),
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
    extensionPeriodForCompletion: z.string().optional(),
    district: z.string().min(1, "District is required"),
    block: z
      .string()
      .max(50, "Block name must be less than 50 characters")
      .optional(),
    gramPanchayat: z
      .string()
      .max(50, "Gram Panchayat name must be less than 50 characters")
      .optional(),

    // Geo location matching backend format [longitude, latitude]
    geoLocation: z
      .object({
        latitude: z.union([z.number().min(-90).max(90), z.string()]).optional(),
        longitude: z
          .union([z.number().min(-180).max(180), z.string()])
          .optional(),
      })
      .optional(),

    // Sub-projects and documents - always arrays, never undefined
    subProjects: z.array(subProjectSchema),
    uploadedFiles: z.array(z.string()),
  })
  // Project start date cannot be before date of issue
  .refine(
    (data) => {
      const issueDate = new Date(data.dateOfIssueOfWorkOrder);
      const projectStartDate = new Date(data.projectStartDate);
      return projectStartDate >= issueDate;
    },
    {
      message:
        "Project start date cannot be before the date of issue of work order",
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
      if (data.hasSubProjects) {
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
  // Sub project validation
  .superRefine((data, ctx) => {
    if (!data.subProjects || data.subProjects.length === 0) {
      return;
    }

    const mainProjectStartDate = new Date(data.projectStartDate);
    const mainProjectEndDate = new Date(data.projectEndDate);

    data.subProjects.forEach((subProject, index) => {
      const subProjectStartDate = new Date(subProject.projectStartDate);
      const subProjectEndDate = new Date(subProject.projectEndDate);

      if (subProjectStartDate < mainProjectStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Sub-project start date cannot be before the main project start date",
          path: ["subProjects", index, "projectStartDate"],
        });
      }

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
