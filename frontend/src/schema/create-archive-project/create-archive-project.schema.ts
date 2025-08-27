import { z } from "zod";

export const createArchiveProjectSchema = z
  .object({
    // Financial Year
    financialYear: z
      .string()
      .min(1, "Financial year is required")
      .regex(/^\d{4}-\d{4}$/, "Financial year must be in YYYY-YYYY format")
      .refine((year) => {
        const [startYear, endYear] = year.split("-").map(Number);
        return endYear === startYear + 1;
      }, "Financial year format should be consecutive years (e.g., 2024-2025)"),

    // Administrative Approval Details
    AANumber: z
      .string()
      .min(1, "A.A number is required")
      .max(100, "A.A number must be less than 100 characters"),

    AAAmount: z
      .number()
      .min(0.01, "A.A amount must be greater than 0")
      .max(9999999999.99, "A.A amount is too large"),

    AADated: z
      .string()
      .min(1, "A.A date is required")
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        return selectedDate <= today;
      }, "A.A date cannot be in the future"),

    // Work Details
    nameOfWork: z
      .string()
      .min(10, "Project name must be at least 10 characters")
      .max(200, "Project name cannot exceed 200 characters"),

    nameOfContractor: z
      .string()
      .min(3, "Contractor name must be at least 3 characters")
      .max(100, "Contractor name cannot exceed 100 characters"),

    workValue: z
      .number()
      .min(0.01, "Work value must be greater than 0")
      .max(9999999999.99, "Work value is too large"),

    // FWO Details
    FWONumberAndDate: z.string(),
    FWODate: z.string(),

    // Progress and Financial Details
    progress: z
      .number()
      .min(0, "Progress cannot be negative")
      .max(100, "Progress cannot exceed 100%"),

    billSubmittedAmount: z
      .number()
      .min(0, "Bill submitted amount cannot be negative")
      .max(9999999999.99, "Bill submitted amount is too large"),

    // Location and Administrative Details
    location: z
      .string()
      .min(3, "Location must be at least 3 characters")
      .max(100, "Location cannot exceed 100 characters"),

    billNumber: z
      .string()
      .min(1, "Bill number is required")
      .max(100, "Bill number must be less than 100 characters"),

    concernedEngineer: z
      .string()
      .min(3, "Concerned engineer must be at least 3 characters")
      .max(100, "Concerned engineer name must be less than 100 characters"),

    remarks: z
      .string()
      .max(500, "Remarks cannot exceed 500 characters")
      .optional(),
  })
  // Cross-field validations
  .refine(
    (data) => {
      return data.billSubmittedAmount <= data.workValue;
    },
    {
      message: "Bill submitted amount cannot exceed work value",
      path: ["billSubmittedAmount"],
    }
  )
  .refine(
    (data) => {
      const aaDate = new Date(data.AADated);
      const fwoDate = new Date(data.FWODate);
      return fwoDate >= aaDate;
    },
    {
      message: "FWO date cannot be before A.A date",
      path: ["FWODate"],
    }
  )
  // Financial year should align with AA date
  .refine(
    (data) => {
      const aaDate = new Date(data.AADated);
      const aaYear = aaDate.getFullYear();
      const [fyStartYear, fyEndYear] = data.financialYear
        .split("-")
        .map(Number);

      // Indian financial year runs from April to March
      // If AA date is between April-December, it should be in the first year
      // If AA date is between January-March, it should be in the second year
      const aaMonth = aaDate.getMonth() + 1; // JavaScript months are 0-indexed

      if (aaMonth >= 4) {
        // April to December - should be in the start year of financial year
        return aaYear === fyStartYear;
      } else {
        // January to March - should be in the end year of financial year
        return aaYear === fyEndYear;
      }
    },
    {
      message:
        "A.A date should fall within the selected financial year (April to March)",
      path: ["AADated"],
    }
  );

export type CreateArchiveProjectFormValues = z.infer<
  typeof createArchiveProjectSchema
>;

// Financial year options for dropdown
export const generateFinancialYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Determine current financial year
  const currentFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;

  const options = [];
  // Generate options for last 10 years and next 2 years
  for (let i = -10; i <= 2; i++) {
    const startYear = currentFYStart + i;
    const endYear = startYear + 1;
    options.push(`${startYear}-${endYear}`);
  }

  return options;
};

// Progress status options
export const progressStatusOptions = [
  "Not Started",
  "Just Started",
  "In Progress",
  "Halfway Complete",
  "Near Completion",
  "Completed",
] as const;

// Default dropdown options (these could be fetched from API)
export const archiveProjectDropdownOptions = {
  engineerOptions: [
    "Junior Engineer - Civil",
    "Junior Engineer - Electrical",
    "Junior Engineer - Mechanical",
    "Assistant Engineer",
    "Executive Engineer",
    "Superintending Engineer",
    "Other",
  ],
  locationOptions: [
    "Guwahati",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Tezpur",
    "Bongaigaon",
    "Sivasagar",
    "Goalpara",
    "Other",
  ],
};
