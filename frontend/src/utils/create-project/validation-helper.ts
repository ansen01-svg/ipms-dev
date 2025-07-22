// utils/validation-helpers.ts
import { CreateProjectFormValues } from "@/types/create-project";

export interface ValidationError {
  field: string;
  message: string;
  step: "form" | "preview" | "submit";
}

export class ProjectValidationHelper {
  static validateStep1(
    formData: Partial<CreateProjectFormValues>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Date validations
    if (formData.dateOfProposal) {
      const proposalDate = new Date(formData.dateOfProposal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (proposalDate < today) {
        errors.push({
          field: "dateOfProposal",
          message: "Date of proposal cannot be in the past",
          step: "form",
        });
      }
    }

    // Project name validation
    if (formData.projectName) {
      if (formData.projectName.trim().length < 3) {
        errors.push({
          field: "projectName",
          message: "Project name must be at least 3 characters",
          step: "form",
        });
      }
      if (formData.projectName.trim().length > 200) {
        errors.push({
          field: "projectName",
          message: "Project name must be less than 200 characters",
          step: "form",
        });
      }
    }

    // Description validation
    if (formData.description) {
      if (formData.description.trim().length < 10) {
        errors.push({
          field: "description",
          message: "Description must be at least 10 characters",
          step: "form",
        });
      }
      if (formData.description.trim().length > 1000) {
        errors.push({
          field: "description",
          message: "Description must be less than 1000 characters",
          step: "form",
        });
      }
    }

    // Date range validation
    if (formData.projectStartDate && formData.projectEndDate) {
      const startDate = new Date(formData.projectStartDate);
      const endDate = new Date(formData.projectEndDate);

      if (startDate >= endDate) {
        errors.push({
          field: "projectEndDate",
          message: "Project end date must be after start date",
          step: "form",
        });
      }
    }

    // Cost validation
    if (formData.estimatedCost) {
      if (!/^\d+(\.\d{1,2})?$/.test(formData.estimatedCost)) {
        errors.push({
          field: "estimatedCost",
          message: "Please enter a valid amount in decimal format",
          step: "form",
        });
      }
    }

    // Sub-projects validation
    if (formData.hasSubProjects === "yes") {
      if (!formData.subProjects || formData.subProjects.length === 0) {
        errors.push({
          field: "subProjects",
          message:
            "At least one sub-project is required when sub-projects are enabled",
          step: "form",
        });
      } else {
        formData.subProjects.forEach((subProject, index) => {
          if (subProject.projectStartDate && subProject.projectEndDate) {
            const subStartDate = new Date(subProject.projectStartDate);
            const subEndDate = new Date(subProject.projectEndDate);

            if (subStartDate >= subEndDate) {
              errors.push({
                field: `subProjects.${index}.projectEndDate`,
                message: `Sub-project ${
                  index + 1
                }: End date must be after start date`,
                step: "form",
              });
            }
          }
        });
      }
    }

    return errors;
  }

  static validateFileUpload(file: File): string | null {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type: ${file.name}. Only PDF and image files are allowed.`;
    }

    if (file.size > maxSize) {
      return `File too large: ${file.name}. Maximum size is 10MB.`;
    }

    return null;
  }

  static getFieldDisplayName(fieldName: string): string {
    const fieldMap: Record<string, string> = {
      dateOfProposal: "Date of Proposal",
      projectName: "Project Name",
      description: "Description",
      hasSubProjects: "Has Sub Projects",
      fund: "Fund",
      function: "Function",
      budgetHead: "Budget Head",
      scheme: "Scheme",
      subScheme: "Sub Scheme",
      owningDepartment: "Owning Department",
      executingDepartment: "Executing Department",
      beneficiary: "Beneficiary",
      letterReference: "Letter Reference",
      estimatedCost: "Estimated Cost",
      typeOfWork: "Type of Work",
      subTypeOfWork: "Sub-Type of Work",
      natureOfWork: "Nature of Work",
      projectStartDate: "Project Start Date",
      projectEndDate: "Project End Date",
      recommendedModeOfExecution: "Recommended Mode of Execution",
      locality: "Locality",
      ward: "Ward",
      ulb: "ULB",
      geoLocation: "Geo Location",
      subProjects: "Sub Projects",
    };

    return fieldMap[fieldName] || fieldName;
  }

  static formatValidationErrors(errors: ValidationError[]): string {
    if (errors.length === 0) return "";

    if (errors.length === 1) {
      return errors[0].message;
    }

    return `Multiple errors found:\n${errors
      .map((e) => `• ${e.message}`)
      .join("\n")}`;
  }

  static checkFormCompletion(formData: CreateProjectFormValues): {
    isComplete: boolean;
    missingFields: string[];
  } {
    const requiredFields = [
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

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = formData[field as keyof CreateProjectFormValues];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missingFields.push(this.getFieldDisplayName(field));
      }
    }

    // Check sub-projects if enabled
    if (formData.hasSubProjects === "yes") {
      if (!formData.subProjects || formData.subProjects.length === 0) {
        missingFields.push("Sub Projects");
      } else {
        const subProjectRequiredFields = [
          "name",
          "estimatedAmount",
          "typeOfWork",
          "subTypeOfWork",
          "natureOfWork",
          "projectStartDate",
          "projectEndDate",
        ];

        formData.subProjects.forEach((subProject, index) => {
          for (const field of subProjectRequiredFields) {
            const value = subProject[field as keyof typeof subProject];
            if (!value || (typeof value === "string" && value.trim() === "")) {
              missingFields.push(
                `Sub-project ${index + 1}: ${this.getFieldDisplayName(field)}`
              );
            }
          }
        });
      }
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }
}
