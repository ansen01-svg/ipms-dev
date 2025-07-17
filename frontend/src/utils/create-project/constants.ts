export const PROJECT_CONSTANTS = {
  FUND_OPTIONS: [
    "Central Government Fund",
    "State Government Fund",
    "Private Fund",
    "International Aid",
    "Public-Private Partnership",
  ],

  FUNCTION_OPTIONS: [
    "Infrastructure Development",
    "Social Welfare",
    "Economic Development",
    "Environmental Conservation",
    "Education & Skill Development",
    "Healthcare & Medical Services",
  ],

  BUDGET_HEAD_OPTIONS: [
    "Capital Expenditure",
    "Revenue Expenditure",
    "Plan Expenditure",
    "Non-Plan Expenditure",
    "Centrally Sponsored Scheme",
  ],

  DEPARTMENT_OPTIONS: [
    "Public Works Department",
    "Rural Development Department",
    "Urban Development Department",
    "Health Department",
    "Education Department",
    "Agriculture Department",
    "Forest Department",
    "Transport Department",
  ],

  TYPE_OF_WORK_OPTIONS: [
    "Construction",
    "Renovation",
    "Maintenance",
    "Survey",
    "Consultancy",
    "Supply",
    "Installation",
  ],

  NATURE_OF_WORK_OPTIONS: [
    "New Work",
    "Ongoing Work",
    "Maintenance Work",
    "Emergency Work",
    "Replacement Work",
  ],

  MODE_OF_EXECUTION_OPTIONS: [
    "Departmental",
    "Tender",
    "Direct Assignment",
    "Joint Venture",
    "Nomination",
  ],

  PROJECT_STATUS: [
    "Draft",
    "Under Review",
    "Approved",
    "Active",
    "On Hold",
    "Completed",
    "Cancelled",
  ],

  FILE_TYPES: {
    DOCUMENTS: [".pdf", ".doc", ".docx"],
    IMAGES: [".jpg", ".jpeg", ".png"],
    SPREADSHEETS: [".xls", ".xlsx"],
    ALL_SUPPORTED: [
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png",
      ".xls",
      ".xlsx",
    ],
  },

  VALIDATION: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES: 10,
    MIN_PROJECT_NAME_LENGTH: 3,
    MAX_PROJECT_NAME_LENGTH: 200,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 1000,
  },
} as const;

// ============= DROPDOWN OPTIONS =============
export const fundOptions = [
  "Central Government Fund",
  "State Government Fund",
  "Private Fund",
  "International Aid",
];

export const functionOptions = [
  "Infrastructure Development",
  "Social Welfare",
  "Economic Development",
  "Environmental Conservation",
];

export const budgetHeadOptions = [
  "Capital Expenditure",
  "Revenue Expenditure",
  "Plan Expenditure",
  "Non-Plan Expenditure",
];

export const departmentOptions = [
  "Public Works Department",
  "Rural Development Department",
  "Urban Development Department",
  "Health Department",
  "Education Department",
];

export const typeOfWorkOptions = [
  "Construction",
  "Renovation",
  "Maintenance",
  "Survey",
  "Consultancy",
];

export const subTypeOfWorkOptions = [
  "Road Construction",
  "Bridge Construction",
  "Building Construction",
  "Water Supply",
  "Drainage System",
];

export const natureOfWorkOptions = [
  "New Work",
  "Ongoing Work",
  "Maintenance Work",
  "Emergency Work",
];

export const modeOfExecutionOptions = [
  "Departmental",
  "Tender",
  "Direct Assignment",
  "Joint Venture",
];
