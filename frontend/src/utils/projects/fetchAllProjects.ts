import { DbProject, DbSubProject } from "@/types/projects.types";

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
  const today = new Date();
  const projectEnd = new Date(endDate);
  const diffTime = projectEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Utility function to determine current stage based on progress
const determineCurrentStage = (progress: number): string => {
  if (progress === 0) return "Planning";
  if (progress <= 25) return "Initial Phase";
  if (progress <= 50) return "Development";
  if (progress <= 75) return "Implementation";
  if (progress < 100) return "Final Phase";
  return "Completed";
};

// Transform subproject data to match DbSubProject interface
const transformSubProject = (
  subProject: DbSubProject,
  index: number
): DbSubProject => {
  const progress = 0;
  const status = "PENDING";

  return {
    id: subProject.id || `sub_${Date.now()}_${index}`,
    name: subProject.name || `Subproject ${index + 1}`,
    estimatedAmount: subProject.estimatedAmount || 0,
    typeOfWork: subProject.typeOfWork || "",
    subTypeOfWork: subProject.subTypeOfWork || "",
    natureOfWork: subProject.natureOfWork || "",
    projectStartDate: subProject.projectStartDate || "",
    projectEndDate: subProject.projectEndDate || "",
    status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED",
    progress: progress,
  };
};

// Transform API response to match DbProject interface
const transformProject = (apiProject: DbProject): DbProject => {
  const progress = 0;
  const budgetUtilized = 0;
  const daysRemaining = calculateDaysRemaining(apiProject.projectEndDate);
  const status = apiProject.status; // Default status, can be customized based on logic
  const currentStage = determineCurrentStage(progress);

  return {
    // Basic project information
    projectId: apiProject.projectId || apiProject.projectId?.toString() || "",
    projectName: apiProject.projectName || "",
    description: apiProject.description || "",
    status: status,
    progress: progress,
    budgetUtilized: budgetUtilized,
    createdBy: "system",
    createdByName: "System User",
    createdAt: formatDate(apiProject.createdAt) || "",
    updatedAt: formatDate(apiProject.updatedAt) || "",
    totalSubProjects: (apiProject.subProjects || []).length,
    daysRemaining: daysRemaining,
    currentStage: currentStage,
    lastUpdated:
      formatDate(apiProject.updatedAt) ||
      formatDate(apiProject.createdAt) ||
      "",

    // Proposal information
    dateOfProposal: apiProject.dateOfProposal || "",
    hasSubProjects:
      typeof apiProject.hasSubProjects === "string"
        ? (apiProject.hasSubProjects as string).toLowerCase() === "yes"
        : Boolean(apiProject.hasSubProjects),
    beneficiary: apiProject.beneficiary || "",
    letterReference: apiProject.letterReference || "",

    // Financial details
    fund: apiProject.fund || "",
    function: apiProject.function || "",
    budgetHead: apiProject.budgetHead || "",
    scheme: apiProject.scheme || "",
    subScheme: apiProject.subScheme || "",
    estimatedCost: apiProject.estimatedCost || 0,

    // Department information
    owningDepartment: apiProject.owningDepartment || "",
    executingDepartment: apiProject.executingDepartment || "",

    // Work details
    typeOfWork: apiProject.typeOfWork || "",
    subTypeOfWork: apiProject.subTypeOfWork || "",
    natureOfWork: apiProject.natureOfWork || "",
    projectStartDate: formatDate(apiProject.projectStartDate || ""),
    projectEndDate: formatDate(apiProject.projectEndDate || ""),
    recommendedModeOfExecution: apiProject.recommendedModeOfExecution || "",

    // Location details
    district: apiProject.district || "Kamrup Metro",
    block: apiProject.block || "Dispur",
    gramPanchayat: apiProject.gramPanchayat || "Dispur",
    geoLocation: apiProject.geoLocation || {
      type: "Point",
      coordinates: [0, 0],
    },

    // Related data
    uploadedFiles: apiProject.uploadedFiles || [],
    subProjects: (apiProject.subProjects || []).map(
      (subProject: DbSubProject, index: number) =>
        transformSubProject(subProject, index)
    ),
  };
};

// Enhanced fetch function
const fetchAllProjects = async (): Promise<DbProject[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/projects`,
      // `http://localhost:5000/api/projects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Ensure data is an array
    if (!Array.isArray(data.data)) {
      console.warn("API response is not an array:", data.data);
      return [];
    }

    console.log("Fetched projects data:", data.data, data.data.length);

    // Transform each project to match the DbProject interface
    const transformedProjects: DbProject[] = data.data.map(
      (project: DbProject) => transformProject(project)
    );

    return transformedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

// Create a mock project with all required fields
const createMockProject = (projectId: string): DbProject => {
  const currentDate = formatDate(new Date().toISOString());

  return {
    // Basic project information
    projectId: projectId,
    projectName: "School Building Project",
    description:
      "This is a school budgetHead project for constructing a new school building.",
    status: "Submitted to AEE",
    progress: 0,
    budgetUtilized: 0,
    createdBy: "system",
    createdByName: "System User",
    createdAt: currentDate,
    updatedAt: currentDate,
    totalSubProjects: 0,
    daysRemaining: 0,
    currentStage: "Planning",
    lastUpdated: currentDate,

    // Proposal information
    dateOfProposal: currentDate,
    hasSubProjects: false,
    beneficiary: "Unknown Beneficiary",
    letterReference: "MOCK-REF-001",

    // Financial details
    fund: "General Fund",
    function: "Mock Function",
    budgetHead: "Mock Budget Head",
    scheme: "Mock Scheme",
    subScheme: "Mock Sub Scheme",
    estimatedCost: 0,

    // Department information
    owningDepartment: "Mock Owning Department",
    executingDepartment: "Mock Executing Department",

    // Work details
    typeOfWork: "Mock Work Type",
    subTypeOfWork: "Mock Sub Work Type",
    natureOfWork: "Mock Nature of Work",
    projectStartDate: currentDate,
    projectEndDate: currentDate,
    recommendedModeOfExecution: "Mock Execution Mode",

    // Location details
    district: "Mock Locality",
    block: "Mock Ward",
    gramPanchayat: "Mock ULB",
    geoLocation: {
      type: "Point",
      coordinates: [0, 0],
    },

    // Related data
    uploadedFiles: [],
    subProjects: [],
  };
};

// Fetch single project by ID
const fetchProjectById = async (projectId: string): Promise<DbProject> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/projects/${projectId}`
      // `http://localhost:5000/api/projects/${projectId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the project to match the DbProject interface
    const transformedProject: DbProject = transformProject(data.data);
    return transformedProject;
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    // Return mock project instead of throwing error
    console.warn("Returning mock project due to error");
    return createMockProject(projectId);
  }
};

export { fetchAllProjects, fetchProjectById };
