export const USER_ROLES = {
  ADMIN: "ADMIN",
  JE: "JE",
  AEE: "AEE",
  CE: "CE",
  MD: "MD",
  OPERATOR: "OPERATOR",
  VIEWER: "VIEWER",
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const ROLE_LABELS = {
  ADMIN: "Admin",
  JE: "Junior Engineer",
  AEE: "Assistant Executive Engineer",
  CE: "Chief Engineer",
  MD: "Managing Director",
  OPERATOR: "Operator",
  VIEWER: "Viewer",
} as const;

export const ROLE_DASHBOARD_PATHS = {
  ADMIN: "/dashboard/admin",
  JE: "/dashboard/je",
  AEE: "/dashboard/aee",
  CE: "/dashboard/ce",
  MD: "/dashboard/md",
  OPERATOR: "/dashboard/operator",
  VIEWER: "/dashboard/viewer",
} as const;

export const ROLE_NAVIGATION_LABELS = {
  ADMIN: "Projects",
  JE: "My Projects",
  AEE: "Projects",
  CE: "Approval Queue",
  MD: "Sanction Queue",
  OPERATOR: "Projects",
  VIEWER: "All Projects",
} as const;
