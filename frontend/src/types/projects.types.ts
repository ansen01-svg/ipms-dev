// Document interface
export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

// Sub-project interface
export interface SubProject {
  id: string;
  name: string;
  estimatedAmount: number;
  typeOfWork: string;
  subType: string;
  nature: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  progress: number;
}

// Project status enum/type
export type ProjectStatus =
  | "Draft"
  | "Submitted to AEE"
  | "Rejected by AEE"
  | "Submitted to CE"
  | "Rejected by CE"
  | "Submitted to MD"
  | "Rejected by MD"
  | "Submitted to Executing Department"
  | "Rejected by Executing Department"
  | "Approved"
  | "Ongoing"
  | "Pending"
  | "Completed";

// Main project interface
export interface Project {
  // Basic project information
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  budgetUtilized: number;
  district: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  expectedCompletion: string;
  category: string;
  subProjects: number;
  daysRemaining: number;
  currentStage: string;
  lastUpdated: string;

  // Proposal information
  dateOfProposal: string;
  hasSubProjects: boolean;
  beneficiary: string;
  letterReference: string;

  // Financial details
  fund: string;
  function: string;
  budgetHead: string;
  scheme: string;
  subScheme: string;
  estimatedCost: number;

  // Department information
  owningDepartment: string;
  executingDepartment: string;

  // Work details
  typeOfWork: string;
  subTypeOfWork: string;
  natureOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  modeOfExecution: string;

  // Location details
  locality: string;
  ward: string;
  ulb: string;
  latitude: number;
  longitude: number;

  // Related data
  documents: ProjectDocument[];
  subProjectDetails: SubProject[];
}
