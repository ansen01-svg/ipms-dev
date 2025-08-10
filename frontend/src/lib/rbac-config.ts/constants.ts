import type { User } from "@/types/user.types";

// Dummy user for testing purposes
export const dummyUser: User = {
  id: "123",
  email: "dummy@gmail,com",
  name: "Guest User",
  role: "JE" as UserRole,
  department: "PWD",
};

export const USER_ROLES = {
  ADMIN: "ADMIN",
  JE: "JE",
  AEE: "AEE",
  CE: "CE",
  MD: "MD",
  EXECUTOR: "EXECUTOR",
  VIEWER: "VIEWER",
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const ROLE_LABELS = {
  ADMIN: "Admin",
  JE: "Junior Engineer",
  AEE: "Assistant Executive Engineer",
  CE: "Chief Engineer",
  MD: "Managing Director",
  EXECUTOR: "Executor",
  VIEWER: "Viewer",
} as const;

export const ROLE_DASHBOARD_PATHS = {
  ADMIN: "/dashboard/admin",
  JE: "/dashboard/je",
  AEE: "/dashboard/aee",
  CE: "/dashboard/ce",
  MD: "/dashboard/md",
  EXECUTOR: "/dashboard/executor",
  VIEWER: "/dashboard/viewer",
} as const;

export const ROLE_NAVIGATION_LABELS = {
  JE: "My Projects",
  AEE: "Projects",
  CE: "Approval Queue",
  MD: "Sanction Queue",
  EXECUTOR: "Implementation",
  VIEWER: "All Projects",
} as const;
