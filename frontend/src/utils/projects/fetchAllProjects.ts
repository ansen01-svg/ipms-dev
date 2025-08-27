import { clearAuthData, getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import { DbProject, ProjectStatus } from "@/types/projects.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

// Utility function to format date to "DD MMM YYYY" format
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

// Utility function to calculate days remaining
const calculateDaysRemaining = (endDate: string): number => {
  if (!endDate) return 0;

  const today = new Date();
  const projectEnd = new Date(endDate);
  const diffTime = projectEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Utility function to determine current stage based on status and progress
const determineCurrentStage = (status: string, progress: number): string => {
  // If status provides clear stage information, use it
  switch (status) {
    case "Draft":
      return "Draft - Under Preparation";
    case "Submitted to AEE":
      return "Under Review - AEE";
    case "Rejected by AEE":
      return "Rejected by AEE";
    case "Submitted to CE":
      return "Under Review - CE";
    case "Rejected by CE":
      return "Rejected by CE";
    case "Submitted to MD":
      return "Under Review - MD";
    case "Rejected by MD":
      return "Rejected by MD";
    case "Submitted to Executing Department":
      return "Under Review - Executing Department";
    case "Rejected by Executing Department":
      return "Rejected by Executing Department";
    case "Approved":
      return "Approved - Ready to Start";
    case "Ongoing":
      if (progress === 0) return "Ongoing - Initialization";
      if (progress <= 25) return "Ongoing - Initial Phase";
      if (progress <= 50) return "Ongoing - Development";
      if (progress <= 75) return "Ongoing - Implementation";
      if (progress < 100) return "Ongoing - Final Phase";
      return "Ongoing - Near Completion";
    case "Completed":
      return "Project Completed";
    case "Pending":
      return "Pending Action Required";
    default:
      return status || "Unknown Status";
  }
};

// Type for raw backend project response (before frontend enhancements)
interface BackendProject {
  _id?: string;
  dateOfIssueOfWorkOrder: string;
  projectId: string;
  projectName: string;
  description?: string;
  hasSubProjects: boolean;
  fund: string;
  sanctionAndDepartment: string;
  budgetHead?: string;
  executingDepartment: string;
  beneficiary?: string;
  workOrderNumber: string;
  estimatedCost: number;
  typeOfWork: string;
  natureOfWork: string;
  projectStartDate: string;
  projectEndDate: string;
  extensionPeriodForCompletion?: string;
  district: string;
  block?: string;
  gramPanchayat?: string;
  subProjects: Array<{
    _id?: string;
    projectName: string;
    estimatedAmount: number;
    typeOfWork: string;
    projectStartDate: string;
    projectEndDate: string;
    extensionPeriodForCompletion?: string;
    parentProjectId: string;
  }>;
  uploadedFiles: Array<{
    _id?: string;
    fileName: string;
    fileType: "pdf" | "jpg" | "jpeg" | "png";
    fileSize: number;
    uploadedAt: Date;
    uploadedBy: {
      userId: string;
      name: string;
    };
  }>;
  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  createdBy: {
    userId: string;
    name: string;
    role: string;
  };
  lastModifiedBy?: {
    userId?: string;
    name?: string;
    role?: string;
    modifiedAt?: Date;
  };
  status: ProjectStatus;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

// Add only frontend-calculated fields to backend project data
const enhanceProjectWithCalculatedFields = (
  backendProject: BackendProject
): DbProject => {
  // Calculate frontend-only fields
  const totalSubProjects = (backendProject.subProjects || []).length;
  const daysRemaining = calculateDaysRemaining(backendProject.projectEndDate);
  const currentStage = determineCurrentStage(
    backendProject.status,
    backendProject.progressPercentage || 0
  );
  const lastUpdated = formatDate(
    backendProject.updatedAt || backendProject.createdAt
  );

  // Return project with backend fields plus calculated frontend fields
  return {
    ...backendProject,
    // Add calculated fields only
    totalSubProjects,
    daysRemaining,
    currentStage,
    lastUpdated,
    budgetUtilized: 0, // Default value since not available in backend
    progress: backendProject.progressPercentage || 0, // Alias for progressPercentage
  } as DbProject;
};

// Main fetch function - gets all projects from backend
// For cookie/session based auth
// const fetchAllProjects = async (): Promise<DbProject[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/project`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(data.message || "API returned success: false");
//     }

//     // Ensure data.data is an array
//     if (!Array.isArray(data.data)) {
//       console.warn("API response data is not an array:", data);
//       return [];
//     }

//     console.log("Fetched projects from backend:", data.data.length, "projects");

//     // Only enhance with calculated fields, don't transform backend data
//     const enhancedProjects: DbProject[] = (data.data as BackendProject[]).map(
//       (project: BackendProject) => enhanceProjectWithCalculatedFields(project)
//     );

//     return enhancedProjects;
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     throw error; // Let the calling component handle the error
//   }
// };

// For local storage based auth
const fetchAllProjects = async (): Promise<DbProject[]> => {
  try {
    // Get token from localStorage
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/project`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      console.error("Authentication failed - clearing stored data");
      clearAuthData();
      window.location.replace("/login");
      throw new Error("Authentication expired");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API returned success: false");
    }

    if (!Array.isArray(data.data)) {
      console.warn("API response data is not an array:", data);
      return [];
    }

    console.log("Fetched projects from backend:", data.data.length, "projects");

    const enhancedProjects: DbProject[] = (data.data as BackendProject[]).map(
      (project: BackendProject) => enhanceProjectWithCalculatedFields(project)
    );

    return enhancedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch single project by ID
// For cookie/session based auth
// const fetchProjectById = async (projectId: string): Promise<DbProject> => {
//   try {
//     if (!projectId) {
//       throw new Error("Project ID is required");
//     }

//     const response = await fetch(
//       // `${process.env.NEXT_PUBLIC_PROD_API_URL}/project/${projectId}`,
//       `${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${projectId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(data.message || "API returned success: false");
//     }

//     if (!data.data) {
//       throw new Error("Project not found");
//     }

//     console.log("Fetched single project:", data.data.projectId);

//     // Only enhance with calculated fields
//     const enhancedProject: DbProject = enhanceProjectWithCalculatedFields(
//       data.data as BackendProject
//     );
//     return enhancedProject;
//   } catch (error) {
//     console.error(`Error fetching project ${projectId}:`, error);
//     throw error; // Let the calling component handle the error
//   }
// };

// For local storage based auth
const fetchProjectById = async (projectId: string): Promise<DbProject> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    // Get token from localStorage
    const token = getAuthToken();

    const response = await fetch(
      // `${process.env.NEXT_PUBLIC_PROD_API_URL}/project/${projectId}`,
      `${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle authentication errors
    if (response.status === 401) {
      console.error("Authentication failed - clearing stored data");
      clearAuthData();
      window.location.replace("/login");
      throw new Error("Authentication expired");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API returned success: false");
    }

    if (!data.data) {
      throw new Error("Project not found");
    }

    console.log("Fetched single project:", data.data.projectId);

    // Only enhance with calculated fields
    const enhancedProject: DbProject = enhanceProjectWithCalculatedFields(
      data.data as BackendProject
    );
    return enhancedProject;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error; // Let the calling component handle the error
  }
};

export { fetchAllProjects, fetchProjectById };
