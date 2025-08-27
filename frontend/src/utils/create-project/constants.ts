// Updated constants to match backend dropdown API response
export const PROJECT_CONSTANTS = {
  // File type restrictions (backend accepts only PDF and images)
  FILE_TYPES: {
    DOCUMENTS: [".pdf"],
    IMAGES: [".jpg", ".jpeg", ".png"],
    ALL_SUPPORTED: [".pdf", ".jpg", ".jpeg", ".png"],
  },

  VALIDATION: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB (matches backend validation)
    MAX_FILES: 10,
    MIN_PROJECT_NAME_LENGTH: 5, // Matches backend validation
    MAX_PROJECT_NAME_LENGTH: 100, // Matches backend validation
    MAX_DESCRIPTION_LENGTH: 1000, // Matches backend validation
    MAX_BUDGET_HEAD_LENGTH: 100, // Matches backend validation
    MAX_BENEFICIARY_LENGTH: 200, // Matches backend validation
    MAX_BLOCK_LENGTH: 50, // Matches backend validation
    MAX_GRAM_PANCHAYAT_LENGTH: 50, // Matches backend validation
  },

  // Default values
  DEFAULTS: {
    EXECUTING_DEPARTMENT: "APTDCL", // Fixed value from backend
    HAS_SUB_PROJECTS: false,
    PROGRESS_PERCENTAGE: 0,
  },
} as const;

// ============= FALLBACK DROPDOWN OPTIONS (Matching Backend Constants) =============

// Fund options - matches backend constants format
export const fundOptions = [
  { name: "Central Government Fund" },
  { name: "State Government Fund" },
  { name: "Private Fund" },
  { name: "International Aid" },
  { name: "Public-Private Partnership" },
];

// Districts - matches backend constants (Assam districts)
export const districtOptions = [
  "Bajali",
  "Baksa",
  "Barpeta",
  "Biswanath",
  "Bongaigaon",
  "Cachar",
  "Charaideo",
  "Chirang",
  "Darrang",
  "Dhemaji",
  "Dhubri",
  "Dibrugarh",
  "Dima Hasao",
  "Goalpara",
  "Golaghat",
  "Hailakandi",
  "Hojai",
  "Jorhat",
  "Kamrup",
  "Kamrup Metropolitan",
  "Karbi Anglong",
  "Karimganj",
  "Kokrajhar",
  "Lakhimpur",
  "Majuli",
  "Morigaon",
  "Nagaon",
  "Nalbari",
  "Sivasagar",
  "Sonitpur",
  "South Salmara-Mankachar",
  "Tamulpur",
  "Tinsukia",
  "Udalguri",
  "West Karbi Anglong",
];

// Sanction and Department options - matches backend constants
export const sanctionAndDepartmentOptions = [
  "Public Works Department",
  "Rural Development Department",
  "Urban Development Department",
  "Health Department",
  "Education Department",
  "Agriculture Department",
  "Forest Department",
  "Transport Department",
  "Water Resources Department",
  "Power Department",
  "Industries & Commerce Department",
];

// Type of Work options - matches backend constants
export const typeOfWorkOptions = [
  "Construction",
  "Renovation",
  "Maintenance",
  "Survey",
  "Consultancy",
  "Supply",
  "Installation",
  "Repair",
];

// Nature of Work options - matches backend constants
export const natureOfWorkOptions = [
  "New Work",
  "Ongoing Work",
  "Maintenance Work",
  "Emergency Work",
  "Replacement Work",
  "Expansion Work",
];

// ============= LEGACY CONSTANTS (For Backward Compatibility) =============

// Function options (not used in current backend but kept for fallback)
export const functionOptions = [
  "Infrastructure Development",
  "Social Welfare",
  "Economic Development",
  "Environmental Conservation",
  "Education & Skill Development",
  "Healthcare & Medical Services",
];

// Budget head options (not used in current backend but kept for fallback)
export const budgetHeadOptions = [
  "Capital Expenditure",
  "Revenue Expenditure",
  "Plan Expenditure",
  "Non-Plan Expenditure",
  "Centrally Sponsored Scheme",
];

// Department options (legacy - now using sanctionAndDepartment)
export const departmentOptions = sanctionAndDepartmentOptions;

// Sub-type of work options (not used in current backend)
export const subTypeOfWorkOptions = [
  "Road Construction",
  "Bridge Construction",
  "Building Construction",
  "Water Supply",
  "Drainage System",
  "Electrical Work",
  "Mechanical Work",
];

// Mode of execution options (not used in current backend)
export const modeOfExecutionOptions = [
  "Departmental",
  "Tender",
  "Direct Assignment",
  "Joint Venture",
  "Nomination",
];

// ============= UTILITY FUNCTIONS =============

// Validate file type against backend restrictions
export const isValidFileType = (fileName: string): boolean => {
  const extension = ("." +
    fileName
      .split(".")
      .pop()
      ?.toLowerCase()) as (typeof PROJECT_CONSTANTS.FILE_TYPES.ALL_SUPPORTED)[number];
  return PROJECT_CONSTANTS.FILE_TYPES.ALL_SUPPORTED.includes(extension);
};

// Validate file size against backend restrictions
export const isValidFileSize = (fileSize: number): boolean => {
  return fileSize <= PROJECT_CONSTANTS.VALIDATION.MAX_FILE_SIZE;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate project name length
export const isValidProjectNameLength = (name: string): boolean => {
  return (
    name.length >= PROJECT_CONSTANTS.VALIDATION.MIN_PROJECT_NAME_LENGTH &&
    name.length <= PROJECT_CONSTANTS.VALIDATION.MAX_PROJECT_NAME_LENGTH
  );
};

// Generate project ID (client-side fallback)
export const generateProjectId = (typeOfWork: string): string => {
  const timestamp = Date.now();
  const typePrefix = typeOfWork.replace(/\s+/g, "_").toUpperCase();
  return `${typePrefix}_${timestamp}`;
};

// Validate coordinates for geoLocation
export const isValidCoordinates = (
  latitude?: number | "",
  longitude?: number | ""
): boolean => {
  if (!latitude || !longitude) return true; // Optional field

  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};
